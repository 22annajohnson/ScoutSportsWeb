import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";

export function AppPreviewSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard className="overflow-hidden p-7">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/40">Discovery + community</p>
              <h3 className="mt-4 font-display text-3xl font-bold text-white">Your app, your crew, your local scene</h3>
              <p className="mt-4 text-white/70 leading-relaxed">
                Showcase local courts, premium circles, restaurant partnerships, club access, and sports hotspots
                with the same purple-blue visual system from the app.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
              {[
                "Purple / blue glow",
                "Large rounded cards",
                "Premium dark UI",
                "Map + discovery sections",
                "Leaderboard energy",
                "Social-first layouts",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white/80">
                  {item}
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="overflow-hidden bg-gradient-to-br from-violet-500/20 to-blue-500/15 p-7">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-violet-200/70">Homepage goal</p>
              <h3 className="mt-4 font-display text-3xl font-bold text-white">Make people want in immediately</h3>
              <p className="mt-4 text-white/70 leading-relaxed">
                The site should not feel like a startup landing page. It should feel like a live local sports scene
                you can join.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Launch concept", "Mobile-first layout"].map((item, index) => (
                <div
                  key={item}
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    index === 0
                      ? "bg-gradient-to-r from-accent-purple to-accent-blue text-white"
                      : "border border-white/10 bg-white/5 text-white"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Live local energy",
                "Player-first discovery",
                "Premium social cues",
                "Cleaner conversion path",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white/80">
                  {item}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}
