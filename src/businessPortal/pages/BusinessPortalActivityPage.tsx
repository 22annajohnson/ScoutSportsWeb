import { Activity, BadgeAlert, Building2, CreditCard, Users2 } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { BusinessPortalPageHeader } from "../components/BusinessPortalPageHeader";
import { useBusinessPortalSession } from "../lib/session";

const activityIcons = {
  billing: CreditCard,
  team: Users2,
  profile: Building2,
  verification: BadgeAlert,
};

export function BusinessPortalActivityPage() {
  const { activity } = useBusinessPortalSession();

  return (
    <>
      <BusinessPortalPageHeader
        eyebrow="Activity log"
        title="Recent account and workspace changes."
        description="This timeline acts as the first audit-style surface for the business portal. It is where business owners should be able to review who changed billing, profile, verification, and team-access settings."
      />

      <GlassCard className="p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-400/20 to-sky-500/20 text-emerald-200">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Audit preview</p>
            <h3 className="mt-1 font-display text-3xl font-black text-white">Latest workspace events</h3>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {activity.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 p-6 text-sm leading-7 text-white/60">
              No audit-style activity has been recorded for this workspace yet.
            </div>
          ) : null}
          {activity.map((item) => {
            const Icon = activityIcons[item.type];

            return (
              <div key={item.id} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-white/55">{item.dateLabel}</p>
                      <h4 className="mt-1 text-xl font-semibold text-white">{item.title}</h4>
                      <p className="mt-2 text-sm text-emerald-200">Actor: {item.actor}</p>
                      <p className="mt-3 text-sm leading-7 text-white/65">{item.detail}</p>
                    </div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm capitalize text-white/80">
                    {item.type}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </>
  );
}
