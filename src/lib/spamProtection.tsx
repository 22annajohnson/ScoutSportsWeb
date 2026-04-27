import type { FormEvent } from "react";

const MIN_SUBMIT_TIME_MS = 900;

export function getSuspiciousSubmissionMessage(
  event: FormEvent<HTMLFormElement>,
  formMountedAt: number,
): string | null {
  const formData = new FormData(event.currentTarget);
  const honeypotValue = String(formData.get("company") ?? formData.get("website") ?? "").trim();
  const submittedTooQuickly = Date.now() - formMountedAt < MIN_SUBMIT_TIME_MS;

  if (honeypotValue) {
    return "We could not verify that submission. Please refresh the page and try again.";
  }

  if (submittedTooQuickly) {
    return "Please wait a moment and submit the form again.";
  }

  return null;
}

export function HoneypotField() {
  return (
    <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
      <label htmlFor="company">Company</label>
      <input
        id="company"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="h-px w-px"
      />
    </div>
  );
}
