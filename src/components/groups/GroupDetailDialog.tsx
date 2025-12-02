import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, Send, UserPlus, Loader2 } from "lucide-react";
import { InviteMembersDialog } from "./InviteMembersDialog";

interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
}

interface GroupDetailDialogProps {
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GroupDetailDialog = ({
  groupId,
  open,
  onOpenChange,
}: GroupDetailDialogProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [preferredDays, setPreferredDays] = useState<string[]>([]);
  const [preferredTime, setPreferredTime] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);

        // Fetch group info
        const { data: group, error: groupError } = await supabase
          .from("groups")
          .select("name, preferred_days, preferred_time, group_members(count)")
          .eq("id", groupId)
          .single();

        if (groupError) throw groupError;
        setGroupName(group.name);
        setMemberCount(group.group_members[0]?.count || 0);
        setPreferredDays(group.preferred_days || []);
        setPreferredTime(group.preferred_time || "any");

        // Fetch messages
        const { data: messagesData, error: messagesError } = await supabase
          .from("group_messages")
          .select("*")
          .eq("group_id", groupId)
          .order("created_at", { ascending: true });

        if (messagesError) throw messagesError;

        // Fetch profiles for messages
        if (messagesData && messagesData.length > 0) {
          const userIds = [...new Set(messagesData.map((m) => m.user_id))];
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, username, avatar_url")
            .in("id", userIds);

          const profilesMap = new Map(
            profiles?.map((p) => [p.id, p]) || []
          );

          const messagesWithProfiles = messagesData.map((m) => ({
            ...m,
            profiles: profilesMap.get(m.user_id),
          }));

          setMessages(messagesWithProfiles);
        } else {
          setMessages([]);
        }
      } catch (error: any) {
        toast({
          title: "Error loading group",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to new messages
    const channel = supabase
      .channel(`group_messages:${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_messages",
          filter: `group_id=eq.${groupId}`,
        },
        async (payload) => {
          // Fetch the profile for the new message
          const { data: profile } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("id", payload.new.user_id)
            .single();

          setMessages((prev) => [
            ...prev,
            { ...payload.new, profiles: profile } as Message,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId, open, toast]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("group_messages").insert({
        group_id: groupId,
        user_id: user.id,
        content: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg h-[600px] flex flex-col p-0">
          <DialogHeader className="p-4 pb-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <DialogTitle>{groupName}</DialogTitle>
                <div className="flex flex-col gap-1 mt-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {memberCount} members
                  </p>
                  {preferredDays && preferredDays[0] !== "any" && (
                    <p className="text-xs text-muted-foreground">
                      📅 {preferredDays.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(", ")}
                    </p>
                  )}
                  {preferredTime && preferredTime !== "any" && (
                    <p className="text-xs text-muted-foreground">
                      🕐 {preferredTime}
                    </p>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setInviteDialogOpen(true)}
                className="gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Invite
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No messages yet. Start the conversation!
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isCurrentUser = message.user_id === currentUserId;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] ${
                          isCurrentUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        } rounded-2xl px-4 py-2`}
                      >
                        {!isCurrentUser && (
                          <p className="text-xs font-semibold mb-1">
                            {message.profiles?.username || "Unknown"}
                          </p>
                        )}
                        <p className="text-sm break-words">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isCurrentUser
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t flex gap-2"
          >
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={sending}
              maxLength={1000}
            />
            <Button type="submit" size="icon" disabled={sending || !newMessage.trim()}>
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <InviteMembersDialog
        groupId={groupId}
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        onMemberAdded={() => setMemberCount((prev) => prev + 1)}
      />
    </>
  );
};