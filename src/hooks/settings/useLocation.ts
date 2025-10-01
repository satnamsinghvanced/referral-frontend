import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  Location,
} from "../../services/settings/location";
import { queryClient } from "../../providers/QueryProvider";

// Cache key
const LOCATION_KEY = ["locations"];

// 🔹 Fetch all locations
export function useFetchLocations() {
  return useQuery<Location[]>({
    queryKey: LOCATION_KEY,
    queryFn: fetchLocations,
  });
}

// 🔹 Create location
export function useCreateLocation() {
  return useMutation({
    mutationFn: (newLocation: Location) => createLocation(newLocation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOCATION_KEY });
    },
  });
}

// 🔹 Update location
export function useUpdateLocation() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Location }) =>
      updateLocation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOCATION_KEY });
    },
  });
}

// 🔹 Delete location
export function useDeleteLocation() {
  return useMutation({
    mutationFn: (id: string) => deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOCATION_KEY });
    },
  });
}
