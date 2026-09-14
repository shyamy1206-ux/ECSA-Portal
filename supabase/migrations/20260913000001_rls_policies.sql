-- ==============================================================================
-- ECSA PLATFORM - ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- 1. ENABLE RLS ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. HELPER FUNCTIONS
-- To prevent infinite recursion in RLS policies, we use a SECURITY DEFINER function
-- to check if the current user has administrative privileges.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('ecsa_admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 3. PROFILES POLICIES
-- ==============================================================================
-- Public can read all profiles (required for avatars/names on projects/clubs)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

-- Users can insert their own profile during signup
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile" ON public.profiles
    FOR UPDATE USING (public.is_admin());

-- ==============================================================================
-- 4. USER ROLES POLICIES
-- ==============================================================================
-- Users can read their own roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- Admins can view and manage all roles
CREATE POLICY "Admins can view all roles" ON public.user_roles
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can manage all roles" ON public.user_roles
    FOR ALL USING (public.is_admin());

-- ==============================================================================
-- 5. CLUBS POLICIES
-- ==============================================================================
-- Public can view approved clubs
CREATE POLICY "Public view approved clubs" ON public.clubs
    FOR SELECT USING (status = 'approved');

-- Admins and Creators can view all clubs
CREATE POLICY "Creators and Admins view all clubs" ON public.clubs
    FOR SELECT USING (created_by = auth.uid() OR public.is_admin());

-- Authenticated users can propose (insert) new clubs
CREATE POLICY "Auth users can propose clubs" ON public.clubs
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND status = 'pending');

-- Creators can update their clubs if they are still pending/draft
CREATE POLICY "Creators update pending clubs" ON public.clubs
    FOR UPDATE USING (created_by = auth.uid() AND status IN ('pending', 'draft'));

-- Admins have full access
CREATE POLICY "Admins have full access to clubs" ON public.clubs
    FOR ALL USING (public.is_admin());

-- ==============================================================================
-- 6. CLUB MEMBERSHIPS & JOIN REQUESTS POLICIES
-- ==============================================================================
-- Public can view memberships
CREATE POLICY "Public view memberships" ON public.club_memberships
    FOR SELECT USING (true);

-- Users can manage their own join requests
CREATE POLICY "Users view own join requests" ON public.club_join_requests
    FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Users insert own join requests" ON public.club_join_requests
    FOR INSERT WITH CHECK (student_id = auth.uid() AND status = 'pending');
CREATE POLICY "Users update own join requests" ON public.club_join_requests
    FOR UPDATE USING (student_id = auth.uid() AND status = 'pending');

-- Admins can manage all memberships and requests
CREATE POLICY "Admins manage all memberships" ON public.club_memberships
    FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage all join requests" ON public.club_join_requests
    FOR ALL USING (public.is_admin());

-- ==============================================================================
-- 7. EVENTS & REGISTRATIONS POLICIES
-- ==============================================================================
-- Public can view published events
CREATE POLICY "Public view published events" ON public.events
    FOR SELECT USING (status = 'published');

-- Admins and Creators can view all events
CREATE POLICY "Creators and Admins view all events" ON public.events
    FOR SELECT USING (created_by = auth.uid() OR public.is_admin());

-- Users can register themselves for published events
CREATE POLICY "Users register for events" ON public.event_registrations
    FOR INSERT WITH CHECK (student_id = auth.uid());
    
-- Users can view and update (cancel) their own registrations
CREATE POLICY "Users view own registrations" ON public.event_registrations
    FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Users update own registrations" ON public.event_registrations
    FOR UPDATE USING (student_id = auth.uid());

-- Admins manage all events, registrations, and attendance
CREATE POLICY "Admins manage events" ON public.events
    FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage registrations" ON public.event_registrations
    FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage attendance" ON public.event_attendance
    FOR ALL USING (public.is_admin());

-- Users can view their own attendance
CREATE POLICY "Users view own attendance" ON public.event_attendance
    FOR SELECT USING (student_id = auth.uid());

-- ==============================================================================
-- 8. PROJECTS POLICIES
-- ==============================================================================
-- Public can view approved projects
CREATE POLICY "Public view approved projects" ON public.projects
    FOR SELECT USING (status = 'approved');

-- Users can propose projects
CREATE POLICY "Users can insert projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid() AND status = 'pending');

-- Creators can view and update their own projects
CREATE POLICY "Creators view own projects" ON public.projects
    FOR SELECT USING (created_by = auth.uid());
CREATE POLICY "Creators update own projects" ON public.projects
    FOR UPDATE USING (created_by = auth.uid());

-- Admins manage all projects
CREATE POLICY "Admins manage projects" ON public.projects
    FOR ALL USING (public.is_admin());

-- ==============================================================================
-- 9. RESOURCES POLICIES
-- ==============================================================================
-- Public can view published resources
CREATE POLICY "Public view published resources" ON public.resources
    FOR SELECT USING (status = 'published');

-- Admins manage resources
CREATE POLICY "Admins manage resources" ON public.resources
    FOR ALL USING (public.is_admin());

-- ==============================================================================
-- 10. CERTIFICATES POLICIES
-- ==============================================================================
-- Public can verify any certificate using its hash
CREATE POLICY "Public verify certificates" ON public.certificates
    FOR SELECT USING (true);

-- Users can view their own certificates
CREATE POLICY "Users view own certificates" ON public.certificates
    FOR SELECT USING (user_id = auth.uid());

-- Admins manage certificates
CREATE POLICY "Admins manage certificates" ON public.certificates
    FOR ALL USING (public.is_admin());

-- ==============================================================================
-- 11. ANNOUNCEMENTS POLICIES
-- ==============================================================================
-- Public can view published announcements
CREATE POLICY "Public view published announcements" ON public.announcements
    FOR SELECT USING (status = 'published');

-- Admins manage announcements
CREATE POLICY "Admins manage announcements" ON public.announcements
    FOR ALL USING (public.is_admin());

-- ==============================================================================
-- 12. NOTIFICATIONS POLICIES
-- ==============================================================================
-- Users can view and update their own notifications (e.g. mark as read)
CREATE POLICY "Users view own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users update own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Admins can insert notifications
CREATE POLICY "Admins insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (public.is_admin());

-- ==============================================================================
-- 13. AUDIT LOGS POLICIES
-- ==============================================================================
-- Only admins can view audit logs. NO ONE can update or delete them.
CREATE POLICY "Admins view audit logs" ON public.audit_logs
    FOR SELECT USING (public.is_admin());

-- Admins and system processes can insert logs
CREATE POLICY "Admins insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (public.is_admin() OR auth.uid() IS NOT NULL);
