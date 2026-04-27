import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  getPortalBusinessSnapshot,
  portalActivitySeed,
  portalBillingSeed,
  portalBusinessOwner,
  portalBusinessProfileDraftSeed,
  portalInvoicesSeed,
  portalTeamSeed,
  type PortalActivityItem,
  type PortalBillingSettings,
  type PortalBusinessProfileDraft,
  type PortalWorkspaceMember,
  type TeamMemberRole,
  type TeamMemberStatus,
} from "./mockPortal";

const STORAGE_KEY = "scout.portal.demoSession";
const BUSINESS_STORAGE_KEY = "scout.portal.businessDraft";
const BILLING_STORAGE_KEY = "scout.portal.billing";
const TEAM_STORAGE_KEY = "scout.portal.team";

function getWorkspaceIdentity(profile: PortalBusinessProfileDraft) {
  const words = profile.displayName.trim().split(/\s+/).filter(Boolean);
  const initials = words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("") || "SC";

  return {
    ...portalBusinessOwner,
    workspaceName: profile.displayName,
    workspaceSlug: profile.slug,
    workspaceInitials: initials,
  };
}

type PortalSessionContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  user: ReturnType<typeof getWorkspaceIdentity> | null;
  business: ReturnType<typeof getPortalBusinessSnapshot> | null;
  billing: PortalBillingSettings | null;
  team: PortalWorkspaceMember[];
  invoices: typeof portalInvoicesSeed;
  activity: PortalActivityItem[];
  saveBusinessProfile: (nextProfile: PortalBusinessProfileDraft) => Promise<void>;
  resetBusinessProfile: () => void;
  saveBillingSettings: (nextBilling: PortalBillingSettings) => Promise<void>;
  inviteTeamMember: (input: { name: string; email: string; role: TeamMemberRole }) => Promise<void>;
  updateTeamMemberRole: (memberId: string, role: TeamMemberRole) => Promise<void>;
  toggleTeamMemberStatus: (memberId: string) => Promise<void>;
  signInAsDemo: () => void;
  signOut: () => void;
};

const PortalSessionContext = createContext<PortalSessionContextValue | null>(null);

export function PortalSessionProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [businessDraft, setBusinessDraft] = useState<PortalBusinessProfileDraft>(portalBusinessProfileDraftSeed);
  const [billingState, setBillingState] = useState<PortalBillingSettings>(portalBillingSeed);
  const [teamState, setTeamState] = useState<PortalWorkspaceMember[]>(portalTeamSeed);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    const storedBusiness = window.localStorage.getItem(BUSINESS_STORAGE_KEY);
    const storedBilling = window.localStorage.getItem(BILLING_STORAGE_KEY);
    const storedTeam = window.localStorage.getItem(TEAM_STORAGE_KEY);

    if (storedBusiness) {
      try {
        setBusinessDraft(JSON.parse(storedBusiness) as PortalBusinessProfileDraft);
      } catch (error) {
        console.error("Unable to parse stored business draft", error);
      }
    }

    if (storedBilling) {
      try {
        setBillingState(JSON.parse(storedBilling) as PortalBillingSettings);
      } catch (error) {
        console.error("Unable to parse stored billing settings", error);
      }
    }

    if (storedTeam) {
      try {
        setTeamState(JSON.parse(storedTeam) as PortalWorkspaceMember[]);
      } catch (error) {
        console.error("Unable to parse stored team settings", error);
      }
    }

    setIsAuthenticated(storedValue === "active");
    setIsReady(true);
  }, []);

  const value = useMemo<PortalSessionContextValue>(
    () => ({
      isReady,
      isAuthenticated,
      user: isAuthenticated ? getWorkspaceIdentity(businessDraft) : null,
      business: isAuthenticated ? getPortalBusinessSnapshot(businessDraft) : null,
      billing: isAuthenticated ? billingState : null,
      team: isAuthenticated ? teamState : [],
      invoices: portalInvoicesSeed,
      activity: portalActivitySeed,
      saveBusinessProfile: async (nextProfile) => {
        setBusinessDraft(nextProfile);
        window.localStorage.setItem(BUSINESS_STORAGE_KEY, JSON.stringify(nextProfile));
      },
      resetBusinessProfile: () => {
        setBusinessDraft(portalBusinessProfileDraftSeed);
        window.localStorage.removeItem(BUSINESS_STORAGE_KEY);
      },
      saveBillingSettings: async (nextBilling) => {
        setBillingState(nextBilling);
        window.localStorage.setItem(BILLING_STORAGE_KEY, JSON.stringify(nextBilling));
      },
      inviteTeamMember: async ({ name, email, role }) => {
        setTeamState((current) => {
          const next = [
            {
              id: `team-${Date.now()}`,
              name,
              email,
              role,
              status: "Invited" as const,
              lastActive: "Invite sent just now",
            },
            ...current,
          ];

          window.localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(next));
          return next;
        });
      },
      updateTeamMemberRole: async (memberId, role) => {
        setTeamState((current) => {
          const next = current.map((member) => (member.id === memberId ? { ...member, role } : member));
          window.localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(next));
          return next;
        });
      },
      toggleTeamMemberStatus: async (memberId) => {
        setTeamState((current) => {
          const next = current.map((member) => {
            if (member.id !== memberId || member.role === "Owner") {
              return member;
            }

            const nextStatus: TeamMemberStatus = member.status === "Paused" ? "Active" : "Paused";

            return {
              ...member,
              status: nextStatus,
              lastActive: nextStatus === "Active" ? "Reactivated just now" : "Access paused just now",
            };
          });

          window.localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(next));
          return next;
        });
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
    [billingState, businessDraft, isAuthenticated, isReady, teamState],
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
