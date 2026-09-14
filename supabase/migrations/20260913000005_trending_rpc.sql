-- Create RPC function to get trending content efficiently
CREATE OR REPLACE FUNCTION get_trending_content(days_back INT DEFAULT 7, max_limit INT DEFAULT 3)
RETURNS TABLE (
    content_id UUID,
    content_type TEXT,
    view_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ce.content_id, 
        ce.content_type, 
        COUNT(*) as view_count
    FROM public.content_engagement ce
    WHERE ce.action = 'view'
      AND ce.created_at >= (NOW() - (days_back || ' days')::INTERVAL)
    GROUP BY ce.content_id, ce.content_type
    ORDER BY view_count DESC
    LIMIT max_limit;
END;
$$;
