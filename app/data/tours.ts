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
  accommodation?: string;
  mealPlan?: string;
  transport?: string;
  itinerary: Array<{ day: number; title: string; description: string }>;
}

export const tours: Tour[] = [
  {
    slug: "skardu-city-tour",
    title: "Skardu City Tour",
    region: "Skardu",
    duration: "3 Days",
    difficulty: "Easy",
    bestSeason: "April – October",
    heroImage: "/images/tours/skardu-city.webp",
    gallery: [
      "/images/tours/skardu-01.jpg",
      "/images/tours/skardu-02.jpg",
      "/images/tours/skardu-03.jpg",
    ],
    highlights: ["Ancient Markets", "Mountain Views", "Local Culture"],
    overview:
      "Explore the vibrant city of Skardu, the gateway to the Karakoram. Visit historic sites, local markets, and enjoy stunning views of surrounding mountains.",
    accommodation: "3-star hotel in city center",
    mealPlan: "Breakfast and dinner included",
    transport: "Hotel pickup and drop-off",
    itinerary: [
      {
        day: 1,
        title: "Skardu Arrival",
        description: "Arrive in Skardu. City orientation tour.",
      },
      {
        day: 2,
        title: "Cultural Exploration",
        description: "Visit ancient forts, local markets, and museums.",
      },
      {
        day: 3,
        title: "Scenic Day",
        description: "Visit viewpoints and local attractions.",
      },
    ],
  },
  {
    slug: "hunza-cultural-tour",
    title: "Hunza Cultural Tour",
    region: "Hunza",
    duration: "4 Days",
    difficulty: "Easy",
    bestSeason: "April – October",
    heroImage: "/images/tours/hunza-cultural.webp",
    gallery: ["/images/tours/hunza-tour-01.jpg", "/images/tours/hunza-tour-02.jpg"],
    highlights: ["Local Villages", "Apricot Orchards", "Mountain Scenery"],
    overview:
      "Experience the unique culture and lifestyle of Hunza Valley. Meet local families, explore traditional villages, and taste authentic cuisine.",
    accommodation: "Local guesthouses",
    mealPlan: "All meals with local families",
    transport: "4WD vehicle",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Hunza",
        description: "Travel from Gilgit to Hunza.",
      },
      {
        day: 2,
        title: "Village Experience",
        description: "Visit local villages and meet families.",
      },
      {
        day: 3,
        title: "Orchard Tour",
        description: "Explore apricot gardens and farms.",
      },
      {
        day: 4,
        title: "Return",
        description: "Journey back to Gilgit.",
      },
    ],
  },
  {
    slug: "gilgit-adventure-tour",
    title: "Gilgit Adventure Tour",
    region: "Gilgit",
    duration: "5 Days",
    difficulty: "Moderate",
    bestSeason: "May – September",
    heroImage: "/images/tours/gilgit-adventure.webp",
    gallery: ["/images/tours/gilgit-01.jpg", "/images/tours/gilgit-02.jpg"],
    highlights: ["River Activities", "Mountain Biking", "Cultural Sites"],
    overview:
      "Adventure-packed tour combining outdoor activities with cultural exploration in Gilgit region.",
    accommodation: "Adventure lodge",
    mealPlan: "Breakfast, lunch, dinner",
    transport: "4WD and activities included",
    itinerary: [
      { day: 1, title: "Arrival", description: "Welcome to Gilgit." },
      { day: 2, title: "River Activity", description: "Rafting on Gilgit River." },
      {
        day: 3,
        title: "Mountain Biking",
        description: "Explore trails on mountain bikes.",
      },
      { day: 4, title: "Cultural Day", description: "Visit local sites." },
      { day: 5, title: "Departure", description: "Return journey." },
    ],
  },
];
