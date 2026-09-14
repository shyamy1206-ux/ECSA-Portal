-- Phase 13: Realtime Notifications Triggers

ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'system';

-- Function to notify all users when an urgent announcement is published
CREATE OR REPLACE FUNCTION notify_urgent_announcements()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'published' AND NEW.priority IN ('high', 'urgent') AND (OLD.status IS DISTINCT FROM 'published') THEN
        INSERT INTO public.notifications (user_id, type, title, message, link)
        SELECT id, 'system', 'Urgent: ' || NEW.title, left(NEW.content, 100), '/#announcements'
        FROM public.profiles;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_urgent_announcement_published
    AFTER INSERT OR UPDATE ON public.announcements
    FOR EACH ROW EXECUTE PROCEDURE notify_urgent_announcements();

-- Function to notify all users when a new event is published
CREATE OR REPLACE FUNCTION notify_new_events()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'published' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'published') THEN
        INSERT INTO public.notifications (user_id, type, title, message, link)
        SELECT id, 'event', 'New Event: ' || NEW.title, 'A new ' || NEW.type || ' is happening on ' || NEW.date, '/events/' || NEW.id
        FROM public.profiles;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_event_published
    AFTER INSERT OR UPDATE ON public.events
    FOR EACH ROW EXECUTE PROCEDURE notify_new_events();

-- Function to notify all users when a new opportunity is published
CREATE OR REPLACE FUNCTION notify_new_opportunities()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'published' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'published') THEN
        INSERT INTO public.notifications (user_id, type, title, message, link)
        SELECT id, 'opportunity', 'New Opportunity: ' || NEW.title, NEW.company || ' is looking for ' || NEW.type, '/opportunities'
        FROM public.profiles;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_opportunity_published
    AFTER INSERT OR UPDATE ON public.opportunities
    FOR EACH ROW EXECUTE PROCEDURE notify_new_opportunities();
