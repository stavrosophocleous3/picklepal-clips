-- Create video_views table to track view completions
CREATE TABLE IF NOT EXISTS public.video_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(video_id, user_id)
);

-- Enable RLS
ALTER TABLE public.video_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Video views are viewable by everyone"
  ON public.video_views FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own video views"
  ON public.video_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video views"
  ON public.video_views FOR UPDATE
  USING (auth.uid() = user_id);

-- Add completions_count to videos table
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS completions_count INTEGER DEFAULT 0;

-- Function to update video completions count
CREATE OR REPLACE FUNCTION public.update_video_completions_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.completed = true THEN
    UPDATE videos SET completions_count = completions_count + 1 WHERE id = NEW.video_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.completed = false AND NEW.completed = true THEN
    UPDATE videos SET completions_count = completions_count + 1 WHERE id = NEW.video_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.completed = true AND NEW.completed = false THEN
    UPDATE videos SET completions_count = completions_count - 1 WHERE id = NEW.video_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for video completions count
CREATE TRIGGER update_video_completions_count_trigger
  AFTER INSERT OR UPDATE ON public.video_views
  FOR EACH ROW
  EXECUTE FUNCTION public.update_video_completions_count();