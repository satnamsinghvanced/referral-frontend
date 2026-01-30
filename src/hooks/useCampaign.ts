import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../providers/QueryProvider";
import {
  createAudience,
  createCampaignTemplate,
  deleteAudience,
  deleteCampaignTemplate,
  getAllAudiences,
  getAudienceById,
  getCampaignTemplateById,
  getCampaignTemplates,
  importAudienceCsv,
  toggleFavoriteTemplate,
  updateAudience,
} from "../services/campaign";
import {
  AudienceFilters,
  AudienceSegment,
  CampaignFilters,
} from "../types/campaign";

export const CAMPAIGN_KEYS = {
  all: ["campaign-templates"] as const,
  list: (filters: CampaignFilters) =>
    [...CAMPAIGN_KEYS.all, "list", filters] as const,
  detail: (id: string) => [...CAMPAIGN_KEYS.all, "detail", id] as const,
};

// --- Queries ---

export function useCampaignTemplates(filters: CampaignFilters) {
  return useQuery({
    queryKey: CAMPAIGN_KEYS.list(filters),
    queryFn: () => getCampaignTemplates(filters),
  });
}

export function useCampaignTemplate(id: string) {
  return useQuery({
    queryKey: CAMPAIGN_KEYS.detail(id),
    queryFn: () => getCampaignTemplateById(id),
    enabled: !!id,
  });
}

// --- Mutations ---

export function useCreateCampaignTemplate() {
  return useMutation({
    mutationFn: createCampaignTemplate,
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Template created successfully",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_KEYS.all });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create template",
        color: "danger",
      });
    },
  });
}

export function useToggleFavoriteTemplate() {
  return useMutation({
    mutationFn: toggleFavoriteTemplate,
    onSuccess: (data) => {
      // Invalidate both the list and the specific detail to keep UI in sync
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_KEYS.all });
      addToast({
        title: "Success",
        description: "Favorites updated successfully",
        color: "success",
      });
    },
  });
}

export function useDeleteCampaignTemplate() {
  return useMutation({
    mutationFn: deleteCampaignTemplate,
    onSuccess: () => {
      addToast({
        title: "Deleted",
        description: "Template removed successfully",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_KEYS.all });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Failed to delete template",
        color: "danger",
      });
    },
  });
}

// AUDIENCE SEGMENT

export const useAudiences = (filters: AudienceFilters) => {
  return useQuery({
    queryKey: ["audiences", filters],
    queryFn: () => getAllAudiences(filters),
  });
};

export const useAudienceById = (id: string) => {
  return useQuery({
    queryKey: ["audience", id],
    queryFn: () => getAudienceById(id),
    enabled: !!id,
  });
};

export const useCreateAudience = () => {
  return useMutation({
    mutationFn: (newAudience: Partial<AudienceSegment>) =>
      createAudience(newAudience),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audiences"] });
    },
  });
};

export const useUpdateAudience = () => {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<AudienceSegment>;
    }) => updateAudience(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["audiences"] });
      queryClient.invalidateQueries({ queryKey: ["audience", data._id] });
    },
  });
};

export const useDeleteAudience = () => {
  return useMutation({
    mutationFn: (id: string) => deleteAudience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audiences"] });
    },
  });
};

export const useImportAudienceCsv = () => {
  return useMutation({
    mutationFn: (file: File) => importAudienceCsv(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audiences"] });
    },
  });
};
