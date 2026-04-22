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
              <h3 className="mt-4 font-display text-3xl font-bold text-white">One place for players, crews, and local sports spots</h3>
              <p className="mt-4 text-white/70 leading-relaxed">
                Scout connects the full routine around pickup: player discovery, trusted circles, courts, clubs,
                restaurants, and the places your crew already talks about after the match.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
              {[
                "Nearby player matching",
                "Private inner circles",
                "Court and club discovery",
                "Partner perks and drops",
                "Leaderboard movement",
                "Match-first social feed",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white/80">
                  {item}
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="overflow-hidden bg-gradient-to-br from-violet-500/20 to-blue-500/15 p-7">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-violet-200/70">Local momentum</p>
              <h3 className="mt-4 font-display text-3xl font-bold text-white">Make every city feel like it already has a sports scene</h3>
              <p className="mt-4 text-white/70 leading-relaxed">
                New players can see who is active, where games are happening, what circles are forming, and which
                local spots are part of the experience before they ever send a message.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Find a game tonight", "Build your circle"].map((item, index) => (
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
                "Real-time player intent",
                "Skill and vibe matching",
                "Bracket-driven competition",
                "Local rewards and hotspots",
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
