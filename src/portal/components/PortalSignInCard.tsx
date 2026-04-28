import { FormEvent, useState } from "react";
import { MailCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { routes } from "@/lib/routes";
import { usePortalSession } from "../lib/session";

export function PortalSignInCard() {
  const { isSupabaseAuthEnabled, signInAsDemo, signInWithEmail } = usePortalSession();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage("Enter the email tied to the player account you want to open.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signInWithEmail(email.trim());
      setSuccessMessage("Magic link sent. Open it on this device to finish entering the portal.");
    } catch (error) {
      console.error(error);
      setErrorMessage("Portal sign-in could not start. Check Supabase Auth configuration and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <GlassCard className="relative overflow-hidden p-8">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-accent-purple/30 via-fuchsia-500/10 to-accent-blue/20 blur-3xl" />
      <div className="relative">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-violet-200">
          <MailCheck className="h-6 w-6" />
        </div>
        <p className="mt-6 text-sm uppercase tracking-[0.3em] text-white/45">Portal access</p>
        <h2 className="mt-3 font-display text-4xl font-black text-white">Enter with your player email.</h2>
        <p className="mt-4 text-base leading-8 text-white/70">
          This foundation uses Supabase Auth magic links. Real profile, membership, and stats data can attach to this
          session later without changing the portal shell.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="space-y-2">
            <span className="text-sm text-white/70">Player email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={!isSupabaseAuthEnabled || isSubmitting}
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-300/50 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="player@example.com"
            />
          </label>

          {errorMessage ? (
            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-100">
              {successMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!isSupabaseAuthEnabled || isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-purple to-accent-blue px-6 py-4 text-sm font-semibold text-white shadow-glow transition duration-300 hover:scale-[1.01] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending link..." : "Send magic link"}
            <Sparkles className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
          <p className="text-sm leading-7 text-white/65">
            {isSupabaseAuthEnabled
              ? "If you just need to review the shell without logging into a real player account, the demo path is still available below."
              : "Supabase Auth is not configured in this environment yet, so only the demo preview is available right now."}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={signInAsDemo}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-white/10"
          >
            Enter demo portal
          </button>
          <Button href={routes.pricing} variant="ghost" className="px-2 py-4">
            Back to memberships
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
