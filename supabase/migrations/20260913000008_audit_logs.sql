-- Phase 16: Audit Logs table

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs (enforced via middleware, but RLS as defense-in-depth)
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT TO authenticated USING (
        auth.uid() IN (
            SELECT user_id FROM public.user_roles WHERE role IN ('ecsa_admin', 'super_admin')
        )
    );

-- System can insert audit logs (any authenticated user action can be logged)
CREATE POLICY "System can insert audit logs" ON public.audit_logs
    FOR INSERT TO authenticated WITH CHECK (true);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);
