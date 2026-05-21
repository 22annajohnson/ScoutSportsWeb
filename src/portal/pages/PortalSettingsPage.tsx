import { FormEvent, useEffect, useMemo, useState } from "react";
import { Bell, CheckCircle2, Download, Settings2, ShieldAlert } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { type PortalSettingsPreferences } from "../lib/mockPortal";
import { PortalPageHeader } from "../components/PortalPageHeader";
import { usePortalSession } from "../lib/session";

const SUPPORT_EMAIL = "support@scoutsports.app";

function getMailto(subject: string, body: string) {
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function PortalSettingsPage() {
  const {
    authUser,
    billingProfile,
    isSettingsLoading,
    isSettingsRemote,
    membership,
    player,
    saveSettingsPreferences,
    settingsPreferences,
  } = usePortalSession();
  const [formState, setFormState] = useState<PortalSettingsPreferences | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!settingsPreferences) {
      return;
    }

    setFormState(settingsPreferences);
  }, [settingsPreferences]);

  const hasUnsavedChanges = useMemo(() => {
    if (!formState || !settingsPreferences) {
      return false;
    }

    return JSON.stringify(formState) !== JSON.stringify(settingsPreferences);
  }, [formState, settingsPreferences]);

  if (!authUser || !billingProfile || !formState || !membership || !player || !settingsPreferences) {
    return null;
  }

  function updateField<K extends keyof PortalSettingsPreferences>(field: K, value: PortalSettingsPreferences[K]) {
    setFormState((current) => (current ? { ...current, [field]: value } : current));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveMessage("");
    setErrorMessage("");
    const currentSettings = formState;

    if (!currentSettings) {
      return;
    }

    setIsSaving(true);

    try {
      await saveSettingsPreferences(currentSettings);
      setSaveMessage("Settings saved to your portal account.");
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong while saving your settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  const exportMailto = getMailto(
    "Scout player portal data export request",
    `Hi Scout team,\n\nI would like to request an export of my player portal data.\n\nAccount email: ${authUser.email ?? player.email}\nPlayer name: ${player.fullName}\n\nThanks.`,
  );
  const deleteMailto = getMailto(
    "Scout player account closure request",
    `Hi Scout team,\n\nI would like to request closure of my Scout player account.\n\nAccount email: ${authUser.email ?? player.email}\nPlayer name: ${player.fullName}\nCurrent membership: ${membership.tier}\n\nPlease let me know the next steps.\n`,
  );

  return (
    <>
      <PortalPageHeader
        eyebrow="Settings"
        title="Notifications, access, and account actions."
        description={
          isSettingsRemote
            ? "This page gives players a real account-level settings surface: notification preferences, support handoff, and data actions in one place."
            : "This settings page rounds out the player portal MVP with account preferences and support handoff states."
        }
        aside={
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">
            {isSettingsLoading ? "Syncing settings..." : hasUnsavedChanges ? "Unsaved changes" : "All settings saved"}
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <GlassCard className="p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Preferences</p>
              <h3 className="mt-3 font-display text-3xl font-black text-white">Notification settings</h3>
            </div>
            <Bell className="mt-1 h-5 w-5 text-violet-200" />
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {[
              ["matchAlertsEmail", "Match alerts", "Email when someone new is a strong fit or a match request needs your response."],
              ["bracketUpdatesEmail", "Bracket updates", "Email when bracket rounds advance, fill up, or need a result confirmation."],
              ["circleActivityEmail", "Circle activity", "Email when your circles get new posts, invites, or active run scheduling."],
              ["partnerOffersEmail", "Premium offers", "Occasional emails about partner drops, perks, and local Scout promotions."],
              ["smsAlertsEnabled", "SMS alerts", "Text-first alerts for important match timing or bracket changes when that channel is enabled."],
            ].map(([field, label, description]) => {
              const key = field as keyof PortalSettingsPreferences;

              return (
                <label
                  key={field}
                  className="flex items-start justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-5"
                >
                  <div>
                    <p className="text-base font-semibold text-white">{label}</p>
                    <p className="mt-2 text-sm leading-7 text-white/65">{description}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formState[key]}
                    onChange={(event) => updateField(key, event.target.checked as PortalSettingsPreferences[typeof key])}
                    className="mt-1 h-5 w-5 rounded border-white/20 bg-black/20 text-violet-400 focus:ring-violet-400"
                  />
                </label>
              );
            })}

            {saveMessage ? (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
                {saveMessage}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-accent-purple to-accent-blue px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving settings..." : "Save settings"}
            </button>
          </form>
        </GlassCard>

        <div className="grid gap-5">
          <GlassCard className="p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">Account</p>
                <h3 className="mt-3 font-display text-3xl font-black text-white">Portal access details</h3>
              </div>
              <Settings2 className="mt-1 h-5 w-5 text-violet-200" />
            </div>

            <div className="mt-6 grid gap-4">
              {[
                ["Signed-in email", authUser.email ?? player.email],
                ["Membership tier", membership.tier],
                ["Billing contact", billingProfile.billingContactEmail],
                ["Payment method", billingProfile.paymentMethod],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-white/45">{label}</p>
                  <p className="mt-2 text-base leading-7 text-white/75">{value}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">Data actions</p>
                <h3 className="mt-3 font-display text-3xl font-black text-white">Export or close account</h3>
              </div>
              <Download className="mt-1 h-5 w-5 text-violet-200" />
            </div>

            <p className="mt-4 text-sm leading-7 text-white/65">
              These actions are routed through support for the MVP so we can keep the portal trustworthy before every automation is live.
            </p>

            <div className="mt-6 grid gap-4">
              <a
                href={exportMailto}
                className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5 text-left transition hover:border-violet-300/30 hover:bg-white/[0.04]"
              >
                <p className="text-base font-semibold text-white">Request data export</p>
                <p className="mt-2 text-sm leading-7 text-white/65">
                  Opens an email to support with your account context pre-filled.
                </p>
              </a>
              <a
                href={deleteMailto}
                className="rounded-[1.5rem] border border-rose-300/20 bg-rose-500/10 p-5 text-left transition hover:border-rose-300/35 hover:bg-rose-500/15"
              >
                <p className="text-base font-semibold text-white">Request account closure</p>
                <p className="mt-2 text-sm leading-7 text-white/75">
                  Starts a support-led closure flow so membership and account data can be handled correctly.
                </p>
              </a>
            </div>
          </GlassCard>

          <GlassCard className="p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">MVP guardrail</p>
                <h3 className="mt-3 font-display text-3xl font-black text-white">Human support stays in the loop</h3>
              </div>
              <ShieldAlert className="mt-1 h-5 w-5 text-violet-200" />
            </div>
            <p className="mt-4 text-sm leading-7 text-white/65">
              The portal now handles the high-signal self-serve settings that matter for launch, while more sensitive actions
              like account closure stay support-assisted until the backend workflows are ready.
            </p>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
