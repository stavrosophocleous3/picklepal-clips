import { MobileNav } from "@/components/MobileNav";
import { VideoFeed } from "@/components/VideoFeed";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2, Trophy, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const PickleLights = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("player");
  const navigate = useNavigate();

  useEffect(() => {
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
      const { data: videosData, error: videosError } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (videosError) throw videosError;

      const userIds = [...new Set(videosData?.map(v => v.user_id) || [])];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      const profilesMap = new Map(
        profilesData?.map(p => [p.id, p]) || []
      );

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
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex items-center justify-between h-16 px-4">
            <h1 className="text-xl font-bold">Pickle Lights</h1>
          </div>
          <TabsList className="w-full justify-start rounded-none border-b h-12 bg-transparent p-0">
            <TabsTrigger 
              value="player" 
              className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Player Highlights
            </TabsTrigger>
            <TabsTrigger 
              value="coaching"
              className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Coaching
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="player" className="flex-1 m-0 overflow-hidden">
          <VideoFeed videos={videos} onVoteChange={loadVideos} />
        </TabsContent>

        <TabsContent value="coaching" className="flex-1 m-0">
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Coaching Highlights</h2>
            <p className="text-muted-foreground text-center max-w-sm">
              Expert coaching tips and techniques coming soon
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <MobileNav />
    </div>
  );
};

export default PickleLights;
