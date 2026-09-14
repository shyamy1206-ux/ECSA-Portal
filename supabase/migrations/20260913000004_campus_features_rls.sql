-- ==============================================================================
-- PHASE 5: ADDITIVE CAMPUS FEATURES RLS POLICIES & REALTIME
-- ==============================================================================

-- Enable RLS on all new tables
ALTER TABLE public.club_recruitment_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_recruitment_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_recruitment_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_interest_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_engagement_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trending_content_snapshots ENABLE ROW LEVEL SECURITY;

-- 1. CLUB RECRUITMENT DRIVES & ROLES
-- Public can see published drives and roles
CREATE POLICY "Public can view published recruitment drives" 
ON public.club_recruitment_drives FOR SELECT 
USING (status = 'published');

CREATE POLICY "Public can view roles for published drives" 
ON public.club_recruitment_roles FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.club_recruitment_drives d 
  WHERE d.id = drive_id AND d.status = 'published'
));

-- 2. RECRUITMENT APPLICATIONS
-- Students can only see, insert, and update their own applications
CREATE POLICY "Students can manage their own applications" 
ON public.club_recruitment_applications FOR ALL 
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);

-- 3. EVENT GALLERIES
-- Public can see published galleries and their images
CREATE POLICY "Public can view published galleries" 
ON public.event_galleries FOR SELECT 
USING (status = 'published');

CREATE POLICY "Public can view images of published galleries" 
ON public.event_gallery_images FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.event_galleries g 
  WHERE g.id = gallery_id AND g.status = 'published'
));

-- 4. OPPORTUNITIES
-- Public can view approved opportunities
CREATE POLICY "Public can view approved opportunities" 
ON public.opportunities FOR SELECT 
USING (status = 'approved');

-- 5. LOST AND FOUND
-- Public can view approved/published lost and found items
CREATE POLICY "Public can view published lost and found items" 
ON public.lost_found_items FOR SELECT 
USING (status = 'published' OR status = 'approved');

-- Students can insert their own reports
CREATE POLICY "Students can report lost and found items" 
ON public.lost_found_items FOR INSERT 
WITH CHECK (auth.uid() = reported_by);

-- 6. SERVICE & EQUIPMENT REQUESTS (Helpdesk)
-- Students can manage their own requests
CREATE POLICY "Students can manage their own service requests" 
ON public.service_requests FOR ALL 
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can manage their own equipment requests" 
ON public.equipment_requests FOR ALL 
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);

-- 7. PERSONALIZATION
CREATE POLICY "Students can manage their own saved items" 
ON public.student_saved_items FOR ALL 
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can manage their own preferences" 
ON public.student_interest_preferences FOR ALL 
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);

-- 8. ENGAGEMENT & TRENDING
-- Anyone can view trending snapshots
CREATE POLICY "Public can view trending snapshots" 
ON public.trending_content_snapshots FOR SELECT 
USING (true);

-- Anyone can insert engagement events (anonymously or authenticated)
CREATE POLICY "Public can insert engagement events" 
ON public.content_engagement_events FOR INSERT 
WITH CHECK (true);

-- 9. ADMIN BYPASS FOR ALL NEW TABLES
-- Uses the existing is_admin() helper
CREATE POLICY "Admins have full access to club_recruitment_drives" ON public.club_recruitment_drives FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to club_recruitment_roles" ON public.club_recruitment_roles FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to club_recruitment_applications" ON public.club_recruitment_applications FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to event_galleries" ON public.event_galleries FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to event_gallery_images" ON public.event_gallery_images FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to opportunities" ON public.opportunities FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to lost_found_items" ON public.lost_found_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to service_requests" ON public.service_requests FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to equipment_requests" ON public.equipment_requests FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to content_engagement_events" ON public.content_engagement_events FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to trending_content_snapshots" ON public.trending_content_snapshots FOR ALL USING (public.is_admin());

-- ==============================================================================
-- ADDITIVE REALTIME SUBSCRIPTIONS
-- ==============================================================================
-- Safely add new tables to the existing supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.service_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.club_recruitment_applications;
