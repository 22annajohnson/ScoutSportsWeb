import { Check } from "lucide-react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";
import { pricingTiers } from "@/data/site";

export function PricingPreviewSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Pricing"
            title="Free to enter. Premium if you want the sharper edge."
            description="Scout is designed to be accessible at the front door and premium where visibility, discovery, and competition matter most."
          />
          <div className="hidden lg:block">
            <Button href="/pricing" variant="secondary">
              Compare plans
            </Button>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <GlassCard
              key={tier.name}
              className={`relative overflow-hidden p-8 ${tier.featured ? "border-accent-purple/40 bg-white/[0.05] shadow-glow" : ""}`}
            >
              <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-br ${tier.accent} opacity-60 blur-2xl`} />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-display text-3xl font-semibold text-white">{tier.name}</div>
                    <div className="mt-2 text-sm text-text-muted">{tier.description}</div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white">
                    {tier.badge}
                  </div>
                </div>
                <div className="mt-8 flex items-end gap-1">
                  <span className="font-display text-5xl font-semibold text-white">{tier.price}</span>
                  <span className="pb-1 text-sm text-text-muted">{tier.cadence ?? ""}</span>
                </div>
                <div className="mt-8 space-y-3">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm text-text-muted">
                      <Check className="h-4 w-4 text-accent-blue" />
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
