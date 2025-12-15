export interface Step {
  title: string;
  content: string;
  selector: string;
  nextRoute?: string;
}

export const STEPS: Step[] = [
  {
    title: "Settings",
    content: "Click here to access your account settings.",
    selector: ".tour-step-settings",
    nextRoute: "/settings",
  },
  {
    title: "Profile",
    content: "Manage your personal profile details here.",
    selector: ".tour-step-profile",
  },
  {
    title: "Locations",
    content: "Configure and manage your practice locations.",
    selector: ".tour-step-locations",
  },
  {
    title: "Team",
    content: "Manage your team members and permissions.",
    selector: ".tour-step-team",
  },
];
