import Link from "next/link";
import { Compass, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-10 px-4">
      <div className="card max-w-lg w-full border-4 border-black bg-white shadow-neo-xl p-8 space-y-5 text-center">
        <div className="h-16 w-16 mx-auto rounded-xl border-3 border-black bg-lpu-yellow flex items-center justify-center text-black shadow-neo-sm">
          <Compass className="h-8 w-8 text-lpu-orange" />
        </div>

        <div className="space-y-1">
          <span className="neo-badge neo-badge-yellow text-[10px]">
            404 • Page Not Found
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black mt-2">
            Lost on Campus?
          </h1>
          <p className="text-xs font-semibold text-black/70 leading-relaxed">
            The page or block resource you are searching for does not exist or has been relocated in the guide.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="btn btn-yellow w-full sm:w-auto text-xs px-5 py-2.5 flex items-center justify-center gap-1.5"
          >
            <Home className="h-4 w-4" />
            <span>Return Home</span>
          </Link>

          <Link
            href="/services"
            className="btn btn-white w-full sm:w-auto text-xs px-5 py-2.5 flex items-center justify-center gap-1.5"
          >
            <Search className="h-4 w-4" />
            <span>Search Directory</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
