import { useState } from "react";
import { Menu, Trophy, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { navLinks } from "@/data/site";
import { Button } from "./Button";
import { Container } from "./Container";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-purple to-accent-blue shadow-glow">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-display text-lg font-semibold text-white">Scout</div>
              <div className="text-xs uppercase tracking-[0.3em] text-text-muted">Sports</div>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `text-sm transition ${isActive ? "text-white" : "text-text-muted hover:text-white"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button href="/pricing" showArrow>
              Join Early
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen ? (
          <div className="grid gap-3 border-t border-white/5 py-4 lg:hidden">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl border px-4 py-4 text-sm transition ${
                    isActive
                      ? "border-accent-purple/30 bg-accent-purple/10 text-white"
                      : "border-white/10 bg-white/[0.03] text-text-muted hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Button href="/pricing" showArrow className="mt-2" variant="primary">
              Join Early
            </Button>
          </div>
        ) : null}
      </Container>
    </header>
  );
}
