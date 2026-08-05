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
    onMutate: async (newActivity: ActivityPayload) => {
      await queryClient.cancelQueries({ queryKey: ["marketingActivities"] });
      const previousData = queryClient.getQueriesData({
        queryKey: ["marketingActivities"],
      });
      const tempId = `temp-${Date.now()}`;
      const tempItem = {
        _id: tempId,
        ...newActivity,
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueriesData(
        { queryKey: ["marketingActivities"] },
        (old: any) => {
          if (!old) return old;
          const currentList = Array.isArray(old.data) ? old.data : [];
          return {
            ...old,
            data: [tempItem, ...currentList],
          };
        }
      );
      return { previousData };
    },
    onError: (error: any, _vars, context: any) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, val]: [any, any]) => {
          queryClient.setQueryData(key, val);
        });
      }
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["marketingActivities"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onSuccess: () => {
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

export const useUpdateActivity = () => {
  return useMutation({
    mutationFn: (payload: ActivityPayload) => updateMarketingActivity(payload),
    onMutate: async (updatedActivity: ActivityPayload & { id?: string; _id?: string }) => {
      await queryClient.cancelQueries({ queryKey: ["marketingActivities"] });
      const previousData = queryClient.getQueriesData({
        queryKey: ["marketingActivities"],
      });
      const targetId = updatedActivity._id || updatedActivity.id;
      queryClient.setQueriesData(
        { queryKey: ["marketingActivities"] },
        (old: any) => {
          if (!old || !Array.isArray(old.data)) return old;
          return {
            ...old,
            data: old.data.map((item: any) =>
              item._id === targetId || item.id === targetId
                ? { ...item, ...updatedActivity }
                : item
            ),
          };
        }
      );
      return { previousData };
    },
    onError: (error: any, _vars, context: any) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, val]: [any, any]) => {
          queryClient.setQueryData(key, val);
        });
      }
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["marketingActivities"] });
      queryClient.invalidateQueries({ queryKey: ["marketingActivityDetail"] });
    },
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Activity updated successfully.",
        color: "success",
      });
    },
  });
};

export const useDeleteActivity = () => {
  return useMutation<DeleteActivityResponse, any, any, { previousData: [any, any][] }>({
    mutationFn: (payload: any) =>
      deleteMarketingActivity(typeof payload === "string" ? payload : payload),
    onMutate: async (payload: any) => {
      await queryClient.cancelQueries({ queryKey: ["marketingActivities"] });
      const previousData = queryClient.getQueriesData({
        queryKey: ["marketingActivities"],
      });
      const targetId = typeof payload === "string" ? payload : payload?.eventId || payload?._id;
      queryClient.setQueriesData(
        { queryKey: ["marketingActivities"] },
        (old: any) => {
          if (!old || !Array.isArray(old.data)) return old;
          return {
            ...old,
            data: old.data.filter(
              (item: any) => item._id !== targetId && item.id !== targetId
            ),
          };
        }
      );
      return { previousData };
    },
    onError: (error: any, _vars, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, val]: [any, any]) => {
          queryClient.setQueryData(key, val);
        });
      }
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["marketingActivities"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Activity deleted successfully.",
        color: "success",
      });
    },
  });
};
