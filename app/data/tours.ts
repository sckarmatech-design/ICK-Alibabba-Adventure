// Tours data model and sample data

export interface Tour {
  slug: string;
  title: string;
  region: string;
  duration: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  bestSeason: string;
  heroImage: string;
  gallery: string[];
  highlights: string[];
  overview: string;
  price?: number;
  currency?: string;
  priceIncludes?: string[];
  priceExcludes?: string[];
  depositAmount?: number;
  accommodation?: string;
  mealPlan?: string;
  transport?: string;
  itinerary: Array<{ day: number; title: string; description: string }>;
}

export const tours: Tour[] = [
  {
    slug: "skardu-city-tour",
    title: "Skardu City & Cultural Tour",
    region: "Skardu",
    duration: "3 Days",
    difficulty: "Easy",
    bestSeason: "April – October",
    heroImage: "https://images.unsplash.com/photo-1677103036843-df9e5ad74eea?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1690789290468-4e6e83f7524b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1638433097357-1dea5816d7a5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1684230715200-40f32e068bf2?w=800&h=600&fit=crop",
    ],
    highlights: ["Ancient Markets", "Mountain Views", "Local Culture", "Historical Forts", "Local Cuisine"],
    overview:
      "Explore the vibrant city of Skardu, the gateway to the Karakoram. Visit historic sites, local markets, and enjoy stunning views of surrounding mountains. Experience authentic local hospitality and traditional Balti culture. Perfect for cultural enthusiasts and photographers.",
    accommodation: "4-star hotel in city center with mountain views",
    mealPlan: "Breakfast and dinner included, lunch at local restaurants",
    transport: "Hotel pickup and drop-off, 4WD for site visits",
    itinerary: [
      {
        day: 1,
        title: "Skardu Arrival & City Orientation",
        description:
          "Arrive in Skardu. Check-in at hotel. City orientation tour visiting Skardu Fort, Manthoka Waterfall, and local bazaars. Evening: traditional Balti dinner.",
      },
      {
        day: 2,
        title: "Cultural Exploration",
        description:
          "Visit Kharpocho Fort (16th century), Skardu Museum with ancient artifacts, and Satpara Lake for sunset views. Evening shopping in traditional markets.",
      },
      {
        day: 3,
        title: "Scenic Day & Departure",
        description:
          "Visit Deosai Plains viewpoint, Shangrila Resort gardens, and Fairy Tale Valley. Lunch with panoramic views. Flight back in evening.",
      },
    ],
  },
  {
    slug: "hunza-cultural-tour",
    title: "Hunza Valley Cultural Immersion",
    region: "Hunza",
    duration: "4 Days",
    difficulty: "Easy",
    bestSeason: "April – October",
    heroImage: "https://images.unsplash.com/photo-1611834473980-502e0a1220d7?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1638433097357-1dea5816d7a5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1722082933604-288a1c130475?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1684230715200-40f32e068bf2?w=800&h=600&fit=crop",
    ],
    highlights: ["Local Villages", "Apricot Orchards", "Mountain Scenery", "Longevity Culture", "Traditional Food"],
    overview:
      "Experience the unique culture and lifestyle of Hunza Valley. Meet local families, explore traditional villages, and taste authentic cuisine. Learn about the famous longevity of Hunza people and their lifestyle secrets.",
    accommodation: "Local guesthouses and family homestays",
    mealPlan: "All meals with local families, includes traditional recipes",
    transport: "4WD vehicle, guided cultural walks",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Hunza",
        description:
          "Travel from Gilgit to Hunza (4 hours). Check-in at guesthouse. Meet your local guide and explore Karimabad village.",
      },
      {
        day: 2,
        title: "Village Experience",
        description:
          "Visit local villages, meet families, participate in daily activities. Learn about traditional agriculture. Lunch with a local family. Visit Altit Fort.",
      },
      {
        day: 3,
        title: "Orchard Tour & Traditional Activities",
        description:
          "Explore apricot gardens and farms. Learn traditional farming methods. Cooking class: prepare traditional Hunza dishes. Evening cultural program.",
      },
      {
        day: 4,
        title: "Return Journey",
        description:
          "Visit Baltit Fort and Hunza Viewpoint. Souvenir shopping at local markets. Return to Gilgit in evening.",
      },
    ],
  },
  {
    slug: "gilgit-adventure-tour",
    title: "Gilgit Adventure & Adventure Sports",
    region: "Gilgit",
    duration: "5 Days",
    difficulty: "Moderate",
    bestSeason: "May – September",
    heroImage: "https://images.unsplash.com/photo-1632133915653-8ded5c72e329?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1638433097357-1dea5816d7a5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1684230715200-40f32e068bf2?w=800&h=600&fit=crop",
    ],
    highlights: ["River Activities", "Mountain Biking", "Cultural Sites", "Local Markets", "Adventure Sports"],
    overview:
      "Adventure-packed tour combining outdoor activities with cultural exploration in Gilgit region. Experience river rafting, mountain biking, hiking, and immerse yourself in local culture.",
    accommodation: "Adventure lodge with modern amenities",
    mealPlan: "Breakfast, lunch, dinner included",
    transport: "4WD vehicle and adventure equipment provided",
    itinerary: [
      {
        day: 1,
        title: "Arrival & Orientation",
        description:
          "Welcome to Gilgit. Meet adventure team. Safety briefing and equipment fitting. Explore Gilgit bazaar and city.",
      },
      {
        day: 2,
        title: "River Adventure Day",
        description:
          "White water rafting on Gilgit River (Grade II-III). Visit Gilgit Fort. Evening traditional music performance.",
      },
      {
        day: 3,
        title: "Mountain Biking",
        description:
          "Mountain biking tour on scenic trails. Visit Fairy Meadows viewpoint on bikes. Altitude: 2,400m to 2,700m.",
      },
      {
        day: 4,
        title: "Cultural & Hiking Day",
        description:
          "Trek to alpine lakes and viewpoints. Visit local shrine and cultural sites. Photography opportunities.",
      },
      {
        day: 5,
        title: "Adventure Sports & Departure",
        description:
          "Optional: rock climbing, paragliding, or zip-lining. Final adventure activities. Evening departure.",
      },
    ],
  },
  {
    slug: "khaplu-off-beaten-path",
    title: "Khaplu Valley - Off the Beaten Path",
    region: "Khaplu Valley",
    duration: "4 Days",
    difficulty: "Easy",
    bestSeason: "May – October",
    heroImage: "https://images.unsplash.com/photo-1690789290468-4e6e83f7524b?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1677103036843-df9e5ad74eea?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-wOAaDxhIyYc?w=800&h=600&fit=crop",
    ],
    highlights: ["Hidden Valleys", "Local Homestays", "Scenic Trails", "Authentic Experience", "Photography"],
    overview:
      "Discover the hidden gem of Khaplu Valley, one of Gilgit Baltistan's most authentic destinations. Experience genuine hospitality, explore pristine valleys, and interact with welcoming local communities.",
    accommodation: "Luxury homestays with traditional architecture",
    mealPlan: "All meals prepared by local families",
    transport: "4WD vehicle and walking",
    itinerary: [
      {
        day: 1,
        title: "Skardu to Khaplu",
        description: "Drive to Khaplu (3 hours). Check-in at homestay. Explore village.",
      },
      {
        day: 2,
        title: "Valley Exploration",
        description: "Trek through Khaplu Valley. Visit local farms and orchards. Meet families.",
      },
      {
        day: 3,
        title: "Cultural Experience",
        description: "Cooking class, traditional crafts workshop, visit ancient sites.",
      },
      {
        day: 4,
        title: "Return Journey",
        description: "Final exploration and return to Skardu.",
      },
    ],
  },
];
