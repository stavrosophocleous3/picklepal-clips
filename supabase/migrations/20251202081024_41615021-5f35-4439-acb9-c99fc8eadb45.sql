-- Add max_players column to group_messages for game posts
ALTER TABLE public.group_messages
ADD COLUMN max_players integer;

-- Add a comment to document the column
COMMENT ON COLUMN public.group_messages.max_players IS 'Maximum number of players for game posts (4, 8, 12, 16, or 20). NULL for non-game messages.';