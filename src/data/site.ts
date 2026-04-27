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
import { getTierInterestPath, routes, type TierSlug } from "@/lib/routes";

export const navLinks = [
  { label: "Home", href: routes.home },
  { label: "Pricing", href: routes.pricing },
  { label: "How It Works", href: routes.howItWorks },
  { label: "For Businesses", href: routes.business },
];

export const heroStats = [
  { label: "Local player network", value: "1,200+" },
  { label: "Bracket play window", value: "24/7" },
  { label: "Ways to find your crew", value: "∞" },
];

export const howItWorksSteps = [
  {
    title: "Swipe local",
    description:
      "Browse players near you with the context that matters: sport, level, location, availability, and playing style.",
    icon: Users,
  },
  {
    title: "Match the vibe",
    description:
      "Connect with people who want the same pace, schedule, and energy so every new game starts with better chemistry.",
    icon: Sparkles,
  },
  {
    title: "Play and post",
    description:
      "Turn matches into real plans, then keep the story moving with recaps, highlights, reactions, and circle updates.",
    icon: Activity,
  },
  {
    title: "Climb and return",
    description:
      "Build reputation through ratings, results, brackets, and leaderboard movement that make every run count.",
    icon: Trophy,
  },
];

export const featureHighlights = [
  {
    title: "Swipe local players",
    description:
      "Find nearby players by sport, skill, availability, neighborhood, and the kind of game they actually want.",
    icon: Users,
  },
  {
    title: "Play real matches",
    description:
      "Move from match to game plan quickly with cleaner coordination and less group-chat chaos.",
    icon: Zap,
  },
  {
    title: "Track your rise",
    description:
      "Turn pickup into progression with ratings, inner circles, bracket history, and local leaderboard movement.",
    icon: Trophy,
  },
];

export const socialSignals = [
  "Private inner circles for trusted teammates, rivals, and regular runs",
  "City leaderboards that update as results, ratings, and bracket wins stack up",
  "Player profiles with badges, fit signals, sports, availability, and social proof",
  "Hotspot discovery for courts, clubs, restaurants, recovery spots, and post-game plans",
];

export const pricingTiers = [
  {
    slug: "free" as TierSlug,
    name: "Free",
    price: "$0",
    cadence: "/month",
    subtitle: "Get in the game",
    description: "Build your player profile, meet nearby athletes, and start finding better games around you.",
    badge: "Open access",
    accent: "from-white/10 to-white/5",
    buttonLabel: "Join Free",
    signupPath: getTierInterestPath("free"),
    features: [
      "Create your player profile",
      "Swipe and match locally",
      "Local sports feed access",
      "Standard match ratings and reviews",
      "Join public circles",
    ],
  },
  {
    slug: "pro" as TierSlug,
    name: "Pro",
    price: "$9.99",
    cadence: "/month",
    subtitle: "For active players",
    description: "Unlock better discovery, deeper stats, and priority access for players who are out there every week.",
    badge: "Most popular",
    accent: "from-accent-purple/30 to-accent-blue/20",
    buttonLabel: "Go Pro",
    signupPath: getTierInterestPath("pro"),
    featured: true,
    features: [
      "Advanced player filters",
      "Unlimited circle invites",
      "Expanded rankings, stats, and match history",
      "Priority bracket entry",
      "Better player-fit signals",
      "Early access to partner drops and local perks",
    ],
  },
  {
    slug: "elite" as TierSlug,
    name: "Elite",
    price: "$17.99",
    cadence: "/month",
    subtitle: "For the obsessed",
    description: "Stand out in discovery, access exclusive circles, and get the best version of Scout’s local sports network.",
    badge: "Members only feel",
    accent: "from-fuchsia-500/30 to-accent-blue/25",
    buttonLabel: "Go Elite",
    signupPath: getTierInterestPath("elite"),
    features: [
      "Everything in Pro",
      "Elite badge on profile",
      "Top-tier visibility in discovery",
      "Exclusive elite-only circles",
      "Premium tournament and bracket perks",
      "Special partner offers, drops, and local rewards",
    ],
  },
];

export const businessCategories = [
  {
    title: "Restaurants and post-game spots",
    description:
      "Reach players when they are choosing where to meet before the game or celebrate after the final point.",
  },
  {
    title: "Clubs and premium facilities",
    description:
      "Put memberships, clinics, leagues, events, and court availability in front of players already looking to book.",
  },
  {
    title: "Courts and community venues",
    description:
      "Drive awareness for open play, reserved sessions, community events, and recurring pickup nights.",
  },
];

export const partnerBenefits = [
  {
    title: "Sponsored placements",
    description: "Show up in discovery, hotspot lists, and match-adjacent moments when players are ready to act.",
    icon: BadgeCheck,
  },
  {
    title: "Local offers",
    description: "Launch offers tied to nearby games, circle activity, bracket weekends, and post-match traffic.",
    icon: Crown,
  },
  {
    title: "Community credibility",
    description: "Become part of the local sports map with placements that feel useful instead of interruptive.",
    icon: Users,
  },
];
