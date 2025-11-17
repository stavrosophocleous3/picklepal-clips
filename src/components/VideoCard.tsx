import { useState } from "react";
import { Heart, MessageCircle, Share2, User } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  videoUrl: string;
  caption: string;
  username: string;
  likes: number;
  comments: number;
  hashtags: string[];
  userAvatar?: string;
}

export const VideoCard = ({
  videoUrl,
  caption,
  username,
  likes,
  comments,
  hashtags,
  userAvatar,
}: VideoCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="relative w-full h-screen snap-item">
      {/* Video Background */}
      <div className="absolute inset-0 bg-muted">
        <video
          src={videoUrl}
          className="w-full h-full object-cover"
          loop
          autoPlay
          playsInline
          muted
        />
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 pb-20">
        <div className="flex gap-4">
          {/* Left Side - Info */}
          <div className="flex-1">
            {/* User Info */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-background">
                {userAvatar ? (
                  <img src={userAvatar} alt={username} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <span className="font-semibold text-white">@{username}</span>
            </div>

            {/* Caption */}
            <p className="text-white text-sm mb-2">{caption}</p>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, index) => (
                <span key={index} className="text-primary text-sm font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex flex-col items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              className="flex flex-col h-auto gap-1"
            >
              <Heart
                className={cn(
                  "w-7 h-7 transition-colors",
                  isLiked ? "fill-primary text-primary" : "text-white"
                )}
              />
              <span className="text-xs text-white">{likeCount}</span>
            </Button>

            <Button variant="ghost" size="icon" className="flex flex-col h-auto gap-1">
              <MessageCircle className="w-7 h-7 text-white" />
              <span className="text-xs text-white">{comments}</span>
            </Button>

            <Button variant="ghost" size="icon" className="flex flex-col h-auto gap-1">
              <Share2 className="w-7 h-7 text-white" />
              <span className="text-xs text-white">Share</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
