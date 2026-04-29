import { FormEvent, useEffect, useMemo, useState } from "react";
import { Building2, CheckCircle2, RotateCcw } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { BusinessPortalPageHeader } from "../components/BusinessPortalPageHeader";
import { useBusinessPortalSession } from "../lib/session";
import { type BusinessPortalProfileDraft } from "../lib/mockBusinessPortal";

export function BusinessPortalProfilePage() {
  const { business, currentRole, permissions, resetBusinessProfile, saveBusinessProfile } = useBusinessPortalSession();
  const [formState, setFormState] = useState<BusinessPortalProfileDraft | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!business) {
      return;
    }

    setFormState({
      displayName: business.displayName,
      legalName: business.legalName,
      slug: business.slug,
      category: business.category,
      supportEmail: business.supportEmail,
      phone: business.phone,
      website: business.website,
      description: business.description,
      locations: business.locations,
    });
  }, [business]);

  const hasUnsavedChanges = useMemo(() => {
    if (!business || !formState) {
      return false;
    }

    return JSON.stringify({
      ...business,
      completionPercent: undefined,
      verificationStatus: undefined,
      businessStatus: undefined,
    }) !== JSON.stringify({
      ...formState,
      completionPercent: undefined,
      verificationStatus: undefined,
      businessStatus: undefined,
    });
  }, [business, formState]);

  if (!business || !formState) {
    return null;
  }

  function updateField<K extends keyof BusinessPortalProfileDraft>(field: K, value: BusinessPortalProfileDraft[K]) {
    setFormState((current) => (current ? { ...current, [field]: value } : current));
  }

  function parseCommaSeparated(value: string) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveMessage("");
    setErrorMessage("");

    if (!permissions.canManageProfile) {
      setErrorMessage("Your current role can view the business profile, but cannot edit it.");
      return;
    }

    if (!formState) {
      return;
    }

    const requiredFields = [
      formState.displayName,
      formState.legalName,
      formState.slug,
      formState.category,
      formState.supportEmail,
    ];

    if (requiredFields.some((field) => !field.trim())) {
      setErrorMessage("Display name, legal name, slug, category, and support email are required.");
      return;
    }

    if (!formState.supportEmail.includes("@")) {
      setErrorMessage("Support email must be a valid business contact.");
      return;
    }

    setIsSaving(true);

    try {
      await saveBusinessProfile({
        ...formState,
        displayName: formState.displayName.trim(),
        legalName: formState.legalName.trim(),
        slug: formState.slug.trim().toLowerCase(),
        category: formState.category.trim(),
        supportEmail: formState.supportEmail.trim().toLowerCase(),
        phone: formState.phone.trim(),
        website: formState.website.trim(),
        description: formState.description.trim(),
      });
      setSaveMessage("Business profile saved. This preview is now synced across the portal.");
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong while saving the business profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    resetBusinessProfile();
    setSaveMessage("Business profile reset to the demo workspace defaults.");
    setErrorMessage("");
  }

  return (
    <>
      <BusinessPortalPageHeader
        eyebrow="Business settings"
        title="Business identity and verification details."
        description="This is the Phase 1 source of truth for how the business appears in the portal and what information is available for verification, billing, and future publishing workflows."
        aside={
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">
            {permissions.canManageProfile ? (hasUnsavedChanges ? "Unsaved changes" : "All changes saved") : "Read only"}
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <GlassCard className="p-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-400/20 to-sky-500/20 text-emerald-200">
            <Building2 className="h-5 w-5" />
          </div>
          <p className="mt-5 text-xs uppercase tracking-[0.3em] text-white/45">Completion</p>
          <h3 className="mt-3 font-display text-4xl font-black text-white">{business.completionPercent}%</h3>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-500"
              style={{ width: `${business.completionPercent}%` }}
            />
          </div>
          <p className="mt-4 text-sm leading-7 text-white/65">
            Completion here will later feed onboarding progress, review readiness, and how confidently the platform can
            open up spend-based features.
          </p>

          <div className="mt-6 grid gap-3">
            {[
              `Status: ${business.businessStatus}`,
              `Verification: ${business.verificationStatus}`,
              `Locations: ${business.locations.length}`,
            ].map((item) => (
              <div key={item} className="rounded-[1.25rem] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">
                {item}
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Editable business record</p>
              <h3 className="mt-3 font-display text-3xl font-black text-white">Core profile settings</h3>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              Verification-aware
            </div>
          </div>

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            {!permissions.canManageProfile ? (
              <div className="rounded-[1.5rem] border border-amber-300/15 bg-amber-500/10 p-5 text-sm leading-7 text-amber-100">
                You are signed in as {currentRole ?? "a viewer"}. Business settings are read-only for your role.
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-white/70">Display name</span>
                <input disabled={!permissions.canManageProfile} value={formState.displayName} onChange={(event) => updateField("displayName", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Harbor Fit Social Club" />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-white/70">Legal name</span>
                <input disabled={!permissions.canManageProfile} value={formState.legalName} onChange={(event) => updateField("legalName", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Harbor Fit Group LLC" />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-white/70">Workspace slug</span>
                <input disabled={!permissions.canManageProfile} value={formState.slug} onChange={(event) => updateField("slug", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50" placeholder="harbor-fit-social-club" />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-white/70">Category</span>
                <input disabled={!permissions.canManageProfile} value={formState.category} onChange={(event) => updateField("category", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Fitness studio and community club" />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-white/70">Support email</span>
                <input disabled={!permissions.canManageProfile} value={formState.supportEmail} onChange={(event) => updateField("supportEmail", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50" placeholder="team@harborfit.co" />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-white/70">Phone</span>
                <input disabled={!permissions.canManageProfile} value={formState.phone} onChange={(event) => updateField("phone", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50" placeholder="(718) 555-0144" />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm text-white/70">Website</span>
              <input disabled={!permissions.canManageProfile} value={formState.website} onChange={(event) => updateField("website", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50" placeholder="https://harborfit.co" />
            </label>

            <label className="space-y-2">
              <span className="text-sm text-white/70">Locations</span>
              <input disabled={!permissions.canManageProfile} value={formState.locations.join(", ")} onChange={(event) => updateField("locations", parseCommaSeparated(event.target.value))} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Williamsburg, Brooklyn, Greenpoint, Brooklyn" />
            </label>

            <label className="space-y-2">
              <span className="text-sm text-white/70">Business description</span>
              <textarea disabled={!permissions.canManageProfile} value={formState.description} onChange={(event) => updateField("description", event.target.value)} className="min-h-40 w-full resize-none rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Describe your business and what customers should know." />
            </label>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
              <p className="text-sm leading-7 text-white/65">
                In a backend pass, this form should save to a business profile record, generate audit events, and
                submit verification-sensitive changes into an approval workflow instead of applying them immediately.
              </p>
            </div>

            {errorMessage ? <p className="text-sm text-rose-300">{errorMessage}</p> : null}
            {saveMessage ? <p className="text-sm text-emerald-200">{saveMessage}</p> : null}

            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={!permissions.canManageProfile || isSaving} className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-500 px-6 py-4 text-sm font-semibold text-slate-950 shadow-glow transition duration-300 hover:scale-[1.01] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50">
                {permissions.canManageProfile ? (isSaving ? "Saving..." : "Save business profile") : "Business settings are read only"}
              </button>
              <button type="button" disabled={!permissions.canManageProfile} onClick={handleReset} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50">
                <RotateCcw className="h-4 w-4" />
                Reset demo data
              </button>
            </div>
          </form>
        </GlassCard>
      </div>
    </>
  );
}
