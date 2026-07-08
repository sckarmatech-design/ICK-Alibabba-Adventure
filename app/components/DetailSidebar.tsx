import { MapPin, Users } from "lucide-react";

interface DetailSidebarProps {
  duration?: string;
  difficulty?: string;
  groupSize?: string;
  startPoint?: string;
  endPoint?: string;
  altitude?: string;
  ctaText?: string;
  onCTA?: () => void;
}

export function DetailSidebar({
  duration,
  difficulty,
  groupSize,
  startPoint,
  endPoint,
  altitude,
  ctaText = "Enquire Now",
  onCTA,
}: DetailSidebarProps) {
  return (
    <div className="sticky top-24 bg-surface rounded-lg border border-border p-6 space-y-6">
      {/* Summary Details */}
      <div className="space-y-4">
        {duration && (
          <div>
            <p className="text-sm text-muted mb-1">Duration</p>
            <p className="text-lg font-semibold text-ink">{duration}</p>
          </div>
        )}

        {difficulty && (
          <div>
            <p className="text-sm text-muted mb-1">Difficulty</p>
            <div className="inline-block px-3 py-1 bg-surface text-secondary rounded-full text-sm font-medium border border-border">
              {difficulty}
            </div>
          </div>
        )}

        {altitude && (
          <div>
            <p className="text-sm text-muted mb-1">Altitude</p>
            <p className="text-lg font-semibold text-ink">{altitude}</p>
          </div>
        )}

        {groupSize && (
          <div className="flex items-center gap-2">
            <Users size={18} className="text-accent" />
            <div>
              <p className="text-sm text-muted">Group Size</p>
              <p className="text-ink">{groupSize}</p>
            </div>
          </div>
        )}

        {startPoint && (
          <div className="flex items-start gap-2">
            <MapPin size={18} className="text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-muted">Start Point</p>
              <p className="text-ink">{startPoint}</p>
            </div>
          </div>
        )}

        {endPoint && (
          <div className="flex items-start gap-2">
            <MapPin size={18} className="text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-muted">End Point</p>
              <p className="text-ink">{endPoint}</p>
            </div>
          </div>
        )}
      </div>

      {/* CTA Button — fixed brand green */}
      <button
        onClick={onCTA}
        className="w-full px-6 py-3 bg-cta text-white rounded-lg hover:bg-cta-hover transition font-semibold"
      >
        {ctaText}
      </button>
    </div>
  );
}
