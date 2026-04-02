import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";
import { featureHighlights } from "@/data/site";

export function FeatureGridSection() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Why it works"
          title="Designed to feel alive, not empty"
          description="Scout should feel like your local sports world already exists the second you open it. The website should sell that energy immediately."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featureHighlights.map((feature) => {
            const Icon = feature.icon;

            return (
              <GlassCard key={feature.title} className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/30 to-blue-500/30 text-violet-200">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-bold text-white">{feature.title}</h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-white/68">{feature.description}</p>
              </GlassCard>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
