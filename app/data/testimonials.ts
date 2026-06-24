// Testimonials data model and sample data

export interface Testimonial {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  rating: number; // 1-5
  review: string;
  tripName: string;
  image?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Sarah Johnson",
    country: "United States",
    countryCode: "US",
    rating: 5,
    review:
      "One of the most incredible experiences of my life! The K2 Base Camp Trek was perfectly organized with amazing guides and fellow trekkers. The views were absolutely breathtaking. Would definitely come back for another adventure.",
    tripName: "K2 Base Camp Trek",
  },
  {
    id: "test-2",
    name: "Anna Mueller",
    country: "Germany",
    countryCode: "DE",
    rating: 5,
    review:
      "The Fairy Meadows Trek exceeded all my expectations. The guides were knowledgeable and caring, the food was delicious, and the Nanga Parbat views were out of this world. Highly recommended for anyone seeking an unforgettable mountain experience.",
    tripName: "Fairy Meadows Trek",
  },
  {
    id: "test-3",
    name: "James Chen",
    country: "Singapore",
    countryCode: "SG",
    rating: 5,
    review:
      "Akhtar Abbasi Hiking provided exceptional service from start to finish. The Hunza Valley Tour was relaxing yet adventurous, perfect for someone like me seeking a balance. The local insights shared by our guides were invaluable.",
    tripName: "Hunza Valley Trek",
  },
  {
    id: "test-4",
    name: "Emma Thompson",
    country: "United Kingdom",
    countryCode: "GB",
    rating: 4,
    review:
      "An amazing trek with professional guides and stunning scenery. The organization was excellent and the team was very supportive throughout. My only suggestion would be slightly better accommodation at higher altitudes, but overall fantastic.",
    tripName: "Spantik Expedition",
  },
  {
    id: "test-5",
    name: "Marco Rossi",
    country: "Italy",
    countryCode: "IT",
    rating: 5,
    review:
      "Incredibile! The Skardu City Tour was a perfect blend of culture and nature. Our guide was passionate about sharing the region's history and local traditions. Every moment was memorable. Grazie mille!",
    tripName: "Skardu City Tour",
  },
  {
    id: "test-6",
    name: "Lisa Anderson",
    country: "Canada",
    countryCode: "CA",
    rating: 5,
    review:
      "This company is world-class. From booking to the final day of the trek, everything was handled professionally. The guides are not just knowledgeable but truly passionate about the mountains. Can't wait to come back!",
    tripName: "K2 Base Camp Trek",
  },
];
