import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../providers/QueryProvider";
import {
  createGBPReviewRequest,
  fetchGBPLocationPerformance,
  fetchGBPOverview,
  fetchGBPRecentReviews,
} from "../services/reviews";
import { addToast } from "@heroui/react";
import { AxiosError } from "axios";

/**
 * Hook for high-level GBP stats and charts
 */
export const useGBPOverview = () => {
  return useQuery({
    queryKey: ["gbp", "overview"],
    queryFn: fetchGBPOverview,
  });
};

/**
 * Hook for clinic-specific performance comparison
 */
export const useGBPLocationPerformance = () => {
  return useQuery({
    queryKey: ["gbp", "locations"],
    queryFn: fetchGBPLocationPerformance,
  });
};

/**
 * Hook for the list of actual customer reviews
 */
export const useGBPRecentReviews = (pageToken?: string) => {
  return useQuery({
    queryKey: ["gbp", "reviews", pageToken],
    queryFn: () => fetchGBPRecentReviews(pageToken),
  });
};

/**
 * Mutation to trigger a new review request (via NFC Desk/Email)
 */
export const useCreateGBPReview = () => {
  return useMutation({
    mutationFn: createGBPReviewRequest,
    onSuccess: () => {
      // Refresh overview and location stats after a new request is logged
      queryClient.invalidateQueries({ queryKey: ["gbp"] });
      addToast({
        title: "Success",
        description: "Review request submitted successfully.",
        color: "success",
      });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to submit review request";
      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};
