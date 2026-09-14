-- Phase 11: Mentorship Schema

-- Mentorship Profiles (Alumni / Faculty mentors)
CREATE TABLE IF NOT EXISTS public.mentorship_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    job_title TEXT,
    company TEXT,
    graduation_year INT,
    expertise TEXT[] DEFAULT '{}',
    mentorship_topics TEXT[] DEFAULT '{}',
    bio TEXT,
    linkedin_url TEXT,
    is_available BOOLEAN DEFAULT true,
    max_mentees INT DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mentorship Requests
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mentor_id UUID REFERENCES public.mentorship_profiles(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    topics TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed')),
    mentor_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(mentor_id, student_id)
);

-- Enable RLS
ALTER TABLE public.mentorship_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;

-- Mentorship Profiles RLS
-- Public can view available mentors
CREATE POLICY "Public can view available mentors" ON public.mentorship_profiles
    FOR SELECT USING (is_available = true);

-- Mentors can view and update their own profile
CREATE POLICY "Mentors can manage own profile" ON public.mentorship_profiles
    FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Mentorship Requests RLS
-- Students can view their own requests
CREATE POLICY "Students can view own requests" ON public.mentorship_requests
    FOR SELECT TO authenticated USING (student_id = auth.uid());

-- Mentors can view requests sent to them
CREATE POLICY "Mentors can view incoming requests" ON public.mentorship_requests
    FOR SELECT TO authenticated USING (
        mentor_id IN (SELECT id FROM public.mentorship_profiles WHERE user_id = auth.uid())
    );

-- Students can create requests
CREATE POLICY "Students can create requests" ON public.mentorship_requests
    FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());

-- Mentors can update requests sent to them (accept/decline)
CREATE POLICY "Mentors can update incoming requests" ON public.mentorship_requests
    FOR UPDATE TO authenticated USING (
        mentor_id IN (SELECT id FROM public.mentorship_profiles WHERE user_id = auth.uid())
    );
