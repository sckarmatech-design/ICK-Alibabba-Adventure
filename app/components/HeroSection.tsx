interface HeroSectionProps {
  title: string;
  subtitle?: string;
  image: string;
  overlay?: boolean;
}

export function HeroSection({
  title,
  subtitle,
  image,
  overlay = true,
}: HeroSectionProps) {
  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      )}

      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-[#9ca3af] max-w-2xl">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
