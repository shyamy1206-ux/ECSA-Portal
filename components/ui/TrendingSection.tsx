import { createClient } from "@/lib/supabase/server";
import { Flame, ChevronRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function TrendingSection() {
  const supabase = createClient();
  
  // 1. Fetch aggregated trending data via Postgres RPC
  const { data: trending } = await supabase
    .rpc('get_trending_content', { days_back: 7, max_limit: 3 });

  if (!trending || trending.length === 0) return null;

  // 2. Fetch the actual content details (Clubs, Events, Opportunities)
  const resolvedContent = await Promise.all(trending.map(async (item: any) => {
    const type = item.content_type;
    const id = item.content_id;
    let data = null;
    
    if (type === 'club') {
      const { data: c } = await supabase.from('clubs').select('id, name, slug, description').eq('id', id).single();
      if (c) data = { ...c, _type: 'club', _href: `/clubs/${c.slug}`, _title: c.name };
    } else if (type === 'event') {
      const { data: e } = await supabase.from('events').select('id, title, date, type').eq('id', id).single();
      if (e) data = { ...e, _type: 'event', _href: `/events/${e.id}`, _title: e.title };
    } else if (type === 'opportunity') {
      const { data: o } = await supabase.from('opportunities').select('id, title, category, external_url').eq('id', id).single();
      if (o) data = { ...o, _type: 'opportunity', _href: o.external_url || `/opportunities`, _title: o.title };
    }
    
    return data;
  }));

  const validContent = resolvedContent.filter(Boolean);

  if (validContent.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-8 py-20 border-t border-white/10">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-12 h-12 rounded-2xl bg-electric-magenta/10 flex items-center justify-center">
          <Flame className="text-electric-magenta" size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-heading font-bold text-white">Trending on Campus</h2>
          <p className="text-gray-400">Most viewed clubs, events, and opportunities this week.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {validContent.map((item: any, idx) => {
          const rankColor = idx === 0 ? "text-yellow-400" : idx === 1 ? "text-gray-300" : "text-amber-600";
          
          return (
            <Link href={item._href} key={item.id} className="block group">
              <div className="glass p-8 rounded-3xl border border-white/5 hover:border-electric-magenta/50 transition-all h-full flex flex-col relative overflow-hidden">
                <div className={`absolute top-4 right-4 text-6xl font-heading font-black opacity-10 ${rankColor}`}>
                  #{idx + 1}
                </div>
                
                <div className="mb-4 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white">
                    {item._type}
                  </span>
                  {item._type === 'event' && <span className="text-xs text-gray-400">{format(new Date(item.date), "MMM d")}</span>}
                  {item._type === 'opportunity' && <span className="text-xs text-gray-400">{item.category}</span>}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-electric-magenta transition-colors pr-8">
                  {item._title}
                </h3>
                
                {item.description && (
                  <p className="text-sm text-gray-400 line-clamp-2 mt-auto">
                    {item.description}
                  </p>
                )}
                
                <div className="mt-6 flex items-center gap-1 text-electric-magenta font-semibold text-sm opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  View Details <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
