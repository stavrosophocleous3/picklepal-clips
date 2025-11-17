import { VideoFeed } from "@/components/VideoFeed";
import { MobileNav } from "@/components/MobileNav";

// Mock data - will be replaced with real data from backend
const mockVideos = [
  {
    id: "1",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    caption: "Perfect backhand volley! 🎾",
    username: "picklemaster",
    likes: 1234,
    comments: 56,
    hashtags: ["pickleball", "volley", "pickleballtips"],
  },
  {
    id: "2",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    caption: "Epic rally at the net! Who won? 👀",
    username: "courtqueen",
    likes: 892,
    comments: 34,
    hashtags: ["pickleball", "rally", "competitive"],
  },
  {
    id: "3",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    caption: "Serve technique breakdown 💪",
    username: "proballer",
    likes: 2104,
    comments: 78,
    hashtags: ["pickleball", "serve", "tutorial"],
  },
];

const Home = () => {
  return (
    <div className="h-screen overflow-hidden bg-background">
      <VideoFeed videos={mockVideos} />
      <MobileNav />
    </div>
  );
};

export default Home;
