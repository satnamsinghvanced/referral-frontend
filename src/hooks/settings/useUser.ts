import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { queryClient } from "../../providers/QueryProvider";
import { fetchUserForTrackings } from "../../services/referralBypassFunction";
import { fetchUser, updateUser, User } from "../../services/settings/user";
import { store } from "../../store";
import { handleLogoutThunk } from "../../store/authSlice";
import { useUpload } from "../../providers/UploadProvider";

export function useFetchUser(id: string) {
  return useQuery<User, AxiosError>({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
    // @ts-ignore
    onError: () => {
      store.dispatch(handleLogoutThunk());
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
  const { completeManualUpload } = useUpload();
  return useMutation<
    User,
    AxiosError,
    {
      userData: Partial<User>;
      onUploadProgress?: (progressEvent: any) => void;
      signal?: AbortSignal;
      uploadId?: string;
    }
  >({
    mutationFn: ({ userData, onUploadProgress, signal }) =>
      updateUser(id, userData, onUploadProgress, signal),
    onSuccess: (data, variables) => {
      if (variables.uploadId) {
        completeManualUpload(variables.uploadId, "completed");
      }
      addToast({
        title: "Success",
        description: "Profile updated successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
    onError: (error, variables) => {
      if (variables.uploadId) {
        completeManualUpload(variables.uploadId, "error");
      }
      const status = error.response?.status;
      const data = error.response?.data as { message?: string; code?: string };
      let errorMessage =
        data?.message || error.message || "Failed to update user profile";
      if (status === 413) {
        errorMessage =
          "The profile image is too large. Please upload a smaller image.";
      } else if (status === 400 && data?.code === "LIMIT_FILE_SIZE") {
        errorMessage = "Profile image exceeds the maximum size limit.";
      }
      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
}
