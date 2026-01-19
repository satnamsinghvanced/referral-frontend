import { useMutation } from "@tanstack/react-query";
import {
  updatePassword,
  UpdatePasswordPayload,
  verifyUpdatePassword,
  enable2FA,
  verifyEnable2FA,
  disable2FA,
} from "../../services/settings/security";
import { addToast } from "@heroui/react";
import { AxiosError } from "axios";

export function useUpdatePassword() {
  return useMutation<any, AxiosError, UpdatePasswordPayload>({
    mutationFn: (payload) => updatePassword(payload),
    onSuccess: (data) => {
      if (!data.twoFactorRequired) {
        addToast({
          title: "Success",
          description: "Password updated successfully.",
          color: "success",
        });
      }
    },
    onError: (error) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to update password";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
}

export function useVerifyUpdatePassword() {
  return useMutation<void, AxiosError, string>({
    mutationFn: (otp) => verifyUpdatePassword(otp),
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
        "Verification failed";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
}

export function useEnable2FA() {
  return useMutation<any, AxiosError, void>({
    mutationFn: () => enable2FA(),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Verification code sent to your phone.",
        color: "success",
      });
    },
    onError: (error) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to initiate 2FA";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
}

export function useVerifyEnable2FA() {
  return useMutation<any, AxiosError, string>({
    mutationFn: (otp) => verifyEnable2FA(otp),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "2FA enabled successfully.",
        color: "success",
      });
    },
    onError: (error) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Verification failed";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
}

export function useDisable2FA() {
  return useMutation<any, AxiosError, void>({
    mutationFn: () => disable2FA(),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "2FA disabled successfully.",
        color: "success",
      });
    },
    onError: (error) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to disable 2FA";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
}
