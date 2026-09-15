import { createClient } from "@/lib/supabase/server";
import { Search, Folder, FileText } from "lucide-react";
import DownloadButton from "./DownloadButton";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";

export const revalidate = 60;

export default async function ResourceVault({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const supabase = createClient();
  const q = searchParams.q || '';
  const category = searchParams.category || '';
  
  let query = supabase
    .from('resources')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (q) {
    query = query.ilike('title', `%${q}%`);
  }
  
  if (category) {
    query = query.eq('category', category);
  }

  const { data: resources } = await query;

  // Derive categories for filter
  const { data: allResources } = await supabase.from('resources').select('category').eq('status', 'published');
  const uniqueCategories = Array.from(new Set((allResources || []).map(r => r.category).filter(Boolean)));

  return (
    <div className="min-h-screen pt-24 px-8 max-w-7xl mx-auto flex flex-col h-screen pb-20">

      <div className="mb-8 shrink-0">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Resource Vault</h1>
        <p className="text-gray-400 max-w-2xl text-lg mb-6">
          Centralized repository for verified study materials, workshop slides, and coding tutorials.
        </p>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-2">
          <Link 
            href={`/resources${q ? `?q=${q}` : ''}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!category ? 'bg-electric-blue text-navy-900' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
          >
            All
          </Link>
          {uniqueCategories.map(cat => (
            <Link 
              key={cat}
              href={`/resources?category=${encodeURIComponent(cat)}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${category === cat ? 'bg-electric-blue text-navy-900' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-1 glass rounded-2xl border border-white/10 flex flex-col overflow-hidden mb-8">
        <div className="p-4 border-b border-white/10 bg-black/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="hover:text-white cursor-pointer transition-colors">Root</span>
            <span>/</span>
            <span className="text-electric-cyan capitalize">{category || 'All Resources'}</span>
          </div>
          
          <form action="/resources" method="GET" className="relative w-full md:w-64">
            {category && <input type="hidden" name="category" value={category} />}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input 
              type="text" 
              name="q"
              defaultValue={q}
              placeholder="Search files..." 
              className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-electric-blue text-white"
            />
          </form>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-gray-500 border-b border-white/5">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Size / Items</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {resources && resources.length > 0 ? (
                resources.map((res: any) => (
                <tr key={res.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-4 py-4 flex items-center gap-3">
                    {res.type === 'folder' ? (
                      <div className="relative w-8 h-8 flex items-center justify-center drop-">
                         <Folder className="text-electric-blue absolute" fill="currentColor" size={24} />
                         <Folder className="text-white opacity-20 absolute translate-y-0.5" size={24} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center text-gray-400">
                        <FileText size={20} />
                      </div>
                    )}
                    <span className="font-medium text-white text-sm">{res.title}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-400 capitalize">
                    {res.category}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 font-mono">
                    {res.type === 'folder' ? `Folder` : 'File'}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {res.type === 'file' && <DownloadButton url={res.url} />}
                  </td>
                </tr>
              ))) : (
                <tr>
                  <td colSpan={4} className="px-4 py-12">
                    <EmptyState 
                      title={q || category ? "No resources match your search." : "No records available yet."}
                      description={q || category ? "Try adjusting your filters or search terms." : "Check back later for updated study materials and resources."}
                      className="border-none bg-transparent"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


