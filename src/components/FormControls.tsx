import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldProps = {
  label: ReactNode;
  children: ReactNode;
  className?: string;
};

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;
type TextareaInputProps = TextareaHTMLAttributes<HTMLTextAreaElement>;
type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement>;

const fieldControlClassName =
  "w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-300/50 disabled:cursor-not-allowed disabled:opacity-50";

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function FormField({ label, children, className }: FieldProps) {
  return (
    <label className={mergeClassNames("space-y-2", className)}>
      <span className="text-sm text-white/70">{label}</span>
      {children}
    </label>
  );
}

export function TextInput({ className, ...props }: TextInputProps) {
  return <input className={mergeClassNames(fieldControlClassName, className)} {...props} />;
}

export function TextareaInput({ className, ...props }: TextareaInputProps) {
  return <textarea className={mergeClassNames("min-h-32 resize-none", fieldControlClassName, className)} {...props} />;
}

export function SelectInput({ className, children, ...props }: SelectInputProps) {
  return (
    <select className={mergeClassNames(fieldControlClassName, className)} {...props}>
      {children}
    </select>
  );
}

export function FormNote({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/60">{children}</div>;
}

export function FormError({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-accent-danger/20 bg-accent-danger/10 p-4 text-sm leading-6 text-red-100">{children}</div>;
}
