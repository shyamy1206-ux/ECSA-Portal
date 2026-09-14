-- ==============================================================================
-- PHASE 5: ADDITIVE CAMPUS FEATURES SCHEMA
-- ==============================================================================

-- 1. CLUB RECRUITMENT
CREATE TABLE IF NOT EXISTS public.club_recruitment_drives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status content_status DEFAULT 'draft',
    open_date TIMESTAMPTZ NOT NULL,
    close_date TIMESTAMPTZ NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.club_recruitment_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    drive_id UUID REFERENCES public.club_recruitment_drives(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    requirements TEXT,
    capacity INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.club_recruitment_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role_id UUID REFERENCES public.club_recruitment_roles(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status content_status DEFAULT 'pending',
    answers JSONB,
    resume_url TEXT,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_id, student_id)
);

-- 2. EVENT GALLERIES
CREATE TABLE IF NOT EXISTS public.event_galleries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    status content_status DEFAULT 'draft',
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id)
);

CREATE TABLE IF NOT EXISTS public.event_gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    gallery_id UUID REFERENCES public.event_galleries(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    is_cover BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. OPPORTUNITIES
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    eligibility TEXT,
    external_url TEXT,
    deadline TIMESTAMPTZ,
    status content_status DEFAULT 'pending',
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LOST AND FOUND
CREATE TABLE IF NOT EXISTS public.lost_found_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    location TEXT,
    date_found_lost TIMESTAMPTZ NOT NULL,
    item_type TEXT CHECK (item_type IN ('lost', 'found')),
    image_url TEXT,
    status content_status DEFAULT 'pending',
    reported_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SERVICE & EQUIPMENT REQUESTS
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    status content_status DEFAULT 'pending',
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.equipment_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    equipment_name TEXT NOT NULL,
    purpose TEXT,
    requested_date TIMESTAMPTZ NOT NULL,
    status content_status DEFAULT 'pending',
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PERSONALIZATION & SAVES
CREATE TABLE IF NOT EXISTS public.student_saved_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, entity_type, entity_id)
);

CREATE TABLE IF NOT EXISTS public.student_interest_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    interests TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id)
);

-- 7. ENGAGEMENT & TRENDING (Privacy-Safe)
CREATE TABLE IF NOT EXISTS public.content_engagement_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'save', 'apply', 'register', 'share')),
    -- User ID is deliberately omitted or made nullable to ensure privacy and prevent unlimited history tracking
    user_hash TEXT, 
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.trending_content_snapshots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    trending_score FLOAT DEFAULT 0.0,
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(entity_type, entity_id)
);

-- ==============================================================================
-- ADD TRIGGERS
-- ==============================================================================
CREATE TRIGGER update_club_recruitment_drives_modtime BEFORE UPDATE ON club_recruitment_drives FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_club_recruitment_roles_modtime BEFORE UPDATE ON club_recruitment_roles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_club_recruitment_applications_modtime BEFORE UPDATE ON club_recruitment_applications FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_event_galleries_modtime BEFORE UPDATE ON event_galleries FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_opportunities_modtime BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_lost_found_items_modtime BEFORE UPDATE ON lost_found_items FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_service_requests_modtime BEFORE UPDATE ON service_requests FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_equipment_requests_modtime BEFORE UPDATE ON equipment_requests FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_student_interest_preferences_modtime BEFORE UPDATE ON student_interest_preferences FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
