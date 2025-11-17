import { VideoCard } from "./VideoCard";

interface Video {
  id: string;
  videoUrl: string;
  caption: string;
  username: string;
  likes: number;
  comments: number;
  hashtags: string[];
  userAvatar?: string;
  userTrendingCount?: number;
}

interface VideoFeedProps {
  videos: Video[];
  onVoteChange?: () => void;
  showTrendingRanks?: boolean;
}

export const VideoFeed = ({ videos, onVoteChange, showTrendingRanks }: VideoFeedProps) => {
  return (
    <div className="h-screen overflow-y-scroll snap-scroll hide-scrollbar">
      {videos.map((video, index) => (
        <VideoCard 
          key={video.id} 
          {...video} 
          videoId={video.id} 
          onVoteChange={onVoteChange}
          trendingRank={showTrendingRanks ? index + 1 : undefined}
          userTrendingCount={video.userTrendingCount}
        />
      ))}
    </div>
  );
};
