-- Create table for game RSVPs
CREATE TABLE public.game_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  message_id UUID NOT NULL REFERENCES public.group_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('going', 'not_going')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- Enable RLS
ALTER TABLE public.game_rsvps ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view RSVPs in their groups"
  ON public.game_rsvps
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_members.group_id = game_rsvps.group_id
        AND group_members.user_id = auth.uid()
        AND group_members.left_at IS NULL
    )
  );

CREATE POLICY "Users can insert their own RSVPs"
  ON public.game_rsvps
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_members.group_id = game_rsvps.group_id
        AND group_members.user_id = auth.uid()
        AND group_members.left_at IS NULL
    )
  );

CREATE POLICY "Users can update their own RSVPs"
  ON public.game_rsvps
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own RSVPs"
  ON public.game_rsvps
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_game_rsvps_message_id ON public.game_rsvps(message_id);
CREATE INDEX idx_game_rsvps_user_id ON public.game_rsvps(user_id);