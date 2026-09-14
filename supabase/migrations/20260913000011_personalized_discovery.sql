-- Phase 14: Personalized Discovery (Student interests tags)

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}';

-- Create an index on the array for faster search overlap
CREATE INDEX IF NOT EXISTS idx_profiles_interests ON public.profiles USING GIN (interests);
