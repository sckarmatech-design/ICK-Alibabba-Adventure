import { Link } from "react-router";

interface DestinationCardProps {
  image: string;
  name: string;
  tripCount: number;
  href: string;
}

export function DestinationCard({
  image,
  name,
  tripCount,
  href,
}: DestinationCardProps) {
  return (
    <Link to={href} className="group">
      <div className="relative overflow-hidden rounded-lg h-48 md:h-56 bg-surface border border-border hover:border-accent transition">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-sm">
            No image
          </div>
        )}
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-linear-to-b from-transparent via-transparent to-black/80"></div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* text-white on dark image overlay stays white for contrast */}
          <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
          <p className="text-sm text-white/80">{tripCount} trips available</p>
        </div>
      </div>
    </Link>
  );
}
