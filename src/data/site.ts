import {
  Activity,
  BadgeCheck,
  Crown,
  MapPinned,
  Medal,
  Radar,
  Sparkles,
  Swords,
  Trophy,
  Users,
} from "lucide-react";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "For Businesses", href: "/business" },
];

export const heroStats = [
  { label: "Live city energy", value: "24/7" },
  { label: "Local circles", value: "Inner" },
  { label: "Game formats", value: "Pickup + Brackets" },
];

export const howItWorksSteps = [
  {
    title: "Swipe local",
    description:
      "Scout surfaces nearby players based on sport, availability, level, and social fit so every match starts with signal.",
    icon: Radar,
  },
  {
    title: "Match the vibe",
    description:
      "Filter by time, neighborhood, skill, and energy. Find the right run instead of settling for whoever is around.",
    icon: Sparkles,
  },
  {
    title: "Play and post",
    description:
      "Take the connection offline fast, then bring it back into the feed with match recaps, content, and reactions.",
    icon: Activity,
  },
  {
    title: "Climb and return",
    description:
      "Ratings, leaderboards, and bracket progression make local play feel competitive, social, and worth coming back to.",
    icon: Trophy,
  },
];

export const featureHighlights = [
  {
    title: "Find your local run faster",
    description:
      "Skip cold outreach. Scout helps players discover who is active nearby and ready for the right kind of game.",
    icon: MapPinned,
  },
  {
    title: "Inner Circles that actually feel personal",
    description:
      "Build tighter communities with private groups, trusted players, and recurring crews that move together.",
    icon: Users,
  },
  {
    title: "Asynchronous brackets built for real life",
    description:
      "Compete on your own schedule, track progress, and keep momentum between games without live tournament friction.",
    icon: Swords,
  },
  {
    title: "Rankings that turn casual play into status",
    description:
      "Local ratings and sharper stats create context around every matchup and give the app a premium edge.",
    icon: Medal,
  },
];

export const socialSignals = [
  "Private circles for your regular crew",
  "City leaderboards and movement after every result",
  "Premium player profiles with visible status and badges",
  "Hotspot discovery for courts, clubs, food, and post-game spots",
];

export const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    description: "Get in the game, build your profile, and start meeting local players.",
    badge: "Open access",
    accent: "from-white/10 to-white/5",
    features: [
      "Basic profile",
      "Swipe and match",
      "Basic feed access",
      "Public circles",
      "Standard ratings",
    ],
  },
  {
    name: "Pro",
    price: "$14",
    cadence: "/month",
    description: "More control, more context, and faster access to competitive local play.",
    badge: "Most popular",
    accent: "from-accent-purple/30 to-accent-blue/20",
    featured: true,
    features: [
      "Advanced filters",
      "Better ranking views",
      "Priority bracket access",
      "Expanded stats",
      "More circle features",
    ],
  },
  {
    name: "Elite",
    price: "$29",
    cadence: "/month",
    description: "Visibility, status, and premium discovery for players who want the full Scout experience.",
    badge: "Members only feel",
    accent: "from-accent-blue/30 to-accent-purple/20",
    features: [
      "Everything in Pro",
      "Premium profile visibility",
      "Elite badge",
      "Exclusive circles",
      "Premium local perks",
      "Better bracket and discovery perks",
    ],
  },
];

export const businessCategories = [
  {
    title: "Restaurants and post-game spots",
    description:
      "Own the social moment after the match with featured placements, offers, and local visibility.",
  },
  {
    title: "Clubs and premium facilities",
    description:
      "Reach active players looking for courts, training, leagues, and a stronger local sports network.",
  },
  {
    title: "Courts and community venues",
    description:
      "Promote availability, events, and recurring sessions inside the same product players already use to organize games.",
  },
];

export const partnerBenefits = [
  {
    title: "Sponsored placements",
    description: "Appear where active players are already discovering where to play and where to go next.",
    icon: BadgeCheck,
  },
  {
    title: "Local offers",
    description: "Create time-based promotions that feel relevant to nearby players and existing circles.",
    icon: Crown,
  },
  {
    title: "Community credibility",
    description: "Show up as part of the local sports scene instead of running generic broad-reach ads.",
    icon: Users,
  },
];
