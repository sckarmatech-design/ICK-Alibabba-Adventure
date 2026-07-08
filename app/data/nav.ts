// Navigation menu structure

export interface NavItem {
  label: string;
  href?: string;
  submenu?: NavItem[];
}

export const mainNav: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Trips",
    href: "/trips",
    submenu: [
      { label: "All Trips", href: "/trips" },
      { label: "Short Treks", href: "/trips?type=short" },
      { label: "Multi-Day Treks", href: "/trips?type=multi" },
    ],
  },
  {
    label: "Expeditions",
    href: "/expeditions",
    submenu: [
      { label: "All Expeditions", href: "/expeditions" },
      { label: "5,500–6,000m", href: "/expeditions?altitude=5500-6000" },
      { label: "6,000–6,500m", href: "/expeditions?altitude=6000-6500" },
      { label: "6,500–7,000m", href: "/expeditions?altitude=6500-7000" },
      { label: "7,000–7,500m", href: "/expeditions?altitude=7000-7500" },
      { label: "7,500–8,000m", href: "/expeditions?altitude=7500-8000" },
    ],
  },
  {
    label: "Tours",
    href: "/tours",
    submenu: [
      { label: "All Tours", href: "/tours" },
      { label: "Gilgit", href: "/tours?region=gilgit" },
      { label: "Hunza", href: "/tours?region=hunza" },
      { label: "Skardu", href: "/tours?region=skardu" },
    ],
  },
  {
    label: "Gallery",
    href: "/gallery",
  },
  {
    label: "About",
    href: "/about",
    submenu: [
      { label: "About Us", href: "/about" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export interface FooterLink {
  category: string;
  links: Array<{ label: string; href: string }>;
}

export const footerLinks: FooterLink[] = [
  {
    category: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Trips", href: "/trips" },
      { label: "Expeditions", href: "/expeditions" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    category: "Services",
    links: [
      { label: "Guided Treks", href: "/trips" },
      { label: "Expeditions", href: "/expeditions" },
      { label: "Cultural Tours", href: "/tours" },
      { label: "Photography Tours", href: "/blog" },
    ],
  },
  {
    category: "Destinations",
    links: [
      { label: "Skardu", href: "/tours?region=skardu" },
      { label: "Hunza", href: "/tours?region=hunza" },
      { label: "Gilgit", href: "/tours?region=gilgit" },
      { label: "Nanga Parbat", href: "/expeditions" },
    ],
  },
];

export interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  whatsapp: string;
  logo: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
}

export const companyInfo: CompanyInfo = {
  name: "ICK ALIBABBA ADVENTURE",
  email: "ickalibabaadventure100@gmail.com",
  phone: "+92 355 4258109",
  location: "Gilgit Baltistan, Pakistan",
  description:
    "Leading adventure and hiking company offering world-class expeditions and treks in the Karakoram and Hindu Kush mountains.",
  whatsapp: "+92 355 4258109",
  logo: "",
  socialMedia: {
    facebook: "https://facebook.com/akhtarabbasihiking",
    instagram: "https://instagram.com/akhtarabbasihiking",
    youtube: "https://youtube.com/@akhtarabbasihiking",
  },
};
