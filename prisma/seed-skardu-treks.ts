import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@prisma/client";

const databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface TripSeed {
  slug: string;
  title: string;
  category: "SHORT_TREK" | "MULTI_DAY_TREK" | "DAY_HIKE";
  region: string;
  duration: string;
  difficulty: "EASY" | "MODERATE" | "CHALLENGING" | "EXPERT";
  bestSeason: string;
  heroImage: string;
  gallery: string[];
  highlights: string[];
  overview: string;
  price: number;
  currency: string;
  priceIncludes: string[];
  priceExcludes: string[];
  depositAmount: number;
  groupSize: string;
  startPoint: string;
  endPoint: string;
  itinerary: ItineraryDay[];
  faqs: FAQ[];
}

interface TourSeed {
  slug: string;
  title: string;
  region: string;
  duration: string;
  difficulty: "EASY" | "MODERATE" | "CHALLENGING" | "EXPERT";
  bestSeason: string;
  heroImage: string;
  gallery: string[];
  highlights: string[];
  overview: string;
  price: number;
  currency: string;
  priceIncludes: string[];
  priceExcludes: string[];
  depositAmount: number;
  accommodation: string;
  mealPlan: string;
  transport: string;
  itinerary: ItineraryDay[];
}

const trips: TripSeed[] = [
  {
    slug: "k2-base-camp-trek",
    title: "K2 Base Camp Trek",
    category: "MULTI_DAY_TREK",
    region: "Karakoram, Baltistan",
    duration: "15 Days",
    difficulty: "CHALLENGING",
    bestSeason: "June – September",
    heroImage: "",
    gallery: [],
    highlights: [
      "Walk the full length of the Baltoro Glacier",
      "Stand at Concordia, the Throne Room of the Mountain Gods",
      "Close-up views of K2, Broad Peak, and the Gasherbrum massif",
      "Camp beneath the granite spires of the Trango Towers",
      "Trek from Askole, the last roadhead village in the valley",
    ],
    overview:
      "This is the classic approach to the world’s second-highest mountain. Beginning in Islamabad, the journey flies north to Skardu before continuing by road to Askole, the final settlement before the Karakoram closes in. From here the trail follows the Braldu River, climbs through scrub and juniper, and eventually commits to the ice of the Baltoro Glacier. Each day brings a new rank of peaks into view until you reach Concordia, the vast glacial junction where K2, Broad Peak, Gasherbrum I, and Gasherbrum II dominate the horizon.\n\n" +
      "The trek is physically demanding but non-technical. Days are spent walking on moraine, loose rock, and glacier ice, with several camps sitting above 4,000 metres. Acclimatisation is built into the schedule, and the pace is steady to give everyone the best chance of reaching K2 Base Camp in good condition. For anyone wanting to understand the scale of the Karakoram, this trek is the definitive introduction.\n\n" +
      "Evenings are spent in a tented camp looked after by a local cook team. The atmosphere is warm, the food is hearty, and the silence of the glacier under a full moon is something that stays with you long after the flight home.",
    price: 2400,
    currency: "USD",
    priceIncludes: [
      "Return domestic flights Islamabad – Skardu",
      "All road transfers including Skardu – Askole – Skardu",
      "Hotel accommodation in Islamabad and Skardu on twin-share basis",
      "Full board camping meals during the trek",
      "Experienced English-speaking trekking guide",
      "Porterage allowance up to 15 kg per person",
      "All trekking permits, park fees, and environmental levies",
      "Two-person tents, mess tent, kitchen equipment, and utensils",
      "Group first-aid kit and emergency oxygen cylinder",
      "Satellite phone available for emergency use",
    ],
    priceExcludes: [
      "International flights to and from Pakistan",
      "Pakistan entry visa and passport fees",
      "Travel and rescue insurance with high-altitude coverage",
      "Personal trekking equipment, clothing, and sleeping bag",
      "Tips for guides, porters, and kitchen staff",
      "Additional porterage for luggage over 15 kg",
      "Single-room supplement in hotels where requested",
      "Personal expenses such as laundry, phone calls, and snacks",
      "Alcoholic beverages and bottled drinks in towns",
      "Any costs arising from itinerary changes beyond our control",
    ],
    depositAmount: 600,
    groupSize: "6 – 12 people",
    startPoint: "Islamabad",
    endPoint: "Skardu",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Islamabad",
        description:
          "Land at Islamabad International Airport and transfer to the group hotel. In the evening we hold a detailed briefing, check equipment, and distribute duffel bags for porterage.",
      },
      {
        day: 2,
        title: "Fly Islamabad to Skardu",
        description:
          "A morning flight carries us over the Himalaya and into the Indus valley. If weather delays the flight we travel by road instead. The rest of the day is for acclimatisation and final preparations in Skardu.",
      },
      {
        day: 3,
        title: "Drive Skardu to Askole",
        description:
          "A long but spectacular jeep journey of roughly eight hours follows the Shigar and Braldu valleys to Askole, the last village before the wilderness begins. We camp near the village.",
      },
      {
        day: 4,
        title: "Trek Askole to Jhola",
        description:
          "The trail descends briefly to the Braldu River, crosses a suspension bridge, and climbs through scrub hillsides to Jhola. Walking time is five to six hours.",
      },
      {
        day: 5,
        title: "Trek Jhola to Paiju",
        description:
          "A day of varied walking beside the river, crossing side streams and passing the snout of the Biafo Glacier. We camp at Paiju, where Baltoro views first appear.",
      },
      {
        day: 6,
        title: "Rest day at Paiju",
        description:
          "A full rest and acclimatisation day. The kitchen team bakes bread while trekkers wash clothes, explore the surroundings, and prepare for the glacier ahead.",
      },
      {
        day: 7,
        title: "Trek Paiju to Khoburtse",
        description:
          "We step onto the Baltoro Glacier and follow its surface toward the heart of the range. The Trango Towers rise directly ahead. Camp is at Khoburtse after six hours of walking.",
      },
      {
        day: 8,
        title: "Trek Khoburtse to Urdukas",
        description:
          "A shorter day of four to five hours brings us to Urdukas, a grassy terrace perched above the glacier with outstanding views of the surrounding peaks.",
      },
      {
        day: 9,
        title: "Trek Urdukas to Goro II",
        description:
          "The route continues up the glacier to Goro II, a camp set directly on the ice at around 4,300 metres. The air is thin and the peaks feel very close.",
      },
      {
        day: 10,
        title: "Trek Goro II to Concordia",
        description:
          "One of the great days of the trek. We reach Concordia, the confluence of the Baltoro and Godwin-Austen glaciers, surrounded by K2, Broad Peak, and the Gasherbrums.",
      },
      {
        day: 11,
        title: "Day trip to K2 Base Camp",
        description:
          "An early start takes us up the Godwin-Austen Glacier to the moraine at K2 Base Camp, roughly 5,150 metres. We spend time taking photographs and absorbing the scale of the mountain before returning to Concordia.",
      },
      {
        day: 12,
        title: "Trek Concordia to Ali Camp",
        description:
          "For those continuing the circuit we move to Ali Camp. This shorter day positions us for the Gondogoro La crossing on the extended route, or begins the return for the base camp trek.",
      },
      {
        day: 13,
        title: "Return to Goro II",
        description:
          "We retrace our steps down the Baltoro Glacier to Goro II, enjoying the views from the opposite direction and a more relaxed pace.",
      },
      {
        day: 14,
        title: "Trek Goro II to Paiju",
        description:
          "A long day covering much of the glacier in one push, descending back to the greener camp at Paiju.",
      },
      {
        day: 15,
        title: "Paiju to Askole, drive to Skardu",
        description:
          "The final walk returns us to Askole, where jeeps are waiting for the drive back to Skardu. The trip concludes with a celebratory dinner in town.",
      },
    ],
    faqs: [
      {
        question: "How fit do I need to be?",
        answer:
          "You need a high level of cardiovascular fitness and strong legs for consecutive days of five to eight hours on rough terrain. A training programme of hiking, stair climbing, and endurance exercise for at least three months beforehand is strongly recommended.",
      },
      {
        question: "What is the highest altitude on this trek?",
        answer:
          "K2 Base Camp sits at approximately 5,150 metres, and the route crosses several passes and camps above 4,000 metres. We build in rest days to help your body adjust.",
      },
      {
        question: "Do I need previous high-altitude experience?",
        answer:
          "Previous trekking above 3,500 metres is helpful but not essential if you are fit and follow the acclimatisation schedule. Your guide will monitor you throughout.",
      },
      {
        question: "What happens if the Skardu flight is cancelled?",
        answer:
          "Weather cancellations are common. We either wait for the next available flight or continue by road, which takes around twenty-two hours. The itinerary is designed with flexibility for this reason.",
      },
    ],
  },
  {
    slug: "k2-gondogoro-la-circuit",
    title: "K2 & Gondogoro La Circuit",
    category: "MULTI_DAY_TREK",
    region: "Karakoram, Baltistan",
    duration: "20 Days",
    difficulty: "EXPERT",
    bestSeason: "June – September",
    heroImage: "",
    gallery: [],
    highlights: [
      "Complete the full K2 Base Camp circuit via Gondogoro La",
      "Cross the 5,585 m Gondogoro La pass with fixed ropes",
      "See Laila Peak, Masherbrum, and the Hushe Valley",
      "Exit through the greener villages of the eastern Karakoram",
      "Experience the most comprehensive trek in the Baltoro region",
    ],
    overview:
      "This is the full loop: the classic K2 Base Camp approach combined with a high pass exit over Gondogoro La. It covers everything the shorter trek offers and then adds one of the most dramatic crossings in the Karakoram. The pass itself reaches 5,585 metres and is crossed with fixed ropes and crampons, giving the journey a true expedition feel without requiring technical climbing skills.\n\n" +
      "After reaching Concordia and K2 Base Camp, the route continues to Ali Camp and makes a pre-dawn start for the pass. The descent drops into the Hushe Valley, where irrigated fields, stone houses, and orchards replace the barren ice world of the Baltoro. The contrast is startling, and the feeling of completing a full circuit rather than an out-and-back route is deeply rewarding.\n\n" +
      "Because of the pass crossing and the longer time at altitude, this trek is graded expert. Participants should be confident on steep, exposed snow slopes and prepared for very cold early starts. The rewards, however, are unmatched: every major peak of the central Karakoram is visible at some point along the way.",
    price: 2900,
    currency: "USD",
    priceIncludes: [
      "Return domestic flights Islamabad – Skardu",
      "All road and jeep transfers including Hushe – Skardu",
      "Hotel accommodation in Islamabad and Skardu on twin-share basis",
      "Full board camping meals during the trek",
      "Experienced English-speaking trekking guide and assistant guides",
      "Porterage allowance up to 15 kg per person",
      "All trekking permits, park fees, and environmental levies",
      "Technical equipment for the pass: ropes, harnesses, crampons, ice axes",
      "Two-person tents, mess tent, kitchen equipment, and utensils",
      "Group first-aid kit, emergency oxygen, and satellite phone",
    ],
    priceExcludes: [
      "International flights to and from Pakistan",
      "Pakistan entry visa and passport fees",
      "Travel and rescue insurance with high-altitude evacuation cover",
      "Personal trekking gear including boots, sleeping bag, and down jacket",
      "Tips for guides, porters, kitchen staff, and pass fixing team",
      "Additional porterage for luggage over 15 kg",
      "Single-room supplement in hotels where requested",
      "Personal expenses such as laundry, phone calls, and snacks",
      "Alcoholic beverages and bottled drinks in towns",
      "Costs arising from weather delays or itinerary changes",
    ],
    depositAmount: 750,
    groupSize: "6 – 10 people",
    startPoint: "Islamabad",
    endPoint: "Skardu",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Islamabad",
        description:
          "Arrive in Islamabad, transfer to the hotel, and attend the pre-trek briefing. We issue duffel bags and review the kit list.",
      },
      {
        day: 2,
        title: "Fly Islamabad to Skardu",
        description:
          "The morning flight to Skardu offers spectacular mountain views. Road travel is the backup if weather cancels the flight.",
      },
      {
        day: 3,
        title: "Skardu to Askole",
        description:
          "A full-day jeep journey takes us to Askole, where the road ends and the walking begins. We camp near the village.",
      },
      {
        day: 4,
        title: "Trek Askole to Jhola",
        description:
          "Five to six hours of walking through river valleys and side gorges brings us to the camp at Jhola.",
      },
      {
        day: 5,
        title: "Trek Jhola to Paiju",
        description:
          "We continue beside the Braldu River, crossing streams and catching first glimpses of the great peaks ahead.",
      },
      {
        day: 6,
        title: "Rest day at Paiju",
        description:
          "A rest day for washing, acclimatisation, and a short walk above camp to stretch the legs before the glacier.",
      },
      {
        day: 7,
        title: "Trek Paiju to Khoburtse",
        description:
          "We enter the Baltoro Glacier proper. The trail weaves across ice and moraine with the Trango Towers directly ahead.",
      },
      {
        day: 8,
        title: "Trek Khoburtse to Urdukas",
        description:
          "A shorter day to the grassy ledge of Urdukas, one of the most scenic camps on the glacier.",
      },
      {
        day: 9,
        title: "Trek Urdukas to Goro II",
        description:
          "The camp moves higher onto the ice at Goro II, with Broad Peak and the Gasherbrums filling the skyline.",
      },
      {
        day: 10,
        title: "Trek Goro II to Concordia",
        description:
          "We arrive at Concordia, the spectacular junction of glaciers beneath K2 and Broad Peak.",
      },
      {
        day: 11,
        title: "K2 Base Camp day trip",
        description:
          "A long day to K2 Base Camp on the Godwin-Austen Glacier, returning to Concordia for the night.",
      },
      {
        day: 12,
        title: "Concordia to Ali Camp",
        description:
          "A relatively short move positions us at Ali Camp, the staging point for the Gondogoro La crossing.",
      },
      {
        day: 13,
        title: "Cross Gondogoro La to Khuspang",
        description:
          "A pre-dawn start leads up fixed ropes to the 5,585 m pass, followed by a steep descent on snow to Khuspang camp.",
      },
      {
        day: 14,
        title: "Trek Khuspang to Shaicho",
        description:
          "The descent continues through the Gondogoro Glacier valley toward greener slopes and the Shaicho campsite.",
      },
      {
        day: 15,
        title: "Trek Shaicho to Hushe",
        description:
          "An easy day down to Hushe village, the first settled area after the pass, with views of Masherbrum and Laila Peak.",
      },
      {
        day: 16,
        title: "Rest day in Hushe",
        description:
          "A welcome rest day with the chance to explore Hushe, interact with local families, and recover from the pass crossing.",
      },
      {
        day: 17,
        title: "Drive Hushe to Skardu",
        description:
          "Jeep transfer back to Skardu via the Shigar Valley. A hot shower and a proper meal await.",
      },
      {
        day: 18,
        title: "Contingency day in Skardu",
        description:
          "A buffer day built into the schedule for weather, pass delays, or recovery. Optional sightseeing in Skardu.",
      },
      {
        day: 19,
        title: "Fly Skardu to Islamabad",
        description:
          "The return flight to Islamabad. If delayed, we continue by road and arrive the following day.",
      },
      {
        day: 20,
        title: "Departure from Islamabad",
        description:
          "A free morning for souvenir shopping or rest before airport transfer and international departure.",
      },
    ],
    faqs: [
      {
        question: "Is technical climbing experience required?",
        answer:
          "No roped climbing is required, but you must be comfortable on steep snow, using crampons, and following guide instructions on exposed terrain. A head for heights helps.",
      },
      {
        question: "How dangerous is Gondogoro La?",
        answer:
          "The pass is serious and weather dependent. We use fixed ropes, cross early in the morning when snow is firm, and only attempt it in suitable conditions. Your guide has the final say.",
      },
      {
        question: "What if the pass is not passable?",
        answer:
          "If conditions are unsafe we return the way we came from Concordia. The itinerary includes buffer days and the group will always prioritise safety over the crossing.",
      },
      {
        question: "Is altitude a bigger issue on this circuit?",
        answer:
          "Yes. More nights are spent above 4,000 metres and the pass is over 5,500 metres. Prior high-altitude experience and excellent fitness are strongly advised.",
      },
    ],
  },
  {
    slug: "nanga-parbat-base-camp-trek",
    title: "Nanga Parbat Base Camp Trek",
    category: "MULTI_DAY_TREK",
    region: "Nanga Parbat, Diamir",
    duration: "8 Days",
    difficulty: "CHALLENGING",
    bestSeason: "May – September",
    heroImage: "",
    gallery: [],
    highlights: [
      "Trek to the base of the ninth-highest mountain on Earth",
      "Camp at Fairy Meadows beneath the Diamir Face",
      "Close views of Nanga Parbat’s 4,600 metre Rupal-Diamir wall",
      "Walk through old-growth pine and juniper forest",
      "Experience the jeep road from Raikot Bridge to Tato Village",
    ],
    overview:
      "Nanga Parbat stands alone. Unlike the clustered peaks of the Karakoram, it rises directly from the Indus valley as a single colossal mass, earning it the name Killer Mountain and a reputation as one of the great alpine objectives of the twentieth century. This trek approaches the mountain from the north, using the famous Fairy Meadows as a base and continuing to the base camp beneath the Diamir Face.\n\n" +
      "The journey begins with one of the most dramatic jeep rides in Pakistan, climbing from Raikot Bridge to Tato Village on a narrow track cut into the mountainside. From Tato a forested trail leads to Fairy Meadows, a grassy plateau at 3,300 metres that feels like an island of green beneath the ice wall above. A further day of walking takes you to Beyal Camp and then to the base camp itself, where the full scale of the mountain becomes overwhelming.\n\n" +
      "At eight days the trek is shorter than the Karakoram giants, but the terrain is steep and the altitude gain is rapid. It suits fit trekkers who want an intense mountain experience without committing to three weeks in the wilderness.",
    price: 1200,
    currency: "USD",
    priceIncludes: [
      "Domestic flights or road transport Islamabad – Chilas – Islamabad",
      "Jeep transfer Raikot Bridge – Tato Village return",
      "Hotel accommodation in Chilas on twin-share basis",
      "Full board meals during the trek",
      "Experienced English-speaking trekking guide",
      "Porterage allowance up to 12 kg per person",
      "All trekking permits and park entry fees",
      "Tents, sleeping mats, mess tent, and kitchen equipment",
      "Group first-aid kit",
    ],
    priceExcludes: [
      "International flights to and from Pakistan",
      "Pakistan entry visa and passport fees",
      "Travel insurance with high-altitude trekking cover",
      "Personal trekking equipment and sleeping bag",
      "Tips for guides and porters",
      "Extra porterage for luggage over 12 kg",
      "Personal expenses and snacks",
      "Optional side trips not listed in the itinerary",
    ],
    depositAmount: 350,
    groupSize: "4 – 10 people",
    startPoint: "Islamabad",
    endPoint: "Islamabad",
    itinerary: [
      {
        day: 1,
        title: "Islamabad to Chilas",
        description:
          "Travel by road or air to Chilas on the Indus Highway. The drive follows the Indus River through the gorge. Overnight in a local hotel.",
      },
      {
        day: 2,
        title: "Chilas to Raikot Bridge and Tato Village",
        description:
          "Drive to Raikot Bridge, then transfer to 4WD jeeps for the thrilling climb to Tato Village. We camp or stay in a simple guesthouse.",
      },
      {
        day: 3,
        title: "Trek Tato to Fairy Meadows",
        description:
          "A three to four hour climb through pine and juniper forest brings us to Fairy Meadows. The first full view of Nanga Parbat dominates the afternoon.",
      },
      {
        day: 4,
        title: "Rest and acclimatisation at Fairy Meadows",
        description:
          "A free day to explore the meadows, take short walks, and adjust to the altitude. Excellent photography opportunities at sunrise and sunset.",
      },
      {
        day: 5,
        title: "Trek Fairy Meadows to Beyal Camp",
        description:
          "A gentler day of two to three hours through forest and open hillside to Beyal Camp, closer to the mountain and the glacier snout.",
      },
      {
        day: 6,
        title: "Day trip to Nanga Parbat Base Camp",
        description:
          "We continue to the base camp at roughly 3,900 metres beneath the Diamir Face. After time to absorb the view we return to Beyal Camp or Fairy Meadows.",
      },
      {
        day: 7,
        title: "Return to Tato and Chilas",
        description:
          "Descend to Tato, jeep down to Raikot Bridge, and drive back to Chilas for a celebratory meal and a comfortable bed.",
      },
      {
        day: 8,
        title: "Chilas to Islamabad",
        description:
          "Return to Islamabad by road or air. The trip concludes on arrival in the capital.",
      },
    ],
    faqs: [
      {
        question: "Is the jeep ride to Tato safe?",
        answer:
          "The track is narrow and rough but our drivers are experienced local professionals. We travel slowly and only go in suitable weather and daylight.",
      },
      {
        question: "How high is the base camp?",
        answer:
          "The base camp beneath the Diamir Face is approximately 3,900 metres above sea level. The rapid ascent makes acclimatisation important.",
      },
      {
        question: "Can beginners do this trek?",
        answer:
          "It is graded challenging because of steep trails and altitude. Beginners with very good fitness and determination can succeed, but prior hill walking experience is helpful.",
      },
    ],
  },
  {
    slug: "snow-lake-hispar-traverse",
    title: "Snow Lake & Hispar La Traverse",
    category: "MULTI_DAY_TREK",
    region: "Karakoram, Biafo-Hispar",
    duration: "18 Days",
    difficulty: "EXPERT",
    bestSeason: "June – September",
    heroImage: "",
    gallery: [],
    highlights: [
      "Cross the Biafo and Hispar glaciers, among the longest outside the polar regions",
      "Camp at Snow Lake, a vast névé basin at 4,800 m",
      "Cross Hispar La at approximately 5,150 m",
      "Exit into the beautiful Hunza Valley at Karimabad",
      "See untouched peaks of the Karakoram far from any road",
    ],
    overview:
      "The Snow Lake and Hispar La traverse is one of the great wilderness journeys in the Karakoram. It crosses two of the longest non-polar glaciers on Earth and passes through a landscape so remote that the only way out is over a high pass or back the way you came. The route begins in the Braldu valley at Askole, climbs onto the Biafo Glacier, and reaches Snow Lake, a vast white basin that feels like the roof of the world.\n\n" +
      "From Snow Lake the trail climbs to Hispar La, a pass of roughly 5,150 metres, before descending the Hispar Glacier into the Nagar and Hunza valleys. The final days drop through irrigated villages and apricot orchards, ending in the historic town of Karimabad. The variety of terrain, from raw ice wilderness to cultivated valley life, is extraordinary.\n\n" +
      "This is an expert trek. There are no villages, no rescue roads, and no easy exits for most of the route. Participants need solid experience on glaciers, excellent physical conditioning, and the mental steadiness to handle prolonged remoteness. For those ready, it is unforgettable.",
    price: 2600,
    currency: "USD",
    priceIncludes: [
      "Domestic flights Islamabad – Skardu and Gilgit – Islamabad",
      "All road and jeep transfers including Askole and Hispar – Karimabad",
      "Hotel accommodation in Islamabad, Skardu, and Hunza on twin-share basis",
      "Full board camping meals during the trek",
      "Experienced English-speaking trekking guide and assistant guide",
      "Porterage allowance up to 15 kg per person",
      "All trekking permits, park fees, and environmental levies",
      "Tents, sleeping mats, mess tent, kitchen equipment, and utensils",
      "Group first-aid kit, emergency oxygen, and satellite phone",
    ],
    priceExcludes: [
      "International flights to and from Pakistan",
      "Pakistan entry visa and passport fees",
      "Travel insurance with high-altitude evacuation cover",
      "Personal trekking equipment and sleeping bag",
      "Tips for guides, porters, and kitchen staff",
      "Additional porterage for luggage over 15 kg",
      "Personal expenses, laundry, phone calls, and snacks",
      "Meals in towns outside the itinerary",
      "Costs from itinerary changes due to weather or route conditions",
    ],
    depositAmount: 650,
    groupSize: "6 – 10 people",
    startPoint: "Skardu",
    endPoint: "Karimabad, Hunza",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Islamabad",
        description:
          "Arrive in Islamabad, transfer to the hotel, and attend the expedition briefing and equipment check.",
      },
      {
        day: 2,
        title: "Fly Islamabad to Skardu",
        description:
          "Flight to Skardu with the Karakoram range unfolding beneath the aircraft. Road backup if needed.",
      },
      {
        day: 3,
        title: "Skardu to Askole",
        description:
          "A full day by jeep to Askole, where porters are organised and the trail onto the Biafo Glacier begins.",
      },
      {
        day: 4,
        title: "Trek Askole to Namla",
        description:
          "Leave the village behind and walk up the Braldu Valley toward the snout of the Biafo Glacier. Camp at Namla.",
      },
      {
        day: 5,
        title: "Trek Namla to Mango",
        description:
          "Enter the Biafo Glacier and weave across ice and moraine to the Mango camp, a key staging point on the glacier.",
      },
      {
        day: 6,
        title: "Trek Mango to Baintha",
        description:
          "Continue up the glacier to Baintha, where a rest day allows acclimatisation before the higher camps.",
      },
      {
        day: 7,
        title: "Rest day at Baintha",
        description:
          "A full rest day. Optional hike to a nearby viewpoint for panoramic views of the Biafo and surrounding peaks.",
      },
      {
        day: 8,
        title: "Trek Baintha to Napina",
        description:
          "The route continues deeper into the ice wilderness toward the higher basin of Snow Lake.",
      },
      {
        day: 9,
        title: "Trek Napina to Snow Lake",
        description:
          "Reach Snow Lake itself, a vast snow basin at around 4,800 metres surrounded by unnamed peaks in every direction.",
      },
      {
        day: 10,
        title: "Rest day at Snow Lake",
        description:
          "A rest and acclimatisation day in one of the most remote places on the trek. Essential before the pass.",
      },
      {
        day: 11,
        title: "Trek Snow Lake to Hispar La Base Camp",
        description:
          "A shorter day positions the group at the foot of Hispar La, ready for an early crossing.",
      },
      {
        day: 12,
        title: "Cross Hispar La to Hispar Glacier",
        description:
          "An early start leads over the 5,150 metre pass and down onto the upper Hispar Glacier. A long, demanding day.",
      },
      {
        day: 13,
        title: "Trek Hispar Glacier to high camp",
        description:
          "Continue down the Hispar Glacier, camping well above the valley floor in the ice wilderness.",
      },
      {
        day: 14,
        title: "Trek to lower Hispar",
        description:
          "The glacier becomes narrower and the first signs of vegetation appear as the valley opens below.",
      },
      {
        day: 15,
        title: "Trek to Hispar village",
        description:
          "Leave the ice behind and reach Hispar village, the first settlement on the western side. A real contrast to Snow Lake.",
      },
      {
        day: 16,
        title: "Hispar village to Karimabad",
        description:
          "Jeep transfer through Nagar Valley to Karimabad in Hunza. Hot showers, fresh food, and comfortable beds.",
      },
      {
        day: 17,
        title: "Rest day in Hunza",
        description:
          "A buffer and recovery day with optional visits to Baltit Fort, Altit Fort, and the viewpoint at Eagle’s Nest.",
      },
      {
        day: 18,
        title: "Fly Gilgit to Islamabad",
        description:
          "Return flight to Islamabad. If weather delays, we continue by road and arrive the next day.",
      },
    ],
    faqs: [
      {
        question: "How remote is this trek?",
        answer:
          "Very remote. For most of the route there is no road access and no village. Evacuation would require a helicopter, which is why comprehensive insurance is mandatory.",
      },
      {
        question: "What experience do I need?",
        answer:
          "You should have previous multi-day high-altitude trekking experience, preferably on glaciers. Comfort with cold, rough terrain, and basic mountaineering equipment is important.",
      },
      {
        question: "How is the weather on Hispar La?",
        answer:
          "It can change quickly. We cross early in the morning when conditions are usually coldest but most stable. Snowstorms can delay the crossing by a day or more.",
      },
      {
        question: "Is there phone signal on the trek?",
        answer:
          "There is no mobile coverage for most of the route. We carry a satellite phone for emergencies and scheduled check-ins.",
      },
    ],
  },
  {
    slug: "khaplu-valley-cultural-trek",
    title: "Khaplu Valley Cultural Trek",
    category: "SHORT_TREK",
    region: "Ghanche, Baltistan",
    duration: "5 Days",
    difficulty: "EASY",
    bestSeason: "May – October",
    heroImage: "",
    gallery: [],
    highlights: [
      "Walk between traditional Balti villages in the Ghanche district",
      "Visit the historic Khaplu Palace and Chaqchan Mosque",
      "Enjoy views toward the Masherbrum range and Hushe Valley",
      "Stay in family-run guesthouses and experience local hospitality",
      "Explore terraced fields, apricot orchards, and irrigation channels",
    ],
    overview:
      "Khaplu is the quieter, eastern side of Baltistan. Where Skardu can feel busy and connected, Khaplu feels like a step back into a slower, more traditional mountain life. This short trek links villages along the Shyok River and its side valleys, walking on irrigation paths, village lanes, and gentle hillsides rather than glaciers or high passes.\n\n" +
      "Each night is spent in a local guesthouse or homestay, giving a direct connection to the families who live here. Mornings begin with fresh bread and tea, days are spent walking through apricot orchards and terraced barley fields, and evenings bring conversations around a stove. The walking is easy, the altitudes are moderate, and the emphasis is on culture, landscape, and hospitality rather than endurance.\n\n" +
      "The trek is ideal for travellers who want a genuine taste of Baltistan without committing to a long or strenuous expedition. It also combines well with a few days in Skardu or a visit to Deosai.",
    price: 550,
    currency: "USD",
    priceIncludes: [
      "Road transfers Skardu – Khaplu – Skardu",
      "Guesthouse or homestay accommodation on twin-share basis",
      "All meals during the trek",
      "English-speaking local guide",
      "Village donations and cultural site entry fees",
      "Basic first-aid kit",
    ],
    priceExcludes: [
      "Flights to and from Skardu",
      "Travel insurance",
      "Personal clothing and walking shoes",
      "Tips for guide and hosts",
      "Personal expenses and snacks",
      "Optional extensions or additional nights",
    ],
    depositAmount: 175,
    groupSize: "4 – 12 people",
    startPoint: "Skardu",
    endPoint: "Skardu",
    itinerary: [
      {
        day: 1,
        title: "Skardu to Khaplu",
        description:
          "A scenic drive of roughly three hours follows the Indus and Shyok rivers to Khaplu. Afternoon visit to Khaplu Palace and the old bazaar.",
      },
      {
        day: 2,
        title: "Khaplu to Saling",
        description:
          "A gentle half-day walk through fields and orchards to the village of Saling. Overnight in a local homestay.",
      },
      {
        day: 3,
        title: "Saling to Kharphanak",
        description:
          "Continue along village trails with views of the Shyok Valley and distant peaks. Afternoon visit to a traditional water mill.",
      },
      {
        day: 4,
        title: "Kharphanak to Chaqchan Mosque and Khaplu",
        description:
          "Walk back toward Khaplu, visiting the 700-year-old Chaqchan Mosque and its carved wooden interior. Farewell dinner with hosts.",
      },
      {
        day: 5,
        title: "Return to Skardu",
        description:
          "Morning visit to a local craft workshop, then drive back to Skardu. The trip ends on arrival.",
      },
    ],
    faqs: [
      {
        question: "How much walking is there each day?",
        answer:
          "Usually three to five hours on gentle village trails. There are no high passes or steep alpine sections.",
      },
      {
        question: "What are the homestays like?",
        answer:
          "They are simple but clean family homes with shared bathrooms and warm hospitality. Bedding is provided, but you may bring a sleeping bag liner for comfort.",
      },
      {
        question: "Is this suitable for children or older travellers?",
        answer:
          "Yes, the easy pace and moderate altitudes make this suitable for a wide range of ages and fitness levels.",
      },
    ],
  },
];

