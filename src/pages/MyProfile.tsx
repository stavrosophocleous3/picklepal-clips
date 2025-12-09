import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileNav } from "@/components/MobileNav";
import { MemberQRCode } from "@/components/MemberQRCode";
import { AchievementBadges } from "@/components/AchievementBadges";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { User, Settings, Edit2, Camera, LogOut, Video, Medal, Calendar, Users, Clock, Trophy, Target, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string | null;
  video_posting_enabled: boolean;
}

const MyProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch follower count
      const { count: followers } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", session.user.id);
      setFollowerCount(followers || 0);

      // Fetch following count
      const { count: following } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", session.user.id);
      setFollowingCount(following || 0);

      // Fetch total likes on user's videos
      const { data: userVideos } = await supabase
        .from("videos")
        .select("likes_count")
        .eq("user_id", session.user.id);
      
      const totalLikes = userVideos?.reduce((sum, video) => sum + (video.likes_count || 0), 0) || 0;
      setLikesCount(totalLikes);

      setLoading(false);
    };

    checkAuthAndFetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been signed out successfully.",
    });
    navigate("/auth");
  };

  const handleVideoPostingToggle = async (enabled: boolean) => {
    if (!user) return;
    
    const { error } = await supabase
      .from("profiles")
      .update({ video_posting_enabled: enabled })
      .eq("id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive",
      });
      return;
    }

    setProfile(prev => prev ? { ...prev, video_posting_enabled: enabled } : null);
    toast({
      title: enabled ? "Video posting enabled" : "Video posting disabled",
      description: enabled 
        ? "You can now share videos on the feed" 
        : "Your videos section is now hidden",
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h1 className="text-xl font-bold">My Profile</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-6 text-center border-b border-border">
          {/* Avatar with edit button */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                <User className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="text-2xl font-bold">
              {profile?.full_name || "Set your name"}
            </h2>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-muted-foreground mb-4">
            @{profile?.username || user?.email?.split("@")[0] || "username"}
          </p>
          
          <p className="text-sm mb-6">
            {profile?.bio || "Add a bio to tell people about yourself"}
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-6">
            <div>
              <p className="text-xl font-bold">{followerCount}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div>
              <p className="text-xl font-bold">{followingCount}</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
            <div>
              <p className="text-xl font-bold">{likesCount}</p>
              <p className="text-sm text-muted-foreground">Likes</p>
            </div>
          </div>

          {/* Edit Profile Button */}
          <Button className="w-full" variant="outline">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Player Stats & Performance */}
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold mb-3">Player Stats</h3>
          <div className="grid grid-cols-3 gap-3">
            {/* Win/Loss Record */}
            <Card className="border-border">
              <CardContent className="p-3 text-center">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-lg font-bold">12-5</p>
                <p className="text-xs text-muted-foreground">Win/Loss</p>
                <p className="text-xs text-green-500 mt-1">71% WR</p>
              </CardContent>
            </Card>

            {/* Skill Rating */}
            <Card className="border-border">
              <CardContent className="p-3 text-center">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-2">
                  <Target className="w-4 h-4 text-purple-500" />
                </div>
                <p className="text-lg font-bold">3.5</p>
                <p className="text-xs text-muted-foreground">Skill Level</p>
                <p className="text-xs text-purple-500 mt-1">Intermediate</p>
              </CardContent>
            </Card>

            {/* Leaderboard Rank */}
            <Card className="border-border">
              <CardContent className="p-3 text-center">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-lg font-bold">#24</p>
                <p className="text-xs text-muted-foreground">Club Rank</p>
                <p className="text-xs text-amber-500 mt-1">Top 20%</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pickle Points Card */}
        <div className="p-4 border-b border-border">
          <Card className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Medal className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pickle Points</p>
                    <p className="text-2xl font-bold">245</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/pickle-points")}
                  className="border-amber-500/30 hover:bg-amber-500/10"
                >
                  View Rewards
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Member QR Code */}
        {user && (
          <MemberQRCode
            memberId={user.id}
            memberName={profile?.full_name || profile?.username || "Member"}
            username={profile?.username || user.email?.split("@")[0] || "member"}
          />
        )}

        {/* My Bookings & Sign-ups */}
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold mb-3">Upcoming</h3>
          <div className="space-y-3">
            {/* Mock Court Booking */}
            <Card className="border-border">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">Court A3 Reserved</p>
                    <p className="text-xs text-muted-foreground">Tomorrow, 2:00 PM - 3:30 PM</p>
                  </div>
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* Mock Game Session */}
            <Card className="border-border">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">Open Play - Thursday</p>
                    <p className="text-xs text-muted-foreground">Thu, 6:00 PM - 9:00 PM • 8 going</p>
                  </div>
                  <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full">Going</span>
                </div>
              </CardContent>
            </Card>

            {/* Mock Group Game */}
            <Card className="border-border">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">Weekend Warriors Game</p>
                    <p className="text-xs text-muted-foreground">Sat, 10:00 AM • 4/8 players</p>
                  </div>
                  <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full">RSVP'd</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Achievement Badges */}
        <AchievementBadges
          stats={{
            wins: 12,
            losses: 5,
            points: 45,
            tournamentWins: 1,
            tournamentPodiums: 2,
            groupMemberships: 2,
            videosPosted: 0,
            matchesPlayed: 17,
          }}
        />

        {/* Profile Details */}
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold mb-4">About</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member Since</span>
              <span className="font-medium">{formatDate(profile?.created_at || user?.created_at || null)}</span>
            </div>
          </div>
        </div>

        {/* Video Posting Settings */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Video className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Enable Video Posting</p>
                <p className="text-sm text-muted-foreground">
                  Allow your account to post content
                </p>
              </div>
            </div>
            <Switch
              checked={profile?.video_posting_enabled ?? false}
              onCheckedChange={handleVideoPostingToggle}
            />
          </div>
        </div>

        {/* My Videos - only shown if enabled */}
        {profile?.video_posting_enabled && (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">My Videos</h3>
            <div className="text-center py-8 text-muted-foreground">
              <p>No videos yet</p>
              <p className="text-sm">Start sharing your pickleball moments!</p>
            </div>
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
};

export default MyProfile;
