-- Add left_at column to group_members to track when users leave groups
ALTER TABLE group_members ADD COLUMN left_at timestamp with time zone DEFAULT NULL;

-- Update RLS policy to only show active members when querying
DROP POLICY IF EXISTS "Users can view members of their groups" ON group_members;
CREATE POLICY "Users can view members of their groups"
ON group_members FOR SELECT
USING (
  is_group_member(auth.uid(), group_id) 
  AND left_at IS NULL
);

-- Allow users to update their own membership (for soft delete)
CREATE POLICY "Users can update their own membership"
ON group_members FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);