import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div
      className={`rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}
