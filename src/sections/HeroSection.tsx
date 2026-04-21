import { motion } from "framer-motion";
import { ArrowUpRight, MapPinned, Star, Users } from "lucide-react";
import { heroStats } from "@/data/site";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.32em] text-text-muted">
              Premium local sports network
            </div>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Find your people. Build your run. Own your local scene.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-muted sm:text-xl">
              Scout helps you discover local players, match for pickup games, build inner circles, join brackets,
              and unlock the sports spots that make your city feel alive.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/pricing" showArrow>
                Join Early Access
              </Button>
              <Button href="/how-it-works" variant="secondary">
                See How It Works
              </Button>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <GlassCard key={stat.label} className="p-4">
                  <div className="text-xs uppercase tracking-[0.26em] text-text-muted">{stat.label}</div>
                  <div className="mt-2 font-display text-xl font-semibold text-white">{stat.value}</div>
                </GlassCard>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute inset-x-10 top-10 h-56 rounded-full bg-accent-purple/25 blur-3xl" />
            <GlassCard className="relative overflow-hidden p-5 shadow-glow">
              <div className="rounded-[24px] border border-white/10 bg-[#0a0d14] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm uppercase tracking-[0.32em] text-text-muted">Tonight in Brooklyn</div>
                    <div className="mt-2 font-display text-3xl font-semibold text-white">Your next run is already nearby</div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white">
                    7 players live
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-[1fr_0.95fr]">
                    <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-accent-purple/25 via-white/[0.03] to-accent-blue/15 p-5">
                      <div className="flex items-center justify-between text-sm text-text-muted">
                        <span>Scout Match</span>
                        <span>94% fit</span>
                      </div>
                      <div className="mt-5 flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
                          <Users className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">Wednesday Pickup Crew</div>
                          <div className="text-sm text-text-muted">Hoops • Williamsburg • 7:30 PM</div>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center gap-3 text-sm text-text-muted">
                        <Star className="h-4 w-4 text-accent-blue" />
                        Skill, pace, and neighborhood aligned
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                        <div className="flex items-center gap-3 text-sm text-text-muted">
                          <MapPinned className="h-4 w-4 text-accent-purple" />
                          Nearby hotspots
                        </div>
                        <div className="mt-4 space-y-3">
                          {["Bridge Court Club", "Baseline Social", "Aftergame Kitchen"].map((item) => (
                            <div
                              key={item}
                              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                            >
                              <span className="text-sm text-white">{item}</span>
                              <ArrowUpRight className="h-4 w-4 text-text-muted" />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                        <div className="text-sm text-text-muted">Bracket status</div>
                        <div className="mt-3 font-display text-2xl font-semibold text-white">Quarterfinal unlocked</div>
                        <div className="mt-4 h-2 rounded-full bg-white/10">
                          <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-accent-purple to-accent-blue" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
