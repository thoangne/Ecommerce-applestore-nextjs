"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Something went wrong!</h1>
        <p className="text-gray-300">{error.message}</p>
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() => reset()}
            className="px-6 py-2 bg-white text-black rounded"
          >
            Try Again
          </Button>
          <Link href="/">
            <Button className="px-6 py-2 bg-gray-800 text-white rounded">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
