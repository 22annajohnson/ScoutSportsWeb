import { FormEvent, useState } from "react";
import { Check, ChevronLeft, CreditCard, MapPin, Sparkles } from "lucide-react";
import { Navigate, useParams } from "react-router-dom";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { pricingTiers } from "@/data/site";

const checkoutCopy = {
  pro: {
    eyebrow: "Pro checkout",
    headline: "Pro checkout is almost ready.",
    note: "Pro will unlock stronger discovery, better filters, priority bracket access, and deeper player context. Reserve interest now and we will notify you when paid memberships open.",
    submitLabel: "Notify me about Pro",
  },
  elite: {
    eyebrow: "Elite checkout",
    headline: "Elite access is being prepared.",
    note: "Elite will be Scout’s highest-visibility membership for exclusive circles, premium discovery, tournament perks, and local rewards. Reserve interest before checkout goes live.",
    submitLabel: "Notify me about Elite",
  },
};

export function CheckoutPage() {
  const { tierId } = useParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const tier = pricingTiers.find((plan) => plan.slug === tierId);

  if (!tier || tierId !== "pro" && tierId !== "elite") {
    return <Navigate to="/pricing" replace />;
  }

  const copy = checkoutCopy[tierId];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
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
            <div className="inline-flex rounded-full border border-blue-300/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">
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
                <p className="text-sm uppercase tracking-[0.3em] text-white/45">Checkout preview</p>
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
                  You are on the {tier.name} checkout list.
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-white/70">
                  We will notify you when {tier.name} checkout opens. No payment was collected, and this does not
                  create an active subscription yet.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href="/signup/free">Join Free interest</Button>
                  <Button href="/how-it-works" variant="secondary">
                    See how Scout works
                  </Button>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/45">Checkout not live</p>
                  <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-white">
                    Reserve paid-tier interest.
                  </h2>
                  <p className="mt-3 text-white/70">
                    Scout will open paid checkout later. For now, this records demand for {tier.name} and helps us
                    prioritize who to notify first.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm text-white/70">First name</span>
                    <input
                      required
                      className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-300/50"
                      placeholder="Alex"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm text-white/70">Email</span>
                    <input
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
                      className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-300/50"
                      placeholder="Brooklyn"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm text-white/70">Main sport</span>
                    <input
                      className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-300/50"
                      placeholder="Basketball, tennis, pickleball..."
                    />
                  </label>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/60">
                  <CreditCard className="mb-3 h-5 w-5 text-violet-300" />
                  No payment is collected on this page. This is a checkout-intent reservation until paid
                  memberships are ready to launch.
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-accent-purple to-accent-blue px-6 py-5 text-base font-semibold text-white shadow-glow transition hover:scale-[1.01] hover:opacity-95"
                >
                  {copy.submitLabel}
                </button>
              </form>
            )}
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}
