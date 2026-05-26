import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import {
  acceptBusinessInvitation,
  appendBusinessAuditLog,
  createBusinessContentPost,
  createBusinessInvitation,
  createBusinessWorkspace,
  fetchActiveBusinessMemberships,
  fetchBusinessContentPosts,
  fetchBusinessWorkspace,
  getAppOrigin,
  getPreferredUserLabel,
  getSupabaseSession,
  hasSupabaseConfig,
  onSupabaseAuthStateChange,
  sendBusinessInvitationEmail,
  signOutSupabase,
  updateBusinessContentPost,
  updateBusinessInvitation,
  updateBusinessMembership,
  updateBusinessWorkspace,
  upsertBusinessBillingProfile,
  type BusinessAuditLogRecord,
  type BusinessBillingProfileRecord,
  type BusinessMediaAssetRecord,
  type BusinessContentPostRecord,
  type BusinessInvoiceRecord,
  type BusinessInvitationRecord,
  type BusinessMembershipRecord,
  type BusinessRecord,
} from "@/lib/supabase";
import {
  businessPortalActivitySeed,
  businessPortalBillingSeed,
  businessPortalContentSeed,
  businessPortalInvoicesSeed,
  businessPortalOwner,
  businessPortalProfileDraftSeed,
  businessPortalTeamSeed,
  getBusinessPortalSnapshot,
  type BusinessPortalActivityItem,
  type BusinessPortalBillingSettings,
  type BusinessPortalMediaAsset,
  type BusinessPortalContentItem,
  type BusinessContentMediaKind,
  type BusinessContentStatus,
  type BusinessContentType,
  type BusinessPortalProfileDraft,
  type BusinessPortalWorkspaceMember,
  type BusinessTeamMemberRole,
  type BusinessTeamMemberStatus,
} from "./mockBusinessPortal";

const STORAGE_KEY = "scout.businessPortal.demoSession";
const BUSINESS_STORAGE_KEY = "scout.businessPortal.profileDraft";
const BILLING_STORAGE_KEY = "scout.businessPortal.billing";
const CONTENT_STORAGE_KEY = "scout.businessPortal.content";
const TEAM_STORAGE_KEY = "scout.businessPortal.team";

type BusinessPortalAuthState =
  | { status: "checking"; user: null }
  | { status: "signed_out"; user: null }
  | { status: "demo"; user: null }
  | { status: "authenticated"; user: User };
type BusinessPortalOperation = "idle" | "provisioning_workspace" | "accepting_invitation";
type BusinessPortalWorkspaceState =
  | { status: "unknown"; businessId: null; role: null }
  | { status: "needs_setup"; businessId: null; role: null }
  | { status: "ready"; businessId: string | null; role: BusinessTeamMemberRole };

type WorkspaceIdentity = typeof businessPortalOwner & {
  workspaceName: string;
  workspaceSlug: string;
  workspaceInitials: string;
};

type BusinessPortalPermissions = {
  canManageProfile: boolean;
  canManageTeam: boolean;
  canManageBilling: boolean;
  canManageContent: boolean;
};

type BusinessPortalContentItemDraft = {
  id?: string;
  title: string;
  summary: string;
  body: string;
  status: BusinessContentStatus;
  type: BusinessContentType;
  ctaLabel: string;
  ctaUrl: string;
  publishAt: string;
  attachments: BusinessPortalMediaAsset[];
};

type BusinessPortalSessionContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  isSupabaseMode: boolean;
  needsBusinessSetup: boolean;
  isProvisioningBusiness: boolean;
  isAcceptingInvitation: boolean;
  backendError: string;
  currentRole: BusinessTeamMemberRole | null;
  permissions: BusinessPortalPermissions;
  user: WorkspaceIdentity | null;
  business: ReturnType<typeof getBusinessPortalSnapshot> | null;
  billing: BusinessPortalBillingSettings | null;
  content: BusinessPortalContentItem[];
  team: BusinessPortalWorkspaceMember[];
  invoices: typeof businessPortalInvoicesSeed;
  activity: BusinessPortalActivityItem[];
  saveBusinessProfile: (nextProfile: BusinessPortalProfileDraft) => Promise<void>;
  resetBusinessProfile: () => void;
  saveBillingSettings: (nextBilling: BusinessPortalBillingSettings) => Promise<void>;
  saveContentItem: (input: BusinessPortalContentItemDraft) => Promise<void>;
  inviteTeamMember: (input: {
    name: string;
    email: string;
    role: BusinessTeamMemberRole;
  }) => Promise<{ inviteLink: string | null; emailSent: boolean; emailError: string | null }>;
  updateTeamMemberRole: (memberId: string, role: BusinessTeamMemberRole) => Promise<void>;
  toggleTeamMemberStatus: (memberId: string) => Promise<void>;
  signInAsDemo: () => void;
  signOut: () => Promise<void>;
  createWorkspace: (input: BusinessPortalProfileDraft) => Promise<void>;
  acceptInvitationToken: (inviteToken: string) => Promise<void>;
};

const BusinessPortalSessionContext = createContext<BusinessPortalSessionContextValue | null>(null);

const ownerPermissions: BusinessPortalPermissions = {
  canManageProfile: true,
  canManageTeam: true,
  canManageBilling: true,
  canManageContent: true,
};

function getBusinessPortalSessionSnapshot(
  authState: BusinessPortalAuthState,
  operation: BusinessPortalOperation,
  workspaceState: BusinessPortalWorkspaceState,
) {
  const isAuthenticated = authState.status === "authenticated" || authState.status === "demo";

  return {
    isReady: authState.status !== "checking",
    isAuthenticated,
    isSupabaseMode: authState.status === "authenticated",
    isProvisioningBusiness: operation === "provisioning_workspace",
    isAcceptingInvitation: operation === "accepting_invitation",
    needsBusinessSetup: workspaceState.status === "needs_setup",
    supabaseUser: authState.status === "authenticated" ? authState.user : null,
    businessId: workspaceState.businessId,
    currentRole: workspaceState.role,
  };
}

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
          : log.entity_type === "content"
            ? "content"
          : log.entity_type === "verification"
            ? "verification"
            : "profile",
  })) satisfies BusinessPortalActivityItem[];
}

function titleCaseContentStatus(status: BusinessContentPostRecord["status"]): BusinessContentStatus {
  switch (status) {
    case "draft":
      return "Draft";
    case "scheduled":
      return "Scheduled";
    case "published":
      return "Published";
    case "archived":
      return "Archived";
  }
}

function titleCaseContentType(type: BusinessContentPostRecord["content_type"]): BusinessContentType {
  switch (type) {
    case "announcement":
      return "Announcement";
    case "offer":
      return "Offer";
    case "event":
      return "Event";
  }
}

function titleCaseContentKind(kind: BusinessMediaAssetRecord["kind"]): BusinessContentMediaKind {
  switch (kind) {
    case "image":
      return "Image";
    case "video":
      return "Video";
  }
}

function dbContentStatus(status: BusinessContentStatus): BusinessContentPostRecord["status"] {
  switch (status) {
    case "Draft":
      return "draft";
    case "Scheduled":
      return "scheduled";
    case "Published":
      return "published";
    case "Archived":
      return "archived";
  }
}

function dbContentType(type: BusinessContentType): BusinessContentPostRecord["content_type"] {
  switch (type) {
    case "Announcement":
      return "announcement";
    case "Offer":
      return "offer";
    case "Event":
      return "event";
  }
}

function dbContentKind(kind: BusinessContentMediaKind): BusinessMediaAssetRecord["kind"] {
  switch (kind) {
    case "Image":
      return "image";
    case "Video":
      return "video";
  }
}

