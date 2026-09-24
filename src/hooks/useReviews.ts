import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../providers/QueryProvider";
import {
  createGBPReviewRequest,
  fetchGBPLocationPerformance,
  fetchGBPOverview,
  fetchGBPRecentReviews,
  fetchFacebookReviews,
} from "../services/reviews";
import { addToast } from "@heroui/react";
import { AxiosError } from "axios";

export const useGBPOverview = (params?: { locationId?: string | undefined }) => {
  return useQuery({
    queryKey: ["gbp", "overview", params?.locationId],
    queryFn: () => fetchGBPOverview(params),
  });
};

export const useGBPLocationPerformance = (params?: { locationId?: string | undefined }) => {
  return useQuery({
    queryKey: ["gbp", "locations", params?.locationId],
    queryFn: () => fetchGBPLocationPerformance(params),
  });
};

export const useGBPRecentReviews = (params?: { pageToken?: string; locationId?: string | undefined } | string) => {
  const queryParams = typeof params === "string" ? { pageToken: params } : params;
  return useQuery({
    queryKey: ["gbp", "reviews", queryParams?.pageToken, queryParams?.locationId],
    queryFn: async () => {
      const data = await fetchGBPRecentReviews(queryParams);
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

export const useFacebookReviews = () => {
  return useQuery({
    queryKey: ["facebook", "reviews"],
    queryFn: fetchFacebookReviews,
  });
};
