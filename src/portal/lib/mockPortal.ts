export type PortalNavItem = {
  label: string;
  href: string;
  description: string;
};

export type PortalMembership = {
  tier: "Pro" | "Elite" | "Free";
  status: "Active" | "Trialing" | "Pending renewal";
  renewalLabel: string;
  billingSummary: string;
  manageLabel: string;
  billingSource: string;
  cadence: string;
  priceLabel: string;
  paymentMethod: string;
  syncedAccessNote: string;
};

export type PortalProfileSnapshot = {
  fullName: string;
  username: string;
  city: string;
  primarySport: string;
  secondarySports: string[];
  skillLevel: string;
  bio: string;
  availability: string;
  vibeTags: string[];
  completionPercent: number;
};

export type PortalProfileDraft = Omit<PortalProfileSnapshot, "completionPercent">;

export type PortalStatsSnapshot = {
  scoutScore: number;
  cityRank: string;
  record: string;
  streak: string;
  bracketFinish: string;
  recentTrend: string;
  recentMatches: number;
  winRate: string;
  favoriteFormat: string;
  growthChannel: string;
  currentEdge: string;
};

export type PortalHistoryItem = {
  id: string;
  title: string;
  dateLabel: string;
  sport: string;
  result: "Win" | "Loss" | "Draw";
  detail: string;
  ratingDelta: string;
  teammateLine: string;
  durationLabel: string;
  venueLabel: string;
  scoreLine: string;
};

export type PortalInvoiceItem = {
  id: string;
  dateLabel: string;
  amountLabel: string;
  status: "Paid" | "Pending" | "Refunded";
  description: string;
};

export type PortalBillingProfile = {
  paymentMethod: string;
  billingContactEmail: string;
  billingAddress: string;
  taxStatus: string;
};

export type PortalSettingsPreferences = {
  matchAlertsEmail: boolean;
  bracketUpdatesEmail: boolean;
  circleActivityEmail: boolean;
  partnerOffersEmail: boolean;
  smsAlertsEnabled: boolean;
};

export type PortalSportBreakdown = {
  sport: string;
  rating: number;
  record: string;
  trend: string;
  note: string;
};

export type PortalBracketResult = {
  title: string;
  finish: string;
  dateLabel: string;
  detail: string;
};

export const portalPlayer = {
  firstName: "Alyssa",
  fullName: "Alyssa Carter",
  email: "alyssa@scoutsports.app",
  location: "Brooklyn, NY",
  avatarInitials: "AC",
  memberSince: "Joined March 2026",
  headline: "Competitive pickleball and tennis player looking for weeknight runs.",
};

export const portalMembership: PortalMembership = {
  tier: "Pro",
  status: "Active",
  renewalLabel: "Renews May 21, 2026",
  billingSummary: "Monthly plan billed online. In-app upgrades will sync here once billing is unified.",
  manageLabel: "Manage membership",
  billingSource: "Web billing",
  cadence: "Monthly",
  priceLabel: "$9.99 / month",
  paymentMethod: "Visa ending in 4242",
  syncedAccessNote: "When billing is fully connected, upgrades made in-app or on the web should resolve into this same membership record.",
};

export const portalMembershipBenefitsByTier: Record<PortalMembership["tier"], string[]> = {
  Free: [
    "Core player profile and local discovery access",
    "Swipe and match with nearby players",
    "Public circles and standard ratings visibility",
    "A lightweight way to stay in the local Scout scene before upgrading",
  ],
  Pro: [
    "Advanced player filters and better fit matching",
    "Priority bracket access and stronger ranking visibility",
    "Expanded profile stats and discovery context",
    "Pro badge and premium access state across the Scout ecosystem",
  ],
  Elite: [
    "Everything in Pro plus elevated discovery placement",
    "Elite badge and access to premium circles",
    "Expanded local perks and premium partner drops",
    "Best bracket and discovery positioning across Scout",
  ],
};

export const portalInvoiceHistory: PortalInvoiceItem[] = [
  {
    id: "INV-2048",
    dateLabel: "April 21, 2026",
    amountLabel: "$9.99",
    status: "Paid",
    description: "Scout Pro monthly renewal",
  },
  {
    id: "INV-1984",
    dateLabel: "March 21, 2026",
    amountLabel: "$9.99",
    status: "Paid",
    description: "Scout Pro monthly renewal",
  },
  {
    id: "INV-1920",
    dateLabel: "February 21, 2026",
    amountLabel: "$9.99",
    status: "Paid",
    description: "Scout Pro monthly start",
  },
];

export const portalBillingProfile: PortalBillingProfile = {
  paymentMethod: "Visa ending in 4242",
  billingContactEmail: "alyssa@scoutsports.app",
  billingAddress: "Brooklyn, NY",
  taxStatus: "No tax information required",
};

export const portalSettingsPreferences: PortalSettingsPreferences = {
  matchAlertsEmail: true,
  bracketUpdatesEmail: true,
  circleActivityEmail: true,
  partnerOffersEmail: false,
  smsAlertsEnabled: false,
};

