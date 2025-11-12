import { useMutation } from "@tanstack/react-query";
import {
  updatePassword,
  UpdatePasswordPayload,
} from "../../services/settings/security";
import { addToast } from "@heroui/react";
import { AxiosError } from "axios";

// ✅ Correct type order
export function useUpdatePassword() {
  return useMutation<void, AxiosError, UpdatePasswordPayload>({
    mutationFn: (payload) => updatePassword(payload),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Password updated successfully.",
        color: "success",
      });
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
