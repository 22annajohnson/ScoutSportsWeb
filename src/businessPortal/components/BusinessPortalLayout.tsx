import { Building2, CreditCard, LayoutGrid, LogOut, ShieldCheck, Users2 } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { routes } from "@/lib/routes";
import { useBusinessPortalSession } from "../lib/session";

const businessPortalNav = [
  { label: "Overview", href: routes.businessPortal, icon: LayoutGrid },
  { label: "Business", href: routes.businessPortalProfile, icon: Building2 },
  { label: "Team", href: routes.businessPortalTeam, icon: Users2 },
  { label: "Billing", href: routes.businessPortalBilling, icon: CreditCard },
  { label: "Activity", href: routes.businessPortalActivity, icon: ShieldCheck },
];

export function BusinessPortalLayout() {
  const { business, signOut, user } = useBusinessPortalSession();

  if (!user || !business) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-text">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(20,184,166,0.16),transparent_30%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.12),transparent_24%)]" />
      <div className="relative z-10 py-6 sm:py-8">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
            <GlassCard className="sticky top-6 self-start p-5 sm:p-6">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 font-display text-lg font-black text-slate-950 shadow-glow">
                  {user.workspaceInitials}
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/45">Business portal</p>
                <h1 className="mt-2 font-display text-3xl font-black text-white">{user.workspaceName}</h1>
                <p className="mt-2 text-sm text-white/60">{business.category}</p>
                <div className="mt-4 inline-flex rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                  {business.verificationStatus}
                </div>
                <p className="mt-4 text-sm leading-7 text-white/60">
                  {user.fullName} is the workspace owner for this Phase 1 preview.
                </p>
              </div>

              <nav className="mt-5 grid gap-3">
                {businessPortalNav.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.href}
                      end={item.href === routes.businessPortal}
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-2xl border px-4 py-4 text-sm transition ${
                          isActive
                            ? "border-emerald-300/25 bg-emerald-500/10 text-white"
                            : "border-white/10 bg-white/[0.03] text-white/65 hover:text-white"
                        }`
                      }
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>

              <button
                type="button"
                onClick={signOut}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Exit business demo
              </button>
            </GlassCard>

            <div className="space-y-6">
              <Outlet />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
