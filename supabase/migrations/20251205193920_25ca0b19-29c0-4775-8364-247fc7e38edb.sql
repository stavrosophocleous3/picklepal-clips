-- Add video posting preference to profiles
ALTER TABLE public.profiles 
ADD COLUMN video_posting_enabled boolean NOT NULL DEFAULT false;