import { FormEvent, useEffect, useMemo, useState } from "react";
import { CreditCard, ReceiptText, ShieldCheck, WalletCards } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { type PortalBillingSettings } from "../lib/mockPortal";
import { PortalPageHeader } from "../components/PortalPageHeader";
import { usePortalSession } from "../lib/session";

export function PortalMembershipPage() {
  const { billing, invoices, saveBillingSettings } = usePortalSession();
  const [formState, setFormState] = useState<PortalBillingSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (billing) {
      setFormState(billing);
    }
  }, [billing]);

  const hasUnsavedChanges = useMemo(() => {
    if (!billing || !formState) {
      return false;
    }

    return JSON.stringify(billing) !== JSON.stringify(formState);
  }, [billing, formState]);

  if (!billing || !formState) {
    return null;
  }

  function updateField<K extends keyof PortalBillingSettings>(field: K, value: PortalBillingSettings[K]) {
    setFormState((current) => (current ? { ...current, [field]: value } : current));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveMessage("");
    setErrorMessage("");

    if (!formState) {
      return;
    }

    if (!formState.billingContactEmail.includes("@")) {
      setErrorMessage("Billing contact email must be valid.");
      return;
    }

    setIsSaving(true);

    try {
      await saveBillingSettings({
        ...formState,
        billingContactEmail: formState.billingContactEmail.trim().toLowerCase(),
        billingAddress: formState.billingAddress.trim(),
        paymentMethod: formState.paymentMethod.trim(),
        monthlyBudgetLabel: formState.monthlyBudgetLabel.trim(),
        spendCapLabel: formState.spendCapLabel.trim(),
      });
      setSaveMessage("Billing settings saved for the demo workspace.");
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong while saving billing settings.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <PortalPageHeader
        eyebrow="Billing"
        title="Billing controls and spend readiness."
        description="Phase 1 gives business owners one place to review plan state, payment details, budget guardrails, and recent invoices before a real billing provider is wired in."
        aside={
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">
            {hasUnsavedChanges ? "Unsaved changes" : "All changes saved"}
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_0.92fr]">
        <div className="grid gap-5">
          <GlassCard className="relative overflow-hidden p-7">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-emerald-400/20 via-cyan-400/10 to-sky-500/20 blur-3xl" />
            <div className="relative">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-400/20 to-sky-500/20 text-emerald-200">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-xs uppercase tracking-[0.3em] text-white/45">Current plan</p>
                  <h3 className="mt-3 font-display text-5xl font-black text-white">{billing.planName}</h3>
                  <p className="mt-3 inline-flex rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                    {billing.planStatus}
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-black/20 px-5 py-4 text-right">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">Budget posture</p>
                  <p className="mt-2 text-2xl font-black text-white">{billing.monthlyBudgetLabel}</p>
                  <p className="mt-1 text-sm text-white/60">{billing.spendCapLabel}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ["Renews", billing.renewalLabel],
                  ["Payment method", billing.paymentMethod],
                  ["Billing contact", billing.billingContactEmail],
                  ["Tax status", billing.taxIdStatus],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                    <p className="text-sm text-white/45">{label}</p>
                    <p className="mt-2 text-base leading-7 text-white/75">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">Editable billing record</p>
                <h3 className="mt-3 font-display text-3xl font-black text-white">Billing settings</h3>
              </div>
              <WalletCards className="mt-1 h-5 w-5 text-emerald-200" />
            </div>

            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-white/70">Billing contact email</span>
                  <input
                    value={formState.billingContactEmail}
                    onChange={(event) => updateField("billingContactEmail", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50"
                    placeholder="finance@harborfit.co"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-white/70">Payment method label</span>
                  <input
                    value={formState.paymentMethod}
                    onChange={(event) => updateField("paymentMethod", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50"
                    placeholder="Visa ending in 4242"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-white/70">Monthly budget label</span>
                  <input
                    value={formState.monthlyBudgetLabel}
                    onChange={(event) => updateField("monthlyBudgetLabel", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50"
                    placeholder="$1,800 monthly ad budget"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-white/70">Spend cap label</span>
                  <input
                    value={formState.spendCapLabel}
                    onChange={(event) => updateField("spendCapLabel", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50"
                    placeholder="$2,500 account spend cap"
                  />
                </label>
              </div>

              <label className="space-y-2">
                <span className="text-sm text-white/70">Billing address</span>
                <input
                  value={formState.billingAddress}
                  onChange={(event) => updateField("billingAddress", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50"
                  placeholder="204 Kent Ave, Brooklyn, NY 11249"
                />
              </label>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                <p className="text-sm leading-7 text-white/65">
                  A real integration should make Stripe or another provider the source of truth for subscription state,
                  invoices, payment methods, retries, and renewal timing. This page is the front-end contract for that
                  future system.
                </p>
              </div>

              {errorMessage ? <p className="text-sm text-rose-300">{errorMessage}</p> : null}
              {saveMessage ? <p className="text-sm text-emerald-200">{saveMessage}</p> : null}

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-500 px-6 py-4 text-sm font-semibold text-slate-950 shadow-glow transition duration-300 hover:scale-[1.01] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? "Saving..." : "Save billing settings"}
              </button>
            </form>
          </GlassCard>
        </div>

        <div className="grid gap-5">
          {[
            {
              icon: ShieldCheck,
              title: "Spend guardrails",
              text: "The portal should ultimately control who can increase budget caps, approve payment changes, and enable new billable features.",
            },
            {
              icon: WalletCards,
              title: "Provider-owned state",
              text: "Plan transitions, retry logic, invoices, and subscription lifecycle events should come from the billing provider, not from local form state.",
            },
            {
              icon: ReceiptText,
              title: "Invoice history preview",
              text: "This list is shaped to become the normalized invoice timeline once the backend is connected.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <GlassCard key={item.title} className="p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/65">{item.text}</p>
              </GlassCard>
            );
          })}

          <GlassCard className="p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">Billing history</p>
                <h3 className="mt-3 font-display text-3xl font-black text-white">Recent invoices</h3>
              </div>
              <ReceiptText className="mt-1 h-5 w-5 text-emerald-200" />
            </div>

            <div className="mt-6 grid gap-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-white/55">{invoice.dateLabel}</p>
                      <h4 className="mt-1 text-lg font-semibold text-white">{invoice.description}</h4>
                      <p className="mt-2 text-sm text-white/55">{invoice.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">{invoice.amountLabel}</p>
                      <p className="mt-2 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/75">
                        {invoice.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
