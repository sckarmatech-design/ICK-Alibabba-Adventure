import { useState } from "react";
import type { MetaFunction } from "react-router";
import { Breadcrumb } from "~/components/Breadcrumb";
import { SectionTitle } from "~/components/SectionTitle";
import { Lightbox } from "~/components/Lightbox";
import { galleryImages, videos } from "~/data/gallery";
import { generateMetaTags, SITE_CONFIG } from "~/lib/seo";

export const meta: MetaFunction = () => [
  ...generateMetaTags({
    title: "Gallery | Akhtar Abbasi Hiking",
    description:
      "Beautiful photos and videos from our trekking and expedition adventures in Gilgit Baltistan.",
    image: "https://akhtarabbasi-hiking.com/images/og/gallery.webp",
    url: `${SITE_CONFIG.url}/gallery`,
  }),
  {
    name: "keywords",
    content: "trekking photos, hiking pictures, adventure photography, Gilgit Baltistan videos",
  },
];

type FilterCategory = "All" | "Treks" | "Expeditions" | "Tours" | "Nature" | "Culture";

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const categories: FilterCategory[] = ["All", "Treks", "Expeditions", "Tours", "Nature", "Culture"];

  const filteredImages =
    selectedCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  const imageList = filteredImages.map((img) => img.image);

  return (
    <div>
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
        />

        <div className="mt-8 mb-12">
          <SectionTitle
            title="Our Adventures in Photos"
            subtitle="Visual stories from our mountain expeditions"
            centered={true}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
                selectedCategory === category
                  ? "bg-[#16a34a] text-white"
                  : "bg-[#111827] text-[#9ca3af] hover:text-[#f9fafb] border border-[#1f2937]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Masonry Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {filteredImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => {
                setLightboxIndex(imageList.indexOf(image.image));
                setLightboxOpen(true);
              }}
              className="relative overflow-hidden rounded-lg h-48 group cursor-pointer bg-[#111827]"
            >
              <img
                src={image.image}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="text-white font-semibold">View</span>
              </div>
            </button>
          ))}
        </div>

        {/* Videos Section */}
        <div className="mt-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Featured Videos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative overflow-hidden rounded-lg group h-56 bg-[#111827] block"
              >
                <img
                  src={video.thumbnail}
                  alt={video.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#16a34a] rounded-full flex items-center justify-center group-hover:bg-[#15803d] transition">
                    <svg
                      className="w-8 h-8 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={imageList}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
