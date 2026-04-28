import { createClient, type Session, type SupabaseClient, type User } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn("Supabase environment variables are missing. Form persistence will be disabled.");
}

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type SportInterestInsert = {
  first_name?: string;
  email: string;
  city: string;
  state_region?: string;
  country?: string;
  primary_sport: string;
  secondary_sports?: string[];
  skill_level?: string;
  play_frequency?: string;
  looking_for?: string;
  preferred_tier?: "free" | "pro" | "elite";
  source_intent?: "free_signup" | "sport_interest" | "checkout_fallback" | "waitlist";
  launch_status_at_signup?: "pre_release" | "launched";
  landing_path?: string;
  submitted_path?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  honeypot_field?: string;
};

export type CheckoutIntentInsert = {
  selected_tier: "pro" | "elite";
  email: string;
  first_name?: string;
  city?: string;
  primary_sport?: string;
  intent_status?: "checkout_not_live" | "checkout_live";
  checkout_path?: string;
  landing_path?: string;
  submitted_path?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  honeypot_field?: string;
};

export type PartnerLeadInsert = {
  contact_name: string;
  email: string;
  organization_name: string;
  organization_type: string;
  city: string;
  partnership_interest?: string;
  notes?: string;
  landing_path?: string;
  submitted_path?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  honeypot_field?: string;
};

export type BusinessRecord = {
  id: string;
  display_name: string;
  legal_name: string | null;
  slug: string;
  category: string | null;
  support_email: string | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  locations: string[] | null;
  verification_status: "verified" | "under_review" | "needs_documents";
  business_status: "active" | "pending_verification" | "needs_review" | "suspended";
  created_by: string | null;
};

export type BusinessMembershipRecord = {
  id: string;
  business_id: string;
  user_id: string;
  display_name: string | null;
  role: "owner" | "manager" | "analyst" | "billing_admin";
  status: "active" | "invited" | "paused";
  invited_by: string | null;
  created_at: string;
  updated_at: string;
};

export type BusinessBillingProfileRecord = {
  id: string;
  business_id: string;
  plan_name: string;
  plan_status: "active" | "trialing" | "past_due" | "canceled";
  renewal_at: string | null;
  monthly_budget_cents: number;
  spend_cap_cents: number;
  payment_method_label: string | null;
  billing_contact_email: string | null;
  billing_address: string | null;
  tax_id_status: string | null;
};

export type BusinessInvitationRecord = {
  id: string;
  business_id: string;
  invited_name: string | null;
  email: string;
  role: "owner" | "manager" | "analyst" | "billing_admin";
  invited_by: string | null;
  invite_token: string;
  status: "pending" | "accepted" | "revoked" | "expired";
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BusinessInvoiceRecord = {
  id: string;
  business_id: string;
  external_invoice_id: string | null;
  amount_cents: number;
  status: "paid" | "pending" | "action_required";
  description: string;
  invoiced_at: string;
};

export type BusinessAuditLogRecord = {
  id: string;
  business_id: string;
  actor_user_id: string | null;
  entity_type: string;
  entity_id: string | null;
  action: string;
  detail: string | null;
  created_at: string;
};

export type PortalProfileRecord = {
  user_id: string;
  full_name: string;
  username: string;
  city: string;
  primary_sport: string;
  secondary_sports: string[] | null;
  skill_level: string;
  bio: string;
  availability: string;
  vibe_tags: string[] | null;
  updated_at?: string;
};

export type PortalProfileUpsert = Omit<PortalProfileRecord, "updated_at">;

export type PortalMembershipRecord = {
  user_id: string;
  tier: "free" | "pro" | "elite";
  status: "active" | "trialing" | "pending_renewal" | "past_due" | "canceled";
  cadence: "monthly" | "annual" | "lifetime" | "app_store" | "play_store" | "manual";
  price_label: string;
  renewal_at: string | null;
  billing_source: string;
  payment_method_summary: string | null;
  sync_note: string | null;
  created_at?: string;
  updated_at?: string;
};

export function hasSupabaseConfig() {
  return isSupabaseConfigured;
}

function requireSupabase() {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
}

function toAppError(error: unknown) {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "object" && error && "message" in error && typeof error.message === "string") {
    return new Error(error.message);
  }

  return new Error("Something went wrong while talking to Supabase.");
}

export async function getSupabaseSessionUser() {
  const client = requireSupabase();
  const {
    data: { session },
    error,
  } = await client.auth.getSession();

  if (error) {
    throw toAppError(error);
  }

  return session?.user ?? null;
}

export async function getSupabaseSession() {
  const client = requireSupabase();
  const {
    data: { session },
    error,
  } = await client.auth.getSession();

  if (error) {
    throw toAppError(error);
  }

  return session;
}

export function onSupabaseAuthStateChange(callback: (session: Session | null) => void) {
  const client = requireSupabase();
  return client.auth.onAuthStateChange((_event, session) => callback(session));
}

