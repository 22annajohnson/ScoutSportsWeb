import { Outlet } from "react-router-dom";
import { Container } from "@/components/Container";
import { PortalSignInCard } from "./PortalSignInCard";
import { usePortalSession } from "../lib/session";

export function PortalAccessGate() {
  const { isAuthenticated, isReady } = usePortalSession();

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 text-center backdrop-blur-xl">
          <div className="mx-auto h-12 w-12 rounded-2xl border border-white/10 bg-white/5" />
          <p className="mt-5 text-sm uppercase tracking-[0.3em] text-white/45">Loading portal</p>
          <h1 className="mt-3 font-display text-3xl font-black text-white">Preparing your account.</h1>
        </div>
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
                Player portal access
              </div>
              <div>
                <h1 className="font-display text-5xl font-black leading-[0.92] tracking-tight text-white sm:text-6xl">
                  Your Scout account,
                  <br />
                  membership, and match history
                  <br />
                  <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-blue-300 bg-clip-text text-transparent">
                    behind a real sign-in flow.
                  </span>
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
                  The player portal gives members one place to manage profile details, review membership status, and
                  stay on top of recent activity with a real sign-in flow.
                </p>
              </div>
            </div>

            <PortalSignInCard />
          </div>
        </Container>
      </section>
    );
  }

  return <Outlet />;
}
