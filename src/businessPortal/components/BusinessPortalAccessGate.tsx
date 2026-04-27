import { Building2, ShieldCheck, Sparkles } from "lucide-react";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { routes } from "@/lib/routes";
import { useBusinessPortalSession } from "../lib/session";

export function BusinessPortalAccessGate() {
  const { isAuthenticated, isReady, signInAsDemo } = useBusinessPortalSession();

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <GlassCard className="w-full max-w-md p-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl border border-white/10 bg-white/5" />
          <p className="mt-5 text-sm uppercase tracking-[0.3em] text-white/45">Loading business portal</p>
          <h1 className="mt-3 font-display text-3xl font-black text-white">Preparing your business workspace.</h1>
        </GlassCard>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="min-h-screen py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
                Business portal foundation preview
              </div>
              <div>
                <h1 className="font-display text-5xl font-black leading-[0.92] tracking-tight text-white sm:text-6xl">
                  Run your business workspace,
                  <br />
                  team access, billing, and
                  <br />
                  <span className="bg-gradient-to-r from-emerald-200 via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                    launch readiness in one place.
                  </span>
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
                  This business portal is separate from the player membership portal and focuses on business settings,
                  team roles, billing visibility, and audit-style activity before ads and analytics arrive.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={signInAsDemo}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-500 px-6 py-4 text-sm font-semibold text-slate-950 shadow-glow transition duration-300 hover:scale-[1.01] hover:opacity-95"
                >
                  Enter business portal
                  <Sparkles className="h-4 w-4" />
                </button>
                <Button href={routes.business} variant="secondary" className="px-6 py-4">
                  Back to business page
                </Button>
              </div>
            </div>

            <GlassCard className="relative overflow-hidden p-8">
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-emerald-400/25 via-cyan-400/10 to-blue-500/20 blur-3xl" />
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-200">
                  <Building2 className="h-6 w-6" />
                </div>
                <p className="mt-6 text-sm uppercase tracking-[0.3em] text-white/45">What Phase 1 covers</p>
                <div className="mt-6 grid gap-4">
                  {[
                    "Business account shell with owner context and verification status",
                    "Team roles, invite flow, and access pause controls",
                    "Billing settings, payment visibility, and invoice history preview",
                    "A foundation activity log for sensitive account actions",
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white/75">
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-amber-300/15 bg-amber-500/10 px-4 py-4 text-sm text-amber-100">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  Real auth, billing providers, and backend persistence are still the next step after this local demo shell.
                </div>
              </div>
            </GlassCard>
          </div>
        </Container>
      </section>
    );
  }

  return <Outlet />;
}
