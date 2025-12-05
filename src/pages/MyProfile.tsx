import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileNav } from "@/components/MobileNav";
import { MemberQRCode } from "@/components/MemberQRCode";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { User, Settings, Edit2, Camera, LogOut, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";

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

        {/* Member QR Code */}
        {user && (
          <MemberQRCode
            memberId={user.id}
            memberName={profile?.full_name || profile?.username || "Member"}
            username={profile?.username || user.email?.split("@")[0] || "member"}
          />
        )}

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
