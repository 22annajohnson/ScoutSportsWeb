import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  showArrow?: boolean;
};

const variants = {
  primary:
    "bg-gradient-to-r from-accent-purple to-accent-blue text-white shadow-glow hover:opacity-95 hover:scale-[1.01]",
  secondary:
    "border border-white/15 bg-white/5 text-white hover:bg-white/10",
  ghost: "text-text-muted hover:text-white",
};

export function Button({
  children,
  href = "/",
  variant = "primary",
  className = "",
  showArrow = false,
}: ButtonProps) {
  return (
    <Link
      to={href}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition duration-300 ${variants[variant]} ${className}`}
    >
      {children}
      {showArrow ? <ArrowRight className="h-4 w-4" /> : null}
    </Link>
  );
}
