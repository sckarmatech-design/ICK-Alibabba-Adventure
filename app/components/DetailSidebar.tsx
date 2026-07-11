import { MapPin, Users, Check, X } from "lucide-react";
import { formatPrice } from "~/lib/format";

interface DetailSidebarProps {
  duration?: string;
  difficulty?: string;
  groupSize?: string;
  startPoint?: string;
  endPoint?: string;
  altitude?: string;
  price?: number;
  currency?: string;
  depositAmount?: number;
  priceIncludes?: string[];
  priceExcludes?: string[];
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
  price,
  currency,
  depositAmount,
  priceIncludes,
  priceExcludes,
  ctaText = "Enquire Now",
  onCTA,
}: DetailSidebarProps) {
  const hasDetails =
    duration || difficulty || altitude || groupSize || startPoint || endPoint;
  const hasPricing =
    typeof price === "number" ||
    priceIncludes?.length ||
    priceExcludes?.length;

  return (
    <div className="sticky top-24 bg-surface rounded-lg border border-border p-5 max-h-[calc(100vh-7rem)] overflow-y-auto">
      <div className="space-y-4">
        {/* Summary Details — 2-column compact grid */}
        {hasDetails && (
          <div className="grid grid-cols-2 gap-3">
            {duration && (
              <div>
                <p className="text-xs text-muted mb-0.5">Duration</p>
                <p className="text-sm font-semibold text-ink">{duration}</p>
              </div>
            )}

            {difficulty && (
              <div>
                <p className="text-xs text-muted mb-0.5">Difficulty</p>
                <span className="inline-block px-2 py-0.5 bg-surface text-secondary rounded text-xs font-medium border border-border">
                  {difficulty}
                </span>
              </div>
            )}

            {altitude && (
              <div>
                <p className="text-xs text-muted mb-0.5">Altitude</p>
                <p className="text-sm font-semibold text-ink">{altitude}</p>
              </div>
            )}

            {groupSize && (
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-accent flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted">Group Size</p>
                  <p className="text-sm text-ink leading-tight">{groupSize}</p>
                </div>
              </div>
            )}

            {startPoint && (
              <div className="flex items-start gap-1.5 col-span-2">
                <MapPin
                  size={14}
                  className="text-accent flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-xs text-muted">Start Point</p>
                  <p className="text-sm text-ink leading-tight">
                    {startPoint}
                  </p>
                </div>
              </div>
            )}

            {endPoint && (
              <div className="flex items-start gap-1.5 col-span-2">
                <MapPin
                  size={14}
                  className="text-accent flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-xs text-muted">End Point</p>
                  <p className="text-sm text-ink leading-tight">{endPoint}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Price */}
        {typeof price === "number" && (
          <div
            className={`${hasDetails ? "pt-3 border-t border-border" : ""}`}
          >
            <p className="text-xs text-muted mb-0.5">Starting from</p>
            <p className="text-2xl font-bold text-accent">
              {formatPrice(price, currency)}
            </p>
            {typeof depositAmount === "number" && (
              <p className="text-xs text-muted mt-0.5">
                Deposit: {formatPrice(depositAmount, currency)}
              </p>
            )}
          </div>
        )}

        {/* Includes / Excludes */}
        {(priceIncludes?.length || priceExcludes?.length) && (
          <div
            className={`${hasPricing ? "pt-3 border-t border-border" : ""} space-y-3`}
          >
            {priceIncludes && priceIncludes.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-ink mb-1.5">
                  What&apos;s included
                </p>
                <ul className="space-y-1">
                  {priceIncludes.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-1.5 text-xs text-muted"
                    >
                      <Check
                        size={14}
                        className="text-accent flex-shrink-0 mt-0.5"
                      />
                      <span className="leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {priceExcludes && priceExcludes.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-ink mb-1.5">
                  What&apos;s not included
                </p>
                <ul className="space-y-1">
                  {priceExcludes.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-1.5 text-xs text-muted"
                    >
                      <X
                        size={14}
                        className="text-red-400 flex-shrink-0 mt-0.5"
                      />
                      <span className="leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={onCTA}
          className="w-full px-4 py-2.5 bg-cta text-white rounded-lg hover:bg-cta-hover transition font-semibold text-sm"
        >
          {ctaText}
        </button>
      </div>
    </div>
  );
}
