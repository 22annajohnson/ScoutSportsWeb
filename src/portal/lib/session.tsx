import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { routes } from "@/lib/routes";
import {
  fetchPortalBillingProfile,
  fetchPortalInvoices,
  fetchPortalHistory,
  fetchPortalMembership,
  fetchPortalProfile,
  fetchPortalSettingsPreferences,
  fetchPortalSportBreakdowns,
  fetchPortalStatsSummary,
  hasSupabaseConfig,
  supabase,
  upsertPortalSettingsPreferences,
  upsertPortalProfile,
} from "@/lib/supabase";
import {
  portalBillingProfile,
  getPortalProfileSnapshot,
  portalHistoryPreview,
  portalInvoiceHistory,
  portalMembership,
  portalPlayer,
  portalProfileDraftSeed,
  portalSettingsPreferences,
  type PortalBillingProfile,
  type PortalHistoryItem,
  type PortalInvoiceItem,
  portalSportBreakdowns,
  portalStatsSnapshot,
  type PortalMembership,
  type PortalProfileDraft,
  type PortalSettingsPreferences,
  type PortalSportBreakdown,
  type PortalStatsSnapshot,
} from "./mockPortal";

const STORAGE_KEY = "scout.portal.demoSession";
const PROFILE_STORAGE_KEY_PREFIX = "scout.portal.profileDraft";

type PortalAuthState =
  | { status: "checking"; session: null; user: null }
  | { status: "signed_out"; session: null; user: null }
  | { status: "demo"; session: null; user: null }
  | { status: "authenticated"; session: Session; user: User };
type PortalRemoteResource = "membership" | "stats" | "history" | "billing" | "settings";
type RemoteLoadStatus = "idle" | "loading" | "ready";

const initialRemoteStatuses: Record<PortalRemoteResource, RemoteLoadStatus> = {
  membership: "idle",
  stats: "idle",
  history: "idle",
  billing: "idle",
  settings: "idle",
};

function portalAuthState(session: Session | null, demoSessionIsActive: boolean): PortalAuthState {
  if (session?.user) {
    return { status: "authenticated", session, user: session.user };
  }

  return demoSessionIsActive
    ? { status: "demo", session: null, user: null }
    : { status: "signed_out", session: null, user: null };
}

function getPortalSessionSnapshot(
  authState: PortalAuthState,
  remoteStatuses: Record<PortalRemoteResource, RemoteLoadStatus>,
) {
  const isAuthenticated = authState.status === "authenticated" || authState.status === "demo";
  const isRemoteAuthenticated = authState.status === "authenticated";

  return {
    isReady: authState.status !== "checking",
    isAuthenticated,
    isProfileRemote: isRemoteAuthenticated,
    isMembershipRemote: isRemoteAuthenticated,
    isStatsRemote: isRemoteAuthenticated,
    isHistoryRemote: isRemoteAuthenticated,
    isBillingRemote: isRemoteAuthenticated,
    isSettingsRemote: isRemoteAuthenticated,
    isMembershipLoading: remoteStatuses.membership === "loading",
    isStatsLoading: remoteStatuses.stats === "loading",
    isHistoryLoading: remoteStatuses.history === "loading",
    isBillingLoading: remoteStatuses.billing === "loading",
    isSettingsLoading: remoteStatuses.settings === "loading",
    authUser: authState.status === "authenticated" ? authState.user : null,
    authSession: authState.status === "authenticated" ? authState.session : null,
  };
}

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

function formatMembershipTier(tier: "free" | "pro" | "elite"): PortalMembership["tier"] {
  switch (tier) {
    case "elite":
      return "Elite";
    case "pro":
      return "Pro";
    default:
      return "Free";
  }
}

function formatMembershipStatus(
  status: "active" | "trialing" | "pending_renewal" | "past_due" | "canceled",
): PortalMembership["status"] {
  switch (status) {
    case "trialing":
      return "Trialing";
    case "pending_renewal":
    case "past_due":
    case "canceled":
      return "Pending renewal";
    default:
      return "Active";
  }
}

