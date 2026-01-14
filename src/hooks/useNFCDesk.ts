import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../providers/QueryProvider";
import { addToast } from "@heroui/react";
import { AxiosError } from "axios";
import {
  createNFCDesk,
  deleteNFCDesk,
  fetchNFCDesks,
  scanNFCDesk,
  updateNFCDesk,
  fetchNFCDeskById,
  submitNFCReview,
} from "../services/nfcDesk";
import { CreateNFCDeskPayload, UpdateNFCDeskPayload } from "../types/nfcDesk";

const NFC_DESK_KEY = ["nfc_desk"];

export const useFetchNFCDesks = (page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: [...NFC_DESK_KEY, { page, limit }],
    queryFn: () => fetchNFCDesks(page, limit),
  });

export const useCreateNFCDesk = () => {
  return useMutation({
    mutationFn: (payload: CreateNFCDeskPayload) => createNFCDesk(payload),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Tag created successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: NFC_DESK_KEY });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to create tag";
      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};

export const useUpdateNFCDesk = () => {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateNFCDeskPayload;
    }) => updateNFCDesk(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NFC_DESK_KEY });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to update tag";
      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};

export const useDeleteNFCDesk = () => {
  return useMutation({
    mutationFn: (id: string) => deleteNFCDesk(id),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Tag deleted successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: NFC_DESK_KEY });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to delete tag";
      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};

export const useScanNFCDesk = () => {
  return useMutation({
    mutationFn: (tagId: string) => scanNFCDesk(tagId),
  });
};

export const useFetchNFCDeskById = (tagId: string) =>
  useQuery({
    queryKey: [...NFC_DESK_KEY, tagId],
    queryFn: () => fetchNFCDeskById(tagId),
    enabled: !!tagId,
  });

export const useSubmitNFCReview = () => {
  return useMutation({
    mutationFn: ({
      tagId,
      payload,
    }: {
      tagId: string;
      payload: { locationId: string; review: string };
    }) => submitNFCReview(tagId, payload),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Review submitted successfully.",
        color: "success",
      });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to submit review";
      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};
