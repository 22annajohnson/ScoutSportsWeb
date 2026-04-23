import { Link } from "react-router-dom";
import { navLinks } from "@/data/site";
import { routes } from "@/lib/routes";
import { Button } from "./Button";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-16">
      <Container>
        <div className="grid gap-10 rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl lg:grid-cols-[1.3fr_0.7fr] lg:p-12">
          <div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.32em] text-text-muted">
              Scout Sports
            </div>
            <h2 className="mt-5 max-w-xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Build your local sports life around the people you actually want to play with.
            </h2>
            <p className="mt-4 max-w-2xl text-text-muted">
              Scout brings player discovery, pickup coordination, trusted circles, flexible brackets, rankings, and
              local sports hotspots into one premium social app.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href={routes.pricing} showArrow>
                View Pricing
              </Button>
              <Button href={routes.business} variant="secondary">
                Partner With Scout
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-text-muted transition hover:border-white/20 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
