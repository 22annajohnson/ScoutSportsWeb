import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  businessPortalActivitySeed,
  businessPortalBillingSeed,
  businessPortalInvoicesSeed,
  businessPortalOwner,
  businessPortalProfileDraftSeed,
  businessPortalTeamSeed,
  getBusinessPortalSnapshot,
  type BusinessPortalActivityItem,
  type BusinessPortalBillingSettings,
  type BusinessPortalProfileDraft,
  type BusinessPortalWorkspaceMember,
  type BusinessTeamMemberRole,
  type BusinessTeamMemberStatus,
} from "./mockBusinessPortal";

const STORAGE_KEY = "scout.businessPortal.demoSession";
const BUSINESS_STORAGE_KEY = "scout.businessPortal.profileDraft";
const BILLING_STORAGE_KEY = "scout.businessPortal.billing";
const TEAM_STORAGE_KEY = "scout.businessPortal.team";

function getWorkspaceIdentity(profile: BusinessPortalProfileDraft) {
  const words = profile.displayName.trim().split(/\s+/).filter(Boolean);
  const initials = words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("") || "SC";

  return {
    ...businessPortalOwner,
    workspaceName: profile.displayName,
    workspaceSlug: profile.slug,
    workspaceInitials: initials,
  };
}

type BusinessPortalSessionContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  user: ReturnType<typeof getWorkspaceIdentity> | null;
  business: ReturnType<typeof getBusinessPortalSnapshot> | null;
  billing: BusinessPortalBillingSettings | null;
  team: BusinessPortalWorkspaceMember[];
  invoices: typeof businessPortalInvoicesSeed;
  activity: BusinessPortalActivityItem[];
  saveBusinessProfile: (nextProfile: BusinessPortalProfileDraft) => Promise<void>;
  resetBusinessProfile: () => void;
  saveBillingSettings: (nextBilling: BusinessPortalBillingSettings) => Promise<void>;
  inviteTeamMember: (input: { name: string; email: string; role: BusinessTeamMemberRole }) => Promise<void>;
  updateTeamMemberRole: (memberId: string, role: BusinessTeamMemberRole) => Promise<void>;
  toggleTeamMemberStatus: (memberId: string) => Promise<void>;
  signInAsDemo: () => void;
  signOut: () => void;
};

const BusinessPortalSessionContext = createContext<BusinessPortalSessionContextValue | null>(null);

export function BusinessPortalSessionProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [businessDraft, setBusinessDraft] = useState<BusinessPortalProfileDraft>(businessPortalProfileDraftSeed);
  const [billingState, setBillingState] = useState<BusinessPortalBillingSettings>(businessPortalBillingSeed);
  const [teamState, setTeamState] = useState<BusinessPortalWorkspaceMember[]>(businessPortalTeamSeed);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    const storedBusiness = window.localStorage.getItem(BUSINESS_STORAGE_KEY);
    const storedBilling = window.localStorage.getItem(BILLING_STORAGE_KEY);
    const storedTeam = window.localStorage.getItem(TEAM_STORAGE_KEY);

    if (storedBusiness) {
      try {
        setBusinessDraft(JSON.parse(storedBusiness) as BusinessPortalProfileDraft);
      } catch (error) {
        console.error("Unable to parse stored business draft", error);
      }
    }

    if (storedBilling) {
      try {
        setBillingState(JSON.parse(storedBilling) as BusinessPortalBillingSettings);
      } catch (error) {
        console.error("Unable to parse stored billing settings", error);
      }
    }

    if (storedTeam) {
      try {
        setTeamState(JSON.parse(storedTeam) as BusinessPortalWorkspaceMember[]);
      } catch (error) {
        console.error("Unable to parse stored team settings", error);
      }
    }

    setIsAuthenticated(storedValue === "active");
    setIsReady(true);
  }, []);

  const value = useMemo<BusinessPortalSessionContextValue>(
    () => ({
      isReady,
      isAuthenticated,
      user: isAuthenticated ? getWorkspaceIdentity(businessDraft) : null,
      business: isAuthenticated ? getBusinessPortalSnapshot(businessDraft) : null,
      billing: isAuthenticated ? billingState : null,
      team: isAuthenticated ? teamState : [],
      invoices: businessPortalInvoicesSeed,
      activity: businessPortalActivitySeed,
      saveBusinessProfile: async (nextProfile) => {
        setBusinessDraft(nextProfile);
        window.localStorage.setItem(BUSINESS_STORAGE_KEY, JSON.stringify(nextProfile));
      },
      resetBusinessProfile: () => {
        setBusinessDraft(businessPortalProfileDraftSeed);
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

            const nextStatus: BusinessTeamMemberStatus = member.status === "Paused" ? "Active" : "Paused";

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

  return <BusinessPortalSessionContext.Provider value={value}>{children}</BusinessPortalSessionContext.Provider>;
}

export function useBusinessPortalSession() {
  const context = useContext(BusinessPortalSessionContext);

  if (!context) {
    throw new Error("useBusinessPortalSession must be used within BusinessPortalSessionProvider");
  }

  return context;
}
