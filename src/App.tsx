import { Route, Routes } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SiteLayout } from "@/components/SiteLayout";
import { routes } from "@/lib/routes";
import { BusinessPage } from "@/pages/BusinessPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
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
          <Route path={routes.pricing} element={<PricingPage />} />
          <Route path={routes.signup} element={<SignupPage />} />
          <Route path={routes.checkout} element={<CheckoutPage />} />
          <Route path={routes.howItWorks} element={<HowItWorksPage />} />
          <Route path={routes.business} element={<BusinessPage />} />
        </Route>
      </Routes>
    </>
  );
}
