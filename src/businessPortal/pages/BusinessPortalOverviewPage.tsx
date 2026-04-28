import { ArrowUpRight, BadgeDollarSign, Building2, ShieldCheck, Users2 } from "lucide-react";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { routes } from "@/lib/routes";
import { businessPortalNextSteps } from "../lib/mockBusinessPortal";
import { BusinessPortalPageHeader } from "../components/BusinessPortalPageHeader";
import { useBusinessPortalSession } from "../lib/session";

export function BusinessPortalOverviewPage() {
  const { billing, business, team, user } = useBusinessPortalSession();

  if (!user || !business || !billing) {
    return null;
  }

  const activeMembers = team.filter((member) => member.status === "Active").length;
  const invitedMembers = team.filter((member) => member.status === "Invited").length;

  return (
    <>
      <BusinessPortalPageHeader
        eyebrow="Workspace home"
        title={`Welcome back, ${user.firstName}.`}
        description="Phase 1 establishes the business account foundation: workspace identity, team access, billing readiness, and a review trail for sensitive changes."
        aside={
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Verification</p>
            <p className="mt-2 text-2xl font-black text-white">{business.verificationStatus}</p>
            <p className="mt-1 text-sm text-emerald-200">{business.businessStatus}</p>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-4">
        {[
          {
            label: "Profile completion",
            value: `${business.completionPercent}%`,
            detail: `${business.locations.length} locations listed`,
            icon: Building2,
          },
          {
            label: "Active team members",
            value: String(activeMembers),
            detail: invitedMembers > 0 ? `${invitedMembers} invite pending` : "No pending invites",
            icon: Users2,
          },
          {
            label: "Plan and billing",
            value: billing.planName,
            detail: billing.renewalLabel,
            icon: BadgeDollarSign,
          },
          {
            label: "Spend guardrail",
            value: billing.spendCapLabel,
            detail: billing.monthlyBudgetLabel,
            icon: ShieldCheck,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <GlassCard key={item.label} className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-400/20 to-sky-500/20 text-emerald-200">
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
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Launch checklist</p>
              <h3 className="mt-3 font-display text-3xl font-black text-white">Phase 1 readiness.</h3>
            </div>
            <ArrowUpRight className="mt-1 h-5 w-5 text-emerald-200" />
          </div>

          <div className="mt-6 grid gap-4">
            {businessPortalNextSteps.map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5 text-sm leading-7 text-white/70">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={routes.businessPortalProfile} className="px-6 py-4">
              Complete business profile
            </Button>
            <Button href={routes.businessPortalTeam} variant="secondary" className="px-6 py-4">
              Review team access
            </Button>
          </div>
        </GlassCard>

        <GlassCard className="p-7">
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">Workspace snapshot</p>
          <h3 className="mt-3 font-display text-3xl font-black text-white">What is already in place</h3>
          <div className="mt-6 grid gap-4">
            {[
              {
                title: "Business identity",
                text: "Your public-facing business details now live in one editable settings flow with verification context.",
              },
              {
                title: "Team controls",
                text: "Owners can invite teammates, assign roles, and pause access without leaving the portal shell.",
              },
              {
                title: "Billing foundation",
                text: "Billing contact, payment method, plan status, and invoice history are ready to connect to a real provider next.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                <h4 className="text-xl font-semibold text-white">{item.title}</h4>
                <p className="mt-2 text-sm leading-7 text-white/65">{item.text}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  );
}
