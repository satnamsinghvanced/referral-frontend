import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUser, updateUser, User } from "../../services/settings/user";
import { addToast } from "@heroui/react";
import { AxiosError } from "axios";
import { fetchUserForTrackings } from "../../services/referralBypassFunction";

// 🔹 Get user detail
export function useFetchUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
    select: (data) => data.data,
  });
}

// 🔹 Get user detail for tracking
export function useFetchUserForTrackings(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserForTrackings(id),
    enabled: !!id,
  });
}

// 🔹 Update user detail
export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation<User, AxiosError, Partial<User>>({
    mutationFn: (userData) => updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      addToast({
        title: "Success",
        description: "Profile Updated",
        color: "success",
      });
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
