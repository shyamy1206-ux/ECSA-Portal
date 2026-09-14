"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useToast } from "@/components/ui/Toast";

export default function BODAdminClient({ initialMembers }: { initialMembers: any[] }) {
  const [members, setMembers] = useState(initialMembers);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const handleUpload = async (memberId: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast("File size exceeds 5MB limit", "error");
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${memberId}-${Date.now()}.${fileExt}`;
    const filePath = `profiles/${fileName}`;

    setLoading(true);
    try {
      // 1. Upload new photo
      const { error: uploadError } = await supabase.storage
        .from('bod-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Find old photo path to delete
      const member = members.find(m => m.id === memberId);
      const oldPath = member?.photo_path;

      // 3. Update database
      const { error: updateError } = await supabase
        .from('bod_members')
        .update({ photo_path: filePath })
        .eq('id', memberId);

      if (updateError) throw updateError;

      // 4. Delete old photo safely after update
      if (oldPath) {
        await supabase.storage.from('bod-photos').remove([oldPath]);
      }

      setMembers(members.map(m => m.id === memberId ? { ...m, photo_path: filePath } : m));
      toast("Photo updated successfully", "success");
    } catch (err: any) {
      toast(`Upload Failed: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (memberId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('bod_members')
        .update({ is_active: !currentStatus })
        .eq('id', memberId);
      
      if (error) throw error;
      setMembers(members.map(m => m.id === memberId ? { ...m, is_active: !currentStatus } : m));
    } catch (err: any) {
      toast("Could not update status", "error");
    }
  };

  const getImageUrl = (path?: string) => {
    if (!path) return null;
    const { data } = supabase.storage.from('bod-photos').getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm">
            <th className="p-4 font-medium">Photo</th>
            <th className="p-4 font-medium">Name & Post</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map(member => {
            const url = getImageUrl(member.photo_path);
            return (
              <tr key={member.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 w-24">
                  <div className="w-16 h-16 rounded-lg bg-black/40 border border-white/10 relative overflow-hidden flex items-center justify-center">
                    {url ? (
                      <Image src={url} alt={member.full_name} fill className="object-cover" sizes="64px" />
                    ) : (
                      <span className="text-xl text-gray-500 font-bold">{member.full_name.charAt(0)}</span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-white">{member.full_name}</div>
                  <div className="text-xs text-electric-cyan tracking-wider uppercase mt-1">{member.post}</div>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => toggleActive(member.id, member.is_active)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      member.is_active 
                        ? 'border-green-500/30 text-green-400 bg-green-500/10 hover:bg-green-500/20' 
                        : 'border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20'
                    }`}
                  >
                    {member.is_active ? 'Active' : 'Hidden'}
                  </button>
                </td>
                <td className="p-4">
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/jpeg,image/png,image/webp"
                      disabled={loading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(member.id, file);
                        e.target.value = '';
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <button disabled={loading} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm border border-white/10 transition-colors pointer-events-none">
                      {loading ? 'Uploading...' : 'Upload Photo'}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {members.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-gray-500">
                No BOD members found. Run the database seed script to populate.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
