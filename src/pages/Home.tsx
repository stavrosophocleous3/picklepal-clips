import { VideoFeed } from "@/components/VideoFeed";
import { MobileNav } from "@/components/MobileNav";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

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
    } catch (error) {
      console.error("Error loading videos:", error);
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

  return (
    <div className="h-screen overflow-hidden bg-background">
      <VideoFeed videos={videos} />
      <MobileNav />
    </div>
  );
};

export default Home;
