import { Clock3 } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { portalHistoryPreview } from "../lib/mockPortal";
import { PortalPageHeader } from "../components/PortalPageHeader";

export function PortalHistoryPage() {
  return (
    <>
      <PortalPageHeader
        eyebrow="History"
        title="Recent matches and game results."
        description="The full history page will eventually support filters, sport switching, and match detail views. This first shell focuses on the card system and content rhythm."
      />

      <GlassCard className="p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 text-violet-200">
            <Clock3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Recent history</p>
            <h3 className="mt-1 font-display text-3xl font-black text-white">Latest matches</h3>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {portalHistoryPreview.map((item) => (
            <div key={`${item.title}-${item.dateLabel}`} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-white/55">{item.dateLabel}</p>
                  <h4 className="mt-2 text-xl font-semibold text-white">{item.title}</h4>
                  <p className="mt-3 text-sm leading-7 text-white/65">{item.detail}</p>
                </div>
                <div className="text-right">
                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80">
                    {item.result}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-violet-200">{item.ratingDelta} rating</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </>
  );
}
