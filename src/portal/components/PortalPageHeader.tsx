import type { ReactNode } from "react";

type PortalPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
};

export function PortalPageHeader({ eyebrow, title, description, aside }: PortalPageHeaderProps) {
  return (
    <div className="grid gap-5 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl lg:grid-cols-[1fr_auto] lg:items-end">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/45">{eyebrow}</p>
        <h2 className="mt-3 font-display text-4xl font-black leading-[0.96] tracking-tight text-white sm:text-5xl">
          {title}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-white/70">{description}</p>
      </div>
      {aside ? <div className="lg:justify-self-end">{aside}</div> : null}
    </div>
  );
}
