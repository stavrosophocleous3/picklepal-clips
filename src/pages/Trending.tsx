import { VideoFeed } from "@/components/VideoFeed";
import { MobileNav } from "@/components/MobileNav";
import { TrendingUp, Loader2, Video as VideoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Video {
  id: string;
  videoUrl: string;
  caption: string;
  username: string;
  likes: number;
  comments: number;
  hashtags: string[];
  userAvatar?: string;
}

const Trending = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        loadTrendingVideos();
      }
    });
  }, [navigate]);

  const loadTrendingVideos = async () => {
    try {
      setError(null);
      setLoading(true);

      // Fetch videos with their creation timestamps
      const { data: videosData, error: videosError } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (videosError) throw videosError;

      // Calculate TikTok-style trending score
      const now = new Date().getTime();
      const scoredVideos = (videosData || []).map(video => {
        const createdAt = new Date(video.created_at).getTime();
        const ageInHours = (now - createdAt) / (1000 * 60 * 60);
        
        // Weights (TikTok-style)
        const likes = video.likes_count || 0;
        const comments = (video.comments_count || 0) * 3; // Comments worth 3x likes
        const completions = (video.completions_count || 0) * 2; // Full video watches worth 2x likes
        const shares = 0; // We don't have shares yet, but worth 5x likes
        
        // Total engagement
        const totalEngagement = likes + comments + completions + shares;
        
        // Engagement velocity (engagement per hour)
        const engagementVelocity = ageInHours > 0 ? totalEngagement / ageInHours : totalEngagement;
        
        // Time decay factor (newer videos get boost)
        // Videos lose 50% of their score every 24 hours
        const timeDecay = Math.pow(0.5, ageInHours / 24);
        
        // Recency boost for videos under 6 hours old
        const recencyBoost = ageInHours < 6 ? 1.5 : 1;
        
        // Final trending score
        const trendingScore = engagementVelocity * timeDecay * recencyBoost;
        
        return {
          ...video,
          trendingScore,
          engagementVelocity,
          ageInHours
        };
      });

      // Sort by trending score
      scoredVideos.sort((a, b) => b.trendingScore - a.trendingScore);

      // Fetch all unique user profiles
      const userIds = [...new Set(scoredVideos.map(v => v.user_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Create a map of profiles for quick lookup
      const profilesMap = new Map(
        profilesData?.map(p => [p.id, p]) || []
      );

      // Count trending videos per user (for badges)
      const userTrendingCount = new Map<string, number>();
      scoredVideos.forEach((video, index) => {
        if (index < 10) { // Only count top 10 as "trending"
          const count = userTrendingCount.get(video.user_id) || 0;
          userTrendingCount.set(video.user_id, count + 1);
        }
      });

      // Combine videos with profiles and trending counts
      const formattedVideos: Video[] = scoredVideos.map((video) => {
        const profile = profilesMap.get(video.user_id);
        return {
          id: video.id,
          videoUrl: video.video_url,
          caption: video.caption,
          username: profile?.username || "unknown",
          likes: video.likes_count || 0,
          comments: video.comments_count || 0,
          hashtags: video.hashtags || [],
          userAvatar: profile?.avatar_url,
          userTrendingCount: userTrendingCount.get(video.user_id) || 0,
        };
      });

      setVideos(formattedVideos);
    } catch (error: any) {
      console.error("Error loading trending videos:", error);
      setError(error.message || "Failed to load trending videos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background p-4">
        <p className="text-destructive mb-4 text-center">{error}</p>
        <Button onClick={loadTrendingVideos}>Try Again</Button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          <TrendingUp className="w-20 h-20 text-primary relative animate-bounce" />
        </div>
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          No Trending Videos Yet
        </h2>
        <p className="text-muted-foreground text-center mb-8 max-w-sm">
          Be the first to create viral content and watch your video soar to the top!
        </p>
        <Button 
          onClick={() => navigate("/upload")} 
          size="lg"
          className="group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            <VideoIcon className="w-4 h-4" />
            Upload Video
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-background relative">
      {/* Enhanced Header with Gradient */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black via-black/80 to-transparent pb-8">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <TrendingUp className="w-7 h-7 text-primary animate-pulse" />
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Trending</h1>
                <p className="text-xs text-white/60">Top videos right now</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
              <VideoIcon className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-white">{videos.length}</span>
            </div>
          </div>
        </div>
      </div>
      
      <VideoFeed videos={videos} onVoteChange={loadTrendingVideos} showTrendingRanks />
      <MobileNav />
    </div>
  );
};

export default Trending;
