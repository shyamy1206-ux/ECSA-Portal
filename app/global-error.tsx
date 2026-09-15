"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body className="bg-navy-900 text-white flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-3xl font-bold mb-4">Critical Error</h2>
        <p className="text-gray-400 mb-8">A fatal error has occurred.</p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-white text-navy-900 font-medium rounded-full"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
