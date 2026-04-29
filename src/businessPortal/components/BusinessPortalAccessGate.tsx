import { FormEvent, useEffect, useMemo, useState } from "react";
import { Building2, ShieldCheck, Sparkles } from "lucide-react";
import { Outlet, useSearchParams } from "react-router-dom";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { GlassCard } from "@/components/GlassCard";
import { routes } from "@/lib/routes";
import { hasSupabaseConfig, signInWithMagicLink } from "@/lib/supabase";
import { useBusinessPortalSession } from "../lib/session";
import { businessPortalProfileDraftSeed, type BusinessPortalProfileDraft } from "../lib/mockBusinessPortal";

export function BusinessPortalAccessGate() {
  const {
    acceptInvitationToken,
    backendError,
    createWorkspace,
    isAcceptingInvitation,
    isAuthenticated,
    isProvisioningBusiness,
    isReady,
    needsBusinessSetup,
    signInAsDemo,
    user,
  } = useBusinessPortalSession();
  const [searchParams, setSearchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState<"idle" | "sending" | "sent">("idle");
  const [emailMessage, setEmailMessage] = useState("");
  const [workspaceError, setWorkspaceError] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [formState, setFormState] = useState<BusinessPortalProfileDraft>(businessPortalProfileDraftSeed);

  const inviteToken = searchParams.get("invite");
  const supabaseAvailable = hasSupabaseConfig();
  const [showCreateWorkspaceForm, setShowCreateWorkspaceForm] = useState(!inviteToken);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
      setFormState((current) => ({
        ...current,
        supportEmail: current.supportEmail || user.email || "",
      }));
    }
  }, [user?.email]);

  useEffect(() => {
    setShowCreateWorkspaceForm(!inviteToken);
  }, [inviteToken]);

  const canShowAuthCard = useMemo(() => supabaseAvailable && !isAuthenticated, [isAuthenticated, supabaseAvailable]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <GlassCard className="w-full max-w-md p-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl border border-white/10 bg-white/5" />
          <p className="mt-5 text-sm uppercase tracking-[0.3em] text-white/45">Loading business portal</p>
          <h1 className="mt-3 font-display text-3xl font-black text-white">Preparing your business workspace.</h1>
        </GlassCard>
      </div>
    );
  }

  async function handleMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailMessage("");
    setEmailState("idle");

    if (!email.trim() || !email.includes("@")) {
      setEmailMessage("Enter a valid email address to receive a login link.");
      return;
    }

    setEmailState("sending");

    try {
      const redirectPath = inviteToken ? `/business-portal?invite=${encodeURIComponent(inviteToken)}` : "/business-portal";
      await signInWithMagicLink(email.trim().toLowerCase(), redirectPath);
      setEmailState("sent");
      setEmailMessage("Check your email for the Supabase magic link, then come back here.");
    } catch (error) {
      console.error(error);
      setEmailState("idle");
      setEmailMessage(error instanceof Error ? error.message : "Unable to send the login link.");
    }
  }

  function updateField<K extends keyof BusinessPortalProfileDraft>(field: K, value: BusinessPortalProfileDraft[K]) {
    setFormState((current) => ({ ...current, [field]: value }));
  }

  function parseCommaSeparated(value: string) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function handleCreateWorkspace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWorkspaceError("");

    const requiredFields = [
      formState.displayName,
      formState.legalName,
      formState.slug,
      formState.category,
      formState.supportEmail,
    ];

    if (requiredFields.some((field) => !field.trim())) {
      setWorkspaceError("Display name, legal name, slug, category, and support email are required.");
      return;
    }

    if (!formState.supportEmail.includes("@")) {
      setWorkspaceError("Support email must be valid.");
      return;
    }

    try {
      await createWorkspace({
        ...formState,
        displayName: formState.displayName.trim(),
        legalName: formState.legalName.trim(),
        slug: formState.slug.trim().toLowerCase(),
        category: formState.category.trim(),
        supportEmail: formState.supportEmail.trim().toLowerCase(),
        phone: formState.phone.trim(),
        website: formState.website.trim(),
        description: formState.description.trim(),
        locations: formState.locations.map((item) => item.trim()).filter(Boolean),
      });
    } catch (error) {
      console.error(error);
      setWorkspaceError(error instanceof Error ? error.message : "Unable to create the business workspace.");
    }
  }

  async function handleAcceptInvite() {
    if (!inviteToken) {
      return;
    }

    setWorkspaceError("");
    setInviteError("");

    try {
      await acceptInvitationToken(inviteToken);
      searchParams.delete("invite");
      setSearchParams(searchParams, { replace: true });
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Unable to accept the business invitation.";
      setInviteError(message);
    }
  }

  if (!isAuthenticated) {
    return (
      <section className="min-h-screen py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
                Business portal foundation preview
              </div>
              <div>
                <h1 className="font-display text-5xl font-black leading-[0.92] tracking-tight text-white sm:text-6xl">
                  Run your business workspace,
                  <br />
                  team access, billing, and
                  <br />
                  <span className="bg-gradient-to-r from-emerald-200 via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                    launch readiness in one place.
                  </span>
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
                  This business portal is separate from the player membership portal and focuses on business settings,
                  team roles, billing visibility, and audit-style activity before ads and analytics arrive.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={signInAsDemo}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-500 px-6 py-4 text-sm font-semibold text-slate-950 shadow-glow transition duration-300 hover:scale-[1.01] hover:opacity-95"
                >
                  Enter business demo
                  <Sparkles className="h-4 w-4" />
                </button>
                <Button href={routes.business} variant="secondary" className="px-6 py-4">
                  Back to business page
                </Button>
              </div>
            </div>

            <div className="grid gap-5">
              <GlassCard className="relative overflow-hidden p-8">
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-emerald-400/25 via-cyan-400/10 to-blue-500/20 blur-3xl" />
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-200">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <p className="mt-6 text-sm uppercase tracking-[0.3em] text-white/45">What Phase 1 covers</p>
                  <div className="mt-6 grid gap-4">
                    {[
                      "Business account shell with owner context and verification status",
                      "Team roles, invite flow, and access pause controls",
                      "Billing settings, payment visibility, and invoice history preview",
                      "A foundation activity log for sensitive account actions",
                    ].map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white/75">
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center gap-3 rounded-2xl border border-amber-300/15 bg-amber-500/10 px-4 py-4 text-sm text-amber-100">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    Demo mode is still available, but you can also sign in with Supabase below.
                  </div>
                </div>
              </GlassCard>

              {canShowAuthCard ? (
                <GlassCard className="p-8">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">Supabase access</p>
                  <h2 className="mt-3 font-display text-3xl font-black text-white">Email me a login link</h2>
                  <p className="mt-3 text-sm leading-7 text-white/65">
                    Use a Supabase magic link to sign in, then create or join your business workspace.
                  </p>

                  <form className="mt-6 grid gap-4" onSubmit={handleMagicLink}>
                    <label className="space-y-2">
                      <span className="text-sm text-white/70">Email</span>
                      <input
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50"
                        placeholder="owner@yourbusiness.com"
                      />
                    </label>

                    {emailMessage ? (
                      <p className={`text-sm ${emailState === "sent" ? "text-emerald-200" : "text-rose-300"}`}>
                        {emailMessage}
                      </p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={emailState === "sending"}
                      className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-500 px-6 py-4 text-sm font-semibold text-slate-950 shadow-glow transition duration-300 hover:scale-[1.01] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {emailState === "sending" ? "Sending..." : "Email me a login link"}
                    </button>
                  </form>
                </GlassCard>
              ) : null}
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (needsBusinessSetup) {
    return (
      <section className="min-h-screen py-16 sm:py-20">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.88fr_1.12fr]">
            <GlassCard className="p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Workspace setup</p>
              <h1 className="mt-3 font-display text-4xl font-black text-white">
                {inviteToken ? "Join your business workspace" : "Create your business portal workspace"}
              </h1>
              <p className="mt-4 text-sm leading-7 text-white/65">
                {inviteToken
                  ? "You are signed in, but this account does not have an active business membership yet. If this invitation belongs to your email, accept it to join the workspace."
                  : "You are signed in, but this account does not have an active business membership yet. Create your first workspace or accept an invitation."}
              </p>

              {inviteToken ? (
                <div className="mt-6 rounded-[1.5rem] border border-emerald-300/20 bg-emerald-500/10 p-5">
                  <p className="text-sm font-semibold text-emerald-100">Invitation detected</p>
                  <p className="mt-2 text-sm leading-7 text-emerald-100/80">
                    This link includes a business invitation token. If this email matches the invite, you can join the
                    workspace directly.
                  </p>
                  {inviteError ? <p className="mt-3 text-sm text-rose-200">{inviteError}</p> : null}
                  <button
                    type="button"
                    onClick={() => void handleAcceptInvite()}
                    disabled={isAcceptingInvitation}
                    className="mt-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-glow transition duration-300 hover:scale-[1.01] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isAcceptingInvitation ? "Accepting..." : "Accept business invitation"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateWorkspaceForm((current) => !current)}
                    className="mt-3 inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    {showCreateWorkspaceForm ? "Hide create-new-business form" : "Want to create a new business instead?"}
                  </button>
                </div>
              ) : null}

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-5 text-sm leading-7 text-white/65">
                Signed in as {user?.email ?? "your account"}. If you expected to see an existing business here, that
                account likely does not yet have an active membership in the new business portal tables.
              </div>
            </GlassCard>

            <GlassCard className={`p-8 ${inviteToken && !showCreateWorkspaceForm ? "hidden lg:block lg:opacity-45" : ""}`}>
              {inviteToken && !showCreateWorkspaceForm ? (
                <div className="flex h-full min-h-[240px] items-center justify-center rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 p-8 text-center text-sm leading-7 text-white/60">
                  The create-new-business form is hidden so the invitation flow stays front and center. Use the button
                  on the left if you want to create a separate workspace instead.
                </div>
              ) : (
              <form className="grid gap-4" onSubmit={handleCreateWorkspace}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm text-white/70">Display name</span>
                    <input
                      value={formState.displayName}
                      onChange={(event) => updateField("displayName", event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50"
                      placeholder="Harbor Fit Social Club"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm text-white/70">Legal name</span>
                    <input
                      value={formState.legalName}
                      onChange={(event) => updateField("legalName", event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm text-white/70">Workspace slug</span>
                    <input
                      value={formState.slug}
                      onChange={(event) => updateField("slug", event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50"
                      placeholder="harbor-fit-social-club"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm text-white/70">Category</span>
                    <input
                      value={formState.category}
                      onChange={(event) => updateField("category", event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm text-white/70">Support email</span>
                    <input
                      value={formState.supportEmail}
                      onChange={(event) => updateField("supportEmail", event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm text-white/70">Phone</span>
                    <input
                      value={formState.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50"
                    />
                  </label>
                </div>

                <label className="space-y-2">
                  <span className="text-sm text-white/70">Website</span>
                  <input
                    value={formState.website}
                    onChange={(event) => updateField("website", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-white/70">Locations</span>
                  <input
                    value={formState.locations.join(", ")}
                    onChange={(event) => updateField("locations", parseCommaSeparated(event.target.value))}
                    className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50"
                    placeholder="Williamsburg, Brooklyn, Greenpoint, Brooklyn"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-white/70">Business description</span>
                  <textarea
                    value={formState.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    className="min-h-32 w-full resize-none rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50"
                  />
                </label>

                {workspaceError || backendError ? (
                  <p className="text-sm text-rose-300">{workspaceError || backendError}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={isProvisioningBusiness}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-500 px-6 py-4 text-sm font-semibold text-slate-950 shadow-glow transition duration-300 hover:scale-[1.01] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isProvisioningBusiness ? "Creating workspace..." : "Create business workspace"}
                </button>
              </form>
              )}
            </GlassCard>
          </div>
        </Container>
      </section>
    );
  }

  return <Outlet />;
}