function formatContentUpdatedLabel(dateString: string) {
  return `Updated ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(dateString))}`;
}

function mapContentPosts(posts: Array<BusinessContentPostRecord & { business_media_assets?: BusinessMediaAssetRecord[] | null }>) {
  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    summary: post.summary ?? "",
    body: post.body,
    status: titleCaseContentStatus(post.status),
    type: titleCaseContentType(post.content_type),
    ctaLabel: post.cta_label ?? "",
    ctaUrl: post.cta_url ?? "",
    publishAt: post.publish_at ?? "",
    attachments: (post.business_media_assets ?? [])
      .sort((left, right) => left.sort_order - right.sort_order)
      .map((asset) => ({
        id: asset.id,
        label: asset.label ?? "",
        kind: titleCaseContentKind(asset.kind),
        url: asset.url,
        altText: asset.alt_text ?? "",
      })),
    updatedAtLabel:
      post.status === "published" && post.published_at
        ? `Published ${new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
          }).format(new Date(post.published_at))}`
        : formatContentUpdatedLabel(post.updated_at),
  })) satisfies BusinessPortalContentItem[];
}

function parseBudgetLabel(value: string) {
  const numeric = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? Math.round(numeric * 100) : 0;
}

async function captureAuditEvent(input: {
  businessId: string;
  entityType: string;
  entityId?: string | null;
  action: string;
  detail?: string | null;
  metadata?: Record<string, unknown>;
}) {
  try {
    await appendBusinessAuditLog(input);
  } catch (error) {
    console.error("Unable to append business audit log", error);
  }
}

