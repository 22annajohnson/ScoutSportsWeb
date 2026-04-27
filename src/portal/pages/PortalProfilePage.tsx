import { FormEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, PencilLine, RotateCcw, UserRound } from "lucide-react";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { routes } from "@/lib/routes";
import { type PortalProfileDraft } from "../lib/mockPortal";
import { PortalPageHeader } from "../components/PortalPageHeader";
import { usePortalSession } from "../lib/session";

export function PortalProfilePage() {
  const { profile, saveProfile, resetProfile } = usePortalSession();
  const [formState, setFormState] = useState<PortalProfileDraft | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!profile) {
      return;
    }

    setFormState({
      fullName: profile.fullName,
      username: profile.username,
      city: profile.city,
      primarySport: profile.primarySport,
      secondarySports: profile.secondarySports,
      skillLevel: profile.skillLevel,
      bio: profile.bio,
      availability: profile.availability,
      vibeTags: profile.vibeTags,
    });
  }, [profile]);

  const hasUnsavedChanges = useMemo(() => {
    if (!profile || !formState) {
      return false;
    }

    return JSON.stringify({
      ...profile,
      completionPercent: undefined,
    }) !== JSON.stringify({ ...formState, completionPercent: undefined });
  }, [formState, profile]);

  if (!profile || !formState) {
    return null;
  }

  function updateField<K extends keyof PortalProfileDraft>(field: K, value: PortalProfileDraft[K]) {
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

    const currentProfile = formState;

    if (!currentProfile) {
      return;
    }

    if (
      !currentProfile.fullName.trim() ||
      !currentProfile.username.trim() ||
      !currentProfile.city.trim() ||
      !currentProfile.primarySport.trim()
    ) {
      setErrorMessage("Full name, username, city, and primary sport are required.");
      return;
    }

    if (!currentProfile.username.startsWith("@")) {
      setErrorMessage("Username should start with @ so it matches the Scout profile format.");
      return;
    }

    setIsSaving(true);

    try {
      await saveProfile({
        ...currentProfile,
        fullName: currentProfile.fullName.trim(),
        username: currentProfile.username.trim(),
        city: currentProfile.city.trim(),
        primarySport: currentProfile.primarySport.trim(),
        skillLevel: currentProfile.skillLevel.trim(),
        bio: currentProfile.bio.trim(),
        availability: currentProfile.availability.trim(),
      });
      setSaveMessage("Profile saved. This draft is synced across the portal preview.");
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong while saving your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <PortalPageHeader
        eyebrow="Profile"
        title="Player identity and profile settings."
        description="This portal pass turns the profile into a real editable flow. It is still local-preview data for now, but the page is structured for future account-backed reads and writes."
        aside={
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">
            {hasUnsavedChanges ? "Unsaved changes" : "All changes saved"}
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <GlassCard className="p-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 text-violet-200">
            <UserRound className="h-5 w-5" />
          </div>
          <p className="mt-5 text-xs uppercase tracking-[0.3em] text-white/45">Completion</p>
          <h3 className="mt-3 font-display text-4xl font-black text-white">
            {profile.completionPercent}%
          </h3>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-purple to-accent-blue"
              style={{ width: `${profile.completionPercent}%` }}
            />
          </div>
          <p className="mt-4 text-sm leading-7 text-white/65">
            Profile strength will help improve matching quality, circle invites, and how a player appears in discovery.
          </p>

          <div className="mt-6 grid gap-3">
            {[
              `Primary sport: ${profile.primarySport}`,
              `City: ${profile.city}`,
              `Availability: ${profile.availability}`,
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">
                {item}
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Editable profile</p>
              <h3 className="mt-3 font-display text-3xl font-black text-white">Public player profile</h3>
            </div>
            <PencilLine className="mt-1 h-5 w-5 text-violet-200" />
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-white/70">Full name</span>
                <input
                  value={formState.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-300/50"
                  placeholder="Alyssa Carter"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-white/70">Username</span>
                <input
                  value={formState.username}
                  onChange={(event) => updateField("username", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-300/50"
                  placeholder="@alyssaplays"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-white/70">City</span>
                <input
                  value={formState.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-300/50"
                  placeholder="Brooklyn, NY"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-white/70">Primary sport</span>
                <input
                  value={formState.primarySport}
                  onChange={(event) => updateField("primarySport", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-300/50"
                  placeholder="Pickleball"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-white/70">Secondary sports</span>
                <input
                  value={formState.secondarySports.join(", ")}
                  onChange={(event) => updateField("secondarySports", parseCommaSeparated(event.target.value))}
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-300/50"
                  placeholder="Tennis, padel"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-white/70">Skill level</span>
                <input
                  value={formState.skillLevel}
                  onChange={(event) => updateField("skillLevel", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-300/50"
                  placeholder="Competitive social"
                />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm text-white/70">Availability</span>
              <input
                value={formState.availability}
                onChange={(event) => updateField("availability", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-300/50"
                placeholder="Weeknights after 6pm, Saturday mornings"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm text-white/70">Vibe tags</span>
              <input
                value={formState.vibeTags.join(", ")}
                onChange={(event) => updateField("vibeTags", parseCommaSeparated(event.target.value))}
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-300/50"
                placeholder="Competitive, reliable, social after"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm text-white/70">Bio</span>
              <textarea
                value={formState.bio}
                onChange={(event) => updateField("bio", event.target.value)}
                className="min-h-36 w-full resize-none rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-300/50"
                placeholder="Tell players what kind of games, people, and energy you are looking for."
              />
            </label>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
              <p className="text-sm leading-7 text-white/65">
                This profile flow is local-preview only for now. In the next backend pass, these fields should map to
                the real player profile table and save through authenticated account writes.
              </p>
            </div>

            {errorMessage ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
                {errorMessage}
              </div>
            ) : null}

            {saveMessage ? (
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-100">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{saveMessage}</span>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-purple to-accent-blue px-6 py-4 text-sm font-semibold text-white shadow-glow transition duration-300 hover:scale-[1.01] hover:opacity-95"
              >
                {isSaving ? "Saving..." : "Save profile"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetProfile();
                  setSaveMessage("Profile reset to the default preview state.");
                  setErrorMessage("");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4" />
                Reset preview
              </button>
              <Button href={routes.portal} variant="ghost" className="px-2 py-4">
                Back to overview
              </Button>
            </div>
          </form>
        </GlassCard>
      </div>
    </>
  );
}
