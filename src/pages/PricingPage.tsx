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
            title="Pick the plan that matches how often you play."
            description="Start with the essentials for free, then upgrade when you want sharper discovery, more competitive context, and a higher-profile presence in your local scene."
            align="center"
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {pricingTiers.map((tier) => (
              <GlassCard
                key={tier.name}
                className={`relative overflow-hidden p-7 ${tier.featured ? "border-violet-400/40 shadow-[0_20px_80px_rgba(124,58,237,0.28)]" : ""}`}
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
                    <span className="font-display text-6xl font-black text-white">{tier.price}</span>
                    <span className="mb-2 text-sm text-white/50">{tier.cadence ?? ""}</span>
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-white/70">{tier.description}</p>

                  <div className="mt-8 space-y-4">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3 text-white/80">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-violet-300" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10">
                    <Button
                      href="/"
                      variant={tier.featured ? "primary" : "secondary"}
                      className={`w-full py-6 text-base ${tier.featured ? "" : "bg-white/10 text-white shadow-none hover:bg-white/15"}`}
                    >
                      {tier.buttonLabel}
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="mt-12 rounded-[32px] border border-white/10 bg-white/[0.03] p-6 text-center text-sm text-text-muted sm:p-8">
            Pro and Elite are built for players who want Scout to do more than find a match. They help you stand out,
            track progress, access better competition, and unlock more of the local sports network around you.
          </div>
        </Container>
      </section>

      <CTASection
        title="Start free. Go Pro or Elite when you want the edge."
        description="Whether you play once a month or compete every week, Scout helps you find better people, better games, and better places to play."
        primaryLabel="Join Scout"
        primaryHref="/"
        secondaryLabel="See How It Works"
        secondaryHref="/how-it-works"
      />
    </>
  );
}
