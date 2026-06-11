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

export const useGBPOverview = () => {
  return useQuery({
    queryKey: ["gbp", "overview"],
    queryFn: fetchGBPOverview,
  });
};

export const useGBPLocationPerformance = () => {
  return useQuery({
    queryKey: ["gbp", "locations"],
    queryFn: fetchGBPLocationPerformance,
  });
};

export const useGBPRecentReviews = (pageToken?: string) => {
  return useQuery({
    queryKey: ["gbp", "reviews", pageToken],
    queryFn: async () => {
      const data = await fetchGBPRecentReviews(pageToken);
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      return data;
    },
  });
};

export const useCreateGBPReview = () => {
  return useMutation({
    mutationFn: createGBPReviewRequest,
    onSuccess: () => {
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
