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
      <h2 className="font-display text-4xl font-black tracking-tight leading-[0.95] text-white sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-white/70">{description}</p>
    </div>
  );
}
