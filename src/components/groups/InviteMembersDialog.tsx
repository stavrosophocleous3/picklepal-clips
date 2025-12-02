import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus, Loader2, Link2, Copy, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  full_name: string | null;
}

interface InviteMembersDialogProps {
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMemberAdded: () => void;
}

export const InviteMembersDialog = ({
  groupId,
  open,
  onOpenChange,
  onMemberAdded,
}: InviteMembersDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [searching, setSearching] = useState(false);
  const [addingMember, setAddingMember] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const { toast } = useToast();

  const inviteLink = `${window.location.origin}/invite/${groupId}`;

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      // Get current group members
      const { data: members, error: membersError } = await supabase
        .from("group_members")
        .select("user_id")
        .eq("group_id", groupId);

      if (membersError) throw membersError;

      const memberIds = members?.map((m) => m.user_id) || [];

      // Search for users not already in the group
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, full_name")
        .ilike("username", `%${searchQuery.trim()}%`)
        .not("id", "in", `(${memberIds.join(",")})`)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);

      if (data?.length === 0) {
        toast({
          title: "No users found",
          description: "Try a different username",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error searching users",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const handleAddMember = async (userId: string) => {
    setAddingMember(userId);
    try {
      const { error } = await supabase.from("group_members").insert({
        group_id: groupId,
        user_id: userId,
        role: "member",
      });

      if (error) throw error;

      toast({
        title: "Member added!",
        description: "The user has been added to the group",
      });

      // Remove from search results
      setSearchResults((prev) => prev.filter((p) => p.id !== userId));
      onMemberAdded();
    } catch (error: any) {
      toast({
        title: "Error adding member",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAddingMember(null);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
      toast({
        title: "Link copied!",
        description: "Share this link to invite members",
      });
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>
            Invite users by username or share an invite link
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="username" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="username">
              <Search className="w-4 h-4 mr-2" />
              By Username
            </TabsTrigger>
            <TabsTrigger value="link">
              <Link2 className="w-4 h-4 mr-2" />
              Invite Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="username" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={searching || !searchQuery.trim()}
                size="icon"
              >
                {searching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">@{profile.username}</p>
                      {profile.full_name && (
                        <p className="text-sm text-muted-foreground">
                          {profile.full_name}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddMember(profile.id)}
                      disabled={addingMember === profile.id}
                      className="gap-2"
                    >
                      {addingMember === profile.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery
                    ? "No users found"
                    : "Search for users to invite"}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Share this link with anyone you want to invite to the group:
              </p>
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  onClick={handleCopyLink}
                  size="icon"
                  variant="outline"
                >
                  {linkCopied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Anyone with this link can join the group
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};