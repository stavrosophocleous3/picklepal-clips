import { VideoFeed } from "@/components/VideoFeed";
import { MobileNav } from "@/components/MobileNav";
import { UserPlus } from "lucide-react";

// Mock following feed - will show videos from users you follow
const followingVideos = [
  {
    id: "f1",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    caption: "New training session!",
    username: "picklemaster",
    likes: 432,
    comments: 23,
    hashtags: ["training", "pickleball", "practice"],
  },
];

const Following = () => {
  return (
    <div className="h-screen overflow-hidden bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4">
        <div className="flex items-center gap-2 text-white">
          <UserPlus className="w-6 h-6" />
          <h1 className="text-xl font-bold">Following</h1>
        </div>
      </div>

      {followingVideos.length > 0 ? (
        <VideoFeed videos={followingVideos} />
      ) : (
        <div className="h-full flex items-center justify-center pb-16">
          <div className="text-center px-6">
            <UserPlus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No videos yet</h2>
            <p className="text-muted-foreground">
              Follow players to see their latest clips here
            </p>
          </div>
        </div>
      )}
      <MobileNav />
    </div>
  );
};

export default Following;
