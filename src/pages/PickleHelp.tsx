import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Plus, Users, MessageCircle, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreateGroupDialog } from "@/components/groups/CreateGroupDialog";
import { GroupDetailDialog } from "@/components/groups/GroupDetailDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Group {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
  member_count?: number;
  preferred_days: string[];
  preferred_time: string;
}

const PickleHelp = () => {
  const [activeGroups, setActiveGroups] = useState<Group[]>([]);
  const [leftGroups, setLeftGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchGroups = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get all group memberships (active and left)
      const { data: memberData, error: memberError } = await supabase
        .from("group_members")
        .select("group_id, left_at")
        .eq("user_id", user.id);

      if (memberError) throw memberError;

      const activeGroupIds = memberData?.filter(m => !m.left_at).map(m => m.group_id) || [];
      const leftGroupIds = memberData?.filter(m => m.left_at).map(m => m.group_id) || [];

      // Fetch active groups
      if (activeGroupIds.length > 0) {
        const { data: activeData, error: activeError } = await supabase
          .from("groups")
          .select(`
            *,
            group_members(count)
          `)
          .in("id", activeGroupIds)
          .order("created_at", { ascending: false });

        if (activeError) throw activeError;

        const activeGroupsWithCount = activeData?.map((group: any) => ({
          ...group,
          member_count: group.group_members[0]?.count || 0,
        })) || [];

        setActiveGroups(activeGroupsWithCount);
      } else {
        setActiveGroups([]);
      }

      // Fetch left groups
      if (leftGroupIds.length > 0) {
        const { data: leftData, error: leftError } = await supabase
          .from("groups")
          .select(`
            *,
            group_members(count)
          `)
          .in("id", leftGroupIds)
          .order("created_at", { ascending: false });

        if (leftError) throw leftError;

        const leftGroupsWithCount = leftData?.map((group: any) => ({
          ...group,
          member_count: group.group_members[0]?.count || 0,
        })) || [];

        setLeftGroups(leftGroupsWithCount);
      } else {
        setLeftGroups([]);
      }
    } catch (error: any) {
      toast({
        title: "Error loading groups",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      setIsAuthenticated(true);
      fetchGroups();
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsAuthenticated(false);
        setActiveGroups([]);
        setLeftGroups([]);
      } else {
        setIsAuthenticated(true);
        fetchGroups();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleGroupCreated = () => {
    fetchGroups();
    setCreateDialogOpen(false);
  };

  const handleGroupLeft = () => {
    fetchGroups();
    setSelectedGroup(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-4 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">My Groups</h1>
              <p className="text-sm text-muted-foreground">
                Private groups with chat
              </p>
            </div>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create
            </Button>
          </div>
        </div>

        {/* Groups Tabs */}
        <div className="p-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : !isAuthenticated ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Please log in to view and create groups
              </p>
              <Button onClick={() => navigate("/auth")}>
                Go to Login
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="active" className="gap-2">
                  <Check className="w-4 h-4" />
                  I'm In
                </TabsTrigger>
                <TabsTrigger value="left" className="gap-2">
                  <Check className="w-4 h-4" />
                  I'm Out
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-4 space-y-3">
                {activeGroups.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      You haven't joined any groups yet
                    </p>
                    <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create Your First Group
                    </Button>
                  </div>
                ) : (
                  activeGroups.map((group) => (
                    <div
                      key={group.id}
                      onClick={() => setSelectedGroup(group.id)}
                      className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {group.name}
                          </h3>
                          {group.description && (
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {group.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {group.member_count} members
                            </span>
                            {group.preferred_days && group.preferred_days[0] !== "any" && (
                              <span>
                                📅 {group.preferred_days.map(d => d.charAt(0).toUpperCase() + d.slice(1, 3)).join(", ")}
                              </span>
                            )}
                            {group.preferred_time && group.preferred_time !== "any" && (
                              <span>
                                🕐 {group.preferred_time}
                              </span>
                            )}
                          </div>
                        </div>
                        <MessageCircle className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="left" className="mt-4 space-y-3">
                {leftGroups.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      You haven't left any groups
                    </p>
                  </div>
                ) : (
                  leftGroups.map((group) => (
                    <div
                      key={group.id}
                      className="bg-card border border-border rounded-xl p-4 opacity-60"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {group.name}
                          </h3>
                          {group.description && (
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {group.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {group.member_count} members
                            </span>
                            {group.preferred_days && group.preferred_days[0] !== "any" && (
                              <span>
                                📅 {group.preferred_days.map(d => d.charAt(0).toUpperCase() + d.slice(1, 3)).join(", ")}
                              </span>
                            )}
                            {group.preferred_time && group.preferred_time !== "any" && (
                              <span>
                                🕐 {group.preferred_time}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      <CreateGroupDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onGroupCreated={handleGroupCreated}
      />

      {selectedGroup && (
        <GroupDetailDialog
          groupId={selectedGroup}
          open={!!selectedGroup}
          onOpenChange={(open) => !open && setSelectedGroup(null)}
          onGroupLeft={handleGroupLeft}
        />
      )}

      <MobileNav />
    </div>
  );
};

export default PickleHelp;