import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";
import { howItWorksSteps } from "@/data/site";

export function HowItWorksPreviewSection() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="Scout turns local sports into a cleaner loop."
          description="Swipe, match, play, rank, and build circles around the people and places that keep your week moving."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {howItWorksSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <GlassCard key={step.title} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm text-text-muted">0{index + 1}</div>
                </div>
                <h3 className="mt-8 font-display text-2xl font-semibold text-white">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-text-muted">{step.description}</p>
              </GlassCard>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
