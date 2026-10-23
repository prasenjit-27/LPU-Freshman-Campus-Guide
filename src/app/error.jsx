"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-10 px-4">
      <div className="card max-w-lg w-full border-4 border-black bg-white shadow-neo-xl p-8 space-y-5 text-center">
        <div className="h-16 w-16 mx-auto rounded-xl border-3 border-black bg-lpu-yellow flex items-center justify-center text-black shadow-neo-sm">
          <AlertTriangle className="h-8 w-8 text-lpu-orange" />
        </div>

        <div className="space-y-2">
          <span className="neo-badge neo-badge-orange text-[10px]">
            System Notice
          </span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-black">
            Something went wrong
          </h1>
          <p className="text-xs font-semibold text-black/70 leading-relaxed">
            The page encountered an unexpected client state. You can attempt to refresh the component or return to the main portal.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="btn btn-yellow w-full sm:w-auto text-xs px-5 py-2.5 flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="btn btn-white w-full sm:w-auto text-xs px-5 py-2.5 flex items-center justify-center gap-1.5"
          >
            <Home className="h-4 w-4" />
            <span>Campus Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
