import { Check } from "lucide-react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";
import { pricingTiers } from "@/data/site";
import { CTASection } from "@/sections/CTASection";

export function PricingPage() {
  return (
    <>
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Pricing"
            title="Choose the level of access that matches how seriously you play."
            description="Scout keeps the front door open, then layers in sharper discovery, stronger visibility, and premium local advantages for players who want more."
            align="center"
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
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
                      <div className="mt-2 text-sm text-text-muted">{tier.badge}</div>
                    </div>
                    {tier.featured ? (
                      <div className="rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                        Recommended
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-8 flex items-end gap-1">
                    <span className="font-display text-6xl font-semibold text-white">{tier.price}</span>
                    <span className="pb-2 text-sm text-text-muted">{tier.cadence ?? ""}</span>
                  </div>
                  <p className="mt-4 text-base leading-7 text-text-muted">{tier.description}</p>

                  <div className="mt-8 space-y-4">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3 text-sm text-text-muted">
                        <Check className="h-4 w-4 text-accent-blue" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10">
                    <Button href="/" variant={tier.featured ? "primary" : "secondary"} className="w-full">
                      {tier.name === "Free" ? "Get Started" : `Choose ${tier.name}`}
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="mt-12 rounded-[32px] border border-white/10 bg-white/[0.03] p-6 text-center text-sm text-text-muted sm:p-8">
            Pricing is presented as a premium framing pass for the marketing site and can be adjusted later without restructuring the UI system.
          </div>
        </Container>
      </section>

      <CTASection
        title="Start with Free. Upgrade when you want more control and more visibility."
        description="Scout is designed to feel useful immediately, then more powerful as your local sports life gets more serious."
        primaryLabel="Join Scout"
        primaryHref="/"
        secondaryLabel="See How It Works"
        secondaryHref="/how-it-works"
      />
    </>
  );
}