export const portalProfileDraftSeed: PortalProfileDraft = {
  fullName: "Alyssa Carter",
  username: "@alyssaplays",
  city: "Brooklyn, NY",
  primarySport: "Pickleball",
  secondarySports: ["Tennis", "Padel"],
  skillLevel: "Beginner+ to competitive social",
  bio: "Love fast doubles games, consistent weeknight matches, and crews that keep the energy high.",
  availability: "Weeknights after 6pm, Saturday mornings",
  vibeTags: ["Competitive", "Reliable", "Weeknights", "Social after"],
};

export function getProfileCompletionPercent(profile: PortalProfileDraft) {
  const checks = [
    profile.fullName,
    profile.username,
    profile.city,
    profile.primarySport,
    profile.skillLevel,
    profile.bio,
    profile.availability,
    profile.secondarySports.length > 0 ? "yes" : "",
    profile.vibeTags.length > 0 ? "yes" : "",
  ];

  const completedFields = checks.filter((item) => String(item).trim().length > 0).length;

  return Math.round((completedFields / checks.length) * 100);
}

export function getPortalProfileSnapshot(profile: PortalProfileDraft): PortalProfileSnapshot {
  return {
    ...profile,
    completionPercent: getProfileCompletionPercent(profile),
  };
}

export const portalStatsSnapshot: PortalStatsSnapshot = {
  scoutScore: 92,
  cityRank: "#12 in Brooklyn pickleball",
  record: "18 wins • 7 losses",
  streak: "Won 4 of last 5",
  bracketFinish: "2 semifinal finishes this month",
  recentTrend: "+7 rating over the last 30 days",
  recentMatches: 8,
  winRate: "72%",
  favoriteFormat: "Weeknight doubles",
  growthChannel: "Bracket and repeat-circle play",
  currentEdge: "Reliable doubles chemistry and pace control",
};

export const portalHistoryPreview: PortalHistoryItem[] = [
  {
    id: "match-1",
    title: "Thursday night doubles run",
    dateLabel: "April 24, 2026",
    sport: "Pickleball",
    result: "Win",
    detail: "McCarren Park • Pickleball • Matched with Mia and Zoe",
    ratingDelta: "+4",
    teammateLine: "Partnered with Mia • Opponents Zoe and Tash",
    durationLabel: "58 min",
    venueLabel: "McCarren Park",
    scoreLine: "11-8, 11-9",
  },
  {
    id: "match-2",
    title: "Scout bracket quarterfinal",
    dateLabel: "April 21, 2026",
    sport: "Pickleball",
    result: "Win",
    detail: "Brooklyn racket club • Bracket play",
    ratingDelta: "+2",
    teammateLine: "Doubles bracket • Partnered with James",
    durationLabel: "42 min",
    venueLabel: "Brooklyn Racket Club",
    scoreLine: "11-7, 9-11, 11-6",
  },
  {
    id: "match-3",
    title: "After-work challenge match",
    dateLabel: "April 18, 2026",
    sport: "Tennis",
    result: "Loss",
    detail: "Prospect Heights • Tennis singles",
    ratingDelta: "-1",
    teammateLine: "Singles match • Opponent: Lauren",
    durationLabel: "71 min",
    venueLabel: "Prospect Heights courts",
    scoreLine: "4-6, 6-4, 4-6",
  },
  {
    id: "match-4",
    title: "Saturday social ladder",
    dateLabel: "April 12, 2026",
    sport: "Padel",
    result: "Win",
    detail: "North Brooklyn club • Rotation ladder set",
    ratingDelta: "+3",
    teammateLine: "Partnered with Eli • Opponents Sam and Nick",
    durationLabel: "49 min",
    venueLabel: "North Brooklyn Padel Club",
    scoreLine: "6-3, 6-4",
  },
];

export const portalSportBreakdowns: PortalSportBreakdown[] = [
  {
    sport: "Pickleball",
    rating: 92,
    record: "14-5",
    trend: "+6 this month",
    note: "Best recent growth comes from competitive weeknight doubles.",
  },
  {
    sport: "Tennis",
    rating: 84,
    record: "4-2",
    trend: "+1 this month",
    note: "Singles matches are less frequent but still positive overall.",
  },
  {
    sport: "Padel",
    rating: 79,
    record: "3-1",
    trend: "Newly tracked",
    note: "Small sample size, but momentum is starting to show.",
  },
];

export const portalBracketResults: PortalBracketResult[] = [
  {
    title: "Brooklyn spring ladder",
    finish: "Semifinal",
    dateLabel: "April 2026",
    detail: "Won two rounds and gained visibility in local discovery.",
  },
  {
    title: "Prospect park invitational",
    finish: "Quarterfinal",
    dateLabel: "March 2026",
    detail: "Strong turnout and a positive rating move despite a close exit.",
  },
  {
    title: "Weeknight doubles bracket",
    finish: "Finalist",
    dateLabel: "February 2026",
    detail: "Best finish so far this season and strongest teammate fit.",
  },
];
