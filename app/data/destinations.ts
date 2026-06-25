// Destinations data model and sample data

export interface Destination {
  id: string;
  name: string;
  region: string;
  image: string;
  tripCount: number;
  description: string;
  highlights: string[];
}

export const destinations: Destination[] = [
  {
    id: "dest-1",
    name: "Skardu",
    region: "Gilgit Baltistan",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    tripCount: 12,
    description:
      "Gateway to the Karakoram, Skardu is a vibrant city nestled in a stunning valley surrounded by snow-capped peaks. Home to ancient forts, pristine lakes, and the starting point for legendary treks.",
    highlights: ["K2 Base Camp Treks", "Ancient Forts", "Local Markets", "Mountain Views", "Skardu Fort", "Pangong Lake"],
  },
  {
    id: "dest-2",
    name: "Hunza Valley",
    region: "Gilgit Baltistan",
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop",
    tripCount: 8,
    description:
      "Known for its longevity and natural beauty, Hunza Valley offers cultural experiences and moderate trekking opportunities. Famous for its terraced fields, apricot orchards, and friendly residents.",
    highlights: ["Apricot Orchards", "Local Culture", "Scenic Drives", "Health & Wellness", "Baltit Fort", "Karimabad"],
  },
  {
    id: "dest-3",
    name: "Gilgit",
    region: "Gilgit Baltistan",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    tripCount: 6,
    description:
      "A bustling mountain city with rich history, serving as a starting point for many adventure expeditions. Experience authentic local bazaars, cultural sites, and river activities.",
    highlights: [
      "Adventure Tours",
      "River Activities",
      "Historical Sites",
      "Local Bazaars",
      "Gilgit Fort",
      "Mountain Biking",
    ],
  },
  {
    id: "dest-4",
    name: "Nanga Parbat Base",
    region: "Gilgit Baltistan",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    tripCount: 4,
    description:
      "Home to the 9th highest peak in the world, perfect for experienced mountaineers seeking extreme challenges. Fairy Meadows offers breathtaking views of Nanga Parbat.",
    highlights: ["Expert Expeditions", "Alpine Views", "Technical Climbing", "Fairy Meadows", "Base Camp Trek"],
  },
  {
    id: "dest-5",
    name: "Khaplu Valley",
    region: "Gilgit Baltistan",
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop",
    tripCount: 5,
    description:
      "A hidden gem offering cultural immersion, local hospitality, and off-the-beaten-path trekking experiences. Experience authentic Balti culture and warm hospitality.",
    highlights: ["Cultural Tours", "Local Homestays", "Scenic Trails", "Authentic Food", "Traditional Crafts"],
  },
];
