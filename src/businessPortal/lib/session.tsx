import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import {
  acceptBusinessInvitation,
  createBusinessInvitation,
  createBusinessWorkspace,
  fetchActiveBusinessMemberships,
  fetchBusinessWorkspace,
  getPreferredUserLabel,
  getSupabaseSession,
  hasSupabaseConfig,
  onSupabaseAuthStateChange,
  signOutSupabase,
  updateBusinessInvitation,
  updateBusinessMembership,
  updateBusinessWorkspace,
  upsertBusinessBillingProfile,
  type BusinessAuditLogRecord,
  type BusinessBillingProfileRecord,
  type BusinessInvoiceRecord,
  type BusinessInvitationRecord,
  type BusinessMembershipRecord,
  type BusinessRecord,
} from "@/lib/supabase";
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

type WorkspaceIdentity = typeof businessPortalOwner & {
  workspaceName: string;
  workspaceSlug: string;
  workspaceInitials: string;
};

type BusinessPortalSessionContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  isSupabaseMode: boolean;
  needsBusinessSetup: boolean;
  isProvisioningBusiness: boolean;
  isAcceptingInvitation: boolean;
  backendError: string;
  user: WorkspaceIdentity | null;
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
  signOut: () => Promise<void>;
  createWorkspace: (input: BusinessPortalProfileDraft) => Promise<void>;
  acceptInvitationToken: (inviteToken: string) => Promise<void>;
};

const BusinessPortalSessionContext = createContext<BusinessPortalSessionContextValue | null>(null);

function getInitials(value: string) {
  const words = value.trim().split(/\s+/).filter(Boolean);

  return (
    words
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? "")
      .join("") || "SC"
  );
}

function titleCaseRole(role: BusinessMembershipRecord["role"]): BusinessTeamMemberRole {
  switch (role) {
    case "owner":
      return "Owner";
    case "manager":
      return "Manager";
    case "analyst":
      return "Analyst";
    case "billing_admin":
      return "Billing Admin";
  }
}

function titleCaseStatus(status: BusinessMembershipRecord["status"]): BusinessTeamMemberStatus {
  switch (status) {
    case "active":
      return "Active";
    case "invited":
      return "Invited";
    case "paused":
      return "Paused";
  }
}

function dbRole(role: BusinessTeamMemberRole): BusinessMembershipRecord["role"] {
  switch (role) {
    case "Owner":
      return "owner";
    case "Manager":
      return "manager";
    case "Analyst":
      return "analyst";
    case "Billing Admin":
      return "billing_admin";
  }
}

function getWorkspaceIdentity(profile: BusinessPortalProfileDraft, userLabel?: string, userEmail?: string): WorkspaceIdentity {
  const fullName = userLabel?.trim() || businessPortalOwner.fullName;
  const firstName = fullName.split(/\s+/)[0] || fullName;

  return {
    firstName,
    fullName,
    email: userEmail || businessPortalOwner.email,
    avatarInitials: getInitials(fullName),
    memberSince: "Workspace created this session",
    workspaceName: profile.displayName,
    workspaceSlug: profile.slug,
    workspaceInitials: getInitials(profile.displayName),
  };
}

function deriveBusinessDraft(record: BusinessRecord): BusinessPortalProfileDraft {
  return {
    displayName: record.display_name,
    legalName: record.legal_name ?? "",
    slug: record.slug,
    category: record.category ?? "",
    supportEmail: record.support_email ?? "",
    phone: record.phone ?? "",
    website: record.website ?? "",
    description: record.description ?? "",
    locations: record.locations ?? [],
  };
}

