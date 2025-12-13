import { addToast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { fetchUserForTrackings } from "../../services/referralBypassFunction";
import { fetchUser, updateUser, User } from "../../services/settings/user";

export function useFetchUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
    select: (data) => data.data,
  });
}

export function useFetchUserForTrackings(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserForTrackings(id),
    enabled: !!id,
  });
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation<User, AxiosError, Partial<User>>({
    mutationFn: (userData) => updateUser(id, userData),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Profile updated successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
    onError: (error) => {
      const errorMessage =
        (error.response?.data as { error?: string })?.error ||
        error.message ||
        "Failed to update user profile";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
}
