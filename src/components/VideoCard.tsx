import { useState, useEffect, useRef } from "react";
import { MessageCircle, Share2, User } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import pickleballIcon from "@/assets/pickleball.png";
import pickleballBrokenIcon from "@/assets/pickleball-broken.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VideoCardProps {
  videoUrl: string;
  caption: string;
  username: string;
  likes: number;
  comments: number;
  hashtags: string[];
  userAvatar?: string;
  videoId: string;
  onVoteChange?: () => void;
}

export const VideoCard = ({
  videoUrl,
  caption,
  username,
  likes,
  comments,
  hashtags,
  userAvatar,
  videoId,
  onVoteChange,
}: VideoCardProps) => {
  const [vote, setVote] = useState<'up' | 'down' | null>(null);
  const [voteCount, setVoteCount] = useState(likes);
  const [isLoading, setIsLoading] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkUserVote();
  }, [videoId]);

  const checkUserVote = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("likes")
      .select("*")
      .eq("video_id", videoId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setVote('up');
    }
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleDoubleTap = async () => {
    const now = Date.now();
    const timeSince = now - lastTap;
    
    if (timeSince < 300 && timeSince > 0) {
      // Double tap detected
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 1000);
      
      if (vote !== 'up') {
        await handleUpvote();
      }
    }
    
    setLastTap(now);
  };

  const handleUpvote = async () => {
    if (isLoading) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to vote on videos",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (vote === 'up') {
        // Remove vote
        await supabase
          .from("likes")
          .delete()
          .eq("video_id", videoId)
          .eq("user_id", user.id);
        
        setVote(null);
        setVoteCount(voteCount - 1);
      } else {
        // Add upvote (remove downvote if exists, though we don't store downvotes)
        await supabase
          .from("likes")
          .insert({
            video_id: videoId,
            user_id: user.id,
          });
        
        const adjustment = vote === 'down' ? 2 : 1;
        setVote('up');
        setVoteCount(voteCount + adjustment);
      }
      
      onVoteChange?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownvote = async () => {
    if (isLoading) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to vote on videos",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (vote === 'down') {
        setVote(null);
        setVoteCount(voteCount + 1);
      } else if (vote === 'up') {
        // Remove the like from database
        await supabase
          .from("likes")
          .delete()
          .eq("video_id", videoId)
          .eq("user_id", user.id);
        
        setVote('down');
        setVoteCount(voteCount - 2);
      } else {
        setVote('down');
        setVoteCount(voteCount - 1);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen snap-item">
      {/* Video Background */}
      <div 
        className="absolute inset-0 bg-muted"
        onClick={handleVideoClick}
        onDoubleClick={handleDoubleTap}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          loop
          autoPlay
          playsInline
          muted
        />
      </div>

      {/* Double-tap Like Animation */}
      {showLikeAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src={pickleballIcon}
            alt="Like"
            className="w-32 h-32 animate-scale-in drop-shadow-[0_0_20px_hsl(var(--primary))]"
          />
        </div>
      )}

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 pb-20 pointer-events-none">
        <div className="flex gap-4">
          {/* Left Side - Info */}
          <div className="flex-1 pointer-events-auto">
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
          <div className="flex flex-col items-center gap-4 pointer-events-auto">
            {/* Upvote - Pickleball */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleUpvote}
              disabled={isLoading}
              className="flex flex-col h-auto gap-1"
            >
              <img
                src={pickleballIcon}
                alt="Pickleball"
                className={cn(
                  "w-10 h-10 transition-all",
                  vote === 'up' ? "scale-110 drop-shadow-[0_0_8px_hsl(var(--primary))]" : "opacity-80"
                )}
              />
            </Button>
            
            {/* Vote Count */}
            <span className="text-sm font-bold text-white">{voteCount}</span>

            {/* Downvote - Broken Pickleball */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownvote}
              disabled={isLoading}
              className="flex flex-col h-auto gap-1"
            >
              <img
                src={pickleballBrokenIcon}
                alt="Broken Pickleball"
                className={cn(
                  "w-10 h-10 transition-all",
                  vote === 'down' ? "scale-110 drop-shadow-[0_0_8px_hsl(var(--destructive))]" : "opacity-80"
                )}
              />
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
