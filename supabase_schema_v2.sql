-- ECSA Production Schema V2 Expansion
-- Includes Recruitment, Galleries, Student Growth, and Audit systems

-- Note: Run this in your Supabase SQL Editor AFTER the initial schema.

-- 1. CLUBS EXPANSION (Recruitment)
CREATE TABLE IF NOT EXISTS public.club_recruitment_drives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed')),
    opens_at TIMESTAMPTZ,
    closes_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.recruitment_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    drive_id UUID REFERENCES public.club_recruitment_drives(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    requirements TEXT[],
    vacancies INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.recruitment_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role_id UUID REFERENCES public.recruitment_roles(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'shortlisted', 'accepted', 'rejected', 'withdrawn')),
    resume_url TEXT,
    cover_letter TEXT,
    answers JSONB DEFAULT '{}'::jsonb,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_id, student_id)
);

-- 2. EVENTS EXPANSION (Registrations & Galleries)
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'waitlisted', 'cancelled')),
    attended BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.event_galleries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id),
    UNIQUE(event_id)
);

CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    gallery_id UUID REFERENCES public.event_galleries(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    caption TEXT,
    is_cover BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. STUDENT GROWTH (Projects & Mentorship)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    tech_stack TEXT[],
    github_url TEXT,
    live_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_members (
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT,
    PRIMARY KEY (project_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.mentorship_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    company TEXT,
    job_title TEXT,
    graduation_year INTEGER,
    expertise TEXT[],
    bio TEXT,
    linkedin_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id)
);

CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT,
    type TEXT CHECK (type IN ('internship', 'full_time', 'freelance', 'hackathon')),
    description TEXT,
    link TEXT,
    status TEXT DEFAULT 'open',
    posted_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. UTILITY (Resources, Helpdesk, Audit)
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    type TEXT CHECK (type IN ('file', 'folder', 'link')),
    storage_path TEXT,
    url TEXT,
    uploaded_by UUID REFERENCES public.profiles(id),
    status TEXT DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS
ALTER TABLE public.club_recruitment_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitment_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitment_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- 1. Recruitment Drives (Public can view 'open')
CREATE POLICY "Public can view open recruitment drives" ON public.club_recruitment_drives
    FOR SELECT USING (status = 'open' OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('ecsa_admin', 'super_admin')));
CREATE POLICY "Admins can manage recruitment drives" ON public.club_recruitment_drives
    USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('ecsa_admin', 'super_admin')));

-- 2. Recruitment Roles
CREATE POLICY "Public can view roles for open drives" ON public.recruitment_roles
    FOR SELECT USING (drive_id IN (SELECT id FROM club_recruitment_drives WHERE status = 'open' OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('ecsa_admin', 'super_admin'))));
CREATE POLICY "Admins can manage roles" ON public.recruitment_roles
    USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('ecsa_admin', 'super_admin')));

-- 3. Recruitment Applications (Students can only see/edit their own, Admins see all)
CREATE POLICY "Students manage their own applications" ON public.recruitment_applications
    FOR ALL USING (student_id = auth.uid());
CREATE POLICY "Admins view and edit all applications" ON public.recruitment_applications
    FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('ecsa_admin', 'super_admin')));

-- 4. Event Registrations (Students manage own, Admins see all)
CREATE POLICY "Students manage own registrations" ON public.event_registrations
    FOR ALL USING (student_id = auth.uid());
CREATE POLICY "Admins manage all registrations" ON public.event_registrations
    FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('ecsa_admin', 'super_admin')));

-- 5. Galleries & Images (Public read published, Admins manage)
CREATE POLICY "Public view published galleries" ON public.event_galleries
    FOR SELECT USING (status = 'published');
CREATE POLICY "Admins manage galleries" ON public.event_galleries
    USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('ecsa_admin', 'super_admin')));

CREATE POLICY "Public view published gallery images" ON public.gallery_images
    FOR SELECT USING (gallery_id IN (SELECT id FROM event_galleries WHERE status = 'published'));
CREATE POLICY "Admins manage gallery images" ON public.gallery_images
    USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('ecsa_admin', 'super_admin')));

-- 6. Projects (Public view approved, Authors view/edit own)
CREATE POLICY "Public view approved projects" ON public.projects
    FOR SELECT USING (status = 'approved');
CREATE POLICY "Authors manage own projects" ON public.projects
    USING (created_by = auth.uid());
CREATE POLICY "Admins manage all projects" ON public.projects
    USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('ecsa_admin', 'super_admin')));

-- 7. Resources (Public view published)
CREATE POLICY "Public view published resources" ON public.resources
    FOR SELECT USING (status = 'published');
CREATE POLICY "Admins manage resources" ON public.resources
    USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('ecsa_admin', 'super_admin')));

-- 8. Mentorship (Public view available)
CREATE POLICY "Public view available mentors" ON public.mentorship_profiles
    FOR SELECT USING (is_available = true);
CREATE POLICY "Admins manage mentorships" ON public.mentorship_profiles
    USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('ecsa_admin', 'super_admin')));
