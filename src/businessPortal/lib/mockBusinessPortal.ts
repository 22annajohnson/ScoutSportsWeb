export type BusinessPortalStatus = "Active" | "Pending verification" | "Needs review";
export type BusinessVerificationStatus = "Verified" | "Under review" | "Needs documents";
export type BusinessTeamMemberRole = "Owner" | "Manager" | "Analyst" | "Billing Admin";
export type BusinessTeamMemberStatus = "Active" | "Invited" | "Paused";
export type BusinessInvoiceStatus = "Paid" | "Pending" | "Action required";
export type BusinessContentStatus = "Draft" | "Scheduled" | "Published" | "Archived";
export type BusinessContentType = "Announcement" | "Offer" | "Event";
export type BusinessContentMediaKind = "Image" | "Video";

export type BusinessPortalProfileSnapshot = {
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
  verificationStatus: BusinessVerificationStatus;
  businessStatus: BusinessPortalStatus;
};

export type BusinessPortalProfileDraft = Omit<
  BusinessPortalProfileSnapshot,
  "completionPercent" | "verificationStatus" | "businessStatus"
>;

export type BusinessPortalWorkspaceMember = {
  id: string;
  name: string;
  email: string;
  role: BusinessTeamMemberRole;
  status: BusinessTeamMemberStatus;
  lastActive: string;
  source?: "membership" | "invitation";
};

export type BusinessPortalBillingSettings = {
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

export type BusinessPortalInvoiceItem = {
  id: string;
  dateLabel: string;
  amountLabel: string;
  status: BusinessInvoiceStatus;
  description: string;
};

export type BusinessPortalActivityItem = {
  id: string;
  title: string;
  actor: string;
  dateLabel: string;
  detail: string;
  type: "billing" | "team" | "profile" | "verification" | "content";
};

export type BusinessPortalContentItem = {
  id: string;
  title: string;
  summary: string;
  body: string;
  status: BusinessContentStatus;
  type: BusinessContentType;
  ctaLabel: string;
  ctaUrl: string;
  publishAt: string;
  updatedAtLabel: string;
  attachments: BusinessPortalMediaAsset[];
};

export type BusinessPortalMediaAsset = {
  id: string;
  label: string;
  kind: BusinessContentMediaKind;
  url: string;
  altText: string;
};

export const businessPortalOwner = {
  firstName: "Maya",
  fullName: "Maya Thompson",
  email: "maya@harborfit.co",
  avatarInitials: "MT",
  memberSince: "Workspace created April 2026",
};

export const businessPortalProfileDraftSeed: BusinessPortalProfileDraft = {
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

export function getBusinessPortalCompletionPercent(profile: BusinessPortalProfileDraft) {
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

export function getBusinessPortalSnapshot(profile: BusinessPortalProfileDraft): BusinessPortalProfileSnapshot {
  return {
    ...profile,
    completionPercent: getBusinessPortalCompletionPercent(profile),
    verificationStatus: "Under review",
    businessStatus: "Active",
  };
}

export const businessPortalBillingSeed: BusinessPortalBillingSettings = {
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

export const businessPortalTeamSeed: BusinessPortalWorkspaceMember[] = [
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

export const businessPortalInvoicesSeed: BusinessPortalInvoiceItem[] = [
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

export const businessPortalActivitySeed: BusinessPortalActivityItem[] = [
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
  {
    id: "activity-5",
    title: "Offer scheduled for next week",
    actor: "Jared Ellis",
    dateLabel: "April 20, 2026",
    detail: "Queued a two-for-one guest class offer to publish ahead of the new member campaign.",
    type: "content",
  },
];

export const businessPortalContentSeed: BusinessPortalContentItem[] = [
  {
    id: "content-1",
    title: "Spring league registration now open",
    summary: "Announce that weekend league signups are available through May 12.",
    body:
      "Registration is now open for our spring social league. Reserve your spot before May 12 and join us for six weeks of community matches and post-game mixers.",
    status: "Published",
    type: "Announcement",
    ctaLabel: "Register now",
    ctaUrl: "https://harborfit.co/leagues",
    publishAt: "2026-05-01T14:00:00.000Z",
    updatedAtLabel: "Published May 1",
    attachments: [
      {
        id: "asset-1",
        label: "League launch graphic",
        kind: "Image",
        url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
        altText: "Players high-fiving on an indoor court.",
      },
    ],
  },
  {
    id: "content-2",
    title: "Two-for-one guest class week",
    summary: "Promote a limited-time guest pass offer for new visitors.",
    body:
      "Bring a friend during guest week and both of you can join any evening class on the schedule with a two-for-one pass.",
    status: "Scheduled",
    type: "Offer",
    ctaLabel: "View class schedule",
    ctaUrl: "https://harborfit.co/schedule",
    publishAt: "2026-05-08T16:30:00.000Z",
    updatedAtLabel: "Scheduled for May 8",
    attachments: [
      {
        id: "asset-2",
        label: "Guest week promo tile",
        kind: "Image",
        url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
        altText: "Two women smiling during a studio workout.",
      },
    ],
  },
  {
    id: "content-3",
    title: "Member social rooftop meetup",
    summary: "Draft event copy for the monthly member social.",
    body:
      "We are planning a rooftop member social with light bites, recovery demos, and space to meet other regulars in the club community.",
    status: "Draft",
    type: "Event",
    ctaLabel: "RSVP interest",
    ctaUrl: "https://harborfit.co/events",
    publishAt: "",
    updatedAtLabel: "Edited today",
    attachments: [],
  },
];

export const businessPortalNextSteps = [
  "Complete business verification so promotions and notifications can be approved faster.",
  "Invite teammates who will own ads, billing, and content before launch week.",
  "Confirm your billing contact and payment method before enabling spend-based tools.",
];
