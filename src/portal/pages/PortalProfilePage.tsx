import { PencilLine, UserRound } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { portalProfileSnapshot } from "../lib/mockPortal";
import { PortalPageHeader } from "../components/PortalPageHeader";

export function PortalProfilePage() {
  return (
    <>
      <PortalPageHeader
        eyebrow="Profile"
        title="Player identity and profile settings."
        description="The next step after the shell is making this page editable. For now it previews the structure and hierarchy for the account fields players will be able to maintain on the web."
        aside={
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">
            Edit flow in next PR
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
            {portalProfileSnapshot.completionPercent}%
          </h3>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-purple to-accent-blue"
              style={{ width: `${portalProfileSnapshot.completionPercent}%` }}
            />
          </div>
          <p className="mt-4 text-sm leading-7 text-white/65">
            Profile strength will help improve matching quality, circle invites, and how a player appears in discovery.
          </p>
        </GlassCard>

        <GlassCard className="p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Preview fields</p>
              <h3 className="mt-3 font-display text-3xl font-black text-white">Public player profile</h3>
            </div>
            <PencilLine className="mt-1 h-5 w-5 text-violet-200" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ["Full name", portalProfileSnapshot.fullName],
              ["Username", portalProfileSnapshot.username],
              ["City", portalProfileSnapshot.city],
              ["Primary sport", portalProfileSnapshot.primarySport],
              ["Secondary sports", portalProfileSnapshot.secondarySports.join(", ")],
              ["Skill level", portalProfileSnapshot.skillLevel],
              ["Availability", portalProfileSnapshot.availability],
              ["Vibe tags", portalProfileSnapshot.vibeTags.join(" • ")],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-white/45">{label}</p>
                <p className="mt-2 text-base leading-7 text-white/80">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-white/45">Bio</p>
            <p className="mt-2 text-base leading-8 text-white/75">{portalProfileSnapshot.bio}</p>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