function formatCurrencyFromCents(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatShortDate(dateString: string | null) {
  if (!dateString) {
    return "No renewal date set";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

function mapBillingProfile(record: BusinessBillingProfileRecord | null, fallbackEmail: string): BusinessPortalBillingSettings {
  if (!record) {
    return {
      ...businessPortalBillingSeed,
      billingContactEmail: fallbackEmail,
      paymentMethod: "",
      monthlyBudgetLabel: "$0 monthly ad budget",
      spendCapLabel: "$0 account spend cap",
      renewalLabel: "No renewal date set",
      taxIdStatus: "No tax record on file",
    };
  }

  return {
    planName: record.plan_name.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
    planStatus: record.plan_status === "trialing" ? "Trialing" : "Active",
    renewalLabel:
      record.renewal_at === null ? "No renewal date set" : `Renews ${formatShortDate(record.renewal_at)}`,
    monthlyBudgetLabel: `${formatCurrencyFromCents(record.monthly_budget_cents)} monthly ad budget`,
    spendCapLabel: `${formatCurrencyFromCents(record.spend_cap_cents)} account spend cap`,
    paymentMethod: record.payment_method_label ?? "",
    billingContactEmail: record.billing_contact_email ?? fallbackEmail,
    billingAddress: record.billing_address ?? "",
    taxIdStatus: record.tax_id_status ?? "No tax record on file",
  };
}

function mapMemberships(memberships: BusinessMembershipRecord[], currentUser: User | null) {
  return memberships.map((member) => {
    const isCurrentUser = currentUser?.id === member.user_id;
    const fallbackName = isCurrentUser ? getPreferredUserLabel(currentUser) : member.display_name?.trim() || "Team member";
    const fallbackEmail = isCurrentUser ? currentUser.email ?? businessPortalOwner.email : "";

    return {
      id: member.id,
      name: member.display_name?.trim() || fallbackName,
      email: fallbackEmail || businessPortalOwner.email,
      role: titleCaseRole(member.role),
      status: titleCaseStatus(member.status),
      lastActive: isCurrentUser ? "Signed in recently" : "Active in workspace",
      source: "membership",
    } satisfies BusinessPortalWorkspaceMember;
  });
}

function mapInvitations(invitations: BusinessInvitationRecord[]) {
  return invitations.map((invite) => ({
    id: invite.id,
    name: invite.invited_name?.trim() || "Open invitation",
    email: invite.email,
    role: titleCaseRole(invite.role),
    status: invite.status === "revoked" ? ("Paused" as const) : ("Invited" as const),
    lastActive:
      invite.status === "expired"
        ? "Invite expired"
        : invite.status === "revoked"
          ? "Invite revoked"
          : "Invite pending",
    source: "invitation" as const,
  }));
}

function mapInvoices(invoices: BusinessInvoiceRecord[]) {
  return invoices.map((invoice) => ({
    id: invoice.external_invoice_id || invoice.id,
    dateLabel: formatShortDate(invoice.invoiced_at),
    amountLabel: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(invoice.amount_cents / 100),
    status:
      invoice.status === "action_required"
        ? "Action required"
        : invoice.status === "pending"
          ? "Pending"
          : "Paid",
    description: invoice.description,
  })) as typeof businessPortalInvoicesSeed;
}

function mapActivity(logs: BusinessAuditLogRecord[], currentUser: User | null) {
  return logs.map((log) => ({
    id: log.id,
    title: log.action.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
    actor: log.actor_user_id === currentUser?.id ? getPreferredUserLabel(currentUser) : "Workspace member",
    dateLabel: formatShortDate(log.created_at),
    detail: log.detail ?? `${log.entity_type} was updated.`,
    type:
      log.entity_type === "billing"
        ? "billing"
        : log.entity_type === "membership"
          ? "team"
          : log.entity_type === "verification"
            ? "verification"
            : "profile",
  })) satisfies BusinessPortalActivityItem[];
}

function parseBudgetLabel(value: string) {
  const numeric = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? Math.round(numeric * 100) : 0;
}

export function BusinessPortalSessionProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSupabaseMode, setIsSupabaseMode] = useState(false);
  const [needsBusinessSetup, setNeedsBusinessSetup] = useState(false);
  const [isProvisioningBusiness, setIsProvisioningBusiness] = useState(false);
  const [isAcceptingInvitation, setIsAcceptingInvitation] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessDraft, setBusinessDraft] = useState<BusinessPortalProfileDraft>(businessPortalProfileDraftSeed);
  const [billingState, setBillingState] = useState<BusinessPortalBillingSettings>(businessPortalBillingSeed);
  const [teamState, setTeamState] = useState<BusinessPortalWorkspaceMember[]>(businessPortalTeamSeed);
  const [invoiceState, setInvoiceState] = useState<typeof businessPortalInvoicesSeed>(businessPortalInvoicesSeed);
  const [activityState, setActivityState] = useState<BusinessPortalActivityItem[]>(businessPortalActivitySeed);

  async function refreshWorkspace(user: User, targetBusinessId?: string) {
    const memberships = await fetchActiveBusinessMemberships(user.id);

    if (memberships.length === 0) {
      setNeedsBusinessSetup(true);
      setBusinessId(null);
      setBusinessDraft({
        ...businessPortalProfileDraftSeed,
        supportEmail: user.email ?? businessPortalProfileDraftSeed.supportEmail,
      });
      setBillingState({
        ...businessPortalBillingSeed,
        billingContactEmail: user.email ?? businessPortalBillingSeed.billingContactEmail,
      });
      setTeamState([]);
      setInvoiceState([]);
      setActivityState([]);
      return;
    }

    const membership =
      (targetBusinessId ? memberships.find((item) => item.business_id === targetBusinessId) : null) ?? memberships[0];
    const workspace = await fetchBusinessWorkspace(membership.business_id);
    const nextDraft = deriveBusinessDraft(workspace.business);

    setNeedsBusinessSetup(false);
    setBusinessId(workspace.business.id);
    setBusinessDraft(nextDraft);
    setBillingState(mapBillingProfile(workspace.billing, user.email ?? nextDraft.supportEmail));
    setTeamState([...mapInvitations(workspace.invitations), ...mapMemberships(workspace.team, user)]);
    setInvoiceState(mapInvoices(workspace.invoices));
    setActivityState(mapActivity(workspace.activity, user));
  }

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

    if (!hasSupabaseConfig()) {
      setIsAuthenticated(storedValue === "active");
      setIsReady(true);
      return;
    }

    let isMounted = true;

    async function bootstrap() {
      try {
        const session = await getSupabaseSession();
        if (!isMounted) {
          return;
        }

        setSupabaseUser(session?.user ?? null);
        setIsAuthenticated(Boolean(session?.user));
        setIsSupabaseMode(Boolean(session?.user));

        if (session?.user) {
          await refreshWorkspace(session.user);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setBackendError(error instanceof Error ? error.message : "Unable to load your business workspace.");
        }
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    void bootstrap();

    const authSubscription = onSupabaseAuthStateChange((session) => {
      setSupabaseUser(session?.user ?? null);
      setIsAuthenticated(Boolean(session?.user));
      setIsSupabaseMode(Boolean(session?.user));
      setBackendError("");

      if (!session?.user) {
        setNeedsBusinessSetup(false);
        setBusinessId(null);
        setIsReady(true);
        return;
      }

      void refreshWorkspace(session.user).finally(() => setIsReady(true));
    });

    return () => {
      isMounted = false;
      authSubscription.data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<BusinessPortalSessionContextValue>(
    () => ({
      isReady,
      isAuthenticated,
      isSupabaseMode,
      needsBusinessSetup,
      isProvisioningBusiness,
      isAcceptingInvitation,
      backendError,
      user: isAuthenticated
        ? getWorkspaceIdentity(
            businessDraft,
            supabaseUser ? getPreferredUserLabel(supabaseUser) : undefined,
            supabaseUser?.email,
          )
        : null,
      business: isAuthenticated ? getBusinessPortalSnapshot(businessDraft) : null,
      billing: isAuthenticated ? billingState : null,
      team: isAuthenticated ? teamState : [],
      invoices: isAuthenticated ? invoiceState : [],
      activity: isAuthenticated ? activityState : [],
      saveBusinessProfile: async (nextProfile) => {
        if (isSupabaseMode && businessId) {
          const updatedBusiness = await updateBusinessWorkspace(businessId, nextProfile);
          setBusinessDraft(deriveBusinessDraft(updatedBusiness));
          return;
        }

        setBusinessDraft(nextProfile);
        window.localStorage.setItem(BUSINESS_STORAGE_KEY, JSON.stringify(nextProfile));
      },
      resetBusinessProfile: () => {
        if (isSupabaseMode) {
          return;
        }

        setBusinessDraft(businessPortalProfileDraftSeed);
        window.localStorage.removeItem(BUSINESS_STORAGE_KEY);
      },
      saveBillingSettings: async (nextBilling) => {
        if (isSupabaseMode && businessId) {
          const updatedBilling = await upsertBusinessBillingProfile({
            businessId,
            planName: nextBilling.planName.toLowerCase(),
            planStatus: nextBilling.planStatus === "Trialing" ? "trialing" : "active",
            renewalAt: null,
            monthlyBudgetCents: parseBudgetLabel(nextBilling.monthlyBudgetLabel),
            spendCapCents: parseBudgetLabel(nextBilling.spendCapLabel),
            paymentMethodLabel: nextBilling.paymentMethod,
            billingContactEmail: nextBilling.billingContactEmail,
            billingAddress: nextBilling.billingAddress,
            taxIdStatus: nextBilling.taxIdStatus,
          });
          setBillingState(mapBillingProfile(updatedBilling, nextBilling.billingContactEmail));
          return;
        }

        setBillingState(nextBilling);
        window.localStorage.setItem(BILLING_STORAGE_KEY, JSON.stringify(nextBilling));
      },
      inviteTeamMember: async ({ name, email, role }) => {
        if (isSupabaseMode && businessId && supabaseUser) {
          await createBusinessInvitation({
            businessId,
            invitedName: name.trim(),
            email: email.trim().toLowerCase(),
            role: dbRole(role),
            invitedBy: supabaseUser.id,
          });
          await refreshWorkspace(supabaseUser, businessId);
          return;
        }

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
        if (isSupabaseMode && businessId && supabaseUser) {
          const currentMember = teamState.find((member) => member.id === memberId);

          if (currentMember?.source === "invitation") {
            await updateBusinessInvitation({
              invitationId: memberId,
              businessId,
              role: dbRole(role),
            });
          } else {
            await updateBusinessMembership({
              membershipId: memberId,
              businessId,
              role: dbRole(role),
            });
          }

          await refreshWorkspace(supabaseUser, businessId);
          return;
        }

        setTeamState((current) => {
          const next = current.map((member) => (member.id === memberId ? { ...member, role } : member));
          if (!isSupabaseMode) {
            window.localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(next));
          }
          return next;
        });
      },
      toggleTeamMemberStatus: async (memberId) => {
        const currentMember = teamState.find((member) => member.id === memberId);
        if (!currentMember || currentMember.role === "Owner") {
          return;
        }

        const nextStatus: BusinessTeamMemberStatus = currentMember.status === "Paused" ? "Active" : "Paused";

        if (isSupabaseMode && businessId && supabaseUser) {
          if (currentMember.source === "invitation") {
            await updateBusinessInvitation({
              invitationId: memberId,
              businessId,
              status: nextStatus === "Paused" ? "revoked" : "pending",
            });
          } else {
            await updateBusinessMembership({
              membershipId: memberId,
              businessId,
              status: nextStatus === "Active" ? "active" : "paused",
            });
          }

          await refreshWorkspace(supabaseUser, businessId);
          return;
        }

        setTeamState((current) => {
          const next = current.map((member) =>
            member.id === memberId
              ? {
                  ...member,
                  status: nextStatus,
                  lastActive: nextStatus === "Active" ? "Reactivated just now" : "Access paused just now",
                }
              : member,
          );

          if (!isSupabaseMode) {
            window.localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(next));
          }

          return next;
        });
      },
      signInAsDemo: () => {
        window.localStorage.setItem(STORAGE_KEY, "active");
        setIsSupabaseMode(false);
        setIsAuthenticated(true);
        setNeedsBusinessSetup(false);
      },
      signOut: async () => {
        if (isSupabaseMode) {
          await signOutSupabase();
          setSupabaseUser(null);
          setBusinessId(null);
          setNeedsBusinessSetup(false);
          return;
        }

        window.localStorage.removeItem(STORAGE_KEY);
        setIsAuthenticated(false);
      },
      createWorkspace: async (input) => {
        if (!isSupabaseMode) {
          setBusinessDraft(input);
          setIsAuthenticated(true);
          return;
        }

        setIsProvisioningBusiness(true);
        setBackendError("");

        try {
          await createBusinessWorkspace(input);
          if (supabaseUser) {
            await refreshWorkspace(supabaseUser);
          }
        } catch (error) {
          console.error(error);
          setBackendError(error instanceof Error ? error.message : "Unable to create the business workspace.");
          throw error;
        } finally {
          setIsProvisioningBusiness(false);
        }
      },
      acceptInvitationToken: async (inviteToken) => {
        setIsAcceptingInvitation(true);
        setBackendError("");

        try {
          const acceptedBusinessId = await acceptBusinessInvitation(inviteToken);
          setBusinessId(acceptedBusinessId);
          if (supabaseUser) {
            await refreshWorkspace(supabaseUser, acceptedBusinessId);
          }
        } catch (error) {
          console.error(error);
          setBackendError(error instanceof Error ? error.message : "Unable to accept the business invitation.");
          throw error;
        } finally {
          setIsAcceptingInvitation(false);
        }
      },
    }),
    [
      activityState,
      backendError,
      billingState,
      businessDraft,
      businessId,
      invoiceState,
      isAcceptingInvitation,
      isAuthenticated,
      isProvisioningBusiness,
      isReady,
      isSupabaseMode,
      needsBusinessSetup,
      supabaseUser,
      teamState,
    ],
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
