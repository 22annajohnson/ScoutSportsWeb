import { Route, Routes } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SiteLayout } from "@/components/SiteLayout";
import { routes } from "@/lib/routes";
import { BusinessPage } from "@/pages/BusinessPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { HomePage } from "@/pages/HomePage";
import { HowItWorksPage } from "@/pages/HowItWorksPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PricingPage } from "@/pages/PricingPage";
import { SignupPage } from "@/pages/SignupPage";
import { PortalAccessGate } from "@/portal/components/PortalAccessGate";
import { PortalLayout } from "@/portal/components/PortalLayout";
import { PortalHistoryPage } from "@/portal/pages/PortalHistoryPage";
import { PortalMembershipPage } from "@/portal/pages/PortalMembershipPage";
import { PortalOverviewPage } from "@/portal/pages/PortalOverviewPage";
import { PortalProfilePage } from "@/portal/pages/PortalProfilePage";
import { PortalStatsPage } from "@/portal/pages/PortalStatsPage";
import { PortalSessionProvider } from "@/portal/lib/session";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path={routes.portal}
          element={
            <PortalSessionProvider>
              <PortalAccessGate />
            </PortalSessionProvider>
          }
        >
          <Route element={<PortalLayout />}>
            <Route index element={<PortalOverviewPage />} />
            <Route path="business" element={<PortalProfilePage />} />
            <Route path="billing" element={<PortalMembershipPage />} />
            <Route path="team" element={<PortalStatsPage />} />
            <Route path="activity" element={<PortalHistoryPage />} />
          </Route>
        </Route>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path={routes.pricing} element={<PricingPage />} />
          <Route path={routes.signup} element={<SignupPage />} />
          <Route path={routes.checkout} element={<CheckoutPage />} />
          <Route path={routes.howItWorks} element={<HowItWorksPage />} />
          <Route path={routes.business} element={<BusinessPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
