import { CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { portalMembership } from "../lib/mockPortal";
import { PortalPageHeader } from "../components/PortalPageHeader";

export function PortalMembershipPage() {
  return (
    <>
      <PortalPageHeader
        eyebrow="Membership"
        title="Membership and billing visibility."
        description="This shell is ready for a third-party billing source such as Stripe. Upgrades made online or in-app should eventually resolve into one normalized membership state here."
        aside={
          <div className="rounded-2xl border border-blue-300/20 bg-blue-500/10 px-4 py-4 text-sm text-blue-200">
            Billing integration planned
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <GlassCard className="p-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 text-violet-200">
            <CreditCard className="h-5 w-5" />
          </div>
          <p className="mt-5 text-xs uppercase tracking-[0.3em] text-white/45">Current plan</p>
          <h3 className="mt-3 font-display text-4xl font-black text-white">{portalMembership.tier}</h3>
          <p className="mt-3 text-lg text-violet-200">{portalMembership.status}</p>
          <p className="mt-5 text-sm leading-7 text-white/65">{portalMembership.renewalLabel}</p>
          <p className="mt-3 text-sm leading-7 text-white/65">{portalMembership.billingSummary}</p>
        </GlassCard>

        <div className="grid gap-5">
          {[
            {
              icon: ShieldCheck,
              title: "Single membership truth",
              text: "The next billing pass should reconcile web checkout and in-app upgrades into one account-level membership record.",
            },
            {
              icon: Sparkles,
              title: "What this page will eventually show",
              text: "Tier, renewal, payment method summary, invoices, plan changes, trial windows, and membership perks.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <GlassCard key={item.title} className="p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/65">{item.text}</p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </>
  );
}
