// Blog posts data model and sample data

export interface BlogPost {
  slug: string;
  title: string;
  author: string;
  date: string; // ISO format: YYYY-MM-DD
  category: "Trekking" | "Expeditions" | "Travel Tips" | "Culture";
  excerpt: string;
  content: string;
  image: string;
  readingTime: number; // minutes
  videoUrl?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "preparing-for-k2-base-camp",
    title: "Preparing for the K2 Base Camp Trek: A Complete Guide",
    author: "Ahmed Khan",
    date: "2026-06-15",
    category: "Trekking",
    excerpt:
      "Learn essential preparation strategies, training routines, and mental tips to conquer the legendary K2 Base Camp Trek.",
    content: `The K2 Base Camp Trek is one of the most challenging and rewarding trekking experiences in the world. Many trekkers dream of walking across the Baltoro Glacier and standing at the base of K2, the world's second-highest mountain. But reaching this goal requires proper preparation, both physical and mental.

## Physical Training

Start your training 3-4 months before the trek. Focus on:
- Cardiovascular exercises (running, cycling, swimming)
- Strength training for legs and core
- Long-distance hiking with a loaded backpack
- Stair climbing with weight

## Altitude Acclimatization

High altitude poses significant challenges. Our guides monitor all trekkers closely and incorporate acclimatization days into the itinerary. Consider:
- Pre-trek acclimatization exercises
- Altitude sickness prevention medications
- Proper hydration throughout the trek

## Mental Preparation

The trek is as much mental as it is physical. Mental toughness comes from:
- Understanding your limitations
- Setting realistic goals
- Building confidence through training
- Staying positive during challenging moments

## Equipment Selection

Invest in quality gear:
- Proper trekking boots (broken in before the trek)
- Layered clothing for extreme temperature changes
- High-quality sleeping bag rated for cold temperatures
- Trekking poles to reduce knee strain

With proper preparation, you'll be ready to tackle this incredible adventure!`,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
    readingTime: 7,
  },
  {
    slug: "hunza-valley-secrets",
    title: "Secrets of Hunza Valley: Living Longer in the Mountains",
    author: "Fatima Ahmed",
    date: "2026-06-10",
    category: "Culture",
    excerpt:
      "Discover the secrets of Hunza Valley's famously long-lived residents and their unique lifestyle practices.",
    content: `Hunza Valley is renowned for the exceptional longevity of its residents. Scientists have long studied this region to understand the secrets of living a long, healthy life in the mountains.

## The Hunza Lifestyle

The people of Hunza Valley follow simple living principles:
- Natural diet rich in fruits and vegetables
- Regular physical activity through daily mountain work
- Strong community and family bonds
- Minimal stress and pollution

## Traditional Diet

The Hunza diet is a key factor in their longevity:
- Fresh apricots (dried and fresh)
- Whole grains and legumes
- Limited meat consumption
- Pure mountain water
- No processed foods

## Mountain Living

Life at high altitude presents natural challenges that build resilience:
- Daily walking on mountain terrain
- Regular physical work
- Natural circadian rhythms
- Clean air and water

Visit Hunza Valley to experience this unique lifestyle firsthand. Our tours provide genuine interactions with local families and insights into their traditions.`,
    image:
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&h=600&fit=crop",
    readingTime: 5,
  },
  {
    slug: "safety-tips-karakoram",
    title: "Mountain Safety Tips for Trekking in the Karakoram",
    author: "Hassan Ali",
    date: "2026-06-05",
    category: "Travel Tips",
    excerpt:
      "Essential safety guidelines to ensure a secure and enjoyable trekking experience in the Karakoram region.",
    content: `Safety is our top priority at Akhtar Abbasi Hiking. Whether you're a beginner or experienced trekker, these safety tips will help ensure a secure mountain experience.

## Before the Trek

- Inform someone about your itinerary
- Get proper travel insurance
- Consult your doctor about altitude
- Check weather forecasts
- Review our safety protocols

## During the Trek

- Follow your guide's instructions
- Stay with your group
- Stay hydrated and eat regularly
- Recognize altitude sickness symptoms
- Use proper footwear and equipment

## Altitude Sickness

Know the symptoms:
- Headache
- Dizziness
- Shortness of breath
- Nausea

Management:
- Acclimatization days
- Descent if symptoms worsen
- Medication (consult doctor)
- Rest and hydration

## Weather Awareness

Mountain weather changes rapidly:
- Start early to avoid afternoon storms
- Always carry rain gear
- Know your route's weather patterns
- Trust your guide's judgment

## Emergency Preparedness

- Carry a basic first aid kit
- Know location of nearest medical facilities
- Have emergency contact information
- Carry a satellite communicator on high-altitude treks

With these precautions and our experienced guides, you'll have a safe and unforgettable mountain adventure.`,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
    readingTime: 8,
  },
  {
    slug: "best-time-trek-gilgit-baltistan",
    title: "Best Time to Trek in Gilgit Baltistan: A Season Guide",
    author: "Ali Raza",
    date: "2026-05-25",
    category: "Trekking",
    excerpt:
      "Learn which season is ideal for different treks in Gilgit Baltistan and plan your adventure accordingly.",
    content: `Gilgit Baltistan offers world-class trekking opportunities throughout the year, but the best time depends on your trek and preferences.

## Summer Season (June - September)

Ideal for high-altitude treks:
- K2 Base Camp Trek
- Nanga Parbat Expedition
- All expeditions above 6000m
- Temperatures: 5-20°C at altitude
- Clear skies and stable weather
- Most tourism activities available

## Spring Season (April - May)

Perfect for easier treks and tours:
- Hunza Valley Trek
- Skardu City Tour
- Gilgit Adventure Tour
- Blooming flowers (April-May)
- Mild temperatures
- Fewer crowds

## Autumn Season (September - October)

Excellent for post-monsoon trekking:
- Clear mountain views
- Comfortable temperatures
- Golden autumn colors
- Good for photography

## Winter Season (November - March)

Limited trekking due to:
- Heavy snowfall at high altitudes
- Closed high passes
- Cold temperatures (below -10°C at altitude)
- Only lower-altitude accessible areas

Plan your trek based on season, difficulty level, and weather preferences. Contact us for season-specific recommendations.`,
    image:
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&h=600&fit=crop",
    readingTime: 6,
  },
  {
    slug: "trekking-gear-essentials",
    title: "Essential Trekking Gear Checklist for Mountain Adventures",
    author: "Sara Williams",
    date: "2026-05-20",
    category: "Travel Tips",
    excerpt:
      "Complete gear checklist to ensure you have everything needed for a comfortable and safe mountain trek.",
    content: `Proper gear is essential for a comfortable and safe trekking experience. Here's a comprehensive checklist of everything you need.

## Footwear & Clothing

- Trekking boots (broken in before trek)
- Wool socks (multiple pairs)
- Layers: base layer, fleece, jacket
- Rain gear and wind jacket
- Hat and sun protection

## Backpack & Bag

- 60-70L backpack with rain cover
- Day pack for daily items
- Waterproof bags for electronics

## Shelter & Sleep

- Tent (provided by company)
- Sleeping bag rated for altitude
- Sleeping pad
- Ground sheet

## Nutrition & Water

- Water bottles or hydration bladder
- Electrolyte supplements
- Energy bars and snacks
- Sunscreen and lip balm

## Health & Safety

- First aid kit
- Medications for altitude
- Blister treatment
- Personal medications
- Insurance documents

With this checklist, you'll be fully prepared for your mountain adventure!`,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
    readingTime: 6,
  },
];
