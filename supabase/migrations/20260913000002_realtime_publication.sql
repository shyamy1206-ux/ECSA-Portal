-- ==============================================================================
-- ECSA PLATFORM - REALTIME CONFIGURATION
-- ==============================================================================

-- Enable logical replication on specific tables by adding them to the supabase_realtime publication
-- Only announcements and notifications need to be broadcasted instantly to clients.

BEGIN;

-- Drop the publication if it exists to ensure idempotency, or simply add tables if we assume it exists.
-- Supabase automatically creates the `supabase_realtime` publication.
-- We can add tables to it.

ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

COMMIT;
