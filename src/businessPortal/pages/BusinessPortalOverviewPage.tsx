import { ArrowUpRight, BadgeDollarSign, Building2, Megaphone, ShieldCheck, Users2 } from "lucide-react";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { routes } from "@/lib/routes";
import { BusinessPortalPageHeader } from "../components/BusinessPortalPageHeader";
import { useBusinessPortalSession } from "../lib/session";

export function BusinessPortalOverviewPage() {
  const { billing, business, content, isSupabaseMode, team, user } = useBusinessPortalSession();

  if (!user || !business || !billing) {
    return null;
  }

  const activeMembers = team.filter((member) => member.status === "Active").length;
  const invitedMembers = team.filter((member) => member.status === "Invited").length;
  const scheduledContent = content.filter((item) => item.status === "Scheduled").length;
  const publishedContent = content.filter((item) => item.status === "Published").length;
  const hasPaymentMethod = billing.paymentMethod.trim().length > 0;
  const hasBillingContact = billing.billingContactEmail.trim().length > 0;
  const hasProfileReady =
    business.completionPercent >= 80 && business.website.trim().length > 0 && business.supportEmail.trim().length > 0;
  const hasTeamCoverage = activeMembers > 1 || invitedMembers > 0;
  const hasContentReady = publishedContent > 0 || scheduledContent > 0;
  const readinessChecks = [
    {
      title: "Business profile ready",
      detail: hasProfileReady
        ? "Core business details, website, and contact info are in place."
        : "Add a complete support email, website, and business details before launch.",
      ready: hasProfileReady,
      href: routes.businessPortalProfile,
      cta: hasProfileReady ? "Review profile" : "Complete profile",
    },
    {
      title: "Team access set up",
      detail: hasTeamCoverage
        ? "At least one additional teammate or pending invite is already in the workspace."
        : "Invite the teammate who will own content, billing, or operations.",
      ready: hasTeamCoverage,
      href: routes.businessPortalTeam,
      cta: hasTeamCoverage ? "Manage team" : "Invite teammate",
    },
    {
      title: "Billing contact configured",
      detail: hasBillingContact && hasPaymentMethod
        ? "A billing contact and payment method label are saved for the workspace."
        : "Add the billing contact and payment method you want tied to this business account.",
      ready: hasBillingContact && hasPaymentMethod,
      href: routes.businessPortalBilling,
      cta: hasBillingContact && hasPaymentMethod ? "Review billing" : "Finish billing",
    },
    {
      title: "Launch content prepared",
      detail: hasContentReady
        ? "The studio already has scheduled or published content ready to go live."
        : "Create at least one scheduled or published content item before opening the portal to a business.",
      ready: hasContentReady,
      href: routes.businessPortalContent,
      cta: hasContentReady ? "Open studio" : "Prepare content",
    },
  ];
  const completedReadinessChecks = readinessChecks.filter((item) => item.ready).length;

  return (
    <>
      <BusinessPortalPageHeader
        eyebrow="Workspace home"
        title={`Welcome back, ${user.firstName}.`}
        description="Run the core business workflow from one place: workspace setup, teammate access, billing readiness, content planning, and an audit trail for sensitive changes."
        aside={
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Launch readiness</p>
            <p className="mt-2 text-2xl font-black text-white">{completedReadinessChecks}/4 complete</p>
            <p className="mt-1 text-sm text-emerald-200">
              {business.businessStatus} • {isSupabaseMode ? "live data" : "demo data"}
            </p>
            <p className="mt-3 text-sm text-white/55">Verification status: {business.verificationStatus}</p>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-5">
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
            label: "Content queue",
            value: String(content.length),
            detail: scheduledContent > 0 ? `${scheduledContent} scheduled to publish` : "No scheduled content yet",
            icon: Megaphone,
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
              <h3 className="mt-3 font-display text-3xl font-black text-white">Business MVP readiness.</h3>
            </div>
            <ArrowUpRight className="mt-1 h-5 w-5 text-emerald-200" />
          </div>

          <div className="mt-6 grid gap-4">
            {readinessChecks.map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h4 className="text-xl font-semibold text-white">{item.title}</h4>
                    <p className="mt-2 text-sm leading-7 text-white/65">{item.detail}</p>
                  </div>
                  <div
                    className={`rounded-full px-3 py-2 text-sm font-semibold ${
                      item.ready
                        ? "border border-emerald-300/15 bg-emerald-500/10 text-emerald-100"
                        : "border border-amber-300/15 bg-amber-500/10 text-amber-100"
                    }`}
                  >
                    {item.ready ? "Ready" : "Needs attention"}
                  </div>
                </div>
                <div className="mt-4">
                  <Button href={item.href} variant="secondary" className="px-5 py-3">
                    {item.cta}
                  </Button>
                </div>
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
            <Button href={routes.businessPortalContent} variant="secondary" className="px-6 py-4">
              Open content studio
            </Button>
          </div>
        </GlassCard>

        <GlassCard className="p-7">
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">Workspace snapshot</p>
          <h3 className="mt-3 font-display text-3xl font-black text-white">What this portal now handles</h3>
          <div className="mt-6 grid gap-4">
            {[
              {
                title: "Business identity",
                text: "Business details, contact info, and verification context all live in one editable profile flow.",
              },
              {
                title: "Team controls",
                text: "Owners and managers can invite teammates, assign roles, and pause or restore access in one place.",
              },
              {
                title: "Billing foundation",
                text: "Billing contact, payment method labeling, plan visibility, and invoice history are ready for business operations.",
              },
              {
                title: "Content studio",
                text: "Businesses can draft, schedule, publish, and attach media to launch content without leaving the workspace.",
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