function formatMembershipCadence(cadence: "monthly" | "annual" | "lifetime" | "app_store" | "play_store" | "manual") {
  switch (cadence) {
    case "annual":
      return "Annual";
    case "lifetime":
      return "Lifetime";
    case "app_store":
      return "Managed in the App Store";
    case "play_store":
      return "Managed in Google Play";
    case "manual":
      return "Managed manually";
    default:
      return "Monthly";
  }
}

function formatRenewalLabel(renewalAt: string | null) {
  if (!renewalAt) {
    return "No renewal date on file yet";
  }

  const date = new Date(renewalAt);

  if (Number.isNaN(date.getTime())) {
    return "Renewal date unavailable";
  }

  return `Renews ${new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)}`;
}

function mapMembershipRecord(record: Awaited<ReturnType<typeof fetchPortalMembership>>): PortalMembership | null {
  if (!record) {
    return null;
  }

  return {
    tier: formatMembershipTier(record.tier),
    status: formatMembershipStatus(record.status),
    renewalLabel: formatRenewalLabel(record.renewal_at),
    billingSummary:
      record.sync_note ??
      "Your membership is now resolving from the account-level portal record.",
    manageLabel: "Manage membership",
    billingSource: record.billing_source,
    cadence: formatMembershipCadence(record.cadence),
    priceLabel: record.price_label,
    paymentMethod: record.payment_method_summary ?? "Payment method not synced yet",
    syncedAccessNote:
      record.sync_note ??
      "This membership state is ready to unify upgrades made online or in-app once billing sync is fully connected.",
  };
}

function mapStatsSummaryRecord(record: Awaited<ReturnType<typeof fetchPortalStatsSummary>>): PortalStatsSnapshot | null {
  if (!record) {
    return null;
  }

  return {
    scoutScore: record.scout_score,
    cityRank: record.city_rank,
    record: record.record_summary,
    streak: record.streak_summary,
    bracketFinish: record.bracket_finish_summary,
    recentTrend: record.recent_trend_summary,
    recentMatches: record.recent_matches,
    winRate: record.win_rate_label,
    favoriteFormat: record.favorite_format,
    growthChannel: record.growth_channel ?? portalStatsSnapshot.growthChannel,
    currentEdge: record.current_edge ?? portalStatsSnapshot.currentEdge,
  };
}

function mapSportBreakdownRecords(records: Awaited<ReturnType<typeof fetchPortalSportBreakdowns>>): PortalSportBreakdown[] {
  return records.map((record) => ({
    sport: record.sport,
    rating: record.rating,
    record: record.record_summary,
    trend: record.trend_summary,
    note: record.note,
  }));
}

