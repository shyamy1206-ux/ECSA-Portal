import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = createClient();
  const query = `%${q}%`;

  // Run searches in parallel
  const [clubs, events, projects, opportunities] = await Promise.all([
    supabase.from('clubs').select('id, name, slug, description, category').ilike('name', query).eq('status', 'published').limit(3),
    supabase.from('events').select('id, title, date, type').ilike('title', query).eq('status', 'published').limit(3),
    supabase.from('projects').select('id, title, summary').ilike('title', query).eq('status', 'published').limit(3),
    supabase.from('opportunities').select('id, title, category, external_url').ilike('title', query).eq('status', 'approved').limit(3)
  ]);

  const results = [
    ...(clubs.data || []).map(c => ({ id: c.id, type: 'Club', title: c.name, subtitle: c.category, url: `/clubs/${c.slug}` })),
    ...(events.data || []).map(e => ({ id: e.id, type: 'Event', title: e.title, subtitle: new Date(e.date).toLocaleDateString(), url: `/events/${e.id}` })),
    ...(projects.data || []).map(p => ({ id: p.id, type: 'Project', title: p.title, subtitle: p.summary, url: `/app/projects/${p.id}` })), // Assuming public projects would be /projects, but /projects is 3D space right now
    ...(opportunities.data || []).map(o => ({ id: o.id, type: 'Opportunity', title: o.title, subtitle: o.category, url: o.external_url || '/opportunities' })),
  ];

  return NextResponse.json({ results });
}
