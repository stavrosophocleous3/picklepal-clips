import { VideoFeed } from "@/components/VideoFeed";
import { MobileNav } from "@/components/MobileNav";
import { TrendingUp } from "lucide-react";

// Mock trending videos - will be replaced with real data sorted by upvotes/velocity
const trendingVideos = [
  {
    id: "t1",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    caption: "This shot is INSANE! 🔥",
    username: "picklepro",
    likes: 5432,
    comments: 234,
    hashtags: ["viral", "pickleball", "amazing"],
  },
  {
    id: "t2",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    caption: "Tournament winning point!",
    username: "championplayer",
    likes: 4521,
    comments: 189,
    hashtags: ["tournament", "winner", "pickleball"],
  },
];

const Trending = () => {
  return (
    <div className="h-screen overflow-hidden bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4">
        <div className="flex items-center gap-2 text-white">
          <TrendingUp className="w-6 h-6" />
          <h1 className="text-xl font-bold">Trending</h1>
        </div>
      </div>
      
      <VideoFeed videos={trendingVideos} />
      <MobileNav />
    </div>
  );
};

export default Trending;
