import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { queryClient } from "../providers/QueryProvider";
import {
  createReferrer,
  createTrackingSetup,
  deleteReferral,
  deleteReferrer,
  fetchReferrals,
  fetchReferrers,
  fetchTrackings,
  getReferralById,
  getReferrerById,
  logTrackingScan,
  updateReferral,
  updateReferrer,
  updateTracking,
} from "../services/referral";
import { createReferral, trackScan } from "../services/referralBypassFunction";
import {
  FetchReferrersParams,
  Referrer,
  ReferrersResponse,
} from "../types/partner";
import {
  Referral,
  ReferralsResponse,
  ScanTrackingParams,
  ScanTrackingResponse,
  TrackingRequestBody,
  TrackingResponseData,
} from "../types/referral";

interface FetchReferralsParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: string;
  source?: string;
}

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
  });

export const useGetReferralById = (id: string) =>
  useQuery<Referral, Error>({
    queryKey: ["referral", id],
    queryFn: () => getReferralById(id),
    enabled: !!id,
  });

export const useCreateReferral = () =>
  useMutation<Referral, any, Partial<Referral>>({
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
    onError: (error) => {
      const message =
        (error?.response?.data as any)?.message ||
        error.message ||
        "Failed to create referral";
      addToast({ title: "Error", description: message, color: "danger" });
    },
  });

export const useTrackScan = () =>
  useMutation<ScanTrackingResponse, Error, ScanTrackingParams>({
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

export const useFetchReferrers = ({
  filter = "",
  page = 1,
  limit = 10,
}: FetchReferrersParams) =>
  useQuery<ReferrersResponse, Error>({
    queryKey: ["referrers", filter, page, limit],
    queryFn: () => fetchReferrers({ filter, page, limit }),
  });

export const useGetReferrerById = (id: string) =>
  useQuery<Referrer, Error>({
    queryKey: ["referrers", id],
    queryFn: () => getReferrerById(id),
    enabled: !!id,
  });

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

export const useUpdateReferrer = () =>
  useMutation<
    Referrer,
    AxiosError,
    { id: string; type: string; payload: Partial<Referrer> }
  >({
    mutationFn: ({ id, type, payload }) => updateReferrer(id, type, payload),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Referrer updated successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["referrers"] });
      queryClient.invalidateQueries({ queryKey: ["partnerStats"] });
    },
    onError: (error: AxiosError) => {
      const message =
        (error.response?.data as any)?.message ||
        error.message ||
        "Failed to update referrer";
      addToast({ title: "Error", description: message, color: "danger" });
    },
  });

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

export const useCreateTrackingSetup = () =>
  useMutation<TrackingResponseData, any, TrackingRequestBody>({
    mutationFn: createTrackingSetup,
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Tracking created successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["trackings"] });
    },
    onError: (error) => {
      const message =
        (error.response?.data as any)?.message ||
        error.message ||
        "Failed to create tracking";
      addToast({ title: "Error", description: message, color: "danger" });
    },
  });

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

export const useFetchTrackings = (id: string) =>
  useQuery<TrackingResponseData, Error>({
    queryKey: ["trackings"],
    queryFn: () => fetchTrackings(id),
    enabled: !!id,
  });

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
