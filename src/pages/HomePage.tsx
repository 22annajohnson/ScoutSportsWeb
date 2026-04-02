import { AppPreviewSection } from "@/sections/AppPreviewSection";
import { BusinessPreviewSection } from "@/sections/BusinessPreviewSection";
import { CTASection } from "@/sections/CTASection";
import { FeatureGridSection } from "@/sections/FeatureGridSection";
import { HeroSection } from "@/sections/HeroSection";
import { PricingPreviewSection } from "@/sections/PricingPreviewSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureGridSection />
      <AppPreviewSection />
      <PricingPreviewSection />
      <BusinessPreviewSection />
      <CTASection
        title="Scout is where local sports starts feeling premium."
        description="Join early to be first into new circles, sharper brackets, and the city-level sports network built around real play."
        primaryLabel="Get Early Access"
        primaryHref="/pricing"
        secondaryLabel="How Scout Works"
        secondaryHref="/how-it-works"
      />
    </>
  );
}
