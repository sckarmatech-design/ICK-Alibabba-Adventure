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
    image: "/images/destinations/skardu.webp",
    tripCount: 12,
    description:
      "Gateway to the Karakoram, Skardu is a vibrant city nestled in a stunning valley surrounded by snow-capped peaks.",
    highlights: ["K2 Base Camp Treks", "Ancient Forts", "Local Markets", "Mountain Views"],
  },
  {
    id: "dest-2",
    name: "Hunza Valley",
    region: "Gilgit Baltistan",
    image: "/images/destinations/hunza.webp",
    tripCount: 8,
    description:
      "Known for its longevity and natural beauty, Hunza Valley offers cultural experiences and moderate trekking opportunities.",
    highlights: ["Apricot Orchards", "Local Culture", "Scenic Drives", "Health & Wellness"],
  },
  {
    id: "dest-3",
    name: "Gilgit",
    region: "Gilgit Baltistan",
    image: "/images/destinations/gilgit.webp",
    tripCount: 6,
    description:
      "A bustling mountain city with rich history, serving as a starting point for many adventure expeditions.",
    highlights: [
      "Adventure Tours",
      "River Activities",
      "Historical Sites",
      "Local Bazaars",
    ],
  },
  {
    id: "dest-4",
    name: "Nanga Parbat Base",
    region: "Gilgit Baltistan",
    image: "/images/destinations/nanga-parbat.webp",
    tripCount: 4,
    description:
      "Home to the 9th highest peak in the world, perfect for experienced mountaineers seeking extreme challenges.",
    highlights: ["Expert Expeditions", "Alpine Views", "Technical Climbing"],
  },
  {
    id: "dest-5",
    name: "Khaplu Valley",
    region: "Gilgit Baltistan",
    image: "/images/destinations/khaplu.webp",
    tripCount: 5,
    description:
      "A hidden gem offering cultural immersion, local hospitality, and off-the-beaten-path trekking experiences.",
    highlights: ["Cultural Tours", "Local Homestays", "Scenic Trails", "Authentic Food"],
  },
];
