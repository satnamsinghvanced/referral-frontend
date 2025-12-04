import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../providers/QueryProvider";
import {
  createMarketingActivity,
  deleteMarketingActivity,
  fetchActivityDetail,
  fetchMarketingActivities,
  updateMarketingActivity,
} from "../services/marketing";
import {
  ActivityPayload,
  DeleteActivityResponse,
  GetActivitiesQuery,
  GetActivitiesResponse,
  GetActivityDetailResponse,
} from "../types/marketing";

export const useMarketingActivities = (query: GetActivitiesQuery) => {
  return useQuery<GetActivitiesResponse, Error>({
    queryKey: ["marketingActivities", query],
    queryFn: () => fetchMarketingActivities(query),
    enabled: true,
  });
};

export const useCreateActivity = () => {
  return useMutation({
    mutationFn: (payload: ActivityPayload) => createMarketingActivity(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketingActivities"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      addToast({
        title: "Success",
        description: "Activity created successfully.",
        color: "success",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to create activity";
      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};

export const useActivityDetail = (activityId: string) => {
  return useQuery<GetActivityDetailResponse, Error>({
    queryKey: ["marketingActivityDetail", activityId],
    queryFn: () => fetchActivityDetail(activityId),
    enabled: !!activityId,
  });
};

export const useUpdateActivity = () => {
  return useMutation({
    mutationFn: (payload: ActivityPayload) => updateMarketingActivity(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketingActivities"] });
      queryClient.invalidateQueries({ queryKey: ["marketingActivityDetail"] });
      addToast({
        title: "Success",
        description: "Activity updated successfully.",
        color: "success",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to update activity";
      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};

export const useDeleteActivity = () => {
  return useMutation<DeleteActivityResponse, any, string>({
    mutationFn: (id: string) => deleteMarketingActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketingActivities"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      addToast({
        title: "Success",
        description: "Activity deleted successfully.",
        color: "success",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to delete activity";
      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};
