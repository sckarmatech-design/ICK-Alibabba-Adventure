// Gallery data model and sample data

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  thumbnail?: string;
  category: "Treks" | "Expeditions" | "Tours" | "Nature" | "Culture";
  alt: string;
  featured?: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  youtubeId: string;
  thumbnail: string;
  alt: string;
}

export const galleryImages: GalleryItem[] = [
  {
    id: "gallery-1",
    title: "K2 Base Camp View",
    image: "/images/gallery/k2-view.webp",
    thumbnail: "/images/gallery/thumbs/k2-view.webp",
    category: "Expeditions",
    alt: "Stunning view of K2 mountain from base camp",
    featured: true,
  },
  {
    id: "gallery-2",
    title: "Baltoro Glacier",
    image: "/images/gallery/baltoro-glacier.webp",
    thumbnail: "/images/gallery/thumbs/baltoro-glacier.webp",
    category: "Treks",
    alt: "Trekkers walking on the Baltoro Glacier",
    featured: true,
  },
  {
    id: "gallery-3",
    title: "Fairy Meadows Alpine",
    image: "/images/gallery/fairy-meadows.webp",
    thumbnail: "/images/gallery/thumbs/fairy-meadows.webp",
    category: "Nature",
    alt: "Lush alpine meadows at the base of Nanga Parbat",
  },
  {
    id: "gallery-4",
    title: "Hunza Valley Sunset",
    image: "/images/gallery/hunza-sunset.webp",
    thumbnail: "/images/gallery/thumbs/hunza-sunset.webp",
    category: "Tours",
    alt: "Golden sunset over the Hunza Valley",
    featured: true,
  },
  {
    id: "gallery-5",
    title: "Local Culture",
    image: "/images/gallery/local-culture.webp",
    thumbnail: "/images/gallery/thumbs/local-culture.webp",
    category: "Culture",
    alt: "Local residents sharing traditional hospitality",
  },
  {
    id: "gallery-6",
    title: "Mountain Summit",
    image: "/images/gallery/mountain-summit.webp",
    thumbnail: "/images/gallery/thumbs/mountain-summit.webp",
    category: "Expeditions",
    alt: "Climbers celebrating at mountain summit",
    featured: true,
  },
  {
    id: "gallery-7",
    title: "Alpine Lake",
    image: "/images/gallery/alpine-lake.webp",
    thumbnail: "/images/gallery/thumbs/alpine-lake.webp",
    category: "Nature",
    alt: "Crystal clear alpine lake surrounded by peaks",
  },
  {
    id: "gallery-8",
    title: "Trek Group Photo",
    image: "/images/gallery/trek-group.webp",
    thumbnail: "/images/gallery/thumbs/trek-group.webp",
    category: "Treks",
    alt: "Happy group of trekkers on the trail",
  },
];

export const videos: VideoItem[] = [
  {
    id: "video-1",
    title: "K2 Base Camp Trek Highlights",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    alt: "Video highlights of K2 Base Camp Trek",
  },
  {
    id: "video-2",
    title: "Hunza Valley Cultural Tour",
    youtubeId: "jNQXAC9IVRw",
    thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg",
    alt: "Video of Hunza Valley cultural tour",
  },
  {
    id: "video-3",
    title: "Nanga Parbat Expedition Documentary",
    youtubeId: "9bZkp7q19f0",
    thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
    alt: "Documentary of Nanga Parbat expedition",
  },
];
