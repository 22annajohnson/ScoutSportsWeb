import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { portalPlayer } from "./mockPortal";

const STORAGE_KEY = "scout.portal.demoSession";

type PortalSessionContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  player: typeof portalPlayer | null;
  signInAsDemo: () => void;
  signOut: () => void;
};

const PortalSessionContext = createContext<PortalSessionContextValue | null>(null);

export function PortalSessionProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    setIsAuthenticated(storedValue === "active");
    setIsReady(true);
  }, []);

  const value = useMemo<PortalSessionContextValue>(
    () => ({
      isReady,
      isAuthenticated,
      player: isAuthenticated ? portalPlayer : null,
      signInAsDemo: () => {
        window.localStorage.setItem(STORAGE_KEY, "active");
        setIsAuthenticated(true);
      },
      signOut: () => {
        window.localStorage.removeItem(STORAGE_KEY);
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated, isReady],
  );

  return <PortalSessionContext.Provider value={value}>{children}</PortalSessionContext.Provider>;
}

export function usePortalSession() {
  const context = useContext(PortalSessionContext);

  if (!context) {
    throw new Error("usePortalSession must be used within PortalSessionProvider");
  }

  return context;
}
