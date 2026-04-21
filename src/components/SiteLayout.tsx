import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function SiteLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-text">
      <div className="pointer-events-none absolute inset-0 bg-hero-grid" />
      <div className="pointer-events-none absolute left-[-10%] top-24 h-72 w-72 rounded-full bg-accent-purple/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10%] top-72 h-96 w-96 rounded-full bg-accent-blue/15 blur-3xl" />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
