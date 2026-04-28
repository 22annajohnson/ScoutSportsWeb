import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { routes } from "@/lib/routes";
import { fetchPortalProfile, hasSupabaseConfig, supabase, upsertPortalProfile } from "@/lib/supabase";
import { getPortalProfileSnapshot, portalPlayer, portalProfileDraftSeed, type PortalProfileDraft } from "./mockPortal";

const STORAGE_KEY = "scout.portal.demoSession";
const PROFILE_STORAGE_KEY_PREFIX = "scout.portal.profileDraft";

function getProfileStorageKey(identity: string) {
  return `${PROFILE_STORAGE_KEY_PREFIX}.${identity}`;
}

function getPlayerFromProfile(profile: PortalProfileDraft, user: User | null) {
  const nameParts = profile.fullName.trim().split(/\s+/).filter(Boolean);
  const initials = nameParts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "SC";

  return {
    ...portalPlayer,
    email: user?.email ?? portalPlayer.email,
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
  isSupabaseAuthEnabled: boolean;
  isProfileRemote: boolean;
  authUser: User | null;
  player: ReturnType<typeof getPlayerFromProfile> | null;
  profile: ReturnType<typeof getPortalProfileSnapshot> | null;
  saveProfile: (nextProfile: PortalProfileDraft) => Promise<void>;
  resetProfile: () => void;
  signInWithEmail: (email: string) => Promise<void>;
  signInAsDemo: () => void;
  signOut: () => void;
};

const PortalSessionContext = createContext<PortalSessionContextValue | null>(null);

export function PortalSessionProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authSession, setAuthSession] = useState<Session | null>(null);
  const [profileDraft, setProfileDraft] = useState<PortalProfileDraft>(portalProfileDraftSeed);
  const isSupabaseAuthEnabled = hasSupabaseConfig() && Boolean(supabase);
  const isProfileRemote = Boolean(authUser);

  const identityKey = authUser?.id ?? (isAuthenticated ? "demo" : "anonymous");

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!isSupabaseAuthEnabled || !supabase) {
      setIsAuthenticated(storedValue === "active");
      setIsReady(true);
      return;
    }

    const supabaseClient = supabase;

    let isMounted = true;

    async function loadSession() {
      const { data, error } = await supabaseClient.auth.getSession();

      if (error) {
        console.error("Unable to load Supabase portal session", error);
      }

      if (!isMounted) {
        return;
      }

      const session = data.session;
      setAuthSession(session);
      setAuthUser(session?.user ?? null);
      setIsAuthenticated(Boolean(session?.user) || storedValue === "active");
      setIsReady(true);
    }

    const { data: authListener } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setAuthSession(session);
      setAuthUser(session?.user ?? null);
      setIsAuthenticated(Boolean(session?.user) || window.localStorage.getItem(STORAGE_KEY) === "active");
      setIsReady(true);
    });

    void loadSession();

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [isSupabaseAuthEnabled]);

  useEffect(() => {
    if (authUser) {
      const currentAuthUser = authUser;
      let isMounted = true;

      async function loadRemoteProfile() {
        try {
          const record = await fetchPortalProfile(currentAuthUser.id);

          if (!isMounted) {
            return;
          }

          if (!record) {
            setProfileDraft(portalProfileDraftSeed);
            return;
          }

          setProfileDraft({
            fullName: record.full_name,
            username: record.username,
            city: record.city,
            primarySport: record.primary_sport,
            secondarySports: record.secondary_sports ?? [],
            skillLevel: record.skill_level,
            bio: record.bio,
            availability: record.availability,
            vibeTags: record.vibe_tags ?? [],
          });
        } catch (error) {
          console.error("Unable to load remote portal profile", error);

          if (isMounted) {
            setProfileDraft(portalProfileDraftSeed);
          }
        }
      }

      void loadRemoteProfile();

      return () => {
        isMounted = false;
      };
    }

    const storedProfile = window.localStorage.getItem(getProfileStorageKey(identityKey));

    if (!storedProfile) {
      setProfileDraft(portalProfileDraftSeed);
      return;
    }

    try {
      const parsed = JSON.parse(storedProfile) as PortalProfileDraft;
      setProfileDraft(parsed);
    } catch (error) {
      console.error("Unable to parse stored portal profile draft", error);
      setProfileDraft(portalProfileDraftSeed);
    }
  }, [authUser, identityKey]);

  const value = useMemo<PortalSessionContextValue>(
    () => ({
      isReady,
      isAuthenticated,
      isSupabaseAuthEnabled,
      isProfileRemote,
      authUser,
      player: isAuthenticated ? getPlayerFromProfile(profileDraft, authUser) : null,
      profile: isAuthenticated ? getPortalProfileSnapshot(profileDraft) : null,
      saveProfile: async (nextProfile) => {
        setProfileDraft(nextProfile);
        const currentAuthUser = authUser;

        if (currentAuthUser) {
          await upsertPortalProfile({
            user_id: currentAuthUser.id,
            full_name: nextProfile.fullName,
            username: nextProfile.username,
            city: nextProfile.city,
            primary_sport: nextProfile.primarySport,
            secondary_sports: nextProfile.secondarySports,
            skill_level: nextProfile.skillLevel,
            bio: nextProfile.bio,
            availability: nextProfile.availability,
            vibe_tags: nextProfile.vibeTags,
          });
          return;
        }

        window.localStorage.setItem(getProfileStorageKey(identityKey), JSON.stringify(nextProfile));
      },
      resetProfile: () => {
        setProfileDraft(portalProfileDraftSeed);
        window.localStorage.removeItem(getProfileStorageKey(identityKey));
      },
      signInWithEmail: async (email) => {
        if (!supabase) {
          throw new Error("Supabase auth is not configured.");
        }

        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}${routes.portal}`,
          },
        });

        if (error) {
          throw error;
        }
      },
      signInAsDemo: () => {
        window.localStorage.setItem(STORAGE_KEY, "active");
        setIsAuthenticated(true);
      },
      signOut: () => {
        window.localStorage.removeItem(STORAGE_KEY);

        if (authSession && supabase) {
          void supabase.auth.signOut();
        }

        setAuthSession(null);
        setAuthUser(null);
        setIsAuthenticated(false);
      },
    }),
    [authSession, authUser, identityKey, isAuthenticated, isProfileRemote, isReady, isSupabaseAuthEnabled, profileDraft],
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
