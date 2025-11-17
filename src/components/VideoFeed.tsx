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
}

interface VideoFeedProps {
  videos: Video[];
  onVoteChange?: () => void;
}

export const VideoFeed = ({ videos, onVoteChange }: VideoFeedProps) => {
  return (
    <div className="h-screen overflow-y-scroll snap-scroll hide-scrollbar">
      {videos.map((video) => (
        <VideoCard key={video.id} {...video} videoId={video.id} onVoteChange={onVoteChange} />
      ))}
    </div>
  );
};
