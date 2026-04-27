import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { rememberMarketingAttribution } from "@/lib/attribution";

export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    rememberMarketingAttribution();
  }, [pathname, search]);

  return null;
}