function formatHistoryDateLabel(playedAt: string) {
  const date = new Date(playedAt);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatHistoryResult(result: "win" | "loss" | "draw"): PortalHistoryItem["result"] {
  switch (result) {
    case "loss":
      return "Loss";
    case "draw":
      return "Draw";
    default:
      return "Win";
  }
}

function formatRatingDelta(value: number) {
  if (value > 0) {
    return `+${value}`;
  }

  return String(value);
}

function formatDurationLabel(durationMinutes: number | null) {
  if (!durationMinutes || durationMinutes <= 0) {
    return "Duration unknown";
  }

  return `${durationMinutes} min`;
}

function mapHistoryRecords(records: Awaited<ReturnType<typeof fetchPortalHistory>>): PortalHistoryItem[] {
  return records.map((record) => ({
    id: record.id,
    title: record.title,
    dateLabel: formatHistoryDateLabel(record.played_at),
    sport: record.sport,
    result: formatHistoryResult(record.result),
    detail: record.detail,
    ratingDelta: formatRatingDelta(record.rating_delta),
    teammateLine: record.teammate_line,
    durationLabel: formatDurationLabel(record.duration_minutes),
    venueLabel: record.venue_label,
    scoreLine: record.score_line,
  }));
}

function mapBillingProfileRecord(record: Awaited<ReturnType<typeof fetchPortalBillingProfile>>): PortalBillingProfile | null {
  if (!record) {
    return null;
  }

  return {
    paymentMethod: record.payment_method_label ?? "Payment method not synced yet",
    billingContactEmail: record.billing_contact_email ?? "No billing contact on file",
    billingAddress: record.billing_address ?? "Billing address not synced yet",
    taxStatus: record.tax_status ?? "Tax status unavailable",
  };
}

function formatInvoiceDateLabel(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatInvoiceAmount(amountCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountCents / 100);
}

function formatInvoiceStatus(status: "paid" | "pending" | "refunded"): PortalInvoiceItem["status"] {
  switch (status) {
    case "pending":
      return "Pending";
    case "refunded":
      return "Refunded";
    default:
      return "Paid";
  }
}

function mapInvoiceRecords(records: Awaited<ReturnType<typeof fetchPortalInvoices>>): PortalInvoiceItem[] {
  return records.map((record) => ({
    id: record.external_invoice_id || record.id,
    dateLabel: formatInvoiceDateLabel(record.invoiced_at),
    amountLabel: formatInvoiceAmount(record.amount_cents),
    status: formatInvoiceStatus(record.status),
    description: record.description,
  }));
}

function mapSettingsPreferencesRecord(
  record: Awaited<ReturnType<typeof fetchPortalSettingsPreferences>>,
): PortalSettingsPreferences | null {
  if (!record) {
    return null;
  }

  return {
    matchAlertsEmail: record.match_alerts_email,
    bracketUpdatesEmail: record.bracket_updates_email,
    circleActivityEmail: record.circle_activity_email,
    partnerOffersEmail: record.partner_offers_email,
    smsAlertsEnabled: record.sms_alerts_enabled,
  };
}

type PortalSessionContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  isSupabaseAuthEnabled: boolean;
  isProfileRemote: boolean;
  isMembershipRemote: boolean;
  isStatsRemote: boolean;
  isHistoryRemote: boolean;
  isBillingRemote: boolean;
  isSettingsRemote: boolean;
  isMembershipLoading: boolean;
  isStatsLoading: boolean;
  isHistoryLoading: boolean;
  isBillingLoading: boolean;
  isSettingsLoading: boolean;
  authUser: User | null;
  player: ReturnType<typeof getPlayerFromProfile> | null;
  profile: ReturnType<typeof getPortalProfileSnapshot> | null;
  membership: PortalMembership | null;
  billingProfile: PortalBillingProfile | null;
  invoices: PortalInvoiceItem[];
  settingsPreferences: PortalSettingsPreferences | null;
  stats: PortalStatsSnapshot | null;
  sportBreakdowns: PortalSportBreakdown[];
  history: PortalHistoryItem[];
  saveSettingsPreferences: (nextPreferences: PortalSettingsPreferences) => Promise<void>;
  saveProfile: (nextProfile: PortalProfileDraft) => Promise<void>;
  resetProfile: () => void;
  signInWithEmail: (email: string) => Promise<void>;
  signInAsDemo: () => void;
  signOut: () => void;
};

const PortalSessionContext = createContext<PortalSessionContextValue | null>(null);

