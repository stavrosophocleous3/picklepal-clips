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
import { Search, UserPlus, Loader2 } from "lucide-react";

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
  const { toast } = useToast();

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>
            Search for users by username to invite them to the group
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};