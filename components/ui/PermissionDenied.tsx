import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function PermissionDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
        <ShieldAlert size={32} />
      </div>
      <h2 className="text-3xl font-heading font-bold mb-4">Access Denied</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        You do not have the required permissions to view this page. If you believe this is a mistake, please contact support.
      </p>
      <Link 
        href="/"
        className="px-6 py-3 border border-white/20 rounded-full hover:bg-white/10 transition-colors inline-block"
      >
        Return to Homepage
      </Link>
    </div>
  );
}
