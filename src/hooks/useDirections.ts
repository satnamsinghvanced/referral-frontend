import { addToast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getDirections } from "../services/mapbox";
import { MapboxDirectionsResponse } from "../types/mapbox";

type MutationPayload = string; // coordinateString

const DIRECTIONS_QUERY_KEY = "mapboxDirections";

export const useDirectionsMutation = () => {
  return useMutation<MapboxDirectionsResponse, AxiosError, MutationPayload>({
    mutationKey: [DIRECTIONS_QUERY_KEY, "mutation"],

    mutationFn: (coordinateString) =>
      getDirections({ coordinates: coordinateString }),

    onError: (error) => {
      const message =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to fetch route directions.";

      addToast({
        title: "Route Error",
        description: message,
        color: "danger",
      });
    },
  });
};
