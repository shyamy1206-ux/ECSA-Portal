import { createClient } from "@/lib/supabase/server";
import { Search, Upload, CheckCircle, XCircle } from "lucide-react";

export default async function CertificatesAdminPage() {
  const supabase = createClient();
  
  const { data: certificates } = await supabase
    .from('certificates')
    .select('*, profiles(full_name), events(title)')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Certificate Issuance</h1>
          <p className="text-gray-400">Review, issue, and cryptographically verify student certificates.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-electric-blue text-navy-900 rounded-lg font-semibold hover:bg-electric-cyan transition-colors">
          <Upload size={16} /> Bulk Issue
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-white/10">
        <div className="p-4 border-b border-white/10 bg-black/20 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input 
              type="text" 
              placeholder="Search by student name or Hash..." 
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-electric-blue text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-xs uppercase tracking-wider text-gray-400 border-b border-white/5">
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">Event</th>
                <th className="px-6 py-4 font-medium">Verification Hash</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {certificates && certificates.length > 0 ? (
                certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-medium text-white">
                      {cert.profiles?.full_name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {cert.events?.title || 'Unknown Event'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                      {cert.verification_hash.substring(0, 12)}...
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs border ${
                        cert.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                        cert.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {cert.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-gray-400 hover:text-green-400 transition-colors" title="Approve">
                          <CheckCircle size={18} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-400 transition-colors" title="Revoke">
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <p>No certificates found.</p>
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
