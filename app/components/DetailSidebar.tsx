import { MapPin, Calendar, Zap, Users } from "lucide-react";

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
    <div className="sticky top-24 bg-[#111827] rounded-lg border border-[#1f2937] p-6 space-y-6">
      {/* Summary Details */}
      <div className="space-y-4">
        {duration && (
          <div>
            <p className="text-sm text-[#9ca3af] mb-1">Duration</p>
            <p className="text-lg font-semibold text-[#f9fafb]">{duration}</p>
          </div>
        )}

        {difficulty && (
          <div>
            <p className="text-sm text-[#9ca3af] mb-1">Difficulty</p>
            <div className="inline-block px-3 py-1 bg-[#1f2937] text-[#d97706] rounded-full text-sm font-medium">
              {difficulty}
            </div>
          </div>
        )}

        {altitude && (
          <div>
            <p className="text-sm text-[#9ca3af] mb-1">Altitude</p>
            <p className="text-lg font-semibold text-[#f9fafb]">{altitude}</p>
          </div>
        )}

        {groupSize && (
          <div className="flex items-center gap-2">
            <Users size={18} className="text-[#16a34a]" />
            <div>
              <p className="text-sm text-[#9ca3af]">Group Size</p>
              <p className="text-[#f9fafb]">{groupSize}</p>
            </div>
          </div>
        )}

        {startPoint && (
          <div className="flex items-start gap-2">
            <MapPin size={18} className="text-[#16a34a] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#9ca3af]">Start Point</p>
              <p className="text-[#f9fafb]">{startPoint}</p>
            </div>
          </div>
        )}

        {endPoint && (
          <div className="flex items-start gap-2">
            <MapPin size={18} className="text-[#16a34a] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#9ca3af]">End Point</p>
              <p className="text-[#f9fafb]">{endPoint}</p>
            </div>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <button
        onClick={onCTA}
        className="w-full px-6 py-3 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] transition font-semibold"
      >
        {ctaText}
      </button>
    </div>
  );
}
