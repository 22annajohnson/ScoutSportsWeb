import { AppPreviewSection } from "@/sections/AppPreviewSection";
import { BusinessPreviewSection } from "@/sections/BusinessPreviewSection";
import { CTASection } from "@/sections/CTASection";
import { FeatureGridSection } from "@/sections/FeatureGridSection";
import { HeroSection } from "@/sections/HeroSection";
import { PricingPreviewSection } from "@/sections/PricingPreviewSection";
import { routes } from "@/lib/routes";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureGridSection />
      <AppPreviewSection />
      <PricingPreviewSection />
      <BusinessPreviewSection />
      <CTASection
        title="Your next favorite teammate is probably nearby."
        description="Join Scout early to meet better matches, form tighter circles, compete in flexible brackets, and discover the local sports spots your city runs on."
        primaryLabel="Get Early Access"
        primaryHref={routes.pricing}
        secondaryLabel="How Scout Works"
        secondaryHref={routes.howItWorks}
      />
    </>
  );
}
