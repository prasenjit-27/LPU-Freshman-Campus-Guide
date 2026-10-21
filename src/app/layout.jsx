import "./globals.css";
import Nav from "@/components/Nav";
export const metadata = { title: "LPU Freshman Guide", description: "An independent, unofficial campus guide for new LPU students." };
export default function RootLayout({ children }) {
  return (
    <html lang="en"><body>
      <Nav />
      <main className="mx-auto max-w-6xl p-4 md:p-8">{children}</main>
      <footer className="mx-auto max-w-6xl p-4 text-xs text-slate-500">Independent guide, not an official LPU service. Always confirm details on official LPU pages.</footer>
    </body></html>
  );
}
