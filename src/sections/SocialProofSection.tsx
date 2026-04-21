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
            title="A local sports network with visible movement."
            description="Every match can create momentum: players rank up, crews tighten, bracket paths advance, and the best local spots become part of the routine."
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
