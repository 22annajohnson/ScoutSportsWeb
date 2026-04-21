import { Route, Routes } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SiteLayout } from "@/components/SiteLayout";
import { BusinessPage } from "@/pages/BusinessPage";
import { HomePage } from "@/pages/HomePage";
import { HowItWorksPage } from "@/pages/HowItWorksPage";
import { PricingPage } from "@/pages/PricingPage";
import { SignupPage } from "@/pages/SignupPage";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/signup/:tierId" element={<SignupPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/business" element={<BusinessPage />} />
        </Route>
      </Routes>
    </>
  );
}
