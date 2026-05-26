import { FormEvent, useState } from "react";
import { MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { FormError, FormField, FormNote, SelectInput, TextareaInput, TextInput } from "@/components/FormControls";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";
import { businessCategories, partnerBenefits } from "@/data/site";
import { getMarketingAttribution } from "@/lib/attribution";
import { getFormText } from "@/lib/formData";
import { isFormSubmitted, isFormSubmitting, type FormStatus } from "@/lib/formStatus";
import { routes } from "@/lib/routes";
import { getSuspiciousSubmissionMessage, HoneypotField } from "@/lib/spamProtection";
import { hasSupabaseConfig, insertPartnerLead } from "@/lib/supabase";
import { CTASection } from "@/sections/CTASection";

export function BusinessPage() {
  const [formStatus, setFormStatus] = useState<FormStatus>("editing");
  const [errorMessage, setErrorMessage] = useState("");
  const [formMountedAt] = useState(() => Date.now());
  const isSubmitting = isFormSubmitting(formStatus);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const suspiciousSubmissionMessage = getSuspiciousSubmissionMessage(event, formMountedAt);

    if (suspiciousSubmissionMessage) {
      setErrorMessage(suspiciousSubmissionMessage);
      return;
    }

    if (!hasSupabaseConfig()) {
      setErrorMessage("Supabase is not configured yet. Add your local env values and reload the page.");
      return;
    }

    setErrorMessage("");
    setFormStatus("submitting");

    const formData = new FormData(event.currentTarget);
    const attribution = getMarketingAttribution();

    try {
      await insertPartnerLead({
        contact_name: getFormText(formData, "contact_name"),
        email: getFormText(formData, "email"),
        organization_name: getFormText(formData, "organization_name"),
        organization_type: getFormText(formData, "organization_type"),
        city: getFormText(formData, "city"),
        partnership_interest: getFormText(formData, "partnership_interest"),
        notes: getFormText(formData, "notes"),
        honeypot_field: getFormText(formData, "company"),
        ...attribution,
      });

      setFormStatus("submitted");
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong while saving your partnership request. Please try again.");
      setFormStatus("editing");
    } finally {
      setFormStatus((current) => (current === "submitting" ? "editing" : current));
    }
  }

  return (
    <>
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="For Businesses and Clubs"
            title="Put your venue, offer, or brand inside the sports moments that already matter locally."
            description="Scout helps restaurants, clubs, courts, trainers, and local sports businesses reach players while they are planning games, joining circles, and deciding where to go next."
            align="center"
          />

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {businessCategories.map((category) => (
              <GlassCard key={category.title} className="p-8">
                <h3 className="font-display text-3xl font-semibold text-white">{category.title}</h3>
                <p className="mt-4 text-base leading-8 text-text-muted">{category.description}</p>
              </GlassCard>
            ))}
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {partnerBenefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <GlassCard key={benefit.title} className="p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-semibold text-white">{benefit.title}</h3>
                  <p className="mt-4 text-base leading-8 text-text-muted">{benefit.description}</p>
                </GlassCard>
              );
            })}
          </div>

          <div className="mt-12 rounded-[32px] border border-white/10 bg-white/[0.03] p-6 text-center text-base leading-8 text-text-muted sm:p-8">
            Partner placements can highlight open courts, featured clubs, post-game offers, tournament weekends,
            member perks, and neighborhood spots that make the local sports scene feel connected.
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <GlassCard className="p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-white/45">Partnership intake</p>
              <h2 className="mt-4 font-display text-4xl font-black leading-[0.95] tracking-tight text-white">
                Tell us about your venue, club, or offer.
              </h2>
              <p className="mt-4 text-base leading-8 text-text-muted">
                We are building Scout’s early local partner network across courts, clubs, restaurants, trainers, and
                other sports-adjacent businesses that want real community visibility.
              </p>

              <div className="mt-8 grid gap-3 text-sm text-white/70 sm:grid-cols-2">
                {[
                  "Sponsored discovery placements",
                  "Local offers and promo drops",
                  "Club and court visibility",
                  "Launch-market partner access",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    {item}
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-8">
              {isFormSubmitted(formStatus) ? (
                <div className="flex min-h-[420px] flex-col justify-center sm:min-h-[560px]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/30 to-blue-500/30 text-violet-200">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h2 className="mt-8 font-display text-4xl font-black tracking-tight text-white">
                    Your partnership request is in.
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-white/70">
                    We saved your business details and interest. As Scout expands launch markets and partner spots, we
                    will reach out with the next steps.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button href={routes.home}>See the consumer site</Button>
                    <Button href={routes.pricing} variant="secondary">
                      Explore memberships
                    </Button>
                  </div>
                </div>
              ) : (
                <form className="relative space-y-6" onSubmit={handleSubmit}>
                  <HoneypotField />

                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/45">Early partner access</p>
                    <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-white">
                      Join the Scout partner list.
                    </h2>
                    <p className="mt-3 text-white/70">
                      Share your business details so we can prioritize the right local partners as Scout rolls out
                      sport-by-sport and city-by-city.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Contact name">
                      <TextInput name="contact_name" required placeholder="Alex Rivera" />
                    </FormField>
                    <FormField label="Email">
                      <TextInput name="email" type="email" required placeholder="alex@yourbusiness.com" />
                    </FormField>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Business or venue">
                      <TextInput name="organization_name" required placeholder="Baseline Social Club" />
                    </FormField>
                    <FormField label="Business type">
                      <SelectInput name="organization_type" required defaultValue="">
                        <option value="" disabled>
                          Select one
                        </option>
                        <option value="restaurant">Restaurant or post-game spot</option>
                        <option value="club">Club or premium facility</option>
                        <option value="court">Court or community venue</option>
                        <option value="trainer">Trainer or coach</option>
                        <option value="brand">Brand or sponsor</option>
                        <option value="other">Other</option>
                      </SelectInput>
                    </FormField>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      label={
                        <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-300" />
                        City
                      </span>
                      }
                    >
                      <TextInput name="city" required placeholder="Brooklyn" />
                    </FormField>
                    <FormField label="Partnership interest">
                      <TextInput name="partnership_interest" placeholder="Sponsored placement, offers, launch partner..." />
                    </FormField>
                  </div>

                  <FormField label="Notes">
                    <TextareaInput
                      name="notes"
                      placeholder="Tell us about your venue, audience, offer, neighborhood, or the kind of players you want to reach."
                    />
                  </FormField>

                  <FormNote>
                    <Sparkles className="mb-3 h-5 w-5 text-violet-300" />
                    This is an early partnership interest form. We are using it to prioritize launch-market venues,
                    clubs, and local business partnerships before broader rollout.
                  </FormNote>

                  {errorMessage ? <FormError>{errorMessage}</FormError> : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-accent-purple to-accent-blue px-6 py-5 text-base font-semibold text-white shadow-glow transition hover:scale-[1.01] hover:opacity-95"
                  >
                    {isSubmitting ? "Saving..." : "Join the partner list"}
                  </button>
                </form>
              )}
            </GlassCard>
          </div>
        </Container>
      </section>

      <CTASection
        title="Reach players when they are planning the next game."
        description="Scout puts your business near the moments that drive real local activity: match discovery, court decisions, bracket play, and post-game plans."
        primaryLabel="Join Early Access"
        primaryHref={routes.pricing}
        secondaryLabel="See Home"
        secondaryHref={routes.home}
      />
    </>
  );
}
