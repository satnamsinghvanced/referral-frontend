export const BUDGET_STATUSES = [
  { label: "Active", value: "active" },
  { label: "Paused", value: "paused" },
];

export const BUDGET_DURATIONS = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Yearly", value: "yearly" },
];

export const CATEGORY_COLORS: Record<string, string> = {
  "Digital Advertising": "#3B82F6",
  // "Google Ads": "#DB4437",
  "Social Media Marketing": "#A855F7",
  // "Meta Ads": "#4267B2",
  // "Facebook Ads": "#4267B2",
  // "TikTok Ads": "#000000",
  "Content Marketing": "#10B981",
  "Email Marketing": "#F59E0B",
  "SEO & Website": "#EF4444",
  "Marketing Tools": "#06B6D4",
  "Referral Programs": "#EC4899",
  "Traditional Marketing": "#6B7280",
};

export const getCategoryColor = (category: string) => {
  if (CATEGORY_COLORS[category]) return CATEGORY_COLORS[category];

  const lower = category.toLowerCase();

  // Try to find a match by substring for more robustness
  const match = Object.keys(CATEGORY_COLORS).find(
    (key) =>
      lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower),
  );

  return match ? CATEGORY_COLORS[match] : "#3B82F6";
};
