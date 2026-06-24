// Expedition data model and sample data

export interface Expedition {
  slug: string;
  title: string;
  region: string;
  duration: string;
  altitude: string;
  difficulty: "Moderate" | "Challenging" | "Expert";
  bestSeason: string;
  heroImage: string;
  gallery: string[];
  highlights: string[];
  overview: string;
  itinerary: Array<{ day: number; title: string; description: string }>;
  technicalRating: string;
  gear?: string[];
  faqs?: Array<{ question: string; answer: string }>;
}

export const expeditions: Expedition[] = [
  {
    slug: "nanga-parbat-expedition",
    title: "Nanga Parbat Expedition",
    region: "Nanga Parbat",
    duration: "30 Days",
    altitude: "8,126 m",
    difficulty: "Expert",
    bestSeason: "July – September",
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    ],
    highlights: [
      "9th Highest Peak",
      "Technical Climbing",
      "Iconic Mountain",
      "Extreme Adventure",
      "Expert Guides",
      "Life-Changing Experience",
    ],
    overview:
      "Attempt the 9th highest peak in the world. Nanga Parbat, known as the Killer Mountain, is one of the most challenging and rewarding expeditions. This expedition combines high-altitude mountaineering with technical rock and ice climbing. Only for experienced climbers with previous 6000m+ summit experience. Our expert guides have summited multiple 8000m peaks.",
    itinerary: [
      {
        day: 1,
        title: "Islamabad Arrival",
        description: "Arrive in Islamabad. Briefing, equipment check, and acclimatization begins.",
      },
      {
        day: 2,
        title: "Travel to Base Camp",
        description: "Journey to Nanga Parbat Base Camp via Fairy Meadows.",
      },
      {
        day: 3,
        title: "Acclimatization",
        description: "Rest and acclimatization at base camp (3,600m). Prepare gear and supplies.",
      },
      {
        day: 4,
        title: "Camp 1 Push",
        description: "Establish Camp 1 at 5,200m. Technical rock and ice climbing begins.",
      },
      {
        day: 5,
        title: "Acclimatization Climb",
        description: "Climb to Camp 1, acclimatize, and return to Base Camp.",
      },
    ],
    technicalRating: "PD+ (Peu Difficile +)",
    gear: [
      "Ice axes",
      "Crampons",
      "Rope and carabiners",
      "Climbing helmet",
      "Oxygen system",
      "High-altitude tent",
      "Insulated boots",
      "Down jacket",
      "Technical climbing gear",
    ],
    faqs: [
      {
        question: "Do I need mountaineering experience?",
        answer:
          "Yes, at least 2-3 previous 6000m+ peaks and rock climbing grade 3-4 experience required. Previous 8000m experience is a plus.",
      },
      {
        question: "What's the success rate?",
        answer: "Success rate is typically 30-40% depending on weather. Our guides have a high success rate due to experience.",
      },
      {
        question: "How much does it cost?",
        answer: "Please contact us for detailed pricing. Costs depend on group size and requirements.",
      },
    ],
  },
  {
    slug: "rakaposhi-expedition",
    title: "Rakaposhi Expedition",
    region: "Hunza",
    duration: "14 Days",
    altitude: "7,788 m",
    difficulty: "Challenging",
    bestSeason: "July – September",
    heroImage: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    ],
    highlights: ["Beautiful Peak", "Technical Climbing", "Hunza Views", "Alpine Challenge"],
    overview:
      "Climb Rakaposhi, one of the most beautiful peaks in the Karakoram. This expedition offers stunning views and challenging technical climbing suitable for experienced mountaineers. At 7,788m, Rakaposhi is an excellent preparation for 8000m peaks.",
    itinerary: [
      {
        day: 1,
        title: "Arrival",
        description: "Arrive in Gilgit and travel to Minapin Base Camp.",
      },
      {
        day: 2,
        title: "Base Camp Setup",
        description: "Settle at base camp and begin acclimatization.",
      },
      {
        day: 3,
        title: "Camp 1",
        description: "Establish Camp 1 and return for acclimatization.",
      },
      {
        day: 4,
        title: "Summit Push",
        description: "Push towards summit. Attempt early morning summit.",
      },
    ],
    technicalRating: "AD (Assez Difficile)",
  },
  {
    slug: "spantik-expedition",
    title: "Spantik Expedition - The Shishapangma of Pakistan",
    region: "The Karakoram",
    duration: "12 Days",
    altitude: "7,027 m",
    difficulty: "Moderate",
    bestSeason: "July – September",
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop",
    ],
    highlights: ["Perfect First 7000m", "Alpine Views", "Technical Climbing", "High Success Rate"],
    overview:
      "An excellent stepping stone to higher peaks. Spantik is perfect for climbers looking to summit their first 7000m peak with moderate technical difficulty. Often called 'The Shishapangma of Pakistan', this peak builds confidence for 8000m expeditions.",
    itinerary: [
      {
        day: 1,
        title: "Base Camp Arrival",
        description: "Establish base camp and begin acclimatization.",
      },
      {
        day: 2,
        title: "Acclimatization",
        description: "Rest day at base camp for altitude adjustment.",
      },
      {
        day: 3,
        title: "Advanced Base Camp",
        description: "Move to advanced base camp and set up camps.",
      },
    ],
    technicalRating: "PD (Peu Difficile)",
  },
  {
    slug: "gasherbrum-expedition",
    title: "Gasherbrum I (Hidden Peak) Expedition",
    region: "The Karakoram",
    duration: "25 Days",
    altitude: "8,080 m",
    difficulty: "Expert",
    bestSeason: "July – August",
    heroImage: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    ],
    highlights: ["11th Highest Peak", "Alpine Climbing", "Concordia Views", "Ultimate Challenge"],
    overview:
      "Gasherbrum I is the 11th highest mountain in the world and one of the most sought-after 8000m peaks. This expedition requires expert mountaineering skills and previous high-altitude experience.",
    itinerary: [
      {
        day: 1,
        title: "Base Camp",
        description: "Establish base camp and begin expedition.",
      },
    ],
    technicalRating: "PD+ (Peu Difficile +)",
    gear: ["Full technical mountaineering kit", "Oxygen system", "8000m expedition gear"],
  },
];
