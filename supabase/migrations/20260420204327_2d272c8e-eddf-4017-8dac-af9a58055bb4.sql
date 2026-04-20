-- Function to decrement spots when an RSVP is created
CREATE OR REPLACE FUNCTION public.decrement_event_spots()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.event_id IS NOT NULL THEN
    UPDATE public.events
    SET spots = GREATEST(spots - 1, 0)
    WHERE id = NEW.event_id;
  ELSE
    UPDATE public.events
    SET spots = GREATEST(spots - 1, 0)
    WHERE slug = NEW.event_slug;
  END IF;
  RETURN NEW;
END;
$$;

-- Function to increment spots back when an RSVP is deleted by an admin
CREATE OR REPLACE FUNCTION public.increment_event_spots()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.event_id IS NOT NULL THEN
    UPDATE public.events
    SET spots = LEAST(spots + 1, capacity)
    WHERE id = OLD.event_id;
  ELSE
    UPDATE public.events
    SET spots = LEAST(spots + 1, capacity)
    WHERE slug = OLD.event_slug;
  END IF;
  RETURN OLD;
END;
$$;

-- Trigger: after RSVP insert -> decrement spots
DROP TRIGGER IF EXISTS trg_decrement_spots_after_rsvp ON public.event_rsvps;
CREATE TRIGGER trg_decrement_spots_after_rsvp
AFTER INSERT ON public.event_rsvps
FOR EACH ROW
EXECUTE FUNCTION public.decrement_event_spots();

-- Trigger: after RSVP delete -> increment spots
DROP TRIGGER IF EXISTS trg_increment_spots_after_rsvp_delete ON public.event_rsvps;
CREATE TRIGGER trg_increment_spots_after_rsvp_delete
AFTER DELETE ON public.event_rsvps
FOR EACH ROW
EXECUTE FUNCTION public.increment_event_spots();