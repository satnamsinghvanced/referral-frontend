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
import { addToast } from "@heroui/react";

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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["marketingActivities"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });

      addToast({
        title: "Success",
        description: "Activity created successfully.",
        color: "success",
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

export const useUpdateActivity = (activityId: string) => {
  return useMutation({
    mutationFn: (payload: ActivityPayload) =>
      updateMarketingActivity(activityId, payload),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Activity updated successfully.",
        color: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["marketingActivities"] });
      queryClient.invalidateQueries({
        queryKey: ["marketingActivityDetail", activityId],
      });
    },
  });
};

export const useDeleteActivity = () => {
  return useMutation<DeleteActivityResponse, Error, string>({
    mutationFn: (activityId: string) => deleteMarketingActivity(activityId),

    onSuccess: (data, variables) => {
      addToast({
        title: "Success",
        description: "Activity deleted successfully.",
        color: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["marketingActivities"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({
        queryKey: ["marketingActivityDetail", variables],
      });
    },
  });
};
