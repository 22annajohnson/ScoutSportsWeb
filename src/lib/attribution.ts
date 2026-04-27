export type MarketingAttribution = {
  landing_path: string;
  submitted_path: string;
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
};

const ATTRIBUTION_STORAGE_KEY = "scout_marketing_attribution";

type StoredMarketingAttribution = Omit<MarketingAttribution, "submitted_path">;

function readStoredAttribution(): StoredMarketingAttribution | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as StoredMarketingAttribution;
  } catch {
    window.sessionStorage.removeItem(ATTRIBUTION_STORAGE_KEY);
    return null;
  }
}

function writeStoredAttribution(attribution: StoredMarketingAttribution) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
}

export function rememberMarketingAttribution() {
  if (typeof window === "undefined") {
    return;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const storedAttribution = readStoredAttribution();

  const nextAttribution: StoredMarketingAttribution = {
    landing_path: storedAttribution?.landing_path ?? window.location.pathname,
    referrer: storedAttribution?.referrer ?? document.referrer,
    utm_source: storedAttribution?.utm_source || searchParams.get("utm_source") || "",
    utm_medium: storedAttribution?.utm_medium || searchParams.get("utm_medium") || "",
    utm_campaign: storedAttribution?.utm_campaign || searchParams.get("utm_campaign") || "",
    utm_content: storedAttribution?.utm_content || searchParams.get("utm_content") || "",
    utm_term: storedAttribution?.utm_term || searchParams.get("utm_term") || "",
  };

  writeStoredAttribution(nextAttribution);
}

export function getMarketingAttribution(): MarketingAttribution {
  rememberMarketingAttribution();
  const storedAttribution = readStoredAttribution();

  return {
    landing_path: storedAttribution?.landing_path ?? window.location.pathname,
    submitted_path: window.location.pathname,
    referrer: storedAttribution?.referrer ?? document.referrer,
    utm_source: storedAttribution?.utm_source ?? "",
    utm_medium: storedAttribution?.utm_medium ?? "",
    utm_campaign: storedAttribution?.utm_campaign ?? "",
    utm_content: storedAttribution?.utm_content ?? "",
    utm_term: storedAttribution?.utm_term ?? "",
  };
}
