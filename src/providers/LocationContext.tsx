import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Location } from "../types/common";
import { useFetchLocations } from "../hooks/settings/useLocation";

interface LocationContextType {
  locations: Location[];
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location) => void;
  isLoading: boolean;
  getLocationColor: (locationId?: string, index?: number) => string;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LOCATION_COLORS = [
  "#f97316",
  "#0284c7",
  "#a855f7",
  "#10b981",
  "#ec4899",
  "#f59e0b",
];

const STORAGE_KEY = "selected_location_id";

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: locationsData, isLoading } = useFetchLocations({ limit: 100 });
  const locations: Location[] = useMemo(() => locationsData?.data || [], [locationsData]);

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY);
  });

  const selectedLocation = useMemo<any>(() => {
    if (!locations || locations.length === 0) return null;

    if (selectedLocationId) {
      const found = locations.find((loc) => loc._id === selectedLocationId);
      if (found) return found;
    }

    const primary = locations.find((loc) => loc.isPrimary);
    return primary || locations[0];
  }, [locations, selectedLocationId]);

  useEffect(() => {
    if (selectedLocation?._id) {
      localStorage.setItem(STORAGE_KEY, selectedLocation._id);
    }
  }, [selectedLocation]);

  const handleSelectLocation = (location: Location): void => {
    if (location._id) {
      setSelectedLocationId(location._id);
      localStorage.setItem(STORAGE_KEY, location._id);
    }
  };

  const getLocationColor = (locationId?: string, index?: number): string => {
    if (index !== undefined) {
      return LOCATION_COLORS[index % LOCATION_COLORS.length] ?? LOCATION_COLORS[0] ?? "#f97316";
    }
    if (!locationId || !locations || locations.length === 0) {
      return LOCATION_COLORS[0] ?? "#f97316";
    }
    const idx = locations.findIndex((l) => l._id === locationId);
    return LOCATION_COLORS[idx >= 0 ? idx % LOCATION_COLORS.length : 0] ?? LOCATION_COLORS[0] ?? "#f97316";
  };

  return (
    <LocationContext.Provider
      value={{
        locations,
        selectedLocation,
        setSelectedLocation: handleSelectLocation,
        isLoading,
        getLocationColor,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocationContext must be used within a LocationProvider");
  }
  return context;
};
