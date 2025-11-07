import { addToast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getDirections } from "../services/mapbox";
import { MapboxDirectionsResponse } from "../types/mapbox";

type MutationPayload = string;

const DIRECTIONS_QUERY_KEY = "mapboxDirections";

export const useDirectionsMutation = () => {
  return useMutation<
    MapboxDirectionsResponse,
    AxiosError, // Error type
    MutationPayload // Payload type (coordinateString)
  >({
    mutationKey: [DIRECTIONS_QUERY_KEY, "mutation"],
    mutationFn: (coordinateString) =>
      getDirections({ coordinates: coordinateString }),
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred while calculating the route.";
      addToast({ title: "Error", description: message, color: "danger" });
    },
  });
};
