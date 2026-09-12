import { createClient } from "@/lib/supabase/server";
import { Search, Folder, FileText } from "lucide-react";
import DownloadButton from "./DownloadButton";

export const revalidate = 60;

export default async function ResourceVault() {
  const supabase = createClient();
  
  const { data: resources } = await supabase
    .from('resources')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  return (
    <div className="min-h-screen pt-24 px-8 max-w-7xl mx-auto flex flex-col h-screen">
      <div className="mb-8 shrink-0">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Resource Vault</h1>
        <p className="text-gray-400 max-w-2xl text-lg">
          Centralized repository for verified study materials, workshop slides, and coding tutorials.
        </p>
      </div>

      <div className="flex-1 glass rounded-2xl border border-white/10 flex flex-col overflow-hidden mb-8">
        <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="hover:text-white cursor-pointer transition-colors">Root</span>
            <span>/</span>
            <span className="text-electric-cyan">All Resources</span>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input 
              type="text" 
              placeholder="Search files..." 
              className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-electric-blue text-white"
            />
          </div>
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
                      <div className="relative w-8 h-8 flex items-center justify-center drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]">
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
                  <td className="px-4 py-4 text-sm text-gray-400">
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
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                    No resources available yet.
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
