import { createClient } from "@/lib/supabase/server";
import { CheckCircle, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HealthCheckPage() {
  const supabase = createClient();
  
  // 1. Check Env Variables
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // 2. Check Database Connection
  let dbStatus = "Checking...";
  let dbError = null;
  if (hasUrl && hasKey) {
    try {
      // Assuming a public table or just hitting auth.users isn't allowed by anon.
      // Easiest is calling a simple select on a known table or rpc
      const { error } = await supabase.from('profiles').select('id').limit(1);
      if (error && error.code !== 'PGRST116') { // PGRST116 is not found/empty, but connection works
        dbError = error.message;
        dbStatus = "Error";
      } else {
        dbStatus = "Connected";
      }
    } catch (e: any) {
      dbError = e.message;
      dbStatus = "Failed";
    }
  } else {
    dbStatus = "Skipped (Missing Env)";
  }

  // 3. Check Auth Connection
  let authStatus = "Checking...";
  let authError = null;
  if (hasUrl && hasKey) {
    try {
      const { error } = await supabase.auth.getSession();
      if (error) {
        authError = error.message;
        authStatus = "Error";
      } else {
        authStatus = "Connected";
      }
    } catch (e: any) {
      authError = e.message;
      authStatus = "Failed";
    }
  } else {
    authStatus = "Skipped (Missing Env)";
  }

  // 4. Check Storage Connection
  let storageStatus = "Checking...";
  let storageError = null;
  if (hasUrl && hasKey) {
    try {
      const { error } = await supabase.storage.listBuckets();
      if (error) {
        storageError = error.message;
        storageStatus = "Error";
      } else {
        storageStatus = "Connected";
      }
    } catch (e: any) {
      storageError = e.message;
      storageStatus = "Failed";
    }
  } else {
    storageStatus = "Skipped (Missing Env)";
  }

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "Connected" || status === "Configured") {
      return <CheckCircle className="text-green-400" size={20} />;
    }
    return <AlertCircle className="text-red-400" size={20} />;
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-heading font-bold mb-8">Supabase Health Check</h1>
      
      <div className="space-y-6">
        <div className="glass p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Environment Configuration</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Supabase URL</span>
              <div className="flex items-center gap-2">
                <span className={hasUrl ? "text-green-400" : "text-red-400"}>
                  {hasUrl ? "Configured" : "Missing"}
                </span>
                <StatusIcon status={hasUrl ? "Configured" : "Missing"} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Publishable Key</span>
              <div className="flex items-center gap-2">
                <span className={hasKey ? "text-green-400" : "text-red-400"}>
                  {hasKey ? "Configured" : "Missing"}
                </span>
                <StatusIcon status={hasKey ? "Configured" : "Missing"} />
              </div>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Service Connections</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300">Database (PostgreSQL)</span>
                <div className="flex items-center gap-2">
                  <span className={dbStatus === "Connected" ? "text-green-400" : "text-red-400"}>
                    {dbStatus}
                  </span>
                  <StatusIcon status={dbStatus} />
                </div>
              </div>
              {dbError && <p className="text-xs text-red-400 bg-red-400/10 p-2 rounded">{dbError}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300">Authentication (GoTrue)</span>
                <div className="flex items-center gap-2">
                  <span className={authStatus === "Connected" ? "text-green-400" : "text-red-400"}>
                    {authStatus}
                  </span>
                  <StatusIcon status={authStatus} />
                </div>
              </div>
              {authError && <p className="text-xs text-red-400 bg-red-400/10 p-2 rounded">{authError}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300">Storage</span>
                <div className="flex items-center gap-2">
                  <span className={storageStatus === "Connected" ? "text-green-400" : "text-red-400"}>
                    {storageStatus}
                  </span>
                  <StatusIcon status={storageStatus} />
                </div>
              </div>
              {storageError && <p className="text-xs text-red-400 bg-red-400/10 p-2 rounded">{storageError}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
