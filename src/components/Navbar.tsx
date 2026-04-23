import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { navLinks } from "@/data/site";
import { Button } from "./Button";
import { Container } from "./Container";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 pt-6">
      <Container>
        <div className="flex min-h-[72px] items-center justify-between gap-4 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
          <NavLink to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-purple to-accent-blue shadow-glow">
              <span className="font-display text-base font-black text-white">S</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Scout Sports</div>
              <div className="text-xs text-white/55">scoutsports.app</div>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `text-sm transition ${isActive ? "text-white" : "text-white/70 hover:text-white"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button href="/pricing" className="px-5">
              Join Waitlist
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen ? (
          <div className="mt-3 grid gap-3 rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl lg:hidden">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl border px-4 py-4 text-sm transition ${
                    isActive
                      ? "border-accent-purple/30 bg-accent-purple/10 text-white"
                      : "border-white/10 bg-white/[0.03] text-white/70 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Button href="/pricing" className="mt-2" variant="primary" onClick={() => setIsOpen(false)}>
              Join Waitlist
            </Button>
          </div>
        ) : null}
      </Container>
    </header>
  );
}
