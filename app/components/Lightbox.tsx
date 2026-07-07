import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface LightboxProps {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex = 0, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      // bg-black/95 is an intentional dark backdrop for the image viewer
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
    >
      {/* Close Button — text-white on dark backdrop stays */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-accent transition z-10"
        aria-label="Close lightbox"
      >
        <X size={32} />
      </button>

      {/* Image Container */}
      <div className="relative w-full h-full max-w-6xl flex items-center justify-center px-4">
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />

        {/* Navigation Buttons — text-white on dark backdrop stays */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-accent transition p-2"
              aria-label="Previous image"
            >
              <ChevronLeft size={40} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-accent transition p-2"
              aria-label="Next image"
            >
              <ChevronRight size={40} />
            </button>

            {/* Image Counter — on dark backdrop */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
