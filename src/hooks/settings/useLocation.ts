import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  Location,
  fetchLocationDetails,
} from "../../services/settings/location";
import { queryClient } from "../../providers/QueryProvider";
import { addToast } from "@heroui/react";
import { AxiosError } from "axios";

// Cache key
const LOCATION_KEY = ["locations"];

// 🔹 Fetch all locations
export function useFetchLocations() {
  return useQuery<Location[]>({
    queryKey: LOCATION_KEY,
    queryFn: fetchLocations,
  });
}

// 🔹 Fetch location detail
export function useFetchLocationDetails(id: string) {
  return useQuery<Location>({
    queryKey: [...LOCATION_KEY, id],
    queryFn: () => fetchLocationDetails(id as string),
    enabled: !!id, // only runs when id is truthy
  });
}

// 🔹 Create location
export function useCreateLocation() {
  return useMutation({
    mutationFn: (newLocation: Location) => createLocation(newLocation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOCATION_KEY });

      addToast({
        title: "Success",
        description: "New practice location added successfully",
        color: "success",
      });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to add new practice location";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
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

      addToast({
        title: "Success",
        description: "Practice location updated successfully",
        color: "success",
      });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to update practice location";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
}

// 🔹 Delete location
export function useDeleteLocation() {
  return useMutation({
    mutationFn: (id: string) => deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOCATION_KEY });

      addToast({
        title: "Success",
        description: "Practice location deleted successfully",
        color: "success",
      });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to delete practice location";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
}
