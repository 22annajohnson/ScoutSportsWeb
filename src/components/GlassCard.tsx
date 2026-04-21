import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div
      className={`rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}
