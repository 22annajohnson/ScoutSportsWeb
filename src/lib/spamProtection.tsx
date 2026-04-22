import type { FormEvent } from "react";

const MIN_SUBMIT_TIME_MS = 900;

export function shouldBlockSuspiciousSubmission(
  event: FormEvent<HTMLFormElement>,
  formMountedAt: number,
) {
  const formData = new FormData(event.currentTarget);
  const honeypotValue = String(formData.get("company") ?? formData.get("website") ?? "").trim();
  const submittedTooQuickly = Date.now() - formMountedAt < MIN_SUBMIT_TIME_MS;

  return Boolean(honeypotValue || submittedTooQuickly);
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
