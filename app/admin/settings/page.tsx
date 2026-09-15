"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Shield, Settings, Loader2, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const [profile, setProfile] = useState({
    id: "",
    email: "",
    fullName: "",
    role: "Admin" // Default display role
  });

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      setProfile({
        id: user.id,
        email: user.email || "",
        fullName: profileData?.full_name || "",
        role: roleData?.role || "ecsa_admin"
      });
      setIsLoading(false);
    }
    loadProfile();
  }, [supabase]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");

    // Update profiles table
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: profile.fullName })
      .eq('id', profile.id);

    // Update Auth Metadata (optional, but good practice)
    await supabase.auth.updateUser({
      data: { full_name: profile.fullName }
    });

    setIsSaving(false);
    
    if (!error) {
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      alert("Error updating profile: " + error.message);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account settings and preferences.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-white/10 overflow-x-auto">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "profile" 
              ? "border-electric-blue text-electric-blue" 
              : "border-transparent text-gray-400 hover:text-white hover:border-white/30"
          }`}
        >
          <User size={16} /> Profile
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "security" 
              ? "border-electric-blue text-electric-blue" 
              : "border-transparent text-gray-400 hover:text-white hover:border-white/30"
          }`}
        >
          <Shield size={16} /> Security
        </button>
        <button
          onClick={() => setActiveTab("preferences")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "preferences" 
              ? "border-electric-blue text-electric-blue" 
              : "border-transparent text-gray-400 hover:text-white hover:border-white/30"
          }`}
        >
          <Settings size={16} /> System Preferences
        </button>
      </div>

      {/* Tab Content */}
      <div className="glass p-8 rounded-2xl border border-white/10">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-electric-blue" />
          </div>
        ) : (
          <>
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Personal Information</h3>
                  <p className="text-sm text-gray-400 mb-6">Update your public profile details.</p>
                </div>

                {successMessage && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-400 text-sm font-medium">
                    <CheckCircle2 size={16} /> {successMessage}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      required
                      className="w-full bg-navy-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-electric-blue focus-visible:ring-2 focus-visible:ring-electric-blue transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full bg-navy-900 border border-white/5 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1.5">Email updates are handled through the authentication provider.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">System Role</label>
                    <input
                      type="text"
                      value={profile.role.toUpperCase()}
                      disabled
                      className="w-full bg-navy-900 border border-white/5 rounded-lg px-4 py-2.5 text-electric-cyan font-bold cursor-not-allowed uppercase"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-electric-blue text-navy-900 font-bold rounded-lg hover:bg-electric-cyan transition-colors disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                    {isSaving ? "Saving..." : "Update Profile"}
                  </button>
                </div>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="py-8 text-center">
                <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Security Settings</h3>
                <p className="text-sm text-gray-400">Password and 2FA settings are managed via Google OAuth.</p>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="py-8 text-center">
                <Settings className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">System Preferences</h3>
                <p className="text-sm text-gray-400">Notification and theme settings coming soon.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
