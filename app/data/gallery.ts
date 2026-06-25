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
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
    category: "Expeditions",
    alt: "Stunning view of K2 mountain from base camp with glaciers",
    featured: true,
  },
  {
    id: "gallery-2",
    title: "Baltoro Glacier Trek",
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1000&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=300&fit=crop",
    category: "Treks",
    alt: "Trekkers walking on the legendary Baltoro Glacier",
    featured: true,
  },
  {
    id: "gallery-3",
    title: "Fairy Meadows Alpine Landscape",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    category: "Nature",
    alt: "Lush alpine meadows at the base of Nanga Parbat mountain",
  },
  {
    id: "gallery-4",
    title: "Hunza Valley at Sunset",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
    category: "Tours",
    alt: "Golden sunset over the picturesque Hunza Valley with mountain backdrop",
    featured: true,
  },
  {
    id: "gallery-5",
    title: "Local Culture and Hospitality",
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1000&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=300&fit=crop",
    category: "Culture",
    alt: "Local residents sharing traditional Balti hospitality and culture",
  },
  {
    id: "gallery-6",
    title: "Mountain Summit Achievement",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
    category: "Expeditions",
    alt: "Climbers celebrating at mountain summit with panoramic peak views",
    featured: true,
  },
  {
    id: "gallery-7",
    title: "Crystal Alpine Lake",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    category: "Nature",
    alt: "Crystal clear alpine lake surrounded by snow-capped mountain peaks",
  },
  {
    id: "gallery-8",
    title: "Trek Group Photo",
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1000&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=300&fit=crop",
    category: "Treks",
    alt: "Happy group of trekkers posing together on mountain trail",
  },
  {
    id: "gallery-9",
    title: "Apricot Orchards of Hunza",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    category: "Tours",
    alt: "Beautiful apricot orchards terraced on Hunza Valley hillsides",
    featured: true,
  },
  {
    id: "gallery-10",
    title: "Traditional Gilgit Bazaar",
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1000&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=300&fit=crop",
    category: "Culture",
    alt: "Vibrant traditional markets and bazaars in Gilgit city",
  },
];

export const videos: VideoItem[] = [
  {
    id: "video-1",
    title: "K2 Base Camp Trek Highlights",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    alt: "Video highlights of K2 Base Camp Trek expedition",
  },
  {
    id: "video-2",
    title: "Hunza Valley Cultural Tour Experience",
    youtubeId: "jNQXAC9IVRw",
    thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg",
    alt: "Video of Hunza Valley cultural tour and local experiences",
  },
  {
    id: "video-3",
    title: "Nanga Parbat Expedition Documentary",
    youtubeId: "9bZkp7q19f0",
    thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
    alt: "Documentary of Nanga Parbat expedition journey and challenges",
  },
  {
    id: "video-4",
    title: "Fairy Meadows Trek Adventure",
    youtubeId: "YQHsXMglC9A",
    thumbnail: "https://img.youtube.com/vi/YQHsXMglC9A/maxresdefault.jpg",
    alt: "Adventure video of Fairy Meadows trek at base of Nanga Parbat",
  },
];
