-- Create bod_members table
CREATE TABLE IF NOT EXISTS public.bod_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    post TEXT NOT NULL,
    session TEXT NOT NULL DEFAULT 'EST 2026-27',
    responsibility TEXT,
    bio TEXT,
    photo_path TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS policies for bod_members
ALTER TABLE public.bod_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active BOD members"
    ON public.bod_members
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Allow admins full access to bod_members"
    ON public.bod_members
    FOR ALL
    USING (auth.role() = 'authenticated'); -- Assuming any authenticated user is admin for now, or adapt to existing RBAC

-- Insert seed data
INSERT INTO public.bod_members (full_name, post, display_order) VALUES
('Priyanshu Prasad', 'PRESIDENT', 1),
('Tanushree Jadhav', 'VICE PRESIDENT', 2),
('Ojas Sulakhe', 'SECRETARY', 3),
('Vrushabh Yeole', 'JOINT SECRETARY', 4),
('Aman Wagh', 'TREASURER', 5),
('Tanaya Patil', 'PR & OUTREACH HEAD', 6),
('Shrujal Inde', 'TECHNICAL HEAD', 7),
('Vaibhav', 'EVENT MANAGEMENT HEAD', 8),
('Pranav Borkar', 'SOCIAL MEDIA & PUBLICITY HEAD', 9),
('Payal Jadhav', 'DESIGN & CREATIVE HEAD', 10),
('Atharva Karanjekar', 'SPONSORSHIP & INDUSTRY HEAD', 11),
('Dipali Thorbole', 'DISCIPLINE & COORDINATION HEAD', 12)
ON CONFLICT DO NOTHING;

-- Create storage bucket for bod-photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('bod-photos', 'bod-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read access for bod-photos" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'bod-photos');

CREATE POLICY "Admin upload access for bod-photos" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'bod-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Admin update access for bod-photos" 
    ON storage.objects FOR UPDATE 
    USING (bucket_id = 'bod-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete access for bod-photos" 
    ON storage.objects FOR DELETE 
    USING (bucket_id = 'bod-photos' AND auth.role() = 'authenticated');
