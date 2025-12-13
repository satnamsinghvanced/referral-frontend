import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { queryClient } from "../../providers/QueryProvider";
import {
  createLocation,
  deleteLocation,
  fetchLocationDetails,
  fetchLocations,
  Location,
  updateLocation,
} from "../../services/settings/location";

const LOCATION_KEY = ["locations"];

export function useFetchLocations() {
  return useQuery<Location[]>({
    queryKey: LOCATION_KEY,
    queryFn: fetchLocations,
  });
}

export function useFetchLocationDetails(id: string) {
  return useQuery<Location>({
    queryKey: [...LOCATION_KEY, id],
    queryFn: () => fetchLocationDetails(id as string),
    enabled: !!id,
  });
}

export function useCreateLocation() {
  return useMutation({
    mutationFn: (newLocation: Location) => createLocation(newLocation),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Practice location added successfully",
        color: "success",
      });

      queryClient.invalidateQueries({ queryKey: LOCATION_KEY });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to add practice location";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
}

export function useUpdateLocation() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Location }) =>
      updateLocation(id, data),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Practice location updated successfully.",
        color: "success",
      });

      queryClient.invalidateQueries({ queryKey: LOCATION_KEY });
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

export function useDeleteLocation() {
  return useMutation({
    mutationFn: (id: string) => deleteLocation(id),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Practice location deleted successfully.",
        color: "success",
      });

      queryClient.invalidateQueries({ queryKey: LOCATION_KEY });
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
