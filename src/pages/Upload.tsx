import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload as UploadIcon, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Upload = () => {
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if video is max 30 seconds (this is a frontend check, backend validation needed)
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          toast({
            title: "Video too long",
            description: "Please upload a video that's 30 seconds or less",
            variant: "destructive",
          });
          return;
        }
        setVideoFile(file);
      };
      video.src = URL.createObjectURL(file);
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      toast({
        title: "No video selected",
        description: "Please select a video to upload",
        variant: "destructive",
      });
      return;
    }

    if (!caption.trim()) {
      toast({
        title: "Add a caption",
        description: "Please add a caption for your video",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload video to storage
      const fileExt = videoFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(fileName, videoFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("videos")
        .getPublicUrl(fileName);

      // Parse hashtags
      const hashtagArray = hashtags
        .split(" ")
        .filter((tag) => tag.trim().startsWith("#"))
        .map((tag) => tag.trim());

      // Insert video record
      const { error: insertError } = await supabase.from("videos").insert({
        user_id: user.id,
        video_url: publicUrl,
        caption,
        hashtags: hashtagArray,
      });

      if (insertError) throw insertError;

      toast({
        title: "Video uploaded!",
        description: "Your clip is now live on PickleTok",
      });

      // Reset form
      setCaption("");
      setHashtags("");
      setVideoFile(null);
      
      // Navigate to home
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-lg mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Clip</h1>
          <p className="text-muted-foreground">Share your best pickleball moments</p>
        </div>

        {/* Video Upload */}
        <div className="mb-6">
          <label
            htmlFor="video-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-2xl cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
          >
            {videoFile ? (
              <div className="flex flex-col items-center">
                <Video className="w-12 h-12 text-primary mb-2" />
                <p className="text-sm font-medium">{videoFile.name}</p>
                <p className="text-xs text-muted-foreground mt-1">Click to change</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <UploadIcon className="w-12 h-12 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Upload Video</p>
                <p className="text-xs text-muted-foreground mt-1">Max 30 seconds</p>
              </div>
            )}
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoChange}
            />
          </label>
        </div>

        {/* Caption */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Caption</label>
          <Textarea
            placeholder="Describe your clip..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="resize-none h-24"
          />
        </div>

        {/* Hashtags */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Hashtags</label>
          <Input
            placeholder="#pickleball #rally #epic"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Separate with spaces
          </p>
        </div>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          className="w-full h-12 text-lg font-semibold"
          size="lg"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload to PickleTok"}
        </Button>
      </div>

      <MobileNav />
    </div>
  );
};

export default Upload;
