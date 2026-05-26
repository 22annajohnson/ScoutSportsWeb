type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl";

  return (
    <div className={alignment}>
      {eyebrow ? (
        <div className="mb-4 text-xs uppercase tracking-[0.35em] text-blue-200/60">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="font-display text-3xl font-black leading-[0.98] tracking-tight text-white sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">{description}</p>
    </div>
  );
}
