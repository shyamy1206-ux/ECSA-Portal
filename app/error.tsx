"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-4xl font-heading font-bold mb-4">Something went wrong</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        An unexpected error has occurred. We&apos;ve been notified and are looking into it.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-white text-navy-900 font-medium rounded-full hover:bg-gray-200 transition-colors"
        >
          Try again
        </button>
        <Link 
          href="/"
          className="px-6 py-3 border border-white/20 rounded-full hover:bg-white/10 transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
