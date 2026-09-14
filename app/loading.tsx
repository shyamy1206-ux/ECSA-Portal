export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-white/10 border-t-electric-cyan rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm font-medium animate-pulse">Loading content...</p>
      </div>
    </div>
  );
}
