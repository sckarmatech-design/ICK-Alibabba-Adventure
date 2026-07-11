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
  price?: number;
  currency?: string;
  priceIncludes?: string[];
  priceExcludes?: string[];
  depositAmount?: number;
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
    heroImage: "https://images.unsplash.com/photo-SWo3ZS-cQ6U?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-FhE2XuXUbVY?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-nv-HceGCO0A?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1638433097357-1dea5816d7a5?w=800&h=600&fit=crop",
    ],
    highlights: [
      "9th Highest Peak",
      "Technical Climbing",
      "Killer Mountain",
      "Extreme Adventure",
      "Expert Guides",
      "Rupal Face",
    ],
    overview:
      "Attempt the 9th highest peak in the world. Nanga Parbat, known as the Killer Mountain, is one of the most technically demanding 8000m expeditions. The standard route ascends the Kinshofer Route on the Diamir Face, involving steep rock bands, serac negotiation, and exposed ridgeline climbing. Only for climbers with previous 7000m+ summit experience and solid crevasse-rescue skills.",
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
    technicalRating: "AD (Assez Difficile)",
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
    duration: "35 Days",
    altitude: "7,788 m",
    difficulty: "Challenging",
    bestSeason: "July – September",
    heroImage: "https://images.unsplash.com/photo-1683548503315-bb949615f80b?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1632133915653-8ded5c72e329?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1638433097357-1dea5816d7a5?w=800&h=600&fit=crop",
    ],
    highlights: ["Beautiful Peak", "Technical Climbing", "Hunza Views", "Alpine Challenge"],
    overview:
      "Climb Rakaposhi, one of the most beautifully proportioned peaks in the Karakoram. At 7,788m, this expedition demands solid alpine skills — steep ice slopes, crevassed glacier travel, and exposed ridgeline sections. The standard route follows the southwest ridge from Minapin, with high camps on the hanging glacier. An excellent stepping stone toward 8000m objectives.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Gilgit",
        description: "Arrive in Gilgit. Equipment check and briefing. Drive to Minapin.",
      },
      {
        day: 2,
        title: "Minapin Base Camp",
        description: "Establish base camp near Minapin (1,350m). Begin acclimatization routine.",
      },
      {
        day: 3,
        title: "Base Camp Acclimatization",
        description: "Rest day and gear preparation. Short acclimatization hikes around the valley.",
      },
      {
        day: 4,
        title: "Camp 1 (4,900m)",
        description: "Establish Camp 1 on the glacier above the treeline. Roped travel on crevassed terrain.",
      },
      {
        day: 5,
        title: "Camp 2 (5,700m)",
        description: "Fix ropes and establish Camp 2 on the hanging glacier. Steep ice sections.",
      },
      {
        day: 6,
        title: "Summit Push",
        description: "Summit attempt via the southwest ridge. Exposed ridgeline to the summit plateau.",
      },
      {
        day: 7,
        title: "Reserve / Contingency",
        description: "Weather buffer day available for summit attempts or rest.",
      },
      {
        day: 8,
        title: "Descent to BC",
        description: "Retreat through camps to base camp. Dismantle camps.",
      },
    ],
    technicalRating: "AD (Assez Difficile)",
  },
  {
    slug: "spantik-expedition",
    title: "Spantik Expedition – The Golden Peak",
    region: "The Karakoram",
    duration: "22 Days",
    altitude: "7,027 m",
    difficulty: "Moderate",
    bestSeason: "July – September",
    heroImage: "https://images.unsplash.com/photo-1632133915653-8ded5c72e329?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1638433097357-1dea5816d7a5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1684230715200-40f32e068bf2?w=800&h=600&fit=crop",
    ],
    highlights: ["Perfect First 7000m", "Alpine Views", "Golden Light Summit", "High Success Rate"],
    overview:
      "Spantik, often called the Golden Peak for the warm alpenglow that bathes its summit ridges at sunset, is one of the most accessible 7000m peaks in Pakistan. The route follows straightforward snow and ice slopes with moderate angles, making it an ideal first 7000m objective. Summiting Spantik builds confidence and experience for higher expeditions in the Karakoram.",
    itinerary: [
      {
        day: 1,
        title: "Base Camp Arrival",
        description: "Establish base camp near Chogogrong Glacier and begin acclimatization.",
      },
      {
        day: 2,
        title: "Acclimatization",
        description: "Rest day at base camp for altitude adjustment. Short hikes on surrounding ridges.",
      },
      {
        day: 3,
        title: "Advanced Base Camp",
        description: "Move to advanced base camp on the glacier at 4,500m. Set up camp.",
      },
    ],
    technicalRating: "PD (Peu Difficile)",
  },
  {
    slug: "gasherbrum-expedition",
    title: "Gasherbrum I (Hidden Peak) Expedition",
    region: "The Karakoram",
    duration: "40 Days",
    altitude: "8,080 m",
    difficulty: "Expert",
    bestSeason: "July – August",
    heroImage: "https://images.unsplash.com/photo-1632133915653-8ded5c72e329?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1638433097357-1dea5816d7a5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-a_beihLZ2Eo?w=800&h=600&fit=crop",
    ],
    highlights: ["11th Highest Peak", "Alpine Climbing", "Concordia Views", "Ultimate Challenge"],
    overview:
      "Gasherbrum I is the 11th highest mountain in the world and one of the most sought-after 8000m peaks. The standard Japanese/Czech route involves sustained steep snow and ice climbing, serac negotiation, and high-altitude ridge travel. Requires expert mountaineering skills, previous 7000m+ experience, and solid familiarity with oxygen systems.",
    itinerary: [
      {
        day: 1,
        title: "Base Camp",
        description: "Establish base camp and begin expedition.",
      },
    ],
    technicalRating: "AD/D (Assez Difficile to Difficile)",
    gear: ["Full technical mountaineering kit", "Oxygen system", "8000m expedition gear"],
  },
];
