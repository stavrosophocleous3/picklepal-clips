-- Drop the existing SELECT policy for groups
DROP POLICY IF EXISTS "Users can view groups they are members of" ON public.groups;

-- Create a new policy that allows users to see groups they created OR are members of
CREATE POLICY "Users can view their groups"
  ON public.groups FOR SELECT
  USING (
    auth.uid() = created_by OR
    public.is_group_member(auth.uid(), id)
  );