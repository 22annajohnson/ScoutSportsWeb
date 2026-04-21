import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";

export function AppPreviewSection() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Inside the app"
          title="A sports product that feels social before it feels transactional."
          description="Every surface is built to move players from discovery to game-time faster, with enough status, identity, and local context to keep the community sticky."
          align="center"
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <GlassCard className="flex min-h-[420px] flex-col justify-between bg-gradient-to-br from-accent-purple/10 to-transparent p-8">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.32em] text-text-muted">
                Player profile
              </div>
              <h3 className="mt-5 font-display text-3xl font-semibold text-white">Visibility, status, and chemistry cues in one place.</h3>
            </div>
            <div className="grid gap-4">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                <div className="text-sm text-text-muted">Profile signals</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Elite badge", "88% reply rate", "Late-night runs", "Hoops + tennis"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                <div className="text-sm text-text-muted">Recent movement</div>
                <div className="mt-3 font-display text-2xl font-semibold text-white">+12 city ranking this week</div>
              </div>
            </div>
          </GlassCard>

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Swipe stack",
                description: "Fast local discovery with stronger filters and a more intentional social graph.",
              },
              {
                title: "Circles feed",
                description: "Private crews, recurring sessions, and shared momentum around the people you trust.",
              },
              {
                title: "Bracket progress",
                description: "Automated asynchronous competition that fits around real schedules.",
              },
              {
                title: "Hotspot map",
                description: "Discover clubs, courts, food, and premium partner spots around every match.",
              },
            ].map((card) => (
              <GlassCard key={card.title} className="min-h-[200px] p-6">
                <div className="text-xs uppercase tracking-[0.28em] text-text-muted">Scout surface</div>
                <h3 className="mt-4 font-display text-2xl font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-muted">{card.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
