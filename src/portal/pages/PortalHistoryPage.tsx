import { useMemo, useState } from "react";
import { Clock3, Filter, MapPin } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { portalHistoryPreview } from "../lib/mockPortal";
import { PortalPageHeader } from "../components/PortalPageHeader";

export function PortalHistoryPage() {
  const [resultFilter, setResultFilter] = useState<"All" | "Win" | "Loss">("All");
  const [sportFilter, setSportFilter] = useState<"All" | "Pickleball" | "Tennis" | "Padel">("All");

  const filteredHistory = useMemo(() => {
    return portalHistoryPreview.filter((item) => {
      const matchesResult = resultFilter === "All" || item.result === resultFilter;
      const matchesSport = sportFilter === "All" || item.sport === sportFilter;

      return matchesResult && matchesSport;
    });
  }, [resultFilter, sportFilter]);

  return (
    <>
      <PortalPageHeader
        eyebrow="History"
        title="Recent matches and game results."
        description="This page now supports the structure a real player history needs: filtering, venue detail, score context, and match-by-match movement. The next step is replacing preview items with real account-scoped match records."
      />

      <GlassCard className="p-7">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 text-violet-200">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Recent history</p>
              <h3 className="mt-1 font-display text-3xl font-black text-white">Latest matches</h3>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-3">
              <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/45">
                <Filter className="h-3.5 w-3.5" />
                Result
              </p>
              <div className="flex flex-wrap gap-2">
                {(["All", "Win", "Loss"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setResultFilter(option)}
                    className={`rounded-full border px-3 py-2 text-sm transition ${
                      resultFilter === option
                        ? "border-accent-purple/30 bg-accent-purple/10 text-white"
                        : "border-white/10 bg-white/[0.03] text-white/65 hover:text-white"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-3">
              <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/45">
                <MapPin className="h-3.5 w-3.5" />
                Sport
              </p>
              <div className="flex flex-wrap gap-2">
                {(["All", "Pickleball", "Tennis", "Padel"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSportFilter(option)}
                    className={`rounded-full border px-3 py-2 text-sm transition ${
                      sportFilter === option
                        ? "border-accent-purple/30 bg-accent-purple/10 text-white"
                        : "border-white/10 bg-white/[0.03] text-white/65 hover:text-white"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {filteredHistory.length ? (
            filteredHistory.map((item) => (
              <div key={item.id} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-white/55">
                      <span>{item.dateLabel}</span>
                      <span>•</span>
                      <span>{item.sport}</span>
                      <span>•</span>
                      <span>{item.durationLabel}</span>
                    </div>
                    <h4 className="mt-2 text-xl font-semibold text-white">{item.title}</h4>
                    <p className="mt-2 text-sm leading-7 text-white/65">{item.detail}</p>
                    <p className="mt-2 text-sm leading-7 text-white/55">{item.teammateLine}</p>
                  </div>
                  <div className="text-right">
                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80">
                      {item.result}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-violet-200">{item.ratingDelta} rating</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Venue", item.venueLabel],
                    ["Score", item.scoreLine],
                    ["Movement", `${item.ratingDelta} rating`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.25em] text-white/40">{label}</p>
                      <p className="mt-2 text-sm text-white/75">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-6 text-sm leading-7 text-white/65">
              No matches fit the current filters. This empty state is ready for real query-backed history once the
              portal is connected to account-scoped match data.
            </div>
          )}
        </div>
      </GlassCard>
    </>
  );
}
