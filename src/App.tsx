import { Route, Routes } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { BusinessPage } from "@/pages/BusinessPage";
import { HomePage } from "@/pages/HomePage";
import { HowItWorksPage } from "@/pages/HowItWorksPage";
import { PricingPage } from "@/pages/PricingPage";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/business" element={<BusinessPage />} />
      </Route>
    </Routes>
  );
}
