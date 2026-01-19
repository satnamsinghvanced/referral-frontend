import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/react";
import { AxiosError } from "axios";
import {
  login,
  LoginPayload,
  LoginResponse,
  verify2FA,
  Verify2FAPayload,
} from "../services/auth";
import { setCredentials } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

export function useLogin() {
  return useMutation<LoginResponse, AxiosError, LoginPayload>({
    mutationFn: (payload) => login(payload),
    onSuccess: (data) => {
      if (!data.twoFactorRequired) {
        addToast({
          title: "Success",
          description: "Login successful!",
          color: "success",
        });
      }
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

export function useVerify2FA() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation<LoginResponse, AxiosError, Verify2FAPayload>({
    mutationFn: (payload) => verify2FA(payload),
    onSuccess: (response) => {
      dispatch(
        setCredentials({
          token: response?.accessToken || "",
        }),
      );
      addToast({
        title: "Success",
        description: "Verification successful!",
        color: "success",
      });
      navigate("/");
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
