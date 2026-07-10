import { Link } from "react-router";
import { MapPin, Clock, Zap } from "lucide-react";

interface TripCardProps {
  slug: string;
  title: string;
  category: string;
  region: string;
  duration: string;
  difficulty?: string;
  image: string;
  highlights?: string[];
  href: string;
}

export function TripCard({
  slug,
  title,
  category,
  region,
  duration,
  difficulty,
  image,
  highlights,
  href,
}: TripCardProps) {
  return (
    <Link to={href} className="group">
      <div className="bg-surface rounded-lg overflow-hidden border border-border hover:border-accent transition h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden h-48 md:h-56 bg-primary">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-surface flex items-center justify-center text-muted text-sm">
              No image
            </div>
          )}
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          {/* Category Badge (non-CTA accent) */}
          <div className="absolute top-3 left-3">
            <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-medium rounded-full">
              {category}
            </span>
          </div>

          {/* Duration Badge — stays white on dark image overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs bg-black/50 px-2 py-1 rounded">
            <Clock size={12} />
            <span>{duration}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-4">
          {/* Title & Region */}
          <h3 className="font-bold text-ink text-base md:text-lg mb-2 line-clamp-2 group-hover:text-accent transition">
            {title}
          </h3>

          <div className="flex items-center gap-1 text-muted text-sm mb-3">
            <MapPin size={14} />
            <span>{region}</span>
          </div>

          {/* Highlights */}
          {highlights && highlights.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {highlights.slice(0, 2).map((highlight, index) => (
                <span
                  key={index}
                  className="text-xs bg-surface text-muted px-2 py-1 rounded border border-border"
                >
                  {highlight}
                </span>
              ))}
              {highlights.length > 2 && (
                <span className="text-xs bg-surface text-muted px-2 py-1 rounded border border-border">
                  +{highlights.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Difficulty — uses secondary (warm amber) per theme */}
          {difficulty && (
            <div className="flex items-center gap-1 text-muted text-sm mb-4">
              <Zap size={14} className="text-secondary" />
              <span>{difficulty}</span>
            </div>
          )}

          {/* CTA Button — fixed brand green */}
          <button className="mt-auto w-full px-4 py-2 bg-cta text-white rounded-lg hover:bg-cta-hover transition font-medium text-sm">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
}
