import { FormEvent, useMemo, useState } from "react";
import { ShieldCheck, UserPlus, Users2 } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { BusinessPortalPageHeader } from "../components/BusinessPortalPageHeader";
import { useBusinessPortalSession } from "../lib/session";
import { type BusinessTeamMemberRole } from "../lib/mockBusinessPortal";

const roleOptions: BusinessTeamMemberRole[] = ["Owner", "Manager", "Analyst", "Billing Admin"];

export function BusinessPortalTeamPage() {
  const { inviteTeamMember, team, toggleTeamMemberStatus, updateTeamMemberRole } = useBusinessPortalSession();
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<BusinessTeamMemberRole>("Manager");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const teamSummary = useMemo(
    () => ({
      active: team.filter((member) => member.status === "Active").length,
      invited: team.filter((member) => member.status === "Invited").length,
      paused: team.filter((member) => member.status === "Paused").length,
    }),
    [team],
  );

  async function handleInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!inviteName.trim() || !inviteEmail.trim()) {
      setErrorMessage("Name and email are required to send an invite.");
      return;
    }

    if (!inviteEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    await inviteTeamMember({
      name: inviteName.trim(),
      email: inviteEmail.trim().toLowerCase(),
      role: inviteRole,
    });

    setInviteName("");
    setInviteEmail("");
    setInviteRole("Manager");
    setMessage("Invitation added to the demo workspace.");
  }

  return (
    <>
      <BusinessPortalPageHeader
        eyebrow="Team access"
        title="Roles, invites, and workspace permissions."
        description="Phase 1 focuses on the account-level controls businesses need first: who can get in, what role they hold, and whether access is active, pending, or paused."
        aside={
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">
            {teamSummary.active} active • {teamSummary.invited} invited • {teamSummary.paused} paused
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_1.05fr]">
        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { label: "Active", value: String(teamSummary.active) },
              { label: "Invited", value: String(teamSummary.invited) },
              { label: "Paused", value: String(teamSummary.paused) },
            ].map((item) => (
              <GlassCard key={item.label} className="p-6">
                <p className="text-sm text-white/50">{item.label}</p>
                <p className="mt-2 font-display text-4xl font-black text-white">{item.value}</p>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">Invite flow</p>
                <h3 className="mt-3 font-display text-3xl font-black text-white">Add a teammate</h3>
              </div>
              <UserPlus className="mt-1 h-5 w-5 text-emerald-200" />
            </div>

            <form className="mt-6 grid gap-4" onSubmit={handleInvite}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-white/70">Name</span>
                  <input value={inviteName} onChange={(event) => setInviteName(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50" placeholder="Casey Morgan" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-white/70">Email</span>
                  <input value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50" placeholder="casey@harborfit.co" />
                </label>
              </div>

              <label className="space-y-2">
                <span className="text-sm text-white/70">Role</span>
                <select value={inviteRole} onChange={(event) => setInviteRole(event.target.value as BusinessTeamMemberRole)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition focus:border-emerald-300/50">
                  {roleOptions.map((role) => (
                    <option key={role} value={role} className="bg-slate-950 text-white">
                      {role}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                <p className="text-sm leading-7 text-white/65">
                  In production, invites should create expiring tokens, send email, and log an audit event tied to the
                  actor, role, and target workspace.
                </p>
              </div>

              {errorMessage ? <p className="text-sm text-rose-300">{errorMessage}</p> : null}
              {message ? <p className="text-sm text-emerald-200">{message}</p> : null}

              <button type="submit" className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-500 px-6 py-4 text-sm font-semibold text-slate-950 shadow-glow transition duration-300 hover:scale-[1.01] hover:opacity-95">
                Send invite
              </button>
            </form>
          </GlassCard>
        </div>

        <GlassCard className="p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Membership roster</p>
              <h3 className="mt-3 font-display text-3xl font-black text-white">Current team</h3>
            </div>
            <Users2 className="mt-1 h-5 w-5 text-emerald-200" />
          </div>

          <div className="mt-6 grid gap-4">
            {team.map((member) => (
              <div key={member.id} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-white/55">{member.email}</p>
                    <h4 className="mt-1 text-lg font-semibold text-white">{member.name}</h4>
                    <p className="mt-2 text-sm text-white/55">Last active: {member.lastActive}</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80">
                    {member.status}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <select value={member.role} onChange={(event) => void updateTeamMemberRole(member.id, event.target.value as BusinessTeamMemberRole)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition focus:border-emerald-300/50" disabled={member.role === "Owner"}>
                    {roleOptions.map((role) => (
                      <option key={role} value={role} className="bg-slate-950 text-white">
                        {role}
                      </option>
                    ))}
                  </select>

                  <button type="button" onClick={() => void toggleTeamMemberStatus(member.id)} disabled={member.role === "Owner"} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40">
                    <ShieldCheck className="h-4 w-4" />
                    {member.status === "Paused" ? "Reactivate" : "Pause access"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  );
}
