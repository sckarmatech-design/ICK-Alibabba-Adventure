import { useState } from "react";
import { useLoaderData } from "react-router";
import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { Play } from "lucide-react";
import { Breadcrumb } from "~/components/Breadcrumb";
import { SectionTitle } from "~/components/SectionTitle";
import { Lightbox } from "~/components/Lightbox";
import prisma from "~/lib/prisma.server";
import {
  mapGalleryImageFromPrisma,
  mapGalleryVideoFromPrisma,
} from "~/lib/mappers";
import { generateMetaTags, SITE_CONFIG } from "~/lib/seo";

export async function loader(_args: LoaderFunctionArgs) {
  const [images, videos] = await Promise.all([
    prisma.galleryImage.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.galleryVideo.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  return {
    images: images.map(mapGalleryImageFromPrisma),
    videos: videos.map(mapGalleryVideoFromPrisma),
  };
}

export const meta: MetaFunction = () => [
  ...generateMetaTags({
    title: "Gallery | Akhtar Abbasi Hiking",
    description:
      "Beautiful photos and videos from our trekking and expedition adventures in Gilgit Baltistan.",
    image: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=1200&h=630&fit=crop",
    url: `${SITE_CONFIG.url}/gallery`,
  }),
  {
    name: "keywords",
    content:
      "trekking photos, hiking pictures, adventure photography, Gilgit Baltistan videos",
  },
];

type FilterCategory =
  | "All"
  | "Treks"
  | "Expeditions"
  | "Tours"
  | "Nature"
  | "Culture";

export default function Gallery() {
  const { images: galleryImages, videos } = useLoaderData<typeof loader>();
  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategory>("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const categories: FilterCategory[] = [
    "All",
    "Treks",
    "Expeditions",
    "Tours",
    "Nature",
    "Culture",
  ];

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

        {/* Filter Tabs (non-CTA — uses bg-accent) */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
                selectedCategory === category
                  ? "bg-accent text-white"
                  : "bg-surface text-muted hover:text-ink border border-border"
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
              className="relative overflow-hidden rounded-lg h-48 group cursor-pointer bg-surface"
              aria-label={`View ${image.title}`}
            >
              <img
                src={image.image}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                loading="lazy"
              />
              {/* Persistent gradient + title at bottom */}
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
                <p className="text-white font-semibold text-sm line-clamp-2 text-left">
                  {image.title}
                </p>
                <p className="text-white/70 text-xs text-left mt-0.5">
                  {image.category}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Videos Section */}
        <div className="mt-16">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-8">
            Featured Videos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <a
                key={video.id}
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg overflow-hidden group bg-surface"
              >
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnail || "/images/video-placeholder.jpg"}
                    alt={video.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center pl-1">
                      <Play className="w-7 h-7 text-gray-900 fill-current" />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-ink font-semibold text-sm line-clamp-1">
                    {video.title}
                  </p>
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
