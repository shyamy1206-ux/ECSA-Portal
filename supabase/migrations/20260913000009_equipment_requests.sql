-- Phase 12: Equipment & Lab Requests

CREATE TABLE IF NOT EXISTS public.equipment_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    request_type TEXT NOT NULL CHECK (request_type IN ('equipment', 'lab_access')),
    title TEXT NOT NULL,
    description TEXT,
    equipment_name TEXT,
    lab_name TEXT,
    date_needed DATE,
    time_slot TEXT,
    purpose TEXT,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'rejected', 'returned', 'completed')),
    coordinator_notes TEXT,
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.equipment_requests ENABLE ROW LEVEL SECURITY;

-- Students can view their own requests
CREATE POLICY "Students can view own equipment requests" ON public.equipment_requests
    FOR SELECT TO authenticated USING (student_id = auth.uid());

-- Students can create requests
CREATE POLICY "Students can create equipment requests" ON public.equipment_requests
    FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());

-- Admins can view all requests
CREATE POLICY "Admins can view all equipment requests" ON public.equipment_requests
    FOR SELECT TO authenticated USING (
        auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role IN ('ecsa_admin', 'super_admin'))
    );

-- Admins can update requests (approve/reject)
CREATE POLICY "Admins can update equipment requests" ON public.equipment_requests
    FOR UPDATE TO authenticated USING (
        auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role IN ('ecsa_admin', 'super_admin'))
    );
