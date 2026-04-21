import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";
import { socialSignals } from "@/data/site";

export function SocialProofSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading
            eyebrow="Community status"
            title="Everything about Scout should feel active, local, and worth joining early."
            description="The product is designed to create visible motion: people ranking up, circles forming, matches getting played, and local spots becoming part of the routine."
          />

          <GlassCard className="grid gap-4 p-6">
            {socialSignals.map((signal) => (
              <div
                key={signal}
                className="rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-5 text-base text-white"
              >
                {signal}
              </div>
            ))}
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}
