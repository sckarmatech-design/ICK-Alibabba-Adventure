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
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    ],
    highlights: ["Baltoro Glacier", "Concordia", "K2 Views", "Alpine Lakes", "Expert Guides"],
    overview:
      "Experience one of the world's most iconic mountain treks. The K2 Base Camp Trek takes you through stunning alpine landscapes, across the legendary Baltoro Glacier, and to the base of K2, the world's second-highest mountain. This challenging trek is perfect for experienced hikers seeking an unforgettable adventure in the Karakoram. Walk among crystalline glaciers, camp beneath towering peaks, and achieve views that few people on Earth have experienced.",
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
    bestSeason: "July – September",
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop",
    ],
    highlights: ["Nanga Parbat Views", "Alpine Meadows", "Mountain Wildlife", "Local Culture"],
    overview:
      "Trek to the magical Fairy Meadows nestled at the base of Nanga Parbat. Known for its lush green meadows and stunning mountain vistas, this trek offers a perfect blend of adventure and natural beauty. Experience the hospitality of Nanga Parbat Base Camp, surrounded by some of the most dramatic mountain scenery in the world.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Gilgit",
        description: "Meet our guide and explore Gilgit city. Visit the Gilgit Bazaar and relax at the hotel. Briefing and preparation.",
      },
      {
        day: 2,
        title: "Gilgit to Bunji",
        description: "Drive to Bunji (about 3 hours) and begin trek to Astore. Trek through scenic valleys. 5 hours.",
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
        description: "Trek down and drive back to Gilgit. Arrive evening. Celebration dinner with the team.",
      },
    ],
    faqs: [
      {
        question: "When is the best time to visit?",
        answer: "July to September offers the best weather and accessible trails. August is peak season with stable weather.",
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
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop"],
    highlights: ["Alpine Villages", "Panoramic Views", "Apricot Gardens", "Local Hospitality", "Photography"],
    overview:
      "Explore the picturesque Hunza Valley, known for its terraced fields, fruit gardens, and friendly locals. This easy trek is perfect for families and beginners seeking a relaxing introduction to mountain trekking. Learn about the famous longevity of Hunza people and experience their authentic culture and cuisine.",
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
    slug: "nanda-devi-trek",
    title: "Rakaposhi Base Camp Trek",
    category: "Multi-Day Trek",
    region: "Hunza",
    duration: "6 Days",
    difficulty: "Moderate",
    bestSeason: "May – September",
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop",
    ],
    highlights: ["Rakaposhi Peak", "Mountain Views", "Local Villages", "Alpine Forests"],
    overview:
      "Trek to the base of Rakaposhi, one of the most beautiful peaks in the Karakoram. This moderate trek offers stunning views and excellent photography opportunities.",
    itinerary: [
      {
        day: 1,
        title: "Gilgit to Minapin",
        description: "Drive to Minapin and begin trek. Set up camp in beautiful setting.",
      },
      {
        day: 2,
        title: "Minapin Exploration",
        description: "Trek around Minapin area. Visit local villages and explore hiking trails.",
      },
      {
        day: 3,
        title: "Trek to Base Camp",
        description: "Trek to Rakaposhi Base Camp. Stunning views of the peak.",
      },
      {
        day: 4,
        title: "Base Camp Day",
        description: "Full day at base camp. Photography and relaxation.",
      },
      {
        day: 5,
        title: "Return Trek",
        description: "Trek back down to Minapin.",
      },
      {
        day: 6,
        title: "Return to Gilgit",
        description: "Drive back to Gilgit.",
      },
    ],
    faqs: [],
    groupSize: "4-12 people",
    startPoint: "Gilgit",
    endPoint: "Gilgit",
  },
];
