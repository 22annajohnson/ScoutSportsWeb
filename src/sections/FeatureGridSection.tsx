import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";
import { featureHighlights } from "@/data/site";

export function FeatureGridSection() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Features"
          title="Built for players who want more than just another group chat."
          description="Scout blends discovery, social identity, competition, and local utility into a product that feels premium from the first screen."
          align="center"
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {featureHighlights.map((feature) => {
            const Icon = feature.icon;

            return (
              <GlassCard key={feature.title} className="p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-8 font-display text-3xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-4 max-w-xl text-base leading-7 text-text-muted">{feature.description}</p>
              </GlassCard>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
