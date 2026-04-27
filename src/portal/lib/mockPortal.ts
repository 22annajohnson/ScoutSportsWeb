export type PortalBusinessStatus = "Active" | "Pending verification" | "Needs review";
export type PortalVerificationStatus = "Verified" | "Under review" | "Needs documents";
export type TeamMemberRole = "Owner" | "Manager" | "Analyst" | "Billing Admin";
export type TeamMemberStatus = "Active" | "Invited" | "Paused";
export type InvoiceStatus = "Paid" | "Pending" | "Action required";

export type PortalBusinessProfileSnapshot = {
  displayName: string;
  legalName: string;
  slug: string;
  category: string;
  supportEmail: string;
  phone: string;
  website: string;
  description: string;
  locations: string[];
  completionPercent: number;
  verificationStatus: PortalVerificationStatus;
  businessStatus: PortalBusinessStatus;
};

export type PortalBusinessProfileDraft = Omit<
  PortalBusinessProfileSnapshot,
  "completionPercent" | "verificationStatus" | "businessStatus"
>;

export type PortalWorkspaceMember = {
  id: string;
  name: string;
  email: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  lastActive: string;
};

export type PortalBillingSettings = {
  planName: string;
  planStatus: "Active" | "Trialing";
  renewalLabel: string;
  monthlyBudgetLabel: string;
  spendCapLabel: string;
  paymentMethod: string;
  billingContactEmail: string;
  billingAddress: string;
  taxIdStatus: string;
};

export type PortalInvoiceItem = {
  id: string;
  dateLabel: string;
  amountLabel: string;
  status: InvoiceStatus;
  description: string;
};

export type PortalActivityItem = {
  id: string;
  title: string;
  actor: string;
  dateLabel: string;
  detail: string;
  type: "billing" | "team" | "profile" | "verification";
};

export const portalBusinessOwner = {
  firstName: "Maya",
  fullName: "Maya Thompson",
  email: "maya@harborfit.co",
  avatarInitials: "MT",
  memberSince: "Workspace created April 2026",
};

export const portalBusinessProfileDraftSeed: PortalBusinessProfileDraft = {
  displayName: "Harbor Fit Social Club",
  legalName: "Harbor Fit Group LLC",
  slug: "harbor-fit-social-club",
  category: "Fitness studio and community club",
  supportEmail: "team@harborfit.co",
  phone: "(718) 555-0144",
  website: "https://harborfit.co",
  description:
    "Neighborhood fitness club hosting classes, social leagues, and recurring local events across Brooklyn.",
  locations: ["Williamsburg, Brooklyn", "Greenpoint, Brooklyn"],
};

export function getBusinessCompletionPercent(profile: PortalBusinessProfileDraft) {
  const checks = [
    profile.displayName,
    profile.legalName,
    profile.slug,
    profile.category,
    profile.supportEmail,
    profile.phone,
    profile.website,
    profile.description,
    profile.locations.length > 0 ? "yes" : "",
  ];

  const completedFields = checks.filter((item) => String(item).trim().length > 0).length;

  return Math.round((completedFields / checks.length) * 100);
}

export function getPortalBusinessSnapshot(profile: PortalBusinessProfileDraft): PortalBusinessProfileSnapshot {
  return {
    ...profile,
    completionPercent: getBusinessCompletionPercent(profile),
    verificationStatus: "Under review",
    businessStatus: "Active",
  };
}

export const portalBillingSeed: PortalBillingSettings = {
  planName: "Growth",
  planStatus: "Active",
  renewalLabel: "Renews May 19, 2026",
  monthlyBudgetLabel: "$1,800 monthly ad budget",
  spendCapLabel: "$2,500 account spend cap",
  paymentMethod: "Visa ending in 4242",
  billingContactEmail: "finance@harborfit.co",
  billingAddress: "204 Kent Ave, Brooklyn, NY 11249",
  taxIdStatus: "W-9 on file",
};

export const portalTeamSeed: PortalWorkspaceMember[] = [
  {
    id: "team-1",
    name: "Maya Thompson",
    email: "maya@harborfit.co",
    role: "Owner",
    status: "Active",
    lastActive: "2 minutes ago",
  },
  {
    id: "team-2",
    name: "Jared Ellis",
    email: "jared@harborfit.co",
    role: "Manager",
    status: "Active",
    lastActive: "Today at 1:18 PM",
  },
  {
    id: "team-3",
    name: "Priya Shah",
    email: "priya@harborfit.co",
    role: "Billing Admin",
    status: "Active",
    lastActive: "Yesterday",
  },
  {
    id: "team-4",
    name: "Open invitation",
    email: "partnerships@harborfit.co",
    role: "Analyst",
    status: "Invited",
    lastActive: "Invite sent today",
  },
];

export const portalInvoicesSeed: PortalInvoiceItem[] = [
  {
    id: "INV-4021",
    dateLabel: "April 18, 2026",
    amountLabel: "$499.00",
    status: "Paid",
    description: "Growth plan monthly subscription",
  },
  {
    id: "INV-3968",
    dateLabel: "April 12, 2026",
    amountLabel: "$725.00",
    status: "Paid",
    description: "Sponsored campaign spend settlement",
  },
  {
    id: "INV-3910",
    dateLabel: "March 18, 2026",
    amountLabel: "$499.00",
    status: "Paid",
    description: "Growth plan monthly subscription",
  },
];

export const portalActivitySeed: PortalActivityItem[] = [
  {
    id: "activity-1",
    title: "Business profile submitted for verification",
    actor: "Maya Thompson",
    dateLabel: "Today at 10:12 AM",
    detail: "Updated legal business name, support email, and added a second location for review.",
    type: "verification",
  },
  {
    id: "activity-2",
    title: "Ad budget cap increased",
    actor: "Priya Shah",
    dateLabel: "Yesterday at 4:40 PM",
    detail: "Raised monthly spend cap from $2,000 to $2,500 for the spring promo window.",
    type: "billing",
  },
  {
    id: "activity-3",
    title: "New team member invited",
    actor: "Jared Ellis",
    dateLabel: "Yesterday at 11:05 AM",
    detail: "Sent an Analyst invite to partnerships@harborfit.co.",
    type: "team",
  },
  {
    id: "activity-4",
    title: "Business description updated",
    actor: "Maya Thompson",
    dateLabel: "April 21, 2026",
    detail: "Refined the public description to better position Harbor Fit classes and social leagues.",
    type: "profile",
  },
];

export const portalNextSteps = [
  "Complete business verification so promotions and notifications can be approved faster.",
  "Invite teammates who will own ads, billing, and content before launch week.",
  "Confirm your billing contact and payment method before enabling spend-based tools.",
];
