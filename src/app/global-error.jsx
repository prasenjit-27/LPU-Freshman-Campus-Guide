"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="bg-[#FFFDF9] min-h-screen flex items-center justify-center p-4 text-black">
        <div className="card max-w-md w-full border-4 border-black bg-white shadow-neo-xl p-8 space-y-5 text-center">
          <div className="h-16 w-16 mx-auto rounded-xl border-3 border-black bg-lpu-yellow flex items-center justify-center text-black shadow-neo-sm">
            <AlertTriangle className="h-8 w-8 text-lpu-orange" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase tracking-tight text-black">
              Application Error
            </h1>
            <p className="text-xs font-semibold text-black/70">
              A critical layout error occurred. Click below to reload the application.
            </p>
          </div>

          <button
            type="button"
            onClick={() => reset()}
            className="btn btn-yellow w-full text-xs px-5 py-2.5 flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reload Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}
