import { Route, Routes } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SiteLayout } from "@/components/SiteLayout";
import { BusinessPage } from "@/pages/BusinessPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { HomePage } from "@/pages/HomePage";
import { HowItWorksPage } from "@/pages/HowItWorksPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
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
          <Route path="/checkout/:tierId" element={<CheckoutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/business" element={<BusinessPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
