export function getFormText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").replace(/\0/g, "").trim();
}
