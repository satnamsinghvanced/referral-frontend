import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { queryClient } from "../providers/QueryProvider";
import {
  deleteAccount,
  exportAccountData,
  exportAnalytics,
  exportReferrals,
  exportReviews,
  login,
  LoginPayload,
  LoginResponse,
  verify2FA,
  Verify2FAPayload,
} from "../services/auth";
import { setCredentials } from "../store/authSlice";
import {
  AnalyticsExportResponse,
  ReferralExportItem,
  ReviewsExportResponse,
} from "../types/auth";

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
// Queries (Data fetching)
export const useExportReferrals = (enabled = false) =>
  useQuery<ReferralExportItem[]>({
    queryKey: ["export", "referrals"],
    queryFn: exportReferrals,
    enabled, // Typically triggered on button click, so disabled by default
  });

export const useExportAnalytics = (enabled = false) =>
  useQuery<AnalyticsExportResponse>({
    queryKey: ["export", "analytics"],
    queryFn: exportAnalytics,
    enabled,
  });

export const useExportReviews = (enabled = false) =>
  useQuery<ReviewsExportResponse>({
    queryKey: ["export", "reviews"],
    queryFn: exportReviews,
    enabled,
  });

// Mutations (Data actions)
export function useExportAccountData() {
  return useMutation({
    mutationFn: exportAccountData,
    onSuccess: (data) => {
      addToast({
        title: "Success",
        description:
          data.message || "Data export initiated. Please check your email.",
        color: "success",
      });
    },
    onError: (error: AxiosError) => {
      addToast({
        title: "Error",
        description:
          (error.response?.data as any)?.message || "Failed to export data",
        color: "danger",
      });
    },
  });
}

export function useExportReferralsMutation() {
  return useMutation({
    mutationFn: exportReferrals,
  });
}

export function useExportAnalyticsMutation() {
  return useMutation({
    mutationFn: exportAnalytics,
  });
}

export function useExportReviewsMutation() {
  return useMutation({
    mutationFn: exportReviews,
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      queryClient.clear();
      window.location.href = "/signin";
    },
    onError: (error: AxiosError) => {
      addToast({
        title: "Error",
        description:
          (error.response?.data as any)?.message || "Failed to delete account",
        color: "danger",
      });
    },
  });
}
