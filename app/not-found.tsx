import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center relative z-10">
      <div className="text-8xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-b from-electric-blue to-navy-900 mb-6">
        404
      </div>
      <h2 className="text-3xl font-bold mb-4">Page not found</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link 
        href="/"
        className="px-8 py-4 bg-electric-blue text-navy-900 font-medium rounded-full hover:bg-electric-cyan transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
}
