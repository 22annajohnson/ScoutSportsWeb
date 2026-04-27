import { LockKeyhole, Sparkles } from "lucide-react";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { routes } from "@/lib/routes";
import { usePortalSession } from "../lib/session";

export function PortalAccessGate() {
  const { isAuthenticated, isReady, signInAsDemo } = usePortalSession();

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <GlassCard className="w-full max-w-md p-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl border border-white/10 bg-white/5" />
          <p className="mt-5 text-sm uppercase tracking-[0.3em] text-white/45">Loading portal</p>
          <h1 className="mt-3 font-display text-3xl font-black text-white">Preparing your account.</h1>
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
              <div className="inline-flex rounded-full border border-accent-purple/20 bg-accent-purple/10 px-4 py-2 text-sm text-violet-200">
                Player portal preview
              </div>
              <div>
                <h1 className="font-display text-5xl font-black leading-[0.92] tracking-tight text-white sm:text-6xl">
                  Your Scout account,
                  <br />
                  membership, and match history
                  <br />
                  <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-blue-300 bg-clip-text text-transparent">
                    in one place.
                  </span>
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
                  We are starting the portal with account tools first: membership, billing visibility, profile edits,
                  stats, and game history. Real auth will replace this preview gate in the next stage.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={signInAsDemo}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-purple to-accent-blue px-6 py-4 text-sm font-semibold text-white shadow-glow transition duration-300 hover:scale-[1.01] hover:opacity-95"
                >
                  Enter demo portal
                  <Sparkles className="h-4 w-4" />
                </button>
                <Button href={routes.pricing} variant="secondary" className="px-6 py-4">
                  Back to memberships
                </Button>
              </div>
            </div>

            <GlassCard className="relative overflow-hidden p-8">
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-accent-purple/30 via-fuchsia-500/10 to-accent-blue/20 blur-3xl" />
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-violet-200">
                  <LockKeyhole className="h-6 w-6" />
                </div>
                <p className="mt-6 text-sm uppercase tracking-[0.3em] text-white/45">What this first shell unlocks</p>
                <div className="mt-6 grid gap-4">
                  {[
                    "A dedicated portal route and authenticated shell",
                    "Shared account navigation across membership, profile, stats, and history",
                    "Premium Scout styling that feels like the product, not a dashboard template",
                    "A safe stand-in gate until real account auth is wired",
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white/75">
                      {item}
                    </div>
                  ))}
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
