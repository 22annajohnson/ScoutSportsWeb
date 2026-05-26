import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function SiteLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-text">
      <div className="app-ambient-marketing pointer-events-none fixed inset-0" />
      <div className="app-ambient-vignette pointer-events-none fixed inset-0" />
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