export async function signInWithMagicLink(email: string) {
  const client = requireSupabase();
  const { error } = await client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/business-portal`,
    },
  });

  if (error) {
    throw toAppError(error);
  }
}

export async function signOutSupabase() {
  const client = requireSupabase();
  const { error } = await client.auth.signOut();

  if (error) {
    throw toAppError(error);
  }
}

export async function createBusinessWorkspace(input: {
  displayName: string;
  legalName: string;
  slug: string;
  category: string;
  supportEmail: string;
  phone: string;
  website: string;
  description: string;
  locations: string[];
}) {
  const client = requireSupabase();
  const user = await getSupabaseSessionUser();

  if (!user) {
    throw new Error("You need to be signed in before creating a business workspace.");
  }

  const { data, error } = await client
    .from("businesses")
    .insert({
      display_name: input.displayName,
      legal_name: input.legalName,
      slug: input.slug,
      category: input.category,
      support_email: input.supportEmail,
      phone: input.phone,
      website: input.website,
      description: input.description,
      locations: input.locations,
      created_by: user.id,
    })
    .select(
      "id, display_name, legal_name, slug, category, support_email, phone, website, description, locations, verification_status, business_status, created_by",
    )
    .single<BusinessRecord>();

  if (error) {
    throw toAppError(error);
  }

  return data;
}

export async function updateBusinessWorkspace(
  businessId: string,
  input: {
    displayName: string;
    legalName: string;
    slug: string;
    category: string;
    supportEmail: string;
    phone: string;
    website: string;
    description: string;
    locations: string[];
  },
) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("businesses")
    .update({
      display_name: input.displayName,
      legal_name: input.legalName,
      slug: input.slug,
      category: input.category,
      support_email: input.supportEmail,
      phone: input.phone,
      website: input.website,
      description: input.description,
      locations: input.locations,
    })
    .eq("id", businessId)
    .select(
      "id, display_name, legal_name, slug, category, support_email, phone, website, description, locations, verification_status, business_status, created_by",
    )
    .single<BusinessRecord>();

  if (error) {
    throw toAppError(error);
  }

  return data;
}

export async function fetchActiveBusinessMemberships(userId: string) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("business_memberships")
    .select("id, business_id, user_id, display_name, role, status, invited_by, created_at, updated_at")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .returns<BusinessMembershipRecord[]>();

  if (error) {
    throw toAppError(error);
  }

  return data ?? [];
}

export async function fetchBusinessWorkspace(businessId: string) {
  const client = requireSupabase();

  const [
    { data: business, error: businessError },
    { data: billing, error: billingError },
    { data: invoices, error: invoicesError },
    { data: activity, error: activityError },
    { data: team, error: teamError },
    { data: invitations, error: invitationsError },
  ] =
    await Promise.all([
      client
        .from("businesses")
        .select(
          "id, display_name, legal_name, slug, category, support_email, phone, website, description, locations, verification_status, business_status, created_by",
        )
        .eq("id", businessId)
        .single<BusinessRecord>(),
      client
        .from("business_billing_profiles")
        .select(
          "id, business_id, plan_name, plan_status, renewal_at, monthly_budget_cents, spend_cap_cents, payment_method_label, billing_contact_email, billing_address, tax_id_status",
        )
        .eq("business_id", businessId)
        .maybeSingle<BusinessBillingProfileRecord>(),
      client
        .from("business_invoices")
        .select("id, business_id, external_invoice_id, amount_cents, status, description, invoiced_at")
        .eq("business_id", businessId)
        .order("invoiced_at", { ascending: false })
        .returns<BusinessInvoiceRecord[]>(),
      client
        .from("business_audit_logs")
        .select("id, business_id, actor_user_id, entity_type, entity_id, action, detail, created_at")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false })
        .limit(20)
        .returns<BusinessAuditLogRecord[]>(),
      client
        .from("business_memberships")
        .select("id, business_id, user_id, display_name, role, status, invited_by, created_at, updated_at")
        .eq("business_id", businessId)
        .order("created_at", { ascending: true })
        .returns<BusinessMembershipRecord[]>(),
      client
        .from("business_invitations")
        .select("id, business_id, invited_name, email, role, invited_by, invite_token, status, expires_at, created_at, updated_at")
        .eq("business_id", businessId)
        .in("status", ["pending", "revoked", "expired"])
        .order("created_at", { ascending: false })
        .returns<BusinessInvitationRecord[]>(),
    ]);

  if (businessError) {
    throw toAppError(businessError);
  }

  if (billingError) {
    throw toAppError(billingError);
  }

  if (invoicesError) {
    throw toAppError(invoicesError);
  }

  if (activityError) {
    throw toAppError(activityError);
  }

  if (teamError) {
    throw toAppError(teamError);
  }

  if (invitationsError) {
    throw toAppError(invitationsError);
  }

  return {
    business,
    billing,
    invoices: invoices ?? [],
    activity: activity ?? [],
    team: team ?? [],
    invitations: invitations ?? [],
  };
}

export async function upsertBusinessBillingProfile(input: {
  businessId: string;
  planName: string;
  planStatus: "active" | "trialing";
  renewalAt: string | null;
  monthlyBudgetCents: number;
  spendCapCents: number;
  paymentMethodLabel: string;
  billingContactEmail: string;
  billingAddress: string;
  taxIdStatus: string;
}) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("business_billing_profiles")
    .upsert(
      {
        business_id: input.businessId,
        plan_name: input.planName,
        plan_status: input.planStatus,
        renewal_at: input.renewalAt,
        monthly_budget_cents: input.monthlyBudgetCents,
        spend_cap_cents: input.spendCapCents,
        payment_method_label: input.paymentMethodLabel,
        billing_contact_email: input.billingContactEmail,
        billing_address: input.billingAddress,
        tax_id_status: input.taxIdStatus,
      },
      { onConflict: "business_id" },
    )
    .select(
      "id, business_id, plan_name, plan_status, renewal_at, monthly_budget_cents, spend_cap_cents, payment_method_label, billing_contact_email, billing_address, tax_id_status",
    )
    .single<BusinessBillingProfileRecord>();

  if (error) {
    throw toAppError(error);
  }

  return data;
}

export async function createBusinessInvitation(input: {
  businessId: string;
  invitedName: string;
  email: string;
  role: "owner" | "manager" | "analyst" | "billing_admin";
  invitedBy: string | null;
}) {
  const client = requireSupabase();
  const { error } = await client.from("business_invitations").insert({
    business_id: input.businessId,
    invited_name: input.invitedName || null,
    email: input.email,
    role: input.role,
    invited_by: input.invitedBy,
  });

  if (error) {
    throw toAppError(error);
  }
}

export async function updateBusinessInvitation(input: {
  invitationId: string;
  businessId: string;
  role?: "owner" | "manager" | "analyst" | "billing_admin";
  status?: "pending" | "revoked" | "expired";
}) {
  const client = requireSupabase();
  const patch: Record<string, string> = {};

  if (input.role) {
    patch.role = input.role;
  }

  if (input.status) {
    patch.status = input.status;
  }

  const { error } = await client
    .from("business_invitations")
    .update(patch)
    .eq("id", input.invitationId)
    .eq("business_id", input.businessId);

  if (error) {
    throw toAppError(error);
  }
}

export async function updateBusinessMembership(input: {
  membershipId: string;
  businessId: string;
  role?: "owner" | "manager" | "analyst" | "billing_admin";
  status?: "active" | "paused";
}) {
  const client = requireSupabase();
  const patch: Record<string, string> = {};

  if (input.role) {
    patch.role = input.role;
  }

  if (input.status) {
    patch.status = input.status;
  }

  const { error } = await client
    .from("business_memberships")
    .update(patch)
    .eq("id", input.membershipId)
    .eq("business_id", input.businessId);

  if (error) {
    throw toAppError(error);
  }
}

export async function acceptBusinessInvitation(inviteToken: string) {
  const client = requireSupabase();
  const { data, error } = await client.rpc("accept_business_invitation", {
    input_invite_token: inviteToken,
  });

  if (error) {
    throw toAppError(error);
  }

  return data as string;
}

export async function insertSportInterest(payload: SportInterestInsert) {
  const client = requireSupabase();
  const { error } = await client.from("marketing_sport_interests").insert(payload);

  if (error) {
    throw toAppError(error);
  }
}

export async function insertCheckoutIntent(payload: CheckoutIntentInsert) {
  const client = requireSupabase();
  const { error } = await client.from("marketing_checkout_intents").insert(payload);

  if (error) {
    throw toAppError(error);
  }
}

export async function insertPartnerLead(payload: PartnerLeadInsert) {
  const client = requireSupabase();
  const { error } = await client.from("marketing_partner_leads").insert(payload);

  if (error) {
    throw toAppError(error);
  }
}

export function getPreferredUserLabel(user: User) {
  const metadata = user.user_metadata ?? {};
  const fullName =
    typeof metadata.full_name === "string"
      ? metadata.full_name
      : typeof metadata.name === "string"
        ? metadata.name
        : "";

  if (fullName.trim()) {
    return fullName.trim();
  }

  if (user.email) {
    return user.email.split("@")[0] ?? "Business owner";
  }

  return "Business owner";
}

export async function fetchPortalProfile(userId: string) {
  const client = requireSupabase();

  const { data, error } = await client
    .from("player_portal_profiles")
    .select(
      "user_id, full_name, username, city, primary_sport, secondary_sports, skill_level, bio, availability, vibe_tags, updated_at",
    )
    .eq("user_id", userId)
    .maybeSingle<PortalProfileRecord>();

  if (error) {
    throw toAppError(error);
  }

  return data;
}

export async function upsertPortalProfile(payload: PortalProfileUpsert) {
  const client = requireSupabase();

  const { error } = await client.from("player_portal_profiles").upsert(payload, {
    onConflict: "user_id",
  });

  if (error) {
    throw toAppError(error);
  }
}

export async function fetchPortalMembership(userId: string) {
  const client = requireSupabase();

  const { data, error } = await client
    .from("player_portal_memberships")
    .select(
      "user_id, tier, status, cadence, price_label, renewal_at, billing_source, payment_method_summary, sync_note, created_at, updated_at",
    )
    .eq("user_id", userId)
    .maybeSingle<PortalMembershipRecord>();

  if (error) {
    throw toAppError(error);
  }

  return data;
}
