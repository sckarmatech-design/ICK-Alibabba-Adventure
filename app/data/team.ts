// Team data model and sample data

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  specialization?: string;
  experience?: string;
}

export const team: TeamMember[] = [
  {
    id: "team-1",
    name: "Akhtar Abbasi",
    role: "Founder & Head Guide",
    bio: "With over 25 years of mountain experience, Akhtar has guided expeditions across all major peaks in the Karakoram. His passion for the mountains and dedication to client safety has made him a legendary figure in the trekking community.",
    image: "/images/team/akhtar-abbasi.webp",
    specialization: "High-altitude mountaineering and expedition planning",
    experience: "25+ years",
  },
  {
    id: "team-2",
    name: "Fatima Khan",
    role: "Senior Trek Guide",
    bio: "Fatima is one of the few female mountain guides in the region. Her warm personality and expert knowledge of the local culture make every trek unforgettable. She specializes in cultural immersion experiences.",
    image: "/images/team/fatima-khan.webp",
    specialization: "Cultural tours and day hikes",
    experience: "15 years",
  },
  {
    id: "team-3",
    name: "Hassan Ali",
    role: "Expedition Guide",
    bio: "Hassan has summited K2, Nanga Parbat, and numerous other 7000m+ peaks. His technical climbing expertise and calm demeanor in challenging situations make him one of our most trusted guides.",
    image: "/images/team/hassan-ali.webp",
    specialization: "Technical mountaineering and high-altitude expeditions",
    experience: "18 years",
  },
  {
    id: "team-4",
    name: "Muhammad Rafiq",
    role: "Operations Manager",
    bio: "Rafiq ensures every trek runs smoothly from logistics to accommodation. His attention to detail and organizational skills guarantee that clients have a seamless experience from booking to return.",
    image: "/images/team/muhammad-rafiq.webp",
    specialization: "Trek logistics and coordination",
    experience: "12 years",
  },
  {
    id: "team-5",
    name: "Ahmed Khan",
    role: "Photographer & Guide",
    bio: "Ahmed combines his passion for photography with guiding to capture stunning moments during treks. His images have been featured in international magazines and his storytelling enriches every journey.",
    image: "/images/team/ahmed-khan.webp",
    specialization: "Photography expeditions and visual documentation",
    experience: "10 years",
  },
  {
    id: "team-6",
    name: "Zainab Malik",
    role: "Cultural Liaison & Guide",
    bio: "Zainab's deep knowledge of local traditions, languages, and customs makes her invaluable for cultural tours. She acts as a bridge between trekkers and local communities, ensuring authentic interactions.",
    image: "/images/team/zainab-malik.webp",
    specialization: "Cultural liaison and community relations",
    experience: "8 years",
  },
];
