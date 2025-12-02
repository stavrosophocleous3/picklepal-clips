-- Allow users to delete their own messages
CREATE POLICY "Users can delete their own messages"
ON public.group_messages
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);