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
          title="Find better games without chasing group chats"
          description="Scout gives players a real local sports graph: who is nearby, who fits your level, where people are playing, and which circles are worth joining."
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
