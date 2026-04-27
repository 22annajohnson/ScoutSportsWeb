import { Activity, Award, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { portalStatsSnapshot } from "../lib/mockPortal";
import { PortalPageHeader } from "../components/PortalPageHeader";

export function PortalStatsPage() {
  return (
    <>
      <PortalPageHeader
        eyebrow="Stats"
        title="Performance and ranking snapshot."
        description="This preview page establishes the stats layout before we connect real rating, bracket, and match-performance data from the app."
      />

      <div className="grid gap-5 xl:grid-cols-3">
        {[
          { icon: Award, label: "Scout score", value: String(portalStatsSnapshot.scoutScore), detail: portalStatsSnapshot.cityRank },
          { icon: Activity, label: "Record", value: portalStatsSnapshot.record, detail: portalStatsSnapshot.streak },
          { icon: TrendingUp, label: "Momentum", value: portalStatsSnapshot.recentTrend, detail: portalStatsSnapshot.bracketFinish },
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
    </>
  );
}
