-- Drop triggers first
DROP TRIGGER IF EXISTS update_likes_count_trigger ON likes;
DROP TRIGGER IF EXISTS update_comments_count_trigger ON comments;

-- Drop functions
DROP FUNCTION IF EXISTS update_video_likes_count();
DROP FUNCTION IF EXISTS update_video_comments_count();

-- Recreate functions with proper security
CREATE OR REPLACE FUNCTION update_video_likes_count()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE videos SET likes_count = likes_count + 1 WHERE id = NEW.video_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE videos SET likes_count = likes_count - 1 WHERE id = OLD.video_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION update_video_comments_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE videos SET comments_count = comments_count + 1 WHERE id = NEW.video_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE videos SET comments_count = comments_count - 1 WHERE id = OLD.video_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Recreate triggers
CREATE TRIGGER update_likes_count_trigger
AFTER INSERT OR DELETE ON likes
FOR EACH ROW EXECUTE FUNCTION update_video_likes_count();

CREATE TRIGGER update_comments_count_trigger
AFTER INSERT OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION update_video_comments_count();