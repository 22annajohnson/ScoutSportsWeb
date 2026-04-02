import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

type CTASectionProps = {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function CTASection({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CTASectionProps) {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-accent-purple/15 via-white/[0.04] to-accent-blue/15 px-6 py-12 text-center shadow-glow sm:px-10 lg:px-16 lg:py-16">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.32em] text-text-muted">
              Join Scout
            </div>
            <h2 className="mt-6 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {title}
            </h2>
            <p className="mt-5 text-base leading-8 text-text-muted sm:text-lg">{description}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button href={primaryHref} showArrow>
                {primaryLabel}
              </Button>
              {secondaryLabel && secondaryHref ? (
                <Button href={secondaryHref} variant="secondary">
                  {secondaryLabel}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