const tours: TourSeed[] = [
  {
    slug: "deosai-plains-safari",
    title: "Deosai Plains Safari",
    region: "Deosai National Park, Skardu",
    duration: "4 Days",
    difficulty: "EASY",
    bestSeason: "June – September",
    heroImage: "",
    gallery: [],
    highlights: [
      "Cross the Deosai Plateau, one of the highest alpine plains in the world",
      "Visit Sheosar Lake with views of the surrounding peaks",
      "Look for Himalayan brown bears, golden marmots, and migratory birds",
      "Camp on the open plateau beneath vast skies",
      "Experience the short summer bloom of wildflowers across the plains",
    ],
    overview:
      "Deosai is a place of scale and silence. At over 4,000 metres, the plateau stretches for dozens of kilometres, a treeless expanse of grass, rock, and sky that only becomes accessible for a few months each year. This short safari explores the national park by 4WD with easy day walks, making it accessible to almost anyone who wants to experience high-altitude wilderness without long trekking days.\n\n" +
      "The route crosses the plateau from the Skardu side, visits Sheosar Lake, and returns via the picturesque Chilam Valley. Wildlife is a real highlight: Himalayan brown bears forage on the slopes in early summer, marmots whistle from their burrows, and birds of prey circle overhead. In July and August the plains turn purple and yellow with wildflowers, an unexpected softness in such a stark landscape.\n\n" +
      "Nights are spent in a simple tented camp. The altitude is high but the pace is slow, and the focus is on watching, walking a little, and letting the emptiness of the place do its work.",
    price: 450,
    currency: "USD",
    priceIncludes: [
      "4WD vehicle and driver for the full safari",
      "Camping equipment including tents and sleeping mats",
      "All meals during the safari",
      "English-speaking guide",
      "Deosai National Park entry permits",
      "Basic first-aid kit",
    ],
    priceExcludes: [
      "Flights or transport to Skardu",
      "Hotel accommodation in Skardu before or after the safari",
      "Travel insurance",
      "Personal warm clothing and sleeping bag",
      "Tips for guide and driver",
      "Personal snacks and drinks",
      "Optional horse or pony rides",
    ],
    depositAmount: 150,
    accommodation: "Tented camp on the Deosai Plateau",
    mealPlan: "Full board during the safari",
    transport: "4WD Toyota Land Cruiser with experienced local driver",
    itinerary: [
      {
        day: 1,
        title: "Skardu to Deosai Plateau",
        description:
          "Drive from Skardu through Sadpara village and up to the Deosai Plateau. Afternoon walk near camp to acclimatise and enjoy the views.",
      },
      {
        day: 2,
        title: "Deosai exploration and Sheosar Lake",
        description:
          "A full day on the plateau with a drive to Sheosar Lake. Short walks along the shore and time to watch for wildlife.",
      },
      {
        day: 3,
        title: "Wildlife and wildflower walks",
        description:
          "Easy morning walks to look for brown bears and marmots. Afternoon at leisure to photograph the landscape.",
      },
      {
        day: 4,
        title: "Return to Skardu",
        description:
          "Break camp and descend back to Skardu, arriving in the afternoon with time to continue your journey.",
      },
    ],
  },
  {
    slug: "shigar-valley-explorer",
    title: "Shigar Valley Explorer",
    region: "Shigar Valley, Baltistan",
    duration: "6 Days",
    difficulty: "EASY",
    bestSeason: "April – October",
    heroImage: "",
    gallery: [],
    highlights: [
      "Explore the historic Shigar Fort, now a heritage hotel",
      "Visit the Cold Desert of Skardu and the Shigar River",
      "Walk through apricot orchards and traditional villages",
      "See the 14th-century Khilingrong Mosque",
      "Combine culture, landscapes, and gentle day walks",
    ],
    overview:
      "The Shigar Valley runs east from Skardu toward the Braldu and Biafo glaciers, a fertile corridor of villages, orchards, and old forts framed by bare Karakoram slopes. This relaxed tour uses a 4WD to link the valley’s cultural sites and best viewpoints, with short walks each day that anyone can manage.\n\n" +
      "Highlights include Shigar Fort, a restored 17th-century palace that now operates as a heritage hotel; the Cold Desert, where wind-sculpted sand sits incongruously beneath snow peaks; and the Khilingrong Mosque, one of the oldest wooden mosques in Baltistan. There is also time to wander through apricot orchards, drink tea with families, and simply watch village life unfold.\n\n" +
      "The tour is perfect as a cultural add-on to a trek or as a standalone trip for travellers who want to understand Baltistan without the physical demands of high-altitude trekking.",
    price: 650,
    currency: "USD",
    priceIncludes: [
      "4WD vehicle and driver for the duration of the tour",
      "Twin-share accommodation in local guesthouses and heritage property",
      "All meals during the tour",
      "English-speaking local guide",
      "Entry fees for forts, museums, and cultural sites",
      "Basic first-aid kit",
    ],
    priceExcludes: [
      "Flights or transport to Skardu",
      "Hotel nights in Skardu before or after the tour",
      "Travel insurance",
      "Personal clothing and walking shoes",
      "Tips for guide and driver",
      "Personal expenses, snacks, and drinks",
      "Optional activities not listed in the itinerary",
    ],
    depositAmount: 200,
    accommodation: "Guesthouses and heritage property in Shigar Valley",
    mealPlan: "Full board with local Balti cuisine",
    transport: "4WD Toyota Land Cruiser with experienced local driver",
    itinerary: [
      {
        day: 1,
        title: "Skardu to Shigar",
        description:
          "Drive from Skardu to Shigar, visit Shigar Fort and its museum, and walk through the old town. Overnight at a local guesthouse.",
      },
      {
        day: 2,
        title: "Cold Desert and sand dunes",
        description:
          "Morning visit to the Skardu Cold Desert for a short walk on the dunes with views of the Indus and Karakoram. Return to Shigar for the night.",
      },
      {
        day: 3,
        title: "Villages and orchards",
        description:
          "Explore villages along the Shigar River, walking through apricot orchards and visiting traditional homes. Picnic lunch by the river.",
      },
      {
        day: 4,
        title: "Khilingrong Mosque and eastern Shigar",
        description:
          "Drive deeper into the valley to visit the ancient wooden Khilingrong Mosque and nearby hot springs. Return to Shigar.",
      },
      {
        day: 5,
        title: "Shigar to Askole viewpoint",
        description:
          "A scenic day trip toward the Braldu Valley with views of the road to Askole and the peaks at the head of the valley.",
      },
      {
        day: 6,
        title: "Return to Skardu",
        description:
          "Final morning in Shigar for souvenirs or a relaxed walk, then drive back to Skardu where the tour ends.",
      },
    ],
  },
];

