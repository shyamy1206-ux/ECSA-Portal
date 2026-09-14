-- Add Phase 10 Tables: Projects and Collaboration

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    description TEXT,
    department TEXT,
    year TEXT,
    skills TEXT[],
    tech_stack TEXT[],
    github_url TEXT,
    live_url TEXT,
    demo_video TEXT,
    images TEXT[],
    mentor UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    milestones JSONB DEFAULT '[]',
    tasks JSONB DEFAULT '[]',
    status content_status DEFAULT 'draft',
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Projects RLS
-- Public can read published projects
CREATE POLICY "Public can view published projects" ON public.projects
    FOR SELECT USING (status = 'published');

-- Authenticated users can view projects they are members of
CREATE POLICY "Users can view their own projects" ON public.projects
    FOR SELECT TO authenticated USING (
        created_by = auth.uid() OR 
        id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid())
    );

-- Users can create projects
CREATE POLICY "Users can create projects" ON public.projects
    FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

-- Project creators can update their projects
CREATE POLICY "Creators can update projects" ON public.projects
    FOR UPDATE TO authenticated USING (created_by = auth.uid());

-- Project Members RLS
-- Anyone can see members of published projects
CREATE POLICY "Public can view members of published projects" ON public.project_members
    FOR SELECT USING (
        project_id IN (SELECT id FROM public.projects WHERE status = 'published')
    );

-- Project creators can see all member requests for their projects
CREATE POLICY "Creators can view all member requests" ON public.project_members
    FOR SELECT TO authenticated USING (
        project_id IN (SELECT id FROM public.projects WHERE created_by = auth.uid())
    );

-- Users can see their own membership requests
CREATE POLICY "Users can view their own memberships" ON public.project_members
    FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Users can request to join projects
CREATE POLICY "Users can request to join projects" ON public.project_members
    FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Project creators can approve/reject/update member statuses
CREATE POLICY "Creators can manage project members" ON public.project_members
    FOR UPDATE TO authenticated USING (
        project_id IN (SELECT id FROM public.projects WHERE created_by = auth.uid())
    );
