import { CreditCard, ReceiptText, ShieldCheck, Sparkles, Star, WalletCards } from "lucide-react";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { routes } from "@/lib/routes";
import { portalInvoiceHistory, portalMembershipBenefitsByTier } from "../lib/mockPortal";
import { PortalPageHeader } from "../components/PortalPageHeader";
import { usePortalSession } from "../lib/session";

export function PortalMembershipPage() {
  const { membership, isMembershipLoading, isMembershipRemote } = usePortalSession();

  if (!membership) {
    return null;
  }

  const membershipBenefits = portalMembershipBenefitsByTier[membership.tier];

  return (
    <>
      <PortalPageHeader
        eyebrow="Membership"
        title="Membership and billing visibility."
        description={
          isMembershipRemote
            ? "Your current plan, renewal timing, and membership access all stay visible here in one account view."
            : "This page keeps membership details organized in one place so players always know their current access."
        }
        aside={
          <div className="rounded-2xl border border-blue-300/20 bg-blue-500/10 px-4 py-4 text-sm text-blue-200">
            {isMembershipLoading ? "Syncing membership..." : isMembershipRemote ? "Membership connected" : "Membership overview"}
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_0.92fr]">
        <div className="grid gap-5">
          <GlassCard className="relative overflow-hidden p-7">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-accent-purple/25 via-fuchsia-500/10 to-accent-blue/20 blur-3xl" />
            <div className="relative">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 text-violet-200">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-xs uppercase tracking-[0.3em] text-white/45">Current plan</p>
                  <h3 className="mt-3 font-display text-5xl font-black text-white">{membership.tier}</h3>
                  <p className="mt-3 inline-flex rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-2 text-sm text-violet-200">
                    {membership.status}
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-black/20 px-5 py-4 text-right">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">Billing cadence</p>
                  <p className="mt-2 text-2xl font-black text-white">{membership.priceLabel}</p>
                  <p className="mt-1 text-sm text-white/60">{membership.cadence}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ["Renews", membership.renewalLabel],
                  ["Billing source", membership.billingSource],
                  ["Payment method", membership.paymentMethod],
                  ["Membership sync", membership.syncedAccessNote],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                    <p className="text-sm text-white/45">{label}</p>
                    <p className="mt-2 text-base leading-7 text-white/75">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={routes.pricing} className="px-6 py-4">
                  Upgrade membership
                </Button>
                <Button href={routes.portal} variant="secondary" className="px-6 py-4">
                  Back to portal
                </Button>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">Included with {membership.tier}</p>
                <h3 className="mt-3 font-display text-3xl font-black text-white">Membership benefits</h3>
              </div>
              <Star className="mt-1 h-5 w-5 text-violet-200" />
            </div>

            <div className="mt-6 grid gap-4">
              {membershipBenefits.map((benefit) => (
                <div key={benefit} className="rounded-[1.5rem] border border-white/10 bg-black/20 px-5 py-4 text-white/75">
                  {benefit}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="grid gap-5">
          {[
            {
              icon: ShieldCheck,
              title: isMembershipRemote ? "Connected membership state" : "Single membership truth",
              text: isMembershipRemote
                ? "This portal page now reads from a real account-level membership record so the portal has one stable place to reflect plan status."
                : "The next billing pass should reconcile web checkout and in-app upgrades into one normalized account-level membership record.",
            },
            {
              icon: WalletCards,
              title: "Billing visibility",
              text: "Renewal timing, payment method, and plan status are organized here so account decisions are easy to make at a glance.",
            },
            {
              icon: ReceiptText,
              title: "Invoice history",
              text: "The membership page keeps a clean billing timeline ready for the full account experience.",
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

          <GlassCard className="p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">Billing history</p>
                <h3 className="mt-3 font-display text-3xl font-black text-white">Recent invoices</h3>
              </div>
              <Sparkles className="mt-1 h-5 w-5 text-violet-200" />
            </div>

            <div className="mt-6 grid gap-4">
              {portalInvoiceHistory.map((invoice) => (
                <div key={invoice.id} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-white/55">{invoice.dateLabel}</p>
                      <h4 className="mt-1 text-lg font-semibold text-white">{invoice.description}</h4>
                      <p className="mt-2 text-sm text-white/55">{invoice.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">{invoice.amountLabel}</p>
                      <p className="mt-2 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/75">
                        {invoice.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
