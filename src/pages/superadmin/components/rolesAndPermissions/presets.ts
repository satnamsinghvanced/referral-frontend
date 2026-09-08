export interface RolePreset {
  id: string;
  title: string;
  role: string;
  description: string;
  filterMatch: (permTitle: string) => boolean;
}

export const ROLE_PRESETS: RolePreset[] = [
  {
    id: "admin",
    title: "Administrator / Owner",
    role: "admin",
    description: "Complete unrestricted access across all modules.",
    filterMatch: () => true,
  },
  {
    id: "office_manager",
    title: "Office Manager",
    role: "office_manager",
    description: "Referrals, partner relations, scheduling, team oversight, and notifications.",
    filterMatch: (title) => {
      const t = title.toLowerCase();
      return (
        t.includes("referral") ||
        t.includes("referrer") ||
        t.includes("partner") ||
        t.includes("review") ||
        t.includes("notification") ||
        t.includes("calendar") ||
        t.includes("schedule") ||
        t.includes("task") ||
        t.includes("team") ||
        t.includes("integration") ||
        t.includes("lead")
      );
    },
  },
  {
    id: "treatment_coordinator",
    title: "Treatment Coordinator",
    role: "treatment_coordinator",
    description: "Clinical coordination, patient intake, treatment review, and tasks.",
    filterMatch: (title) => {
      const t = title.toLowerCase();
      return !t.includes("billing") && !t.includes("subscription") && !t.includes("finance");
    },
  },
  {
    id: "front_desk",
    title: "Front Desk Receptionist",
    role: "front_desk",
    description: "Referral reception, appointments, logging, and notifications.",
    filterMatch: (title) => {
      const t = title.toLowerCase();
      return (
        t.includes("referrer") ||
        t.includes("referral") ||
        t.includes("notification") ||
        t.includes("task") ||
        t.includes("calendar") ||
        t.includes("appointment")
      );
    },
  },
  {
    id: "doctor",
    title: "Doctor / Clinician",
    role: "doctor",
    description: "Clinical patient care, treatment notes, reviews, and direct notifications.",
    filterMatch: (title) => {
      const t = title.toLowerCase();
      return (
        t.includes("referral") ||
        t.includes("review") ||
        t.includes("task") ||
        t.includes("notification") ||
        t.includes("patient")
      );
    },
  },
  {
    id: "marketing",
    title: "Marketing Specialist",
    role: "marketing",
    description: "Campaigns, partner rewards, reviews growth, and marketing performance.",
    filterMatch: (title) => {
      const t = title.toLowerCase();
      return (
        t.includes("campaign") ||
        t.includes("referral") ||
        t.includes("referrer") ||
        t.includes("reward") ||
        t.includes("review") ||
        t.includes("analytic") ||
        t.includes("social") ||
        t.includes("coupon")
      );
    },
  },
];