export function PortalSessionProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<PortalAuthState>({ status: "checking", session: null, user: null });
  const [profileDraft, setProfileDraft] = useState<PortalProfileDraft>(portalProfileDraftSeed);
  const [membership, setMembership] = useState<PortalMembership>(portalMembership);
  const [stats, setStats] = useState<PortalStatsSnapshot>(portalStatsSnapshot);
  const [sportBreakdowns, setSportBreakdowns] = useState<PortalSportBreakdown[]>(portalSportBreakdowns);
  const [history, setHistory] = useState<PortalHistoryItem[]>(portalHistoryPreview);
  const [billingProfile, setBillingProfile] = useState<PortalBillingProfile>(portalBillingProfile);
  const [invoices, setInvoices] = useState<PortalInvoiceItem[]>(portalInvoiceHistory);
  const [settingsPreferences, setSettingsPreferences] = useState<PortalSettingsPreferences>(portalSettingsPreferences);
  const [remoteStatuses, setRemoteStatuses] = useState(initialRemoteStatuses);
  const isSupabaseAuthEnabled = hasSupabaseConfig() && Boolean(supabase);
  const sessionSnapshot = getPortalSessionSnapshot(authState, remoteStatuses);
  const authUser = sessionSnapshot.authUser;

  const identityKey = authUser?.id ?? (sessionSnapshot.isAuthenticated ? "demo" : "anonymous");

  function setRemoteStatus(resource: PortalRemoteResource, status: RemoteLoadStatus) {
    setRemoteStatuses((current) => ({ ...current, [resource]: status }));
  }

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!isSupabaseAuthEnabled || !supabase) {
      setAuthState(portalAuthState(null, storedValue === "active"));
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
      setAuthState(portalAuthState(session, storedValue === "active"));
    }

    const { data: authListener } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setAuthState(portalAuthState(session, window.localStorage.getItem(STORAGE_KEY) === "active"));
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

  useEffect(() => {
    if (!authUser) {
      setMembership(portalMembership);
      setRemoteStatus("membership", "idle");
      return;
    }

    const currentAuthUser = authUser;
    let isMounted = true;
    setRemoteStatus("membership", "loading");

    async function loadMembership() {
      try {
        const record = await fetchPortalMembership(currentAuthUser.id);

        if (!isMounted) {
          return;
        }

        setMembership(mapMembershipRecord(record) ?? portalMembership);
      } catch (error) {
        console.error("Unable to load remote portal membership", error);

        if (isMounted) {
          setMembership(portalMembership);
        }
      } finally {
        if (isMounted) {
          setRemoteStatus("membership", "ready");
        }
      }
    }

    void loadMembership();

    return () => {
      isMounted = false;
    };
  }, [authUser]);

  useEffect(() => {
    if (!authUser) {
      setStats(portalStatsSnapshot);
      setSportBreakdowns(portalSportBreakdowns);
      setRemoteStatus("stats", "idle");
      return;
    }

    const currentAuthUser = authUser;
    let isMounted = true;
    setRemoteStatus("stats", "loading");

    async function loadStats() {
      try {
        const [summaryRecord, breakdownRecords] = await Promise.all([
          fetchPortalStatsSummary(currentAuthUser.id),
          fetchPortalSportBreakdowns(currentAuthUser.id),
        ]);

        if (!isMounted) {
          return;
        }

        setStats(mapStatsSummaryRecord(summaryRecord) ?? portalStatsSnapshot);
        setSportBreakdowns(breakdownRecords.length > 0 ? mapSportBreakdownRecords(breakdownRecords) : portalSportBreakdowns);
      } catch (error) {
        console.error("Unable to load remote portal stats", error);

        if (isMounted) {
          setStats(portalStatsSnapshot);
          setSportBreakdowns(portalSportBreakdowns);
        }
      } finally {
        if (isMounted) {
          setRemoteStatus("stats", "ready");
        }
      }
    }

    void loadStats();

    return () => {
      isMounted = false;
    };
  }, [authUser]);

  useEffect(() => {
    if (!authUser) {
      setHistory(portalHistoryPreview);
      setRemoteStatus("history", "idle");
      return;
    }

    const currentAuthUser = authUser;
    let isMounted = true;
    setRemoteStatus("history", "loading");

    async function loadHistory() {
      try {
        const records = await fetchPortalHistory(currentAuthUser.id);

        if (!isMounted) {
          return;
        }

        setHistory(records.length > 0 ? mapHistoryRecords(records) : portalHistoryPreview);
      } catch (error) {
        console.error("Unable to load remote portal history", error);

        if (isMounted) {
          setHistory(portalHistoryPreview);
        }
      } finally {
        if (isMounted) {
          setRemoteStatus("history", "ready");
        }
      }
    }

    void loadHistory();

    return () => {
      isMounted = false;
    };
  }, [authUser]);

  useEffect(() => {
    if (!authUser) {
      setBillingProfile(portalBillingProfile);
      setInvoices(portalInvoiceHistory);
      setRemoteStatus("billing", "idle");
      return;
    }

    const currentAuthUser = authUser;
    let isMounted = true;
    setRemoteStatus("billing", "loading");

    async function loadBilling() {
      try {
        const [profileRecord, invoiceRecords] = await Promise.all([
          fetchPortalBillingProfile(currentAuthUser.id),
          fetchPortalInvoices(currentAuthUser.id),
        ]);

        if (!isMounted) {
          return;
        }

        setBillingProfile(mapBillingProfileRecord(profileRecord) ?? portalBillingProfile);
        setInvoices(invoiceRecords.length > 0 ? mapInvoiceRecords(invoiceRecords) : portalInvoiceHistory);
      } catch (error) {
        console.error("Unable to load remote portal billing", error);

        if (isMounted) {
          setBillingProfile(portalBillingProfile);
          setInvoices(portalInvoiceHistory);
        }
      } finally {
        if (isMounted) {
          setRemoteStatus("billing", "ready");
        }
      }
    }

    void loadBilling();

    return () => {
      isMounted = false;
    };
  }, [authUser]);

  useEffect(() => {
    if (!authUser) {
      setSettingsPreferences(portalSettingsPreferences);
      setRemoteStatus("settings", "idle");
      return;
    }

    const currentAuthUser = authUser;
    let isMounted = true;
    setRemoteStatus("settings", "loading");

    async function loadSettingsPreferences() {
      try {
        const record = await fetchPortalSettingsPreferences(currentAuthUser.id);

        if (!isMounted) {
          return;
        }

        setSettingsPreferences(mapSettingsPreferencesRecord(record) ?? portalSettingsPreferences);
      } catch (error) {
        console.error("Unable to load remote portal settings preferences", error);

        if (isMounted) {
          setSettingsPreferences(portalSettingsPreferences);
        }
      } finally {
        if (isMounted) {
          setRemoteStatus("settings", "ready");
        }
      }
    }

    void loadSettingsPreferences();

    return () => {
      isMounted = false;
    };
  }, [authUser]);

  const value = useMemo<PortalSessionContextValue>(
    () => ({
      isReady: sessionSnapshot.isReady,
      isAuthenticated: sessionSnapshot.isAuthenticated,
      isSupabaseAuthEnabled,
      isProfileRemote: sessionSnapshot.isProfileRemote,
      isMembershipRemote: sessionSnapshot.isMembershipRemote,
      isStatsRemote: sessionSnapshot.isStatsRemote,
      isHistoryRemote: sessionSnapshot.isHistoryRemote,
      isBillingRemote: sessionSnapshot.isBillingRemote,
      isSettingsRemote: sessionSnapshot.isSettingsRemote,
      isMembershipLoading: sessionSnapshot.isMembershipLoading,
      isStatsLoading: sessionSnapshot.isStatsLoading,
      isHistoryLoading: sessionSnapshot.isHistoryLoading,
      isBillingLoading: sessionSnapshot.isBillingLoading,
      isSettingsLoading: sessionSnapshot.isSettingsLoading,
      authUser,
      player: sessionSnapshot.isAuthenticated ? getPlayerFromProfile(profileDraft, authUser) : null,
      profile: sessionSnapshot.isAuthenticated ? getPortalProfileSnapshot(profileDraft) : null,
      membership: sessionSnapshot.isAuthenticated ? membership : null,
      billingProfile: sessionSnapshot.isAuthenticated ? billingProfile : null,
      invoices: sessionSnapshot.isAuthenticated ? invoices : [],
      settingsPreferences: sessionSnapshot.isAuthenticated ? settingsPreferences : null,
      stats: sessionSnapshot.isAuthenticated ? stats : null,
      sportBreakdowns: sessionSnapshot.isAuthenticated ? sportBreakdowns : [],
      history: sessionSnapshot.isAuthenticated ? history : [],
      saveSettingsPreferences: async (nextPreferences) => {
        setSettingsPreferences(nextPreferences);
        const currentAuthUser = authUser;

        if (!currentAuthUser) {
          return;
        }

        await upsertPortalSettingsPreferences({
          user_id: currentAuthUser.id,
          match_alerts_email: nextPreferences.matchAlertsEmail,
          bracket_updates_email: nextPreferences.bracketUpdatesEmail,
          circle_activity_email: nextPreferences.circleActivityEmail,
          partner_offers_email: nextPreferences.partnerOffersEmail,
          sms_alerts_enabled: nextPreferences.smsAlertsEnabled,
        });
      },
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
        setAuthState({ status: "demo", session: null, user: null });
      },
      signOut: () => {
        window.localStorage.removeItem(STORAGE_KEY);

        if (sessionSnapshot.authSession && supabase) {
          void supabase.auth.signOut();
        }

        setAuthState({ status: "signed_out", session: null, user: null });
      },
    }),
    [
      authUser,
      identityKey,
      sessionSnapshot,
      isSupabaseAuthEnabled,
      billingProfile,
      history,
      invoices,
      membership,
      settingsPreferences,
      sportBreakdowns,
      stats,
      profileDraft,
    ],
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
