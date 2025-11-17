import { VideoFeed } from "@/components/VideoFeed";
import { MobileNav } from "@/components/MobileNav";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2, Video as VideoIcon } from "lucide-react";
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

const Home = () => {
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
        loadVideos();
      }
    });
  }, [navigate]);

  const loadVideos = async () => {
    try {
      setError(null);
      // Fetch videos
      const { data: videosData, error: videosError } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (videosError) throw videosError;

      // Fetch all unique user profiles
      const userIds = [...new Set(videosData?.map(v => v.user_id) || [])];
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
      const formattedVideos: Video[] = (videosData || []).map((video) => {
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
      console.error("Error loading videos:", error);
      setError(error.message || "Failed to load videos");
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
        <Button onClick={loadVideos}>Try Again</Button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background p-4">
        <VideoIcon className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No videos yet</h2>
        <p className="text-muted-foreground text-center mb-6">
          Be the first to share a pickleball moment!
        </p>
        <Button onClick={() => navigate("/upload")}>Upload Video</Button>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-background">
      <VideoFeed videos={videos} onVoteChange={loadVideos} />
      <MobileNav />
    </div>
  );
};

export default Home;
