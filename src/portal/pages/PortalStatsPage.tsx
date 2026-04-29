import { Activity, Award, BarChart3, Flame, Swords, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { portalBracketResults } from "../lib/mockPortal";
import { PortalPageHeader } from "../components/PortalPageHeader";
import { usePortalSession } from "../lib/session";

export function PortalStatsPage() {
  const { isStatsLoading, isStatsRemote, sportBreakdowns, stats } = usePortalSession();

  if (!stats) {
    return null;
  }

  return (
    <>
      <PortalPageHeader
        eyebrow="Stats"
        title="Performance and ranking snapshot."
        description={
          isStatsRemote
            ? "Your headline performance metrics now read from the portal account layer, while deeper bracket and match-history surfaces can continue moving over in follow-up passes."
            : "This page is now structured like a real player performance dashboard: headline metrics, sport-level breakdowns, bracket finishes, and momentum framing. The next step is replacing preview data with app-backed reads."
        }
      />

      <div className="grid gap-5 xl:grid-cols-4">
        {[
          { icon: Award, label: "Scout score", value: String(stats.scoutScore), detail: stats.cityRank },
          { icon: Activity, label: "Record", value: stats.record, detail: `${stats.recentMatches} recent matches tracked` },
          { icon: Flame, label: "Current form", value: stats.streak, detail: stats.winRate },
          { icon: TrendingUp, label: "Momentum", value: stats.recentTrend, detail: stats.bracketFinish },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <GlassCard key={item.label} className="p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 text-violet-200">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-5 text-sm text-white/50">{item.label}</p>
              <p className="mt-2 font-display text-3xl font-black text-white">{item.value}</p>
              <p className="mt-3 text-sm leading-7 text-white/65">{item.detail}</p>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <GlassCard className="p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Sport breakdown</p>
              <h3 className="mt-3 font-display text-3xl font-black text-white">How performance shifts by sport</h3>
            </div>
            <BarChart3 className="mt-1 h-5 w-5 text-violet-200" />
          </div>

          <div className="mt-6 grid gap-4">
            {sportBreakdowns.map((item) => (
              <div key={item.sport} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-white/55">{item.record}</p>
                    <h4 className="mt-1 text-xl font-semibold text-white">{item.sport}</h4>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-3xl font-black text-white">{item.rating}</p>
                    <p className="mt-1 text-sm text-violet-200">{item.trend}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/65">{item.note}</p>
              </div>
            ))}
          </div>

          {isStatsLoading ? <p className="mt-4 text-sm text-blue-200">Refreshing performance snapshot...</p> : null}
        </GlassCard>

        <div className="grid gap-5">
          <GlassCard className="p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">Competitive pattern</p>
                <h3 className="mt-3 font-display text-3xl font-black text-white">How this player wins</h3>
              </div>
              <Swords className="mt-1 h-5 w-5 text-violet-200" />
            </div>

              <div className="mt-6 grid gap-4">
              {[
                ["Favorite format", stats.favoriteFormat],
                ["Best growth channel", stats.growthChannel],
                ["Current edge", stats.currentEdge],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-white/45">{label}</p>
                  <p className="mt-2 text-base leading-7 text-white/75">{value}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">Bracket history</p>
                <h3 className="mt-3 font-display text-3xl font-black text-white">Recent finishes</h3>
              </div>
              <TrendingUp className="mt-1 h-5 w-5 text-violet-200" />
            </div>

            <div className="mt-6 grid gap-4">
              {portalBracketResults.map((item) => (
                <div key={`${item.title}-${item.dateLabel}`} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-white/55">{item.dateLabel}</p>
                      <h4 className="mt-1 text-xl font-semibold text-white">{item.title}</h4>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80">
                      {item.finish}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/65">{item.detail}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
