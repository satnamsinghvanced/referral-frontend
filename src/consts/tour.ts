export interface Step {
  title: string;
  content: string;
  selector: string;
  nextRoute?: string;
  requiredClick?: boolean;
}

export const STEPS: Step[] = [
  {
    title: "Settings",
    content: "Click to go to Settings.",
    selector: ".tour-step-settings",
    nextRoute: "/settings",
    requiredClick: true,
  },
  {
    title: "Profile",
    content: "View your Profile settings.",
    selector: ".tour-step-profile",
  },
  {
    title: "Locations",
    content: "Manage your Locations.",
    selector: ".tour-step-locations",
    requiredClick: true,
  },
  {
    title: "Team",
    content: "Manage your Team.",
    selector: ".tour-step-team",
    requiredClick: true,
  },
  {
    title: "Referrals",
    content: "Go to Referrals Dashboard.",
    selector: ".tour-step-referrals",
    nextRoute: "/referrals",
    requiredClick: true,
  },
  {
    title: "NFC & QR Tracking",
    content: "Switch to NFC & QR Tracking view.",
    selector: ".tour-step-nfc-tab",
    requiredClick: true,
  },
  {
    title: "Generator",
    content: "Use this box to generate new codes.",
    selector: ".tour-step-qr-area",
  },
  {
    title: "Add Referrer",
    content: "Click to add a new referrer.",
    selector: ".tour-step-add-referrer-btn",
  },
  {
    title: "Referrers Tab",
    content: "Click to view Referrers list.",
    selector: ".tour-step-referrers-tab",
    requiredClick: true,
  },
  {
    title: "Referrals Tab",
    content: "Click to go back to Referrals list.",
    selector: ".tour-step-referrals-tab",
    requiredClick: true,
  },
  {
    title: "Partner Network",
    content: "Visit Partner Network.",
    selector: ".tour-step-partner-network",
    requiredClick: true,
  },
  {
    title: "Marketing Calendar",
    content: "View your Marketing Calendar.",
    selector: ".tour-step-marketing-calendar",
    requiredClick: true,
  },
  {
    title: "Email Campaigns",
    content: "Go to Email Campaigns.",
    selector: ".tour-step-email-campaigns",
    requiredClick: true,
  },
  {
    title: "Media Management",
    content: "Manage your Media.",
    selector: ".tour-step-media-management",
    requiredClick: true,
  },
];
