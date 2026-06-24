// FAQs data model and sample data

export interface FAQItem {
  id: string;
  category: "General" | "Preparation" | "Logistics" | "Safety" | "Finance";
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    id: "general-1",
    category: "General",
    question: "How do I register for a trek?",
    answer:
      "Visit our Contact page and fill out the enquiry form with your preferred trek and travel dates. Our team will respond within 24 hours with available options and pricing.",
  },
  {
    id: "general-2",
    category: "General",
    question: "Do you organize solo treks?",
    answer:
      "Yes, we organize solo treks. You can join a group trek or book a private guided experience. Solo treks require a minimum booking of one guide.",
  },
  {
    id: "general-3",
    category: "General",
    question: "Do you organize private group treks?",
    answer:
      "Absolutely! We offer fully customized private treks for groups of any size. Contact us with your requirements and we'll design a perfect itinerary.",
  },
  {
    id: "prep-1",
    category: "Preparation",
    question: "How do I prepare for a trek?",
    answer:
      "Start training 2-3 months before your trek. Focus on cardiovascular fitness, strength training, and practice hiking with a loaded backpack. Consult our detailed preparation guide.",
  },
  {
    id: "prep-2",
    category: "Preparation",
    question: "What vaccinations are needed?",
    answer:
      "Consult your doctor about vaccinations for Pakistan. Common recommendations include Hepatitis A/B, Typhoid, and Tetanus. Altitude sickness prevention should also be discussed.",
  },
  {
    id: "prep-3",
    category: "Preparation",
    question: "What is the weather like?",
    answer:
      "Weather varies by region and season. Summer (June-September) is best for high-altitude treks. Temperatures range from 5-20°C at altitude, with unpredictable mountain weather possible.",
  },
  {
    id: "logistics-1",
    category: "Logistics",
    question: "What is the baggage allowance?",
    answer:
      "For treks, carry a backpack with 15-20kg of personal gear. Porter services are available for an additional cost to carry excess baggage.",
  },
  {
    id: "logistics-2",
    category: "Logistics",
    question: "Can equipment be rented?",
    answer:
      "Yes, we offer rental of trekking poles, sleeping bags, and other equipment. Rental costs are calculated per trek. High-quality equipment is guaranteed.",
  },
  {
    id: "logistics-3",
    category: "Logistics",
    question: "What meals are provided?",
    answer:
      "All meals are included in trek packages. We provide hearty breakfasts, packed lunches, and three-course dinners. Vegetarian and dietary requirements can be accommodated.",
  },
  {
    id: "logistics-4",
    category: "Logistics",
    question: "What is the accommodation like?",
    answer:
      "Accommodation ranges from basic mountain huts to comfortable camps with sleeping bags and foam mats. Higher-end options include heated tents and better amenities.",
  },
  {
    id: "safety-1",
    category: "Safety",
    question: "Is Pakistan safe for foreigners?",
    answer:
      "Gilgit Baltistan is a safe and stable region for trekking. Security is strong and tourist infrastructure is well-developed. Our guides are trained in all safety protocols.",
  },
  {
    id: "safety-2",
    category: "Safety",
    question: "Is the Karakoram Highway safe?",
    answer:
      "The Karakoram Highway is one of the world's most scenic routes and is generally safe for travelers. Occasional landslides occur during monsoon season, but regular maintenance ensures safety.",
  },
  {
    id: "finance-1",
    category: "Finance",
    question: "How much money should I carry?",
    answer:
      "Bring USD 1000-1500 for personal expenses. Most trek costs are included. Currency exchange is available in Islamabad, Gilgit, and Skardu.",
  },
  {
    id: "finance-2",
    category: "Finance",
    question: "How much should I tip porters?",
    answer:
      "Tips are appreciated but not mandatory. Standard practice is PKR 500-1000 (USD 2-4) per porter per day. Tipping shows appreciation for their hard work.",
  },
];
