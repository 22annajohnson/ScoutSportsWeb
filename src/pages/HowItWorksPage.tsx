import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";
import { howItWorksSteps } from "@/data/site";
import { routes } from "@/lib/routes";
import { CTASection } from "@/sections/CTASection";

const extendedSteps = [
  "Browse players nearby with the sport, skill, availability, and location context you need up front.",
  "Match with people who fit your pace, competitiveness, schedule, and neighborhood.",
  "Turn a match into pickup, a recurring run, or an asynchronous bracket round.",
  "Build reputation through ratings, results, profile badges, and city-level leaderboard movement.",
  "Create inner circles for trusted teammates, favorite rivals, and crews you want to play with again.",
  "Find courts, clubs, restaurants, recovery spots, and partner perks around your sports routine.",
];

export function HowItWorksPage() {
  return (
    <>
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="How It Works"
            title="From first swipe to regular run, Scout keeps the whole loop moving."
            description="Discover compatible players, make the match, play the game, track the result, and build the circle that brings you back."
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
        title="Find one match today. Build your sports circle over time."
        description="Scout is built for the full local sports habit: discovery, repeat play, friendly competition, social proof, and the places that make every game feel bigger."
        primaryLabel="View Pricing"
        primaryHref={routes.pricing}
        secondaryLabel="Partner With Scout"
        secondaryHref={routes.business}
      />
    </>
  );
}
