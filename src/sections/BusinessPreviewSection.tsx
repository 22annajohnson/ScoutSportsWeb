import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";
import { businessCategories } from "@/data/site";
import { routes } from "@/lib/routes";

export function BusinessPreviewSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Partnerships"
            title="Reach players while they are choosing where to play and where to go next."
            description="Scout helps local sports businesses show up inside match planning, hotspot discovery, circle activity, and post-game decisions."
          />

          <div className="grid gap-5">
            {businessCategories.map((category) => (
              <GlassCard key={category.title} className="p-6">
                <h3 className="font-display text-2xl font-semibold text-white">{category.title}</h3>
                <p className="mt-3 max-w-2xl text-base leading-7 text-text-muted">{category.description}</p>
              </GlassCard>
            ))}
            <div className="pt-2">
              <Button href={routes.business} showArrow>
                Explore partnerships
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
