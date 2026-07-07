interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionTitle({
  title,
  subtitle,
  centered = true,
}: SectionTitleProps) {
  return (
    <div className={`mb-8 md:mb-12 ${centered ? "text-center" : ""}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-ink mb-3">{title}</h2>
      {subtitle && (
        <p className={`text-lg text-muted ${centered ? "" : "max-w-2xl"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
