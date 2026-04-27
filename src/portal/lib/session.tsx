import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getPortalProfileSnapshot, portalPlayer, portalProfileDraftSeed, type PortalProfileDraft } from "./mockPortal";

const STORAGE_KEY = "scout.portal.demoSession";
const PROFILE_STORAGE_KEY = "scout.portal.profileDraft";

function getPlayerFromProfile(profile: PortalProfileDraft) {
  const nameParts = profile.fullName.trim().split(/\s+/).filter(Boolean);
  const initials = nameParts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "SC";

  return {
    ...portalPlayer,
    firstName: nameParts[0] ?? portalPlayer.firstName,
    fullName: profile.fullName,
    location: profile.city,
    headline: profile.bio,
    avatarInitials: initials,
  };
}

type PortalSessionContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  player: ReturnType<typeof getPlayerFromProfile> | null;
  profile: ReturnType<typeof getPortalProfileSnapshot> | null;
  saveProfile: (nextProfile: PortalProfileDraft) => Promise<void>;
  resetProfile: () => void;
  signInAsDemo: () => void;
  signOut: () => void;
};

const PortalSessionContext = createContext<PortalSessionContextValue | null>(null);

export function PortalSessionProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileDraft, setProfileDraft] = useState<PortalProfileDraft>(portalProfileDraftSeed);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    const storedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);

    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile) as PortalProfileDraft;
        setProfileDraft(parsed);
      } catch (error) {
        console.error("Unable to parse stored portal profile draft", error);
      }
    }

    setIsAuthenticated(storedValue === "active");
    setIsReady(true);
  }, []);

  const value = useMemo<PortalSessionContextValue>(
    () => ({
      isReady,
      isAuthenticated,
      player: isAuthenticated ? getPlayerFromProfile(profileDraft) : null,
      profile: isAuthenticated ? getPortalProfileSnapshot(profileDraft) : null,
      saveProfile: async (nextProfile) => {
        setProfileDraft(nextProfile);
        window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
      },
      resetProfile: () => {
        setProfileDraft(portalProfileDraftSeed);
        window.localStorage.removeItem(PROFILE_STORAGE_KEY);
      },
      signInAsDemo: () => {
        window.localStorage.setItem(STORAGE_KEY, "active");
        setIsAuthenticated(true);
      },
      signOut: () => {
        window.localStorage.removeItem(STORAGE_KEY);
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated, isReady, profileDraft],
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
