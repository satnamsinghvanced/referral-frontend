export interface LocationTheme {
  key: string;
  bg: string;
  badge: string;
  dot: string;
  dotColor: string;
  chipSelected: string;
}

export const LOCATION_THEMES: LocationTheme[] = [
  {
    key: "sky",
    bg: "bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300",
    badge: "bg-sky-500 text-white border-sky-500",
    dot: "bg-sky-500",
    dotColor: "#0284c7",
    chipSelected: "bg-sky-50 dark:bg-sky-950/50 border-sky-400 text-sky-700 dark:text-sky-300",
  },
  {
    key: "orange",
    bg: "bg-orange-50 dark:bg-orange-950/40 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300",
    badge: "bg-orange-500 text-white border-orange-500",
    dot: "bg-orange-500",
    dotColor: "#f97316",
    chipSelected: "bg-orange-50 dark:bg-orange-950/50 border-orange-400 text-orange-700 dark:text-orange-300",
  },
  {
    key: "purple",
    bg: "bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300",
    badge: "bg-purple-500 text-white border-purple-500",
    dot: "bg-purple-500",
    dotColor: "#a855f7",
    chipSelected: "bg-purple-50 dark:bg-purple-950/50 border-purple-400 text-purple-700 dark:text-purple-300",
  },
  {
    key: "emerald",
    bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300",
    badge: "bg-emerald-500 text-white border-emerald-500",
    dot: "bg-emerald-500",
    dotColor: "#10b981",
    chipSelected: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-700 dark:text-emerald-300",
  },
  {
    key: "pink",
    bg: "bg-pink-50 dark:bg-pink-950/40 border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-300",
    badge: "bg-pink-500 text-white border-pink-500",
    dot: "bg-pink-500",
    dotColor: "#ec4899",
    chipSelected: "bg-pink-50 dark:bg-pink-950/50 border-pink-400 text-pink-700 dark:text-pink-300",
  },
];

export const DEFAULT_LOCATIONS = [
  "Main Street Office",
  "North Campus Clinic",
  "Westside Branch",
  "East Side Center",
];

const DEFAULT_THEME: LocationTheme = LOCATION_THEMES[0]!;

export const getLocationStyle = (
  locationName?: string,
  availableLocations: string[] = DEFAULT_LOCATIONS
): { theme: LocationTheme; dotColor: string } => {
  if (!locationName) {
    return {
      theme: DEFAULT_THEME,
      dotColor: DEFAULT_THEME.dotColor,
    };
  }

  let index = availableLocations.indexOf(locationName);
  if (index < 0) {
    let hash = 0;
    for (let i = 0; i < locationName.length; i++) {
      hash = locationName.charCodeAt(i) + ((hash << 5) - hash);
    }
    index = Math.abs(hash) % LOCATION_THEMES.length;
  }

  const theme = LOCATION_THEMES[index % LOCATION_THEMES.length] ?? DEFAULT_THEME;
  return {
    theme,
    dotColor: theme.dotColor,
  };
};
