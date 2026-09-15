"use client";

import { useState } from "react";
import { X, UploadCloud, Loader2 } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";

export function ReportItemModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast("You must be logged in to report an item.", "error");
        setLoading(false);
        return;
      }

      const formData = new FormData(e.currentTarget);
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const category = formData.get('category') as string;
      const location = formData.get('location') as string;
      const item_type = formData.get('item_type') as string;

      let imageUrl = null;
      if (file) {
        const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;
        const filePath = `lost-and-found/${user.id}/${uniqueFileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('gallery-photos') // Using existing bucket for now
          .upload(filePath, file);
          
        if (uploadError) throw new Error("Failed to upload image.");
        imageUrl = filePath;
      }

      const { error } = await supabase.from('lost_found_items').insert({
        title,
        description,
        category,
        location,
        item_type,
        date_found_lost: new Date().toISOString(),
        image_url: imageUrl,
        reported_by: user.id,
        status: 'pending' // requires admin approval
      });

      if (error) throw error;

      toast("Item reported successfully! It will appear once approved by an admin.", "success");
      onClose();
    } catch (err: any) {
      toast("Error: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-navy-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">Report Lost/Found Item</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-black/40 cursor-pointer hover:border-electric-blue/50 has-[:checked]:border-electric-blue has-[:checked]:bg-electric-blue/5">
              <input type="radio" name="item_type" value="lost" defaultChecked className="accent-electric-blue" required />
              <span className="font-bold text-white">I Lost Something</span>
            </label>
            <label className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-black/40 cursor-pointer hover:border-electric-blue/50 has-[:checked]:border-electric-blue has-[:checked]:bg-electric-blue/5">
              <input type="radio" name="item_type" value="found" className="accent-electric-blue" required />
              <span className="font-bold text-white">I Found Something</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Item Name</label>
            <input type="text" name="title" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue" placeholder="e.g. Blue Water Bottle" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Category</label>
              <select name="category" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue">
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="documents">Documents/ID</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Location</label>
              <input type="text" name="location" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue" placeholder="e.g. Library 2nd Floor" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Description</label>
            <textarea name="description" rows={3} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue resize-none" placeholder="Brand, color, identifiable marks..."></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Photo (Optional)</label>
            <div className="w-full border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-electric-blue/50 bg-black/20 cursor-pointer relative">
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <UploadCloud size={24} className="text-gray-500 mb-2" />
              <span className="text-sm font-bold text-white">{file ? file.name : "Upload Image"}</span>
            </div>
          </div>

          <MagneticButton>
            <button type="submit" disabled={loading} className="w-full py-4 bg-electric-blue text-navy-900 font-bold rounded-xl hover:bg-electric-cyan transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </MagneticButton>
        </form>
      </div>
    </div>
  );
}