export function BusinessPortalSessionProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<BusinessPortalAuthState>({ status: "checking", user: null });
  const [operation, setOperation] = useState<BusinessPortalOperation>("idle");
  const [workspaceState, setWorkspaceState] = useState<BusinessPortalWorkspaceState>({
    status: "unknown",
    businessId: null,
    role: null,
  });
  const [backendError, setBackendError] = useState("");
  const [businessDraft, setBusinessDraft] = useState<BusinessPortalProfileDraft>(businessPortalProfileDraftSeed);
  const [billingState, setBillingState] = useState<BusinessPortalBillingSettings>(businessPortalBillingSeed);
  const [contentState, setContentState] = useState<BusinessPortalContentItem[]>(businessPortalContentSeed);
  const [teamState, setTeamState] = useState<BusinessPortalWorkspaceMember[]>(businessPortalTeamSeed);
  const [invoiceState, setInvoiceState] = useState<typeof businessPortalInvoicesSeed>(businessPortalInvoicesSeed);
  const [activityState, setActivityState] = useState<BusinessPortalActivityItem[]>(businessPortalActivitySeed);
  const sessionSnapshot = getBusinessPortalSessionSnapshot(authState, operation, workspaceState);
  const supabaseUser = sessionSnapshot.supabaseUser;
  const businessId = sessionSnapshot.businessId;

  async function refreshWorkspace(user: User, targetBusinessId?: string) {
    const memberships = await fetchActiveBusinessMemberships(user.id);

    if (memberships.length === 0) {
      setWorkspaceState({ status: "needs_setup", businessId: null, role: null });
      setBusinessDraft({
        ...businessPortalProfileDraftSeed,
        supportEmail: user.email ?? businessPortalProfileDraftSeed.supportEmail,
      });
      setBillingState({
        ...businessPortalBillingSeed,
        billingContactEmail: user.email ?? businessPortalBillingSeed.billingContactEmail,
      });
      setContentState([]);
      setTeamState([]);
      setInvoiceState([]);
      setActivityState([]);
      return;
    }

    const membership =
      (targetBusinessId ? memberships.find((item) => item.business_id === targetBusinessId) : null) ?? memberships[0];
    const workspace = await fetchBusinessWorkspace(membership.business_id);
    let contentPosts: BusinessPortalContentItem[] = [];
    try {
      contentPosts = mapContentPosts(await fetchBusinessContentPosts(membership.business_id));
    } catch (error) {
      console.warn("Business content posts are not available yet.", error);
    }
    const nextDraft = deriveBusinessDraft(workspace.business);
    const nextRole = titleCaseRole(membership.role);

    setWorkspaceState({ status: "ready", businessId: workspace.business.id, role: nextRole });
    setBusinessDraft(nextDraft);
    setBillingState(mapBillingProfile(workspace.billing, user.email ?? nextDraft.supportEmail));
    setContentState(contentPosts);
    setTeamState([...mapInvitations(workspace.invitations), ...mapMemberships(workspace.team, user)]);
    setInvoiceState(mapInvoices(workspace.invoices));
    setActivityState(mapActivity(workspace.activity, user));
  }

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    const storedBusiness = window.localStorage.getItem(BUSINESS_STORAGE_KEY);
    const storedBilling = window.localStorage.getItem(BILLING_STORAGE_KEY);
    const storedContent = window.localStorage.getItem(CONTENT_STORAGE_KEY);
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

    if (storedContent) {
      try {
        setContentState(JSON.parse(storedContent) as BusinessPortalContentItem[]);
      } catch (error) {
        console.error("Unable to parse stored content items", error);
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
      setAuthState(storedValue === "active" ? { status: "demo", user: null } : { status: "signed_out", user: null });
      setWorkspaceState(
        storedValue === "active"
          ? { status: "ready", businessId: null, role: "Owner" }
          : { status: "unknown", businessId: null, role: null },
      );
      return;
    }

    let isMounted = true;

    async function bootstrap() {
      try {
        const session = await getSupabaseSession();
        if (!isMounted) {
          return;
        }

        setAuthState(session?.user ? { status: "authenticated", user: session.user } : { status: "signed_out", user: null });

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
          setAuthState((current) => (current.status === "checking" ? { status: "signed_out", user: null } : current));
        }
      }
    }

    void bootstrap();

    const authSubscription = onSupabaseAuthStateChange((session) => {
      setAuthState(session?.user ? { status: "authenticated", user: session.user } : { status: "signed_out", user: null });
      setBackendError("");

      if (!session?.user) {
        setWorkspaceState({ status: "unknown", businessId: null, role: null });
        return;
      }

      void refreshWorkspace(session.user).finally(() => setAuthState({ status: "authenticated", user: session.user }));
    });

    return () => {
      isMounted = false;
      authSubscription.data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<BusinessPortalSessionContextValue>(
    () => ({
      isReady: sessionSnapshot.isReady,
      isAuthenticated: sessionSnapshot.isAuthenticated,
      isSupabaseMode: sessionSnapshot.isSupabaseMode,
      needsBusinessSetup: sessionSnapshot.needsBusinessSetup,
      isProvisioningBusiness: sessionSnapshot.isProvisioningBusiness,
      isAcceptingInvitation: sessionSnapshot.isAcceptingInvitation,
      backendError,
      currentRole: sessionSnapshot.currentRole,
      permissions:
        !sessionSnapshot.isAuthenticated || !sessionSnapshot.currentRole
          ? ownerPermissions
          : sessionSnapshot.currentRole === "Owner"
            ? ownerPermissions
            : sessionSnapshot.currentRole === "Manager"
              ? { canManageProfile: true, canManageTeam: true, canManageBilling: false, canManageContent: true }
              : sessionSnapshot.currentRole === "Billing Admin"
                ? { canManageProfile: false, canManageTeam: false, canManageBilling: true, canManageContent: false }
                : { canManageProfile: false, canManageTeam: false, canManageBilling: false, canManageContent: false },
      user: sessionSnapshot.isAuthenticated
        ? getWorkspaceIdentity(
            businessDraft,
            supabaseUser ? getPreferredUserLabel(supabaseUser) : undefined,
            supabaseUser?.email,
          )
        : null,
      business: sessionSnapshot.isAuthenticated ? getBusinessPortalSnapshot(businessDraft) : null,
      billing: sessionSnapshot.isAuthenticated ? billingState : null,
      content: sessionSnapshot.isAuthenticated ? contentState : [],
      team: sessionSnapshot.isAuthenticated ? teamState : [],
      invoices: sessionSnapshot.isAuthenticated ? invoiceState : [],
      activity: sessionSnapshot.isAuthenticated ? activityState : [],
      saveBusinessProfile: async (nextProfile) => {
        if (sessionSnapshot.isSupabaseMode && businessId) {
          const updatedBusiness = await updateBusinessWorkspace(businessId, nextProfile);
          setBusinessDraft(deriveBusinessDraft(updatedBusiness));
          await captureAuditEvent({
            businessId,
            entityType: "profile",
            entityId: businessId,
            action: "business_profile_updated",
            detail: `Updated business profile settings for ${nextProfile.displayName}.`,
          });
          if (supabaseUser) {
            await refreshWorkspace(supabaseUser, businessId);
          }
          return;
        }

        setBusinessDraft(nextProfile);
        window.localStorage.setItem(BUSINESS_STORAGE_KEY, JSON.stringify(nextProfile));
      },
      resetBusinessProfile: () => {
        if (sessionSnapshot.isSupabaseMode) {
          return;
        }

        setBusinessDraft(businessPortalProfileDraftSeed);
        window.localStorage.removeItem(BUSINESS_STORAGE_KEY);
      },
      saveBillingSettings: async (nextBilling) => {
        if (sessionSnapshot.isSupabaseMode && businessId) {
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
          await captureAuditEvent({
            businessId,
            entityType: "billing",
            entityId: updatedBilling.id,
            action: "billing_profile_updated",
            detail: `Updated billing contact and payment settings for the workspace.`,
          });
          if (supabaseUser) {
            await refreshWorkspace(supabaseUser, businessId);
          }
          return;
        }

        setBillingState(nextBilling);
        window.localStorage.setItem(BILLING_STORAGE_KEY, JSON.stringify(nextBilling));
      },
      saveContentItem: async (input) => {
        if (sessionSnapshot.isSupabaseMode && businessId) {
          const savedPost = input.id
            ? await updateBusinessContentPost({
                contentId: input.id,
                businessId,
                title: input.title.trim(),
                summary: input.summary.trim(),
                body: input.body.trim(),
                status: dbContentStatus(input.status),
                contentType: dbContentType(input.type),
                ctaLabel: input.ctaLabel.trim(),
                ctaUrl: input.ctaUrl.trim(),
                publishAt: input.publishAt || null,
                attachments: input.attachments.map((attachment) => ({
                  label: attachment.label.trim(),
                  kind: dbContentKind(attachment.kind),
                  url: attachment.url.trim(),
                  altText: attachment.altText.trim(),
                })),
              })
            : await createBusinessContentPost({
                businessId,
                title: input.title.trim(),
                summary: input.summary.trim(),
                body: input.body.trim(),
                status: dbContentStatus(input.status),
                contentType: dbContentType(input.type),
                ctaLabel: input.ctaLabel.trim(),
                ctaUrl: input.ctaUrl.trim(),
                publishAt: input.publishAt || null,
                attachments: input.attachments.map((attachment) => ({
                  label: attachment.label.trim(),
                  kind: dbContentKind(attachment.kind),
                  url: attachment.url.trim(),
                  altText: attachment.altText.trim(),
                })),
              });

          await captureAuditEvent({
            businessId,
            entityType: "content",
            entityId: savedPost.id,
            action: input.id ? "business_content_updated" : "business_content_created",
            detail: `${input.id ? "Updated" : "Created"} the ${input.type.toLowerCase()} "${input.title.trim()}".`,
          });

          if (supabaseUser) {
            await refreshWorkspace(supabaseUser, businessId);
          }
          return;
        }

        setContentState((current) => {
          const nextItem: BusinessPortalContentItem = {
            id: input.id ?? `content-${Date.now()}`,
            title: input.title.trim(),
            summary: input.summary.trim(),
            body: input.body.trim(),
            status: input.status,
            type: input.type,
            ctaLabel: input.ctaLabel.trim(),
            ctaUrl: input.ctaUrl.trim(),
            publishAt: input.publishAt,
            attachments: input.attachments,
            updatedAtLabel:
              input.status === "Published"
                ? `Published ${new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                  }).format(new Date())}`
                : "Edited just now",
          };

          const next = current.some((item) => item.id === nextItem.id)
            ? current.map((item) => (item.id === nextItem.id ? nextItem : item))
            : [nextItem, ...current];
          window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(next));
          return next;
        });
      },
      inviteTeamMember: async ({ name, email, role }) => {
        if (sessionSnapshot.isSupabaseMode && businessId && supabaseUser) {
          const invitation = await createBusinessInvitation({
            businessId,
            invitedName: name.trim(),
            email: email.trim().toLowerCase(),
            role: dbRole(role),
            invitedBy: supabaseUser.id,
          });
          await captureAuditEvent({
            businessId,
            entityType: "invitation",
            entityId: invitation.id,
            action: "business_invitation_created",
            detail: `Invited ${email.trim().toLowerCase()} as ${role}.`,
            metadata: {
              invitee_email: email.trim().toLowerCase(),
              invitee_name: name.trim(),
              role,
            },
          });
          const inviteLink = `${getAppOrigin()}/business-portal?invite=${invitation.invite_token}`;
          let emailSent = false;
          let emailError: string | null = null;

          try {
            const delivery = await sendBusinessInvitationEmail({
              businessName: businessDraft.displayName,
              inviteeEmail: email.trim().toLowerCase(),
              inviteeName: name.trim(),
              inviterName: getPreferredUserLabel(supabaseUser),
              roleLabel: role,
              inviteLink,
            });

            emailSent = delivery.success;
            emailError = delivery.success ? null : delivery.error ?? "Invite email could not be sent.";

            await captureAuditEvent({
              businessId,
              entityType: "invitation",
              entityId: invitation.id,
              action: delivery.success ? "business_invitation_email_sent" : "business_invitation_email_failed",
              detail: delivery.success
                ? `Sent an invite email to ${email.trim().toLowerCase()}.`
                : `Could not send the invite email to ${email.trim().toLowerCase()}.`,
              metadata: {
                invitee_email: email.trim().toLowerCase(),
                provider: delivery.provider,
                provider_message_id: delivery.id ?? null,
                error: delivery.error ?? null,
              },
            });
          } catch (error) {
            emailError = error instanceof Error ? error.message : "Invite email could not be sent.";
            await captureAuditEvent({
              businessId,
              entityType: "invitation",
              entityId: invitation.id,
              action: "business_invitation_email_failed",
              detail: `Could not send the invite email to ${email.trim().toLowerCase()}.`,
              metadata: {
                invitee_email: email.trim().toLowerCase(),
                error: emailError,
              },
            });
          }

          await refreshWorkspace(supabaseUser, businessId);
          return { inviteLink, emailSent, emailError };
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
        return { inviteLink: null, emailSent: false, emailError: null };
      },
      updateTeamMemberRole: async (memberId, role) => {
        if (sessionSnapshot.isSupabaseMode && businessId && supabaseUser) {
          const currentMember = teamState.find((member) => member.id === memberId);

          if (currentMember?.source === "invitation") {
            await updateBusinessInvitation({
              invitationId: memberId,
              businessId,
              role: dbRole(role),
            });
            await captureAuditEvent({
              businessId,
              entityType: "invitation",
              entityId: memberId,
              action: "business_invitation_role_updated",
              detail: `Updated the invited role for ${currentMember.email} to ${role}.`,
            });
          } else {
            await updateBusinessMembership({
              membershipId: memberId,
              businessId,
              role: dbRole(role),
            });
            await captureAuditEvent({
              businessId,
              entityType: "membership",
              entityId: memberId,
              action: "business_membership_role_updated",
              detail: `Updated the workspace role for ${currentMember?.email ?? "a teammate"} to ${role}.`,
            });
          }

          await refreshWorkspace(supabaseUser, businessId);
          return;
        }

        setTeamState((current) => {
          const next = current.map((member) => (member.id === memberId ? { ...member, role } : member));
          if (!sessionSnapshot.isSupabaseMode) {
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

        if (sessionSnapshot.isSupabaseMode && businessId && supabaseUser) {
          if (currentMember.source === "invitation") {
            await updateBusinessInvitation({
              invitationId: memberId,
              businessId,
              status: nextStatus === "Paused" ? "revoked" : "pending",
            });
            await captureAuditEvent({
              businessId,
              entityType: "invitation",
              entityId: memberId,
              action: nextStatus === "Paused" ? "business_invitation_revoked" : "business_invitation_restored",
              detail:
                nextStatus === "Paused"
                  ? `Revoked the pending invite for ${currentMember.email}.`
                  : `Restored the pending invite for ${currentMember.email}.`,
            });
          } else {
            await updateBusinessMembership({
              membershipId: memberId,
              businessId,
              status: nextStatus === "Active" ? "active" : "paused",
            });
            await captureAuditEvent({
              businessId,
              entityType: "membership",
              entityId: memberId,
              action: nextStatus === "Active" ? "business_membership_reactivated" : "business_membership_paused",
              detail:
                nextStatus === "Active"
                  ? `Reactivated workspace access for ${currentMember.email}.`
                  : `Paused workspace access for ${currentMember.email}.`,
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

          if (!sessionSnapshot.isSupabaseMode) {
            window.localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(next));
          }

          return next;
        });
      },
      signInAsDemo: () => {
        window.localStorage.setItem(STORAGE_KEY, "active");
        setAuthState({ status: "demo", user: null });
        setWorkspaceState({ status: "ready", businessId: null, role: "Owner" });
      },
      signOut: async () => {
        if (sessionSnapshot.isSupabaseMode) {
          await signOutSupabase();
          setAuthState({ status: "signed_out", user: null });
          setWorkspaceState({ status: "unknown", businessId: null, role: null });
          return;
        }

        window.localStorage.removeItem(STORAGE_KEY);
        setAuthState({ status: "signed_out", user: null });
        setWorkspaceState({ status: "unknown", businessId: null, role: null });
      },
      createWorkspace: async (input) => {
        if (!sessionSnapshot.isSupabaseMode) {
          setBusinessDraft(input);
          setAuthState({ status: "demo", user: null });
          setWorkspaceState({ status: "ready", businessId: null, role: "Owner" });
          return;
        }

        setOperation("provisioning_workspace");
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
          setOperation("idle");
        }
      },
      acceptInvitationToken: async (inviteToken) => {
        setOperation("accepting_invitation");
        setBackendError("");

        try {
          const acceptedBusinessId = await acceptBusinessInvitation(inviteToken);
          setWorkspaceState({ status: "ready", businessId: acceptedBusinessId, role: sessionSnapshot.currentRole ?? "Manager" });
          if (supabaseUser) {
            await refreshWorkspace(supabaseUser, acceptedBusinessId);
          }
        } catch (error) {
          console.error(error);
          setBackendError(error instanceof Error ? error.message : "Unable to accept the business invitation.");
          throw error;
        } finally {
          setOperation("idle");
        }
      },
    }),
    [
      activityState,
      backendError,
      billingState,
      businessDraft,
      businessId,
      contentState,
      invoiceState,
      sessionSnapshot,
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
