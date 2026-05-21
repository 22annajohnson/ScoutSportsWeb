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
import { PortalSettingsPage } from "@/portal/pages/PortalSettingsPage";
import { PortalStatsPage } from "@/portal/pages/PortalStatsPage";
import { PortalSessionProvider } from "@/portal/lib/session";
import { BusinessPortalAccessGate } from "@/businessPortal/components/BusinessPortalAccessGate";
import { BusinessPortalLayout } from "@/businessPortal/components/BusinessPortalLayout";
import { BusinessPortalActivityPage } from "@/businessPortal/pages/BusinessPortalActivityPage";
import { BusinessPortalBillingPage } from "@/businessPortal/pages/BusinessPortalBillingPage";
import { BusinessPortalContentPage } from "@/businessPortal/pages/BusinessPortalContentPage";
import { BusinessPortalOverviewPage } from "@/businessPortal/pages/BusinessPortalOverviewPage";
import { BusinessPortalProfilePage } from "@/businessPortal/pages/BusinessPortalProfilePage";
import { BusinessPortalTeamPage } from "@/businessPortal/pages/BusinessPortalTeamPage";
import { BusinessPortalSessionProvider } from "@/businessPortal/lib/session";

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
            <Route path="membership" element={<PortalMembershipPage />} />
            <Route path="profile" element={<PortalProfilePage />} />
            <Route path="stats" element={<PortalStatsPage />} />
            <Route path="history" element={<PortalHistoryPage />} />
            <Route path="settings" element={<PortalSettingsPage />} />
          </Route>
        </Route>
        <Route
          path={routes.businessPortal}
          element={
            <BusinessPortalSessionProvider>
              <BusinessPortalAccessGate />
            </BusinessPortalSessionProvider>
          }
        >
          <Route element={<BusinessPortalLayout />}>
            <Route index element={<BusinessPortalOverviewPage />} />
            <Route path="content" element={<BusinessPortalContentPage />} />
            <Route path="profile" element={<BusinessPortalProfilePage />} />
            <Route path="team" element={<BusinessPortalTeamPage />} />
            <Route path="billing" element={<BusinessPortalBillingPage />} />
            <Route path="activity" element={<BusinessPortalActivityPage />} />
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
