import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, Send, UserPlus, Loader2, LogOut, MessageCircle, Calendar, Check, X } from "lucide-react";
import { InviteMembersDialog } from "./InviteMembersDialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
  rsvps?: GameRsvp[];
}

interface GameRsvp {
  id: string;
  user_id: string;
  status: 'going' | 'not_going';
  profiles?: {
    username: string;
  } | null;
}

interface Member {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles?: {
    username: string;
    avatar_url: string | null;
    full_name: string | null;
  } | null;
}

interface GroupDetailDialogProps {
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupLeft?: () => void;
}

export const GroupDetailDialog = ({
  groupId,
  open,
  onOpenChange,
  onGroupLeft,
}: GroupDetailDialogProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupCreator, setGroupCreator] = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [preferredDays, setPreferredDays] = useState<string[]>([]);
  const [preferredTime, setPreferredTime] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [gameDetails, setGameDetails] = useState("");
  const [gameDate, setGameDate] = useState("");
  const [gameTime, setGameTime] = useState("");
  const [postingGame, setPostingGame] = useState(false);
  const [rsvpingMessageId, setRsvpingMessageId] = useState<string | null>(null);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const isGamePost = (content: string) => content.startsWith("🎾 Game Posted!");

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);

        // Fetch group info
        const { data: group, error: groupError } = await supabase
          .from("groups")
          .select("name, created_by, preferred_days, preferred_time, group_members(count)")
          .eq("id", groupId)
          .single();

        if (groupError) throw groupError;
        setGroupName(group.name);
        setGroupCreator(group.created_by);
        setMemberCount(group.group_members[0]?.count || 0);
        setPreferredDays(group.preferred_days || []);
        setPreferredTime(group.preferred_time || "any");

        // Fetch members
        const { data: membersData, error: membersError } = await supabase
          .from("group_members")
          .select("*")
          .eq("group_id", groupId)
          .is("left_at", null)
          .order("joined_at", { ascending: true });

        if (membersError) throw membersError;

        // Fetch profiles for members
        if (membersData && membersData.length > 0) {
          const userIds = membersData.map(m => m.user_id);
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, username, avatar_url, full_name")
            .in("id", userIds);

          const profilesMap = new Map(
            profilesData?.map(p => [p.id, p]) || []
          );

          const membersWithProfiles = membersData.map(m => ({
            ...m,
            profiles: profilesMap.get(m.user_id),
          }));

          setMembers(membersWithProfiles);
        } else {
          setMembers([]);
        }

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

          // Fetch RSVPs for game posts
          const gamePostIds = messagesData.filter(m => isGamePost(m.content)).map(m => m.id);
          let rsvpsMap = new Map<string, GameRsvp[]>();
          
          if (gamePostIds.length > 0) {
            const { data: rsvpsData } = await supabase
              .from("game_rsvps")
              .select("*")
              .in("message_id", gamePostIds);

            if (rsvpsData) {
              const rsvpUserIds = [...new Set(rsvpsData.map(r => r.user_id))];
              const { data: rsvpProfiles } = await supabase
                .from("profiles")
                .select("id, username")
                .in("id", rsvpUserIds);

              const rsvpProfilesMap = new Map(
                rsvpProfiles?.map(p => [p.id, p]) || []
              );

              rsvpsData.forEach(rsvp => {
                if (!rsvpsMap.has(rsvp.message_id)) {
                  rsvpsMap.set(rsvp.message_id, []);
                }
                rsvpsMap.get(rsvp.message_id)!.push({
                  id: rsvp.id,
                  user_id: rsvp.user_id,
                  status: rsvp.status as 'going' | 'not_going',
                  profiles: rsvpProfilesMap.get(rsvp.user_id) || null,
                });
              });
            }
          }

          const messagesWithProfiles = messagesData.map((m) => ({
            ...m,
            profiles: profilesMap.get(m.user_id),
            rsvps: rsvpsMap.get(m.id) || [],
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

  const handleLeaveGroup = async () => {
    setLeaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("group_members")
        .update({ left_at: new Date().toISOString() })
        .eq("group_id", groupId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Left group",
        description: "You have left the group",
      });

      setLeaveDialogOpen(false);
      onOpenChange(false);
      onGroupLeft?.();
    } catch (error: any) {
      toast({
        title: "Error leaving group",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLeaving(false);
    }
  };

  const handlePostGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameDetails.trim() || !gameDate || !gameTime || postingGame) return;

    setPostingGame(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const gameMessage = `🎾 Game Posted!\n\n${gameDetails}\n📅 ${new Date(gameDate).toLocaleDateString()}\n🕐 ${gameTime}`;

      const { error } = await supabase.from("group_messages").insert({
        group_id: groupId,
        user_id: user.id,
        content: gameMessage,
      });

      if (error) throw error;

      toast({
        title: "Game posted!",
        description: "Your game has been posted to the chat",
      });

      setGameDetails("");
      setGameDate("");
      setGameTime("");
    } catch (error: any) {
      toast({
        title: "Error posting game",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setPostingGame(false);
    }
  };

  const handleRsvp = async (messageId: string, status: 'going' | 'not_going') => {
    if (!currentUserId) return;
    
    setRsvpingMessageId(messageId);
    try {
      // Check if user already has an RSVP
      const { data: existingRsvp } = await supabase
        .from("game_rsvps")
        .select("id, status")
        .eq("message_id", messageId)
        .eq("user_id", currentUserId)
        .maybeSingle();

      if (existingRsvp) {
        if (existingRsvp.status === status) {
          // Same status clicked - remove RSVP
          const { error } = await supabase
            .from("game_rsvps")
            .delete()
            .eq("id", existingRsvp.id);

          if (error) throw error;

          // Update local state
          setMessages(prev => prev.map(msg => {
            if (msg.id === messageId) {
              return {
                ...msg,
                rsvps: msg.rsvps?.filter(r => r.user_id !== currentUserId) || [],
              };
            }
            return msg;
          }));
        } else {
          // Different status - update RSVP
          const { error } = await supabase
            .from("game_rsvps")
            .update({ status })
            .eq("id", existingRsvp.id);

          if (error) throw error;

          // Update local state
          setMessages(prev => prev.map(msg => {
            if (msg.id === messageId) {
              return {
                ...msg,
                rsvps: msg.rsvps?.map(r => 
                  r.user_id === currentUserId ? { ...r, status: status as 'going' | 'not_going' } : r
                ) || [],
              };
            }
            return msg;
          }));
        }
      } else {
        // No existing RSVP - create new one
        const { data: newRsvp, error } = await supabase
          .from("game_rsvps")
          .insert({
            group_id: groupId,
            message_id: messageId,
            user_id: currentUserId,
            status,
          })
          .select()
          .single();

        if (error) throw error;

        // Fetch user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", currentUserId)
          .single();

        // Update local state
        setMessages(prev => prev.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              rsvps: [...(msg.rsvps || []), {
                id: newRsvp.id,
                user_id: currentUserId,
                status: status as 'going' | 'not_going',
                profiles: profile || null,
              }],
            };
          }
          return msg;
        }));
      }
    } catch (error: any) {
      toast({
        title: "Error updating RSVP",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setRsvpingMessageId(null);
    }
  };

  const isCreator = currentUserId === groupCreator;

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
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setInviteDialogOpen(true)}
                  className="gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Invite
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setLeaveDialogOpen(true)}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Leave
                </Button>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="w-full rounded-none border-b bg-transparent p-0">
              <TabsTrigger value="chat" className="gap-2 flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                <MessageCircle className="w-4 h-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="members" className="gap-2 flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                <Users className="w-4 h-4" />
                Members
              </TabsTrigger>
              {isCreator && (
                <TabsTrigger value="game" className="gap-2 flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <Calendar className="w-4 h-4" />
                  Post Game
                </TabsTrigger>
              )}
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="flex-1 flex flex-col m-0 data-[state=inactive]:hidden">
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
                      const isGame = isGamePost(message.content);
                      const userRsvp = message.rsvps?.find(r => r.user_id === currentUserId);
                      const goingCount = message.rsvps?.filter(r => r.status === 'going').length || 0;
                      const notGoingCount = message.rsvps?.filter(r => r.status === 'not_going').length || 0;

                      return (
                        <div
                          key={message.id}
                          className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`${isGame ? 'max-w-[90%]' : 'max-w-[80%]'} ${
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
                            <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
                            
                            {isGame && (
                              <div className="mt-3 pt-3 border-t border-primary/20 space-y-2">
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant={userRsvp?.status === 'going' ? 'default' : 'outline'}
                                    onClick={() => handleRsvp(message.id, 'going')}
                                    disabled={rsvpingMessageId === message.id}
                                    className={`flex-1 gap-1 ${
                                      isCurrentUser 
                                        ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90' 
                                        : ''
                                    }`}
                                  >
                                    <Check className="w-4 h-4" />
                                    Going {goingCount > 0 && `(${goingCount})`}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={userRsvp?.status === 'not_going' ? 'default' : 'outline'}
                                    onClick={() => handleRsvp(message.id, 'not_going')}
                                    disabled={rsvpingMessageId === message.id}
                                    className={`flex-1 gap-1 ${
                                      isCurrentUser 
                                        ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90' 
                                        : ''
                                    }`}
                                  >
                                    <X className="w-4 h-4" />
                                    Can't Make It {notGoingCount > 0 && `(${notGoingCount})`}
                                  </Button>
                                </div>
                                
                                {(goingCount > 0 || notGoingCount > 0) && (
                                  <div className="flex flex-wrap gap-1">
                                    {message.rsvps?.filter(r => r.status === 'going').map(rsvp => (
                                      <Badge 
                                        key={rsvp.id} 
                                        variant="secondary"
                                        className={`text-xs ${
                                          isCurrentUser 
                                            ? 'bg-primary-foreground/20 text-primary-foreground' 
                                            : ''
                                        }`}
                                      >
                                        ✓ {rsvp.profiles?.username}
                                      </Badge>
                                    ))}
                                    {message.rsvps?.filter(r => r.status === 'not_going').map(rsvp => (
                                      <Badge 
                                        key={rsvp.id} 
                                        variant="outline"
                                        className={`text-xs ${
                                          isCurrentUser 
                                            ? 'border-primary-foreground/30 text-primary-foreground/70' 
                                            : 'opacity-50'
                                        }`}
                                      >
                                        ✗ {rsvp.profiles?.username}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

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
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="flex-1 m-0 data-[state=inactive]:hidden">
              <ScrollArea className="h-[450px] p-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : members.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No members found
                  </div>
                ) : (
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {member.profiles?.username?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            {member.profiles?.username || "Unknown User"}
                            {member.user_id === groupCreator && (
                              <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                Creator
                              </span>
                            )}
                          </p>
                          {member.profiles?.full_name && (
                            <p className="text-sm text-muted-foreground">
                              {member.profiles.full_name}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(member.joined_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            {/* Post Game Tab (Creator Only) */}
            {isCreator && (
              <TabsContent value="game" className="flex-1 m-0 data-[state=inactive]:hidden">
                <ScrollArea className="h-[450px] p-4">
                  <form onSubmit={handlePostGame} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Game Details
                      </label>
                      <Textarea
                        value={gameDetails}
                        onChange={(e) => setGameDetails(e.target.value)}
                        placeholder="Enter game details (location, skill level, etc.)"
                        className="min-h-[120px]"
                        maxLength={500}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Date
                      </label>
                      <Input
                        type="date"
                        value={gameDate}
                        onChange={(e) => setGameDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Time
                      </label>
                      <Input
                        type="time"
                        value={gameTime}
                        onChange={(e) => setGameTime(e.target.value)}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={postingGame || !gameDetails.trim() || !gameDate || !gameTime}
                    >
                      {postingGame ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Calendar className="w-4 h-4 mr-2" />
                          Post Game to Chat
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      This will post the game details as a message in the chat for all members to see
                    </p>
                  </form>
                </ScrollArea>
              </TabsContent>
            )}
          </Tabs>
        </DialogContent>
      </Dialog>

      <InviteMembersDialog
        groupId={groupId}
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        onMemberAdded={() => setMemberCount((prev) => prev + 1)}
      />

      <AlertDialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave your friends :( You will no longer have access to the group chat and won't see any new messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeaveGroup}
              disabled={leaving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {leaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Leaving...
                </>
              ) : (
                "Leave Group"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};