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

      // Fetch videos sorted by engagement score (likes + comments)
      const { data: videosData, error: videosError } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (videosError) throw videosError;

      // Calculate trending score and sort
      const scoredVideos = (videosData || []).map(video => ({
        ...video,
        trendingScore: (video.likes_count || 0) + (video.comments_count || 0) * 2
      }));

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

      // Combine videos with profiles
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
      <div className="h-screen flex flex-col items-center justify-center bg-background p-4">
        <TrendingUp className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No trending videos</h2>
        <p className="text-muted-foreground text-center mb-6">
          Be the first to create viral content!
        </p>
        <Button onClick={() => navigate("/upload")}>Upload Video</Button>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4">
        <div className="flex items-center gap-2 text-white">
          <TrendingUp className="w-6 h-6" />
          <h1 className="text-xl font-bold">Trending</h1>
        </div>
      </div>
      
      <VideoFeed videos={videos} onVoteChange={loadTrendingVideos} />
      <MobileNav />
    </div>
  );
};

export default Trending;
