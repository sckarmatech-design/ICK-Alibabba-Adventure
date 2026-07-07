// Trip/Hiking data model and sample data

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Trip {
  slug: string;
  title: string;
  category: "Short Trek" | "Multi-Day Trek" | "Day Hike";
  region: string;
  duration: string;
  difficulty: "Easy" | "Moderate" | "Challenging" | "Expert";
  bestSeason: string;
  heroImage: string;
  gallery: string[];
  highlights: string[];
  overview: string;
  itinerary: ItineraryDay[];
  faqs: FAQ[];
  groupSize?: string;
  startPoint?: string;
  endPoint?: string;
}

export const trips: Trip[] = [
  {
    slug: "k2-base-camp-trek",
    title: "K2 Base Camp Trek",
    category: "Multi-Day Trek",
    region: "The Karakoram",
    duration: "17 Days",
    difficulty: "Challenging",
    bestSeason: "June – September",
    heroImage: "https://images.unsplash.com/photo-1632133915653-8ded5c72e329?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1638433097357-1dea5816d7a5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1677103036843-df9e5ad74eea?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-a_beihLZ2Eo?w=800&h=600&fit=crop",
    ],
    highlights: ["Baltoro Glacier", "Concordia", "K2 Views", "Alpine Lakes", "Expert Guides"],
    overview:
      "Trek deep into the heart of the Karakoram to the foot of K2, the world's second-highest mountain. Starting from Askole, the last inhabited village, the trail follows the Braldu River, crosses the mighty Baltoro Glacier, and reaches Concordia — the junction of the greatest concentration of high peaks on Earth. Marvel at K2, Broad Peak, and the Gasherbrum massif from camps on glacial moraine.",
    itinerary: [
      {
        day: 1,
        title: "Islamabad Arrival",
        description:
          "Arrive in Islamabad. Transfer to hotel. Briefing session and equipment check. Meet your trekking team and review safety protocols.",
      },
      {
        day: 2,
        title: "Islamabad to Skardu",
        description: "Flight to Skardu (about 2 hours). Acclimatization day in this beautiful valley. Explore local markets and relax.",
      },
      {
        day: 3,
        title: "Skardu to Askole",
        description: "Long drive to Askole (about 8 hours), the last village before the trek begins. Overnight in local guesthouse.",
      },
      {
        day: 4,
        title: "Askole to Jhula",
        description: "Start trekking through rhododendron forests and rocky terrain. Altitude: 2,200m to 2,500m. 5-6 hours.",
      },
      {
        day: 5,
        title: "Jhula to Paju",
        description: "Continue through pristine wilderness, enjoying mountain views. Cross several streams. 4-5 hours. Altitude: 2,500m to 2,680m.",
      },
      {
        day: 6,
        title: "Paju to Liligo",
        description: "Trek through alpine meadows with stunning views of surrounding peaks. 5 hours. Altitude: 2,680m to 3,100m.",
      },
      {
        day: 7,
        title: "Liligo to Baltoro Camp",
        description: "First views of the Baltoro Glacier. Set up camp on the glacier. 4-5 hours. Altitude: 3,100m to 3,500m.",
      },
      {
        day: 8,
        title: "Acclimatization Day",
        description: "Rest day at Baltoro Camp. Light exploration of glacier areas. Altitude adjustment continues.",
      },
      {
        day: 9,
        title: "Baltoro to Concordia",
        description: "Trek across the Baltoro Glacier to Concordia. Witness the meeting of K2, Broad Peak, and Gasherbrum peaks. 5 hours.",
      },
      {
        day: 10,
        title: "Concordia Exploration",
        description: "Full day exploration of Concordia area. Highest campsite at the base of K2. Photography opportunities.",
      },
    ],
    faqs: [
      {
        question: "What is the fitness level required?",
        answer:
          "This trek is challenging and requires excellent fitness. Regular training 3-4 months before is recommended. You should be comfortable hiking 5-6 hours daily at high altitude.",
      },
      {
        question: "What about altitude sickness?",
        answer:
          "Our guides monitor all trekkers closely. We take acclimatization days and carry oxygen as a precaution. We recommend consulting your doctor before the trek.",
      },
      {
        question: "What's the best time to trek?",
        answer:
          "June to September is the best season. July and August offer the most stable weather, while June and September are less crowded.",
      },
    ],
    groupSize: "6-12 people",
    startPoint: "Islamabad",
    endPoint: "Skardu",
  },
  {
    slug: "fairy-meadows-trek",
    title: "Fairy Meadows Trek",
    category: "Multi-Day Trek",
    region: "Nanga Parbat",
    duration: "5 Days",
    difficulty: "Moderate",
    bestSeason: "May – September",
    heroImage: "https://images.unsplash.com/photo-a_beihLZ2Eo?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-SWo3ZS-cQ6U?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-nv-HceGCO0A?w=800&h=600&fit=crop",
    ],
    highlights: ["Nanga Parbat Views", "Alpine Meadows", "Mountain Wildlife", "Local Culture"],
    overview:
      "Trek to the legendary Fairy Meadows, a lush alpine plateau at the foot of Nanga Parbat (8,126 m) — the ninth-highest mountain on Earth. The journey begins with a thrilling jeep ride from Raikot Bridge up a winding dirt road to Tato Village, followed by a forested hike through pine and juniper to the meadows. Soak in close-up views of the Rupal Face, one of the world's largest mountain walls.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Gilgit",
        description: "Meet our guide and explore Gilgit city. Visit the Gilgit Bazaar and relax at the hotel. Briefing and preparation.",
      },
      {
        day: 2,
        title: "Gilgit to Raikot Bridge – Tato Village",
        description: "Drive to Raikot Bridge (about 1.5 hours), then take a thrilling 4WD jeep up to Tato Village. Begin trek through pine forests toward Fairy Meadows. 4-5 hours.",
      },
      {
        day: 3,
        title: "Trek to Fairy Meadows",
        description: "Ascend through forests to the magical Fairy Meadows. First views of Nanga Parbat. 6 hours. Altitude: 2,400m.",
      },
      {
        day: 4,
        title: "Fairy Meadows Exploration",
        description: "Full day to explore and enjoy the meadows. Photography, nature walks, and relaxation. Optional: visit local shepherds.",
      },
      {
        day: 5,
        title: "Return to Gilgit",
        description: "Trek down to Tato, jeep ride to Raikot Bridge, and drive back to Gilgit. Arrive evening. Celebration dinner with the team.",
      },
    ],
    faqs: [
      {
        question: "When is the best time to visit?",
        answer: "May to September offers the best weather and accessible trails. July and August are peak season with stable conditions.",
      },
      {
        question: "Is this trek suitable for beginners?",
        answer: "Yes, this is a moderate trek suitable for people with basic fitness. No climbing experience needed.",
      },
    ],
    groupSize: "4-10 people",
    startPoint: "Gilgit",
    endPoint: "Gilgit",
  },
  {
    slug: "hunza-valley-trek",
    title: "Hunza Valley Trek",
    category: "Short Trek",
    region: "Hunza",
    duration: "3 Days",
    difficulty: "Easy",
    bestSeason: "April – October",
    heroImage: "https://images.unsplash.com/photo-1632133915653-8ded5c72e329?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1611834473980-502e0a1220d7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1638433097357-1dea5816d7a5?w=800&h=600&fit=crop",
    ],
    highlights: ["Alpine Villages", "Panoramic Views", "Apricot Gardens", "Local Hospitality", "Photography"],
    overview:
      "Explore the picturesque Hunza Valley, known for its terraced fields, apricot orchards, and famously hospitable people. This easy trek winds through ancient villages like Karimabad, Ganish, and Duikar, with sweeping views of Rakaposhi, Ultar Sar, and the Passu Cones. Learn about the legendary longevity of Hunza's residents and sample their nutrient-rich traditional cuisine.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Hunza",
        description: "Transfer from Gilgit to Hunza (about 4 hours). Check-in at guesthouse. Explore local markets and villages.",
      },
      {
        day: 2,
        title: "Valley Trek",
        description: "Easy trek through villages and apricot orchards. Meet local families. Traditional Hunza lunch with a family. 4 hours.",
      },
      {
        day: 3,
        title: "Return Journey",
        description: "Final exploration of nearby villages. Souvenir shopping. Drive back to Gilgit in evening.",
      },
    ],
    faqs: [],
    groupSize: "4-15 people",
    startPoint: "Gilgit",
    endPoint: "Gilgit",
  },
  {
    slug: "rakaposhi-base-camp-trek",
    title: "Rakaposhi Base Camp Trek",
    category: "Multi-Day Trek",
    region: "Nagar Valley",
    duration: "6 Days",
    difficulty: "Moderate",
    bestSeason: "May – September",
    heroImage: "https://images.unsplash.com/photo-1683548503315-bb949615f80b?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1632133915653-8ded5c72e329?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1638433097357-1dea5816d7a5?w=800&h=600&fit=crop",
    ],
    highlights: ["Rakaposhi Peak", "Mountain Views", "Nagar Villages", "Alpine Forests"],
    overview:
      "Trek to the base of Rakaposhi (7,788 m), one of the most perfectly shaped peaks in the Karakoram. Starting from Gilgit, the route goes through the lush Nagar Valley to the village of Minapin, then climbs through juniper and birch forests to the Rakaposhi Base Camp meadow. The close-up view of Rakaposhi's southeast ridge from camp is among the finest mountain vistas in Pakistan.",
    itinerary: [
      {
        day: 1,
        title: "Gilgit to Minapin",
        description: "Drive from Gilgit through Nagar Valley (2 hours) to Minapin village. Fine views of Rakaposhi en route. Overnight at guesthouse.",
      },
      {
        day: 2,
        title: "Minapin to Rakaposhi Base Camp",
        description: "Trek from Minapin (1,350m) through irrigated fields and juniper forest. Steady climb to the base camp meadow at 3,500m. 5-6 hours.",
      },
      {
        day: 3,
        title: "Base Camp Exploration Day",
        description: "Full day at base camp. Photography of Rakaposhi's southeast ridge. Optional hike toward the Hapakun Glacier moraine.",
      },
      {
        day: 4,
        title: "Return to Minapin",
        description: "Descend back through forests and villages to Minapin. Overnight at guesthouse.",
      },
      {
        day: 5,
        title: "Minapin – Nagar Valley Tour",
        description: "Explore the Nagar Valley — visit Hopper, Pisan, and the Nagar Fort area. Experience local culture and apricot orchards.",
      },
      {
        day: 6,
        title: "Return to Gilgit",
        description: "Drive back to Gilgit. Departure or onward transfer.",
      },
    ],
    faqs: [],
    groupSize: "4-12 people",
    startPoint: "Gilgit",
    endPoint: "Gilgit",
  },
];
