import { useQuery } from "@tanstack/react-query";
import { MapboxDirectionsResponse } from "../types/mapbox";
import { getDirections } from "../services/mapbox";

interface UseDirectionsQueryProps {
  coordinateString: string;
  enabled?: boolean;
}

const DIRECTIONS_QUERY_KEY = "mapboxDirections";

export const useDirectionsQuery = ({
  coordinateString,
  enabled = false,
}: UseDirectionsQueryProps) => {
  return useQuery<MapboxDirectionsResponse, Error>({
    queryKey: [DIRECTIONS_QUERY_KEY, coordinateString],
    queryFn: () => getDirections({ coordinates: coordinateString }),
    enabled: enabled ? !!coordinateString : false,
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    retry: 1, // Retry failed requests once
  });
};

// --- Example Usage in a React Component ---
/*
import React from 'react';
import { useDirectionsQuery } from '../hooks/useDirectionsQuery';

// In a real app, you would get this data from your main form/context
const mockCoordinates = "-74.046233,40.77726;-73.996562,40.757439;-74.010853,40.73673";
const MAPBOX_TOKEN = "pk.eyJ1Ijoib3J0aG9yZXZkZXYiLCJhIjoiY21oOWJlZ203MG9pNzJtb29lNHZ6cHcwZCJ9.loyvioKWsXKslGkNYL6cJw"; // WARNING: Keep tokens secure

const DirectionsComponent: React.FC = () => {
  const { data, isLoading, isError, error } = useDirectionsQuery({
    coordinateString: mockCoordinates,
    accessToken: MAPBOX_TOKEN,
  });

  if (isLoading) return <div>Loading route...</div>;
  if (isError) return <div>Error fetching route: {error.message}</div>;
  if (!data) return <div>No route data available.</div>;

  // Extract the best route (usually the first one in the array)
  const bestRoute = data.routes[0];

  return (
    <div>
      <h3>Mapbox Directions Result</h3>
      <p>Total Distance: <strong>{(bestRoute.distance / 1000).toFixed(2)} km</strong></p>
      <p>Total Duration: <strong>{(bestRoute.duration / 60).toFixed(0)} minutes</strong></p>
      // ... render geometry, waypoints, etc.
    </div>
  );
};
*/
