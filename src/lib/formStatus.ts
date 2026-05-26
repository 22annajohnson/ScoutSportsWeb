export type FormStatus = "editing" | "submitting" | "submitted";

export function isFormSubmitting(status: FormStatus) {
  return status === "submitting";
}

export function isFormSubmitted(status: FormStatus) {
  return status === "submitted";
}
