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
};

export type PortalHistoryItem = {
  title: string;
  dateLabel: string;
  result: string;
  detail: string;
  ratingDelta: string;
};

export type PortalInvoiceItem = {
  id: string;
  dateLabel: string;
  amountLabel: string;
  status: "Paid" | "Pending" | "Refunded";
  description: string;
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
  billingSource: "Web billing preview",
  cadence: "Monthly",
  priceLabel: "$9.99 / month",
  paymentMethod: "Visa ending in 4242",
  syncedAccessNote: "When billing is fully connected, upgrades made in-app or on the web should resolve into this same membership record.",
};

export const portalMembershipBenefits = [
  "Advanced player filters and better fit matching",
  "Priority bracket access and stronger ranking visibility",
  "Expanded profile stats and discovery context",
  "Pro badge and premium access state across the Scout ecosystem",
];

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
};

export const portalHistoryPreview: PortalHistoryItem[] = [
  {
    title: "Thursday night doubles run",
    dateLabel: "April 24, 2026",
    result: "Win",
    detail: "McCarren Park • Pickleball • Matched with Mia and Zoe",
    ratingDelta: "+4",
  },
  {
    title: "Scout bracket quarterfinal",
    dateLabel: "April 21, 2026",
    result: "Win",
    detail: "Brooklyn racket club • Bracket play",
    ratingDelta: "+2",
  },
  {
    title: "After-work challenge match",
    dateLabel: "April 18, 2026",
    result: "Loss",
    detail: "Prospect Heights • Tennis singles",
    ratingDelta: "-1",
  },
];
