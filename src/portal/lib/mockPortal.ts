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
};

export const portalProfileSnapshot: PortalProfileSnapshot = {
  fullName: "Alyssa Carter",
  username: "@alyssaplays",
  city: "Brooklyn, NY",
  primarySport: "Pickleball",
  secondarySports: ["Tennis", "Padel"],
  skillLevel: "Beginner+ to competitive social",
  bio: "Love fast doubles games, consistent weeknight matches, and crews that keep the energy high.",
  availability: "Weeknights after 6pm, Saturday mornings",
  vibeTags: ["Competitive", "Reliable", "Weeknights", "Social after"],
  completionPercent: 84,
};

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
