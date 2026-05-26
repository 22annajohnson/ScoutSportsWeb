import { Check } from "lucide-react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";
import { pricingTiers } from "@/data/site";
import { routes } from "@/lib/routes";

export function PricingPreviewSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Pricing"
            title="Start free. Upgrade when your local game gets serious."
            description="Scout is free for the basics, with paid tiers for players who want stronger filters, better visibility, deeper stats, and premium local perks."
          />
          <div className="hidden lg:block">
            <Button href={routes.pricing} variant="secondary">
              Compare plans
            </Button>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <GlassCard
              key={tier.name}
              className={`relative overflow-hidden p-7 ${tier.featured ? "border-violet-400/40 shadow-[0_20px_80px_rgb(var(--color-accent-purple)/0.28)]" : ""}`}
            >
              <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-br ${tier.accent} opacity-80 blur-3xl`} />
              <div className="relative">
                {tier.featured ? (
                  <div className="absolute right-0 top-0">
                    <div className="rounded-full border border-violet-300/20 bg-violet-500/20 px-3 py-2 text-xs text-violet-200">
                      Most Popular
                    </div>
                  </div>
                ) : null}

                <div>
                  <div className="text-sm uppercase tracking-[0.3em] text-white/45">Membership</div>
                  <div className="mt-3 font-display text-3xl font-black text-white">{tier.name}</div>
                  <div className="mt-2 text-white/65">{tier.subtitle}</div>
                </div>

                <div className="mt-8 flex items-end gap-1">
                  <span className="font-display text-5xl font-black text-white">{tier.price}</span>
                  <span className="mb-1 text-sm text-white/50">{tier.cadence ?? ""}</span>
                </div>
                <div className="mt-6">
                  <Button
                    href={tier.signupPath}
                    className={`w-full py-6 text-base ${tier.featured ? "" : "bg-white/10 text-white shadow-none hover:bg-white/15"}`}
                    variant={tier.featured ? "primary" : "secondary"}
                  >
                    {tier.buttonLabel}
                  </Button>
                </div>
                <div className="mt-8 space-y-3">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-white/80">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-violet-300" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
