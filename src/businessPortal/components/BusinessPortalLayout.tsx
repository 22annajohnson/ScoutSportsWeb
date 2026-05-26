import { Building2, CreditCard, LayoutGrid, LogOut, Megaphone, ShieldCheck, Users2 } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { routes } from "@/lib/routes";
import { useBusinessPortalSession } from "../lib/session";

const businessPortalNav = [
  { label: "Overview", href: routes.businessPortal, icon: LayoutGrid },
  { label: "Content", href: routes.businessPortalContent, icon: Megaphone },
  { label: "Business", href: routes.businessPortalProfile, icon: Building2 },
  { label: "Team", href: routes.businessPortalTeam, icon: Users2 },
  { label: "Billing", href: routes.businessPortalBilling, icon: CreditCard },
  { label: "Activity", href: routes.businessPortalActivity, icon: ShieldCheck },
];

export function BusinessPortalLayout() {
  const { authStatus, business, signOut, user } = useBusinessPortalSession();

  if (!user || !business) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-text">
      <div className="app-ambient-business pointer-events-none fixed inset-0" />
      <div className="relative z-10 py-6 sm:py-8">
        <Container>
          <div className="grid min-w-0 gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
            <GlassCard className="self-start p-4 sm:p-6 lg:sticky lg:top-6">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 font-display text-lg font-black text-slate-950 shadow-glow">
                  {user.workspaceInitials}
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/45">Business portal</p>
                <h1 className="mt-2 break-words font-display text-2xl font-black text-white sm:text-3xl">{user.workspaceName}</h1>
                <p className="mt-2 text-sm text-white/60">{business.category}</p>
                <div className="mt-4 inline-flex rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                  {business.verificationStatus}
                </div>
                <p className="mt-4 text-sm leading-7 text-white/60">
                  {authStatus === "authenticated"
                    ? `${user.fullName} is signed into this live business workspace.`
                    : `${user.fullName} is browsing the sample business workspace.`}
                </p>
              </div>

              <nav className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1 lg:gap-3">
                {businessPortalNav.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.href}
                      end={item.href === routes.businessPortal}
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center gap-2 rounded-2xl border px-3 py-3 text-sm transition sm:gap-3 sm:px-4 sm:py-4 ${
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
                {authStatus === "authenticated" ? "Sign out" : "Exit business demo"}
              </button>
            </GlassCard>

            <div className="min-w-0 space-y-6">
              <Outlet />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
