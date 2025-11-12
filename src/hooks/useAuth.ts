import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/react";
import { AxiosError } from "axios";
import { login, LoginPayload, LoginResponse } from "../services/auth";

export function useLogin() {
  return useMutation<LoginResponse, AxiosError, LoginPayload>({
    mutationFn: (payload) => login(payload),
    onSuccess: (data) => {
      addToast({
        title: "Success",
        description: "Login successful!",
        color: "success",
      });
    },
    onError: (error) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to login";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
}
