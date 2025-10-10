// src/hooks/useReferral.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { queryClient } from "../providers/QueryProvider";
import { addToast } from "@heroui/react";
import {
  Referral,
  Referrer,
  createReferral,
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

// ---------------------------
// 🔹 Referrals
// ---------------------------

// Fetch list of referrals
export const useFetchReferrals = ({
  search = "",
  page = 1,
  limit = 10,
}: {
  search?: string;
  page?: number;
  limit?: number;
}) =>
  useQuery<Referral[], Error>({
    queryKey: ["referrals", search, page, limit],
    queryFn: () => fetchReferrals(search, page, limit),
  });

// Get referral by ID
export const useGetReferralById = (id: string) =>
  useQuery<Referral, Error>({
    queryKey: ["referral", id],
    queryFn: () => getReferralById(id),
  });

// Create a new referral
export const useCreateReferral = () =>
  useMutation<Referral, AxiosError, Partial<Referral>>({
    mutationFn: (payload) => createReferral(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
      addToast({
        title: "Success",
        description: "Referral created",
        color: "success",
      });
    },
    onError: (error: AxiosError) => {
      const message =
        (error.response?.data as any)?.message ||
        error.message ||
        "Failed to create referral";
      addToast({ title: "Error", description: message, color: "danger" });
    },
  });

// Update referral
export const useUpdateReferral = () =>
  useMutation<Referral, AxiosError, { id: string; payload: Partial<Referral> }>(
    {
      mutationFn: ({ id, payload }) => updateReferral(id, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["referrals"] });
        addToast({
          title: "Success",
          description: "Referral updated",
          color: "success",
        });
      },
      onError: (error: AxiosError) => {
        const message =
          (error.response?.data as any)?.message ||
          error.message ||
          "Failed to update referral";
        addToast({ title: "Error", description: message, color: "danger" });
      },
    }
  );

// Delete referral
export const useDeleteReferral = () =>
  useMutation<Referral, AxiosError, string>({
    mutationFn: (id) => deleteReferral(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
      addToast({
        title: "Success",
        description: "Referral deleted",
        color: "success",
      });
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
}: {
  filter?: string;
  page?: number;
  limit?: number;
}) =>
  useQuery<Referrer[], Error>({
    queryKey: ["referrers", filter, page, limit],
    queryFn: () => fetchReferrers(filter, page, limit),
  });



// Get referrer by ID
export const useGetReferrerById = (id: string) =>
  useQuery<Referrer, Error>({
    queryKey: ["referrer", id],
    queryFn: () => getReferrerById(id),
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
      queryClient.invalidateQueries({ queryKey: ["referrers"] });
      addToast({
        title: "Success",
        description: "Referrer created",
        color: "success",
      });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referrers"] });
      addToast({
        title: "Success",
        description: "Referrer updated",
        color: "success",
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
      queryClient.invalidateQueries({ queryKey: ["referrers"] });
      addToast({
        title: "Success",
        description: "Referrer deleted",
        color: "success",
      });
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
      queryClient.invalidateQueries({ queryKey: ["trackings"] });
      addToast({
        title: "Success",
        description: "Tracking created",
        color: "success",
      });
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
      queryClient.invalidateQueries({ queryKey: ["trackings"] });
      addToast({
        title: "Success",
        description: "Tracking updated",
        color: "success",
      });
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
export const useFetchTrackings = (page = 1, limit = 10) =>
  useQuery<any[], Error>({
    queryKey: ["trackings", page, limit],
    queryFn: () => fetchTrackings(page, limit),
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
