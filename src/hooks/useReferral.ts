// src/hooks/useReferral.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { queryClient } from "../providers/QueryProvider";
import { addToast } from "@heroui/react";
import {
  getReferralById,
  fetchReferrals,
  updateReferral,
  deleteReferral,
  createReferrer,
  fetchReferrers,
  getReferrerById,
  updateReferrer,
  deleteReferrer,
  createTracking,
  updateTracking,
  fetchTrackings,
  logTrackingScan,
} from "../services/referral";
import { createReferral, trackScan } from "../services/referralBypassFunction";
import {
  Referral,
  ReferralsResponse,
  ScanTrackingParams,
  ScanTrackingResponse,
} from "../types/referral";
import {
  FetchReferrersParams,
  Referrer,
  ReferrersResponse,
} from "../types/partner";

// ---------------------------
// 🔹 Referrals
// ---------------------------

interface FetchReferralsParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: string; // Added filter parameter
  source?: string; // Added source parameter
}

// Fetch list of referrals
export const useFetchReferrals = ({
  page = 1,
  limit = 20,
  search = "",
  filter = "",
  source = "",
}: FetchReferralsParams) =>
  useQuery<ReferralsResponse, Error>({
    queryKey: ["referrals", search, page, limit, filter, source],
    queryFn: () => fetchReferrals({ page, limit, search, filter, source }),
    // Optional: Add refetchOnWindowFocus, keepPreviousData, etc. as needed
  });

// Get referral by ID
export const useGetReferralById = (id: string) =>
  useQuery<Referral, Error>({
    queryKey: ["referral", id],
    queryFn: () => getReferralById(id),
    enabled: !!id,
  });

// Create a new referral
export const useCreateReferral = () =>
  useMutation<Referral, Error, Partial<Referral>>({
    mutationFn: (payload) => createReferral(payload),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Referral created successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: Error) => {
      const message =
        // @ts-ignore
        (error?.response?.data as any)?.message ||
        error.message ||
        "Failed to create referral";
      addToast({ title: "Error", description: message, color: "danger" });
    },
  });

export const useTrackScan = () => {
  return useMutation<ScanTrackingResponse, Error, ScanTrackingParams>({
    mutationFn: trackScan,
    onSuccess: (data, variables) => {
      console.log(
        `Scan tracked successfully for user ${variables.userId} via ${variables.source}`
      );
    },
    onError: (error) => {
      console.error("Error tracking scan:", error);
    },
  });
};

// Update referral
export const useUpdateReferral = () =>
  useMutation<Referral, AxiosError, { id: string; payload: any }>({
    mutationFn: ({ id, payload }) => updateReferral(id, payload),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Referral updated successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
    },
    onError: (error: AxiosError) => {
      const message =
        (error.response?.data as any)?.message ||
        error.message ||
        "Failed to update referral";
      addToast({ title: "Error", description: message, color: "danger" });
    },
  });

// Delete referral
export const useDeleteReferral = () =>
  useMutation<Referral, AxiosError, string>({
    mutationFn: (id) => deleteReferral(id),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Referral deleted successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: AxiosError) => {
      const message =
        (error.response?.data as any)?.message ||
        error.message ||
        "Failed to delete referral";
      addToast({ title: "Error", description: message, color: "danger" });
    },
  });

// ---------------------------
// 🔹 Referrers
// ---------------------------

// Fetch list of referrers
export const useFetchReferrers = ({
  filter = "",
  page = 1,
  limit = 10,
}: FetchReferrersParams) =>
  useQuery<ReferrersResponse, Error>({
    queryKey: ["referrers", filter, page, limit],
    queryFn: () => fetchReferrers({ filter, page, limit }),
  });

// Get referrer by ID
export const useGetReferrerById = (id: string) =>
  useQuery<Referrer, Error>({
    queryKey: ["referrers", id],
    queryFn: () => getReferrerById(id),
    enabled: !!id,
  });

// Create referrer
export const useCreateReferrer = () =>
  useMutation<
    Referrer,
    AxiosError,
    { id: string; type: string; payload: Partial<Referrer> }
  >({
    mutationFn: ({ id, type, payload }) => createReferrer(id, type, payload),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Referrer created successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["referrers"] });
      queryClient.invalidateQueries({ queryKey: ["partnerStats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: AxiosError) => {
      const message =
        (error.response?.data as any)?.message ||
        error.message ||
        "Failed to create referrer";
      addToast({ title: "Error", description: message, color: "danger" });
    },
  });

// Update referrer
export const useUpdateReferrer = () =>
  useMutation<
    Referrer,
    AxiosError,
    { id: string; type: string; payload: Partial<Referrer> }
  >({
    mutationFn: ({ id, type, payload }) => updateReferrer(id, type, payload),
    onSuccess: (data, variables) => {
      addToast({
        title: "Success",
        description: "Referrer updated successfully.",
        color: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["referrers"] });
      queryClient.invalidateQueries({ queryKey: ["partnerStats"] });
      queryClient.invalidateQueries({
        queryKey: ["partnerStats", variables.id],
      });
    },
    onError: (error: AxiosError) => {
      const message =
        (error.response?.data as any)?.message ||
        error.message ||
        "Failed to update referrer";
      addToast({ title: "Error", description: message, color: "danger" });
    },
  });

// Delete referrer
export const useDeleteReferrer = () =>
  useMutation<Referrer, AxiosError, string>({
    mutationFn: (id) => deleteReferrer(id),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Referrer deleted successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["referrers"] });
      queryClient.invalidateQueries({ queryKey: ["partnerStats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: AxiosError) => {
      const message =
        (error.response?.data as any)?.message ||
        error.message ||
        "Failed to delete referrer";
      addToast({ title: "Error", description: message, color: "danger" });
    },
  });

// ---------------------------
// 🔹 Tracking
// ---------------------------

// Create tracking (FormData)
export const useCreateTracking = () =>
  useMutation<any, AxiosError, { adminId: string; payload: FormData }>({
    mutationFn: ({ adminId, payload }) => createTracking(adminId, payload),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Tracking created successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["trackings"] });
    },
    onError: (error: AxiosError) => {
      const message =
        (error.response?.data as any)?.message ||
        error.message ||
        "Failed to create tracking";
      addToast({ title: "Error", description: message, color: "danger" });
    },
  });

// Update tracking
export const useUpdateTracking = () =>
  useMutation<any, AxiosError, { trackingId: string; payload: any }>({
    mutationFn: ({ trackingId, payload }) =>
      updateTracking(trackingId, payload),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Trackings updated successfully.",
        color: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["trackings"] });
    },
    onError: (error: AxiosError) => {
      const message =
        (error.response?.data as any)?.message ||
        error.message ||
        "Failed to update tracking";
      addToast({ title: "Error", description: message, color: "danger" });
    },
  });

// Fetch tracking list
export const useFetchTrackings = (id: any) =>
  useQuery<any[], Error>({
    queryKey: ["tracking", id],
    queryFn: () => fetchTrackings(id),
  });

// Log tracking scan
export const useLogTrackingScan = () =>
  useMutation<any, AxiosError, { trackingId: string; source: "QR" | "NFC" }>({
    mutationFn: ({ trackingId, source }) => logTrackingScan(trackingId, source),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trackings"] });
      addToast({
        title: "Success",
        description: "Scan logged",
        color: "success",
      });
    },
    onError: (error: AxiosError) => {
      const message =
        (error.response?.data as any)?.message ||
        error.message ||
        "Failed to log scan";
      addToast({ title: "Error", description: message, color: "danger" });
    },
  });
