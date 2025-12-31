import { addToast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { fetchUserForTrackings } from "../../services/referralBypassFunction";
import { fetchUser, updateUser, User } from "../../services/settings/user";
import { store } from "../../store";
import { logout } from "../../store/authSlice";

export function useFetchUser(id: string) {
  return useQuery<User, AxiosError>({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
    // @ts-ignore - onError is deprecated in v5 but keeping for backward compatibility if needed, or it might be v4
    onError: () => {
      store.dispatch(logout());
      window.location.href = `${import.meta.env.VITE_URL_PREFIX}/signin`;
    },
  });
}

export function useFetchUserForTrackings(id: string) {
  return useQuery<User, AxiosError>({
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
        (error.response?.data as { message?: string })?.message ||
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
