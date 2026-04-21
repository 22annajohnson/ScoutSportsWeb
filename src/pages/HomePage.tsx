import { AppPreviewSection } from "@/sections/AppPreviewSection";
import { BusinessPreviewSection } from "@/sections/BusinessPreviewSection";
import { CTASection } from "@/sections/CTASection";
import { FeatureGridSection } from "@/sections/FeatureGridSection";
import { HeroSection } from "@/sections/HeroSection";
import { HowItWorksPreviewSection } from "@/sections/HowItWorksPreviewSection";
import { PricingPreviewSection } from "@/sections/PricingPreviewSection";
import { SocialProofSection } from "@/sections/SocialProofSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <AppPreviewSection />
      <HowItWorksPreviewSection />
      <FeatureGridSection />
      <SocialProofSection />
      <PricingPreviewSection />
      <BusinessPreviewSection />
      <CTASection
        title="Scout is where local sports starts feeling premium."
        description="Join early to be first into new circles, better brackets, and the city-level sports network built around real play."
        primaryLabel="See Pricing"
        primaryHref="/pricing"
        secondaryLabel="How Scout Works"
        secondaryHref="/how-it-works"
      />
    </>
  );
}
