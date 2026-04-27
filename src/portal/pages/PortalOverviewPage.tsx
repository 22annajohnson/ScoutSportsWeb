import { ArrowUpRight, Clock3, Sparkles, Trophy, UserRound } from "lucide-react";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { routes } from "@/lib/routes";
import { portalHistoryPreview, portalMembership, portalStatsSnapshot } from "../lib/mockPortal";
import { PortalPageHeader } from "../components/PortalPageHeader";
import { usePortalSession } from "../lib/session";

export function PortalOverviewPage() {
  const { player, profile } = usePortalSession();

  if (!player || !profile) {
    return null;
  }

  return (
    <>
      <PortalPageHeader
        eyebrow="Account home"
        title={`Welcome back, ${player.firstName}.`}
        description="This first portal shell is designed to feel like the Scout product on the web. It gives players one place to manage membership, update identity details, and review performance context."
        aside={
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Membership</p>
            <p className="mt-2 text-2xl font-black text-white">{portalMembership.tier}</p>
            <p className="mt-1 text-sm text-violet-200">{portalMembership.status}</p>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-4">
        {[
          { label: "Scout score", value: String(portalStatsSnapshot.scoutScore), detail: portalStatsSnapshot.recentTrend, icon: Trophy },
          { label: "Profile completion", value: `${profile.completionPercent}%`, detail: `${profile.primarySport} • ${profile.city}`, icon: UserRound },
          { label: "Renewal", value: "May 21", detail: portalMembership.billingSummary, icon: Clock3 },
          { label: "Recent form", value: "4 of 5", detail: portalStatsSnapshot.record, icon: Sparkles },
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
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">What ships next</p>
              <h3 className="mt-3 font-display text-3xl font-black text-white">Portal roadmap in motion.</h3>
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
                text: "Stripe or another billing source will become the account truth for upgrades made online or in-app.",
              },
              {
                title: "Stats and history",
                text: "Real player metrics, recent matches, and bracket results will replace the preview data here.",
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
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">Recent activity preview</p>
          <h3 className="mt-3 font-display text-3xl font-black text-white">Game history snapshot</h3>
          <div className="mt-6 grid gap-4">
            {portalHistoryPreview.map((item) => (
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
            ))}
          </div>
          <Button href={routes.portalHistory} variant="secondary" className="mt-6 w-full">
            Open history page
          </Button>
        </GlassCard>
      </div>
    </>
  );
}
