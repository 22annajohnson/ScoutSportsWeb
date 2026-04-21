import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";
import { businessCategories } from "@/data/site";

export function BusinessPreviewSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Partnerships"
            title="Built to connect local businesses to active players, not passive audiences."
            description="Scout gives restaurants, clubs, courts, and premium spots a more contextual way to show up inside the sports routines people already care about."
          />

          <div className="grid gap-5">
            {businessCategories.map((category) => (
              <GlassCard key={category.title} className="p-6">
                <h3 className="font-display text-2xl font-semibold text-white">{category.title}</h3>
                <p className="mt-3 max-w-2xl text-base leading-7 text-text-muted">{category.description}</p>
              </GlassCard>
            ))}
            <div className="pt-2">
              <Button href="/business" showArrow>
                Explore partnerships
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
