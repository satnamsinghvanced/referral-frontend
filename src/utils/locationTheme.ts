import React from "react";

export interface LocationItemLike {
  _id?: string;
  name?: string;
  color?: string;
}

export interface LocationTheme {
  key: string;
  bg: string;
  badge: string;
  dot: string;
  dotColor: string;
  chipSelected: string;
  chipStyle?: React.CSSProperties;
}

const DEFAULT_FALLBACK_COLOR = "#0ea5e9";

export const getLocationStyle = (
  locationNameOrId?: string,
  dbLocations?: LocationItemLike[]
): { theme: LocationTheme; dotColor: string; chipStyle: React.CSSProperties } => {
  let color = DEFAULT_FALLBACK_COLOR;

  if (locationNameOrId && dbLocations && Array.isArray(dbLocations) && dbLocations.length > 0) {
    const matched = dbLocations.find(
      (l) =>
        l._id === locationNameOrId ||
        l.name?.toLowerCase() === locationNameOrId.toLowerCase()
    );
    if (matched?.color) {
      color = matched.color;
    }
  }

  const chipStyle: React.CSSProperties = {
    backgroundColor: `${color}18`,
    borderColor: `${color}50`,
    color: color,
  };

  const theme: LocationTheme = {
    key: "db-dynamic",
    bg: "border text-current",
    badge: `text-white border-transparent`,
    dot: "",
    dotColor: color,
    chipSelected: "",
    chipStyle,
  };

  return {
    theme,
    dotColor: color,
    chipStyle,
  };
};
