export type TierSlug = "free" | "pro" | "elite";

export const routes = {
  home: "/",
  pricing: "/pricing",
  howItWorks: "/how-it-works",
  business: "/business",
  signup: "/signup/:tierId",
  checkout: "/checkout/:tierId",
  portal: "/portal",
  portalMembership: "/portal/membership",
  portalProfile: "/portal/profile",
  portalStats: "/portal/stats",
  portalHistory: "/portal/history",
  businessPortal: "/business-portal",
  businessPortalContent: "/business-portal/content",
  businessPortalProfile: "/business-portal/profile",
  businessPortalTeam: "/business-portal/team",
  businessPortalBilling: "/business-portal/billing",
  businessPortalActivity: "/business-portal/activity",
} as const;

export function getSignupPath(tierId: TierSlug) {
  return `/signup/${tierId}`;
}

export function getCheckoutPath(tierId: Exclude<TierSlug, "free">) {
  return `/checkout/${tierId}`;
}

export function getTierInterestPath(tierId: TierSlug) {
  if (tierId === "free") {
    return getSignupPath(tierId);
  }

  return getCheckoutPath(tierId);
}
