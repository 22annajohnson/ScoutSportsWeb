import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";
import { businessCategories, partnerBenefits } from "@/data/site";
import { CTASection } from "@/sections/CTASection";

export function BusinessPage() {
  return (
    <>
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="For Businesses and Clubs"
            title="Put your venue, offer, or brand inside the sports moments that already matter locally."
            description="Scout creates a cleaner connection between active players and the businesses that shape their routines before, during, and after the game."
            align="center"
          />

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {businessCategories.map((category) => (
              <GlassCard key={category.title} className="p-8">
                <h3 className="font-display text-3xl font-semibold text-white">{category.title}</h3>
                <p className="mt-4 text-base leading-8 text-text-muted">{category.description}</p>
              </GlassCard>
            ))}
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {partnerBenefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <GlassCard key={benefit.title} className="p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-semibold text-white">{benefit.title}</h3>
                  <p className="mt-4 text-base leading-8 text-text-muted">{benefit.description}</p>
                </GlassCard>
              );
            })}
          </div>

          <div className="mt-12 rounded-[32px] border border-white/10 bg-white/[0.03] p-6 text-center text-base leading-8 text-text-muted sm:p-8">
            Early partnership opportunities can support sponsored placements, local offers, venue discovery, premium spotlights, and ecosystem visibility for clubs and community hubs.
          </div>
        </Container>
      </section>

      <CTASection
        title="Build local relevance instead of running generic ads."
        description="Scout gives sports-focused businesses a more contextual way to reach active players and recurring communities."
        primaryLabel="Join Early Access"
        primaryHref="/pricing"
        secondaryLabel="See Home"
        secondaryHref="/"
      />
    </>
  );
}
