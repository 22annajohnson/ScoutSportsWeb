import { CreditCard, History, LayoutGrid, LogOut, Medal, Settings, UserCircle2 } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { routes } from "@/lib/routes";
import { usePortalSession } from "../lib/session";

const portalNav = [
  { label: "Overview", href: routes.portal, icon: LayoutGrid },
  { label: "Membership", href: routes.portalMembership, icon: CreditCard },
  { label: "Profile", href: routes.portalProfile, icon: UserCircle2 },
  { label: "Stats", href: routes.portalStats, icon: Medal },
  { label: "History", href: routes.portalHistory, icon: History },
  { label: "Settings", href: routes.portalSettings, icon: Settings },
];

export function PortalLayout() {
  const { authUser, membership, player, signOut } = usePortalSession();

  if (!membership || !player) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-text">
      <div className="app-ambient-player pointer-events-none fixed inset-0" />
      <div className="relative z-10 py-6 sm:py-8">
        <Container>
          <div className="grid min-w-0 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <GlassCard className="self-start p-4 sm:p-6 lg:sticky lg:top-6">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-purple to-accent-blue font-display text-lg font-black text-white shadow-glow">
                  {player.avatarInitials}
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/45">Player portal</p>
                <h1 className="mt-2 break-words font-display text-2xl font-black text-white sm:text-3xl">{player.fullName}</h1>
                <p className="mt-2 text-sm text-white/60">{player.location}</p>
                <p className="mt-1 break-all text-xs text-white/45">{authUser?.email ?? player.email}</p>
                <div className="mt-4 inline-flex rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-2 text-sm text-violet-200">
                  {membership.tier} member
                </div>
              </div>

              <nav className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1 lg:gap-3">
                {portalNav.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.href}
                      end={item.href === routes.portal}
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center gap-2 rounded-2xl border px-3 py-3 text-sm transition sm:gap-3 sm:px-4 sm:py-4 ${
                          isActive
                            ? "border-accent-purple/30 bg-accent-purple/10 text-white"
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
                Sign out
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
