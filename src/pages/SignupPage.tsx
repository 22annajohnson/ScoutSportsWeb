import { FormEvent, useState } from "react";
import { Check, ChevronLeft, MapPin, Sparkles } from "lucide-react";
import { Navigate, useParams } from "react-router-dom";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { pricingTiers } from "@/data/site";
import { getMarketingAttribution } from "@/lib/attribution";
import { HoneypotField, shouldBlockSuspiciousSubmission } from "@/lib/spamProtection";
import { hasSupabaseConfig, insertSportInterest } from "@/lib/supabase";

const tierNotes = {
  free: {
    eyebrow: "Sport interest",
    headline: "Tell us where Scout should open next.",
    note: "Join the Free interest list and help us prioritize the sports, cities, courts, and player communities that should launch first.",
    submitLabel: "Join the interest list",
  },
};

export function SignupPage() {
  const { tierId } = useParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formMountedAt] = useState(() => Date.now());
  const tier = pricingTiers.find((plan) => plan.slug === tierId);

  if (!tier || tierId !== "free") {
    return <Navigate to="/pricing" replace />;
  }

  const copy = tierNotes.free;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (shouldBlockSuspiciousSubmission(event, formMountedAt)) {
      return;
    }

    if (!hasSupabaseConfig()) {
      setErrorMessage("Supabase is not configured yet. Add your local env values and reload the page.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const attribution = getMarketingAttribution();

    try {
      await insertSportInterest({
        first_name: String(formData.get("first_name") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        city: String(formData.get("city") ?? "").trim(),
        primary_sport: String(formData.get("primary_sport") ?? "").trim(),
        looking_for: String(formData.get("looking_for") ?? "").trim(),
        preferred_tier: "free",
        source_intent: "free_signup",
        launch_status_at_signup: "pre_release",
        honeypot_field: String(formData.get("company") ?? "").trim(),
        ...attribution,
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong while saving your interest. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Button href="/pricing" variant="ghost" className="mb-8 px-0">
          <ChevronLeft className="h-4 w-4" />
          Back to pricing
        </Button>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-accent-purple/20 bg-accent-purple/10 px-4 py-2 text-sm text-violet-200">
              {copy.eyebrow}
            </div>
            <div>
              <h1 className="font-display text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl">
                {copy.headline}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">{copy.note}</p>
            </div>

            <GlassCard className="relative overflow-hidden p-7">
              <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-br ${tier.accent} opacity-80 blur-3xl`} />
              <div className="relative">
                <p className="text-sm uppercase tracking-[0.3em] text-white/45">Selected membership</p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="font-display text-4xl font-black text-white">{tier.name}</span>
                  <span className="mb-1 text-white/55">
                    {tier.price}
                    {tier.cadence}
                  </span>
                </div>
                <p className="mt-4 text-white/70">{tier.description}</p>
                <div className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-white/80">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-violet-300" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-7">
            {isSubmitted ? (
              <div className="flex min-h-[520px] flex-col justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/30 to-blue-500/30 text-violet-200">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h2 className="mt-8 font-display text-4xl font-black tracking-tight text-white">
                  You are on the Scout interest list.
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-white/70">
                  We have your sport and city interest saved. Scout will use this demand to prioritize launch markets,
                  local communities, and the next sports to support.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href="/how-it-works">See how Scout works</Button>
                  <Button href="/business" variant="secondary">
                    Partner with Scout
                  </Button>
                </div>
              </div>
            ) : (
              <form className="relative space-y-6" onSubmit={handleSubmit}>
                <HoneypotField />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/45">Launch interest</p>
                  <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-white">
                    Tell us where you play.
                  </h2>
                  <p className="mt-3 text-white/70">
                    This helps Scout understand which sports and cities have real player demand before each community
                    opens.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm text-white/70">First name</span>
                    <input
                      name="first_name"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-300/50"
                      placeholder="Alex"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm text-white/70">Email</span>
                    <input
                      name="email"
                      required
                      type="email"
                      className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-300/50"
                      placeholder="you@example.com"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="flex items-center gap-2 text-sm text-white/70">
                      <MapPin className="h-4 w-4 text-blue-300" />
                      City
                    </span>
                    <input
                      name="city"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-300/50"
                      placeholder="Brooklyn"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm text-white/70">Main sport</span>
                    <input
                      name="primary_sport"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-300/50"
                      placeholder="Basketball, tennis, pickleball..."
                    />
                  </label>
                </div>

                <label className="space-y-2">
                  <span className="text-sm text-white/70">What are you looking for?</span>
                  <textarea
                    name="looking_for"
                    className="min-h-32 w-full resize-none rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-300/50"
                    placeholder="Better pickup runs, consistent doubles partners, competitive brackets, post-game spots..."
                  />
                </label>

                {errorMessage ? (
                  <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
                    {errorMessage}
                  </div>
                ) : null}

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/60">
                  <Sparkles className="mb-3 h-5 w-5 text-violet-300" />
                  This is interest capture for Free access and sport availability. Pro and Elite will use separate
                  checkout pages when paid memberships are ready.
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-accent-purple to-accent-blue px-6 py-5 text-base font-semibold text-white shadow-glow transition hover:scale-[1.01] hover:opacity-95"
                >
                  {isSubmitting ? "Saving..." : copy.submitLabel}
                </button>
              </form>
            )}
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}
