import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";
import { howItWorksSteps } from "@/data/site";
import { CTASection } from "@/sections/CTASection";

const extendedSteps = [
  "Swipe through local players who fit your sport, level, and timing.",
  "Match based on chemistry, skill, vibe, and neighborhood convenience.",
  "Play pickup games, recurring runs, or bracket rounds when your schedule lines up.",
  "Rank up through ratings, results, and city-level movement.",
  "Build inner circles around the crews you actually want to play with again.",
  "Discover courts, clubs, restaurants, and premium hotspots around your sports routine.",
];

export function HowItWorksPage() {
  return (
    <>
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="How It Works"
            title="Scout keeps the path from discovering players to building a real local sports network tight."
            description="The app is designed to feel immediate on day one and socially richer every week after."
            align="center"
          />

          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <GlassCard key={step.title} className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-sm text-text-muted">0{index + 1}</div>
                  </div>
                  <h3 className="mt-8 font-display text-3xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-4 text-base leading-8 text-text-muted">{step.description}</p>
                </GlassCard>
              );
            })}
          </div>

          <div className="mt-12 rounded-[32px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <h3 className="font-display text-3xl font-semibold text-white">The full loop</h3>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {extendedSteps.map((step) => (
                <div key={step} className="rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-5 text-text-muted">
                  {step}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <CTASection
        title="The more active your city is, the better Scout feels."
        description="That is why the product is built around discovery, repeat play, local status, and community momentum instead of one-off scheduling."
        primaryLabel="View Pricing"
        primaryHref="/pricing"
        secondaryLabel="Partner With Scout"
        secondaryHref="/business"
      />
    </>
  );
}
