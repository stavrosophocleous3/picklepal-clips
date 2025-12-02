-- Add day and time preferences to groups table
ALTER TABLE public.groups 
ADD COLUMN preferred_days text[] DEFAULT ARRAY['any'],
ADD COLUMN preferred_time text DEFAULT 'any';

COMMENT ON COLUMN public.groups.preferred_days IS 'Days of the week the group plays: monday, tuesday, wednesday, thursday, friday, saturday, sunday, or any';
COMMENT ON COLUMN public.groups.preferred_time IS 'Preferred time for the group in HH:MM format or any';