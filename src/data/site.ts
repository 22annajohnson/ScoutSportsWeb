import {
  Activity,
  BadgeCheck,
  Crown,
  MapPinned,
  Sparkles,
  Swords,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "For Businesses", href: "/business" },
];

export const heroStats = [
  { label: "Projected local players", value: "1,200+" },
  { label: "Asynchronous brackets", value: "24/7" },
  { label: "Potential connections", value: "∞" },
];

export const howItWorksSteps = [
  {
    title: "Swipe local",
    description:
      "Scout surfaces nearby players based on sport, availability, level, and social fit so every match starts with signal.",
    icon: Users,
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
    title: "Swipe local players",
    description:
      "Find people nearby who match your sport, vibe, and schedule.",
    icon: Users,
  },
  {
    title: "Play real matches",
    description:
      "Set games fast and build your local sports circle naturally.",
    icon: Zap,
  },
  {
    title: "Track your rise",
    description:
      "Ratings, inner circles, brackets, and local momentum all in one place.",
    icon: Trophy,
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
    cadence: "/month",
    subtitle: "Get in the game",
    description: "Create your player profile and start matching locally right away.",
    badge: "Open access",
    accent: "from-white/10 to-white/5",
    buttonLabel: "Join Free",
    features: [
      "Create your player profile",
      "Swipe and match locally",
      "Basic social feed access",
      "Standard match ratings",
      "Join public circles",
    ],
  },
  {
    name: "Pro",
    price: "$9.99",
    cadence: "/month",
    subtitle: "For active players",
    description: "More control, more context, and stronger access to the local game flow.",
    badge: "Most popular",
    accent: "from-accent-purple/30 to-accent-blue/20",
    buttonLabel: "Go Pro",
    featured: true,
    features: [
      "Advanced player filters",
      "Unlimited circle invites",
      "Expanded rankings and stats",
      "Priority bracket entry",
      "See who fits your style better",
      "Early access to premium local drops",
    ],
  },
  {
    name: "Elite",
    price: "$17.99",
    cadence: "/month",
    subtitle: "For the obsessed",
    description: "Visibility, status, and premium discovery perks for players all the way in.",
    badge: "Members only feel",
    accent: "from-fuchsia-500/30 to-accent-blue/25",
    buttonLabel: "Go Elite",
    features: [
      "Everything in Pro",
      "Elite badge on profile",
      "Top-tier visibility in discovery",
      "Exclusive elite-only circles",
      "Premium tournament and bracket perks",
      "Special partner offers and local drops",
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
