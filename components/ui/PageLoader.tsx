import { Loader2 } from "lucide-react";

export function PageLoader() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] w-full text-gray-400">
      <Loader2 className="w-10 h-10 animate-spin text-electric-blue mb-4 opacity-80" />
      <p className="text-sm font-medium tracking-widest uppercase">Loading workspace...</p>
    </div>
  );
}
