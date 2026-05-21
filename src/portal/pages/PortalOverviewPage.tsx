import { ArrowUpRight, Clock3, Sparkles, Trophy, UserRound } from "lucide-react";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { routes } from "@/lib/routes";
import { PortalPageHeader } from "../components/PortalPageHeader";
import { usePortalSession } from "../lib/session";

export function PortalOverviewPage() {
  const { history, membership, player, profile, stats } = usePortalSession();

  if (!membership || !player || !profile || !stats) {
    return null;
  }

  const renewalValue = membership.renewalLabel.startsWith("Renews ")
    ? membership.renewalLabel.replace("Renews ", "")
    : membership.renewalLabel;

  return (
    <>
      <PortalPageHeader
        eyebrow="Account home"
        title={`Welcome back, ${player.firstName}.`}
        description="Your Scout account center keeps membership, profile updates, performance context, and recent activity in one place."
        aside={
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Membership</p>
            <p className="mt-2 text-2xl font-black text-white">{membership.tier}</p>
            <p className="mt-1 text-sm text-violet-200">{membership.status}</p>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-4">
        {[
          { label: "Scout score", value: String(stats.scoutScore), detail: stats.recentTrend, icon: Trophy },
          { label: "Profile completion", value: `${profile.completionPercent}%`, detail: `${profile.primarySport} • ${profile.city}`, icon: UserRound },
          { label: "Renewal", value: renewalValue, detail: membership.billingSummary, icon: Clock3 },
          { label: "Recent form", value: stats.streak, detail: stats.record, icon: Sparkles },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <GlassCard key={item.label} className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 text-violet-200">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-5 text-sm text-white/60">{item.label}</p>
              <p className="mt-2 font-display text-4xl font-black text-white">{item.value}</p>
              <p className="mt-3 text-sm leading-6 text-white/60">{item.detail}</p>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassCard className="p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Account center</p>
              <h3 className="mt-3 font-display text-3xl font-black text-white">Everything that matters, one place.</h3>
            </div>
            <ArrowUpRight className="mt-1 h-5 w-5 text-violet-200" />
          </div>

          <div className="mt-6 grid gap-4">
            {[
              {
                title: "Profile editing",
                text: "Players can now update bio, city, sports, availability, vibe tags, and public identity inside the portal flow.",
              },
              {
                title: "Membership and billing",
                text: "Membership status, renewal timing, and billing visibility are organized for one clean player account experience.",
              },
              {
                title: "Stats and history",
                text: "Performance context and recent matches stay close at hand so players can track momentum without leaving the portal.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                <h4 className="text-xl font-semibold text-white">{item.title}</h4>
                <p className="mt-2 text-sm leading-7 text-white/65">{item.text}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-7">
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">Recent activity</p>
          <h3 className="mt-3 font-display text-3xl font-black text-white">Game history snapshot</h3>
          <div className="mt-6 grid gap-4">
            {history.length ? (
              history.slice(0, 4).map((item) => (
                <div key={`${item.title}-${item.dateLabel}`} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-white/55">{item.dateLabel}</p>
                      <h4 className="mt-1 text-lg font-semibold text-white">{item.title}</h4>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80">
                      {item.result}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/65">{item.detail}</p>
                  <p className="mt-3 text-sm font-semibold text-violet-200">{item.ratingDelta} rating</p>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5 text-sm leading-7 text-white/65">
                Match history will show up here as soon as this player starts logging games through Scout.
              </div>
            )}
          </div>
          <Button href={routes.portalHistory} variant="secondary" className="mt-6 w-full">
            Open history page
          </Button>
        </GlassCard>
      </div>
    </>
  );
}
