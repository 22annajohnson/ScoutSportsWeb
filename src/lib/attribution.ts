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

export function getMarketingAttribution(): MarketingAttribution {
  const searchParams = new URLSearchParams(window.location.search);

  return {
    landing_path: window.location.pathname,
    submitted_path: window.location.pathname,
    referrer: document.referrer,
    utm_source: searchParams.get("utm_source") ?? "",
    utm_medium: searchParams.get("utm_medium") ?? "",
    utm_campaign: searchParams.get("utm_campaign") ?? "",
    utm_content: searchParams.get("utm_content") ?? "",
    utm_term: searchParams.get("utm_term") ?? "",
  };
}
