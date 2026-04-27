import { Compass, MapPinned } from "lucide-react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";

export function NotFoundPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <GlassCard className="mx-auto max-w-4xl p-8 text-center sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 text-white">
            <Compass className="h-7 w-7" />
          </div>

          <div className="mt-8 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-text-muted">
            404 | Route not found
          </div>

          <h1 className="mt-6 font-display text-4xl font-black tracking-tight text-white sm:text-6xl">
            That page is off the map.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
            The link may be outdated, or the page may have moved while Scout’s marketing site was being updated.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/" showArrow>
              Back to home
            </Button>
            <Button href="/pricing" variant="secondary">
              View pricing
            </Button>
          </div>

          <div className="mt-10 rounded-[28px] border border-white/10 bg-white/[0.03] p-5 text-left text-sm leading-7 text-white/65">
            <div className="flex items-center gap-2 text-white/80">
              <MapPinned className="h-4 w-4 text-blue-300" />
              Try one of Scout’s active pages instead:
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <Button href="/how-it-works" variant="ghost" className="px-0">
                How it works
              </Button>
              <Button href="/business" variant="ghost" className="px-0">
                For businesses
              </Button>
            </div>
          </div>
        </GlassCard>
      </Container>
    </section>
  );
}
