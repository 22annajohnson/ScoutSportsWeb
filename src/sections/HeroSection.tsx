import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { heroStats } from "@/data/site";
import { routes } from "@/lib/routes";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-14 lg:py-16">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-7"
          >
            <div className="inline-flex rounded-full border border-accent-purple/20 bg-accent-purple/10 px-4 py-2 text-sm text-violet-200">
              Built for local pickup sports
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl font-display text-6xl font-black tracking-tight leading-[0.92] text-white sm:text-7xl">
                Meet players.
                <br />
                Build your circle.
                <br />
                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-blue-300 bg-clip-text text-transparent">
                  Play more.
                </span>
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-white/72 sm:text-xl">
                Scout matches you with nearby players, helps you turn availability into real games, and brings your
                city’s courts, circles, brackets, and sports hotspots into one premium community.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href={routes.pricing} className="px-7 py-5 text-base shadow-2xl shadow-violet-500/20">
                Join Early Access
              </Button>
              <Button href={routes.howItWorks} variant="secondary" className="px-7 py-5 text-base">
                See How It Works
              </Button>
            </div>
            <div className="grid gap-4 pt-4 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <GlassCard key={stat.label} className="rounded-[1.75rem] p-5">
                  <div className="font-display text-3xl font-black text-transparent bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm text-white/60">{stat.label}</div>
                </GlassCard>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative h-[720px]"
          >
            <div className="absolute inset-y-8 right-0 w-full rounded-[2.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_40px_120px_rgba(76,29,149,0.35)] backdrop-blur-2xl lg:w-[82%]">
              <div className="flex h-full flex-col rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/45">Scout</p>
                    <h3 className="text-2xl font-bold text-white">Find your next game</h3>
                  </div>
                  <div className="rounded-full border border-blue-300/20 bg-blue-500/15 px-3 py-2 text-xs text-blue-200">
                    Live nearby
                  </div>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900">
                  <img
                    src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80"
                    alt="Local sports player"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-blue-500/20" />
                  <div className="absolute bottom-0 left-0 right-0 space-y-4 p-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h4 className="text-4xl font-black text-white">Alyssa, 26</h4>
                        <p className="text-white/75">4.8 match fit • 2.1 mi away • Pickleball</p>
                      </div>
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-2xl font-black text-white backdrop-blur">
                        92
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      {["Competitive", "Weeknights", "Beginner+"].map((item) => (
                        <div key={item} className="rounded-2xl bg-white/10 p-3 text-center text-white backdrop-blur">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {["Brackets", "Inner Circle", "Hotspots"].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                      <p className="text-sm text-white/55">Inside Scout</p>
                      <p className="mt-1 font-semibold text-white">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <GlassCard className="absolute bottom-12 left-0 w-60 bg-black/50 p-4 shadow-[0_20px_80px_rgba(59,130,246,0.18)] backdrop-blur-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Inner Circle</p>
              <div className="mt-4 space-y-3">
                {[
                  ["#1", "You", "96"],
                  ["#2", "Mia", "92"],
                  ["#3", "Jake", "90"],
                ].map(([rank, name, score]) => (
                  <div key={name} className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-3">
                    <div>
                      <p className="text-sm text-white/55">{rank}</p>
                      <p className="font-semibold text-white">{name}</p>
                    </div>
                    <div className="text-lg font-bold text-violet-300">{score}</div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="absolute left-4 top-24 hidden max-w-[240px] bg-black/45 p-4 backdrop-blur-2xl md:block">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <MapPin className="h-4 w-4 text-blue-300" />
                Hotspots nearby
              </div>
              <div className="mt-3 space-y-2">
                {["McCarren courts", "BK padel club", "Baseline social"].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white">
                    {item}
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