async function main() {
  const upsertedTrips: string[] = [];
  const upsertedTours: string[] = [];

  for (const trip of trips) {
    await prisma.trip.upsert({
      where: { slug: trip.slug },
      update: {
        title: trip.title,
        category: trip.category,
        region: trip.region,
        duration: trip.duration,
        difficulty: trip.difficulty,
        bestSeason: trip.bestSeason,
        heroImage: trip.heroImage,
        gallery: trip.gallery,
        highlights: trip.highlights,
        overview: trip.overview,
        price: trip.price,
        currency: trip.currency,
        priceIncludes: trip.priceIncludes,
        priceExcludes: trip.priceExcludes,
        depositAmount: trip.depositAmount,
        groupSize: trip.groupSize,
        startPoint: trip.startPoint,
        endPoint: trip.endPoint,
        itinerary: trip.itinerary as unknown as Prisma.InputJsonValue,
        faqs: trip.faqs as unknown as Prisma.InputJsonValue,
      },
      create: {
        slug: trip.slug,
        title: trip.title,
        category: trip.category,
        region: trip.region,
        duration: trip.duration,
        difficulty: trip.difficulty,
        bestSeason: trip.bestSeason,
        heroImage: trip.heroImage,
        gallery: trip.gallery,
        highlights: trip.highlights,
        overview: trip.overview,
        price: trip.price,
        currency: trip.currency,
        priceIncludes: trip.priceIncludes,
        priceExcludes: trip.priceExcludes,
        depositAmount: trip.depositAmount,
        groupSize: trip.groupSize,
        startPoint: trip.startPoint,
        endPoint: trip.endPoint,
        itinerary: trip.itinerary as unknown as Prisma.InputJsonValue,
        faqs: trip.faqs as unknown as Prisma.InputJsonValue,
      },
    });
    upsertedTrips.push(trip.title);
  }

  for (const tour of tours) {
    await prisma.tour.upsert({
      where: { slug: tour.slug },
      update: {
        title: tour.title,
        region: tour.region,
        duration: tour.duration,
        difficulty: tour.difficulty,
        bestSeason: tour.bestSeason,
        heroImage: tour.heroImage,
        gallery: tour.gallery,
        highlights: tour.highlights,
        overview: tour.overview,
        price: tour.price,
        currency: tour.currency,
        priceIncludes: tour.priceIncludes,
        priceExcludes: tour.priceExcludes,
        depositAmount: tour.depositAmount,
        accommodation: tour.accommodation,
        mealPlan: tour.mealPlan,
        transport: tour.transport,
        itinerary: tour.itinerary as unknown as Prisma.InputJsonValue,
      },
      create: {
        slug: tour.slug,
        title: tour.title,
        region: tour.region,
        duration: tour.duration,
        difficulty: tour.difficulty,
        bestSeason: tour.bestSeason,
        heroImage: tour.heroImage,
        gallery: tour.gallery,
        highlights: tour.highlights,
        overview: tour.overview,
        price: tour.price,
        currency: tour.currency,
        priceIncludes: tour.priceIncludes,
        priceExcludes: tour.priceExcludes,
        depositAmount: tour.depositAmount,
        accommodation: tour.accommodation,
        mealPlan: tour.mealPlan,
        transport: tour.transport,
        itinerary: tour.itinerary as unknown as Prisma.InputJsonValue,
      },
    });
    upsertedTours.push(tour.title);
  }

  console.log("Skardu treks/tours seed completed successfully.");
  console.log("Trips:", upsertedTrips.length, upsertedTrips.join(", "));
  console.log("Tours:", upsertedTours.length, upsertedTours.join(", "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
