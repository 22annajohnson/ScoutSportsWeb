export type TierSlug = "free" | "pro" | "elite";

export const routes = {
  home: "/",
  pricing: "/pricing",
  howItWorks: "/how-it-works",
  business: "/business",
  signup: "/signup/:tierId",
  checkout: "/checkout/:tierId",
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
