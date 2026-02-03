import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../providers/QueryProvider";
import {
  archiveCampaign,
  createAudience,
  createCampaign,
  createCampaignTemplate,
  deleteAudience,
  deleteCampaign,
  deleteCampaignTemplate,
  duplicateCampaign,
  getAllAudiences,
  getAllCampaigns,
  getAudienceById,
  getCampaignById,
  getCampaignTemplateById,
  getCampaignTemplates,
  getDashboardStats,
  getEmailAnalyticsAudience,
  getEmailAnalyticsCampaign,
  getEmailAnalyticsDevices,
  getEmailAnalyticsOverview,
  getEmailAnalyticsPerformance,
  importAudienceCsv,
  pauseCampaign,
  toggleFavoriteTemplate,
  updateAudience,
  updateCampaign,
} from "../services/campaign";
import {
  AudienceFilters,
  AudienceSegment,
  CampaignFilters,
  ICampaignFilters,
  ICampaignPayload,
} from "../types/campaign";

export const CAMPAIGN_KEYS = {
  all: ["campaigns"] as const,
  list: (filters: CampaignFilters) =>
    [...CAMPAIGN_KEYS.all, "list", filters] as const,
  detail: (id: string) => [...CAMPAIGN_KEYS.all, "detail", id] as const,
  stats: ["campaigns", "stats"] as const,
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

      addToast({
        title: "Success",
        description: "Audience created successfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create audience",
        color: "danger",
      });
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

      addToast({
        title: "Success",
        description: "Audience updated successfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update audience",
        color: "danger",
      });
    },
  });
};

export const useDeleteAudience = () => {
  return useMutation({
    mutationFn: (id: string) => deleteAudience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audiences"] });

      addToast({
        title: "Success",
        description: "Audience deleted successfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete audience",
        color: "danger",
      });
    },
  });
};

export const useImportAudienceCsv = () => {
  return useMutation({
    mutationFn: (file: File) => importAudienceCsv(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audiences"] });

      addToast({
        title: "Success",
        description: "Audience imported successfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to import audience",
        color: "danger",
      });
    },
  });
};

// CAMPAIGNS
export const useCampaigns = (filters: ICampaignFilters) => {
  return useQuery({
    queryKey: CAMPAIGN_KEYS.list(filters),
    queryFn: () => getAllCampaigns(filters),
  });
};

export const useCampaignDetails = (id: string) => {
  return useQuery({
    queryKey: CAMPAIGN_KEYS.detail(id),
    queryFn: () => getCampaignById(id),
    enabled: !!id,
  });
};

export const useCampaignDashboard = () => {
  return useQuery({
    queryKey: CAMPAIGN_KEYS.stats,
    queryFn: getDashboardStats,
  });
};

export const useCreateCampaign = () => {
  return useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_KEYS.all });

      addToast({
        title: "Success",
        description: "Campaign created successfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create campaign",
        color: "danger",
      });
    },
  });
};

export const useUpdateCampaign = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ICampaignPayload }) =>
      updateCampaign(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_KEYS.all });

      addToast({
        title: "Success",
        description: "Campaign updated successfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update campaign",
        color: "danger",
      });
    },
  });
};

export const useDuplicateCampaign = () => {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => duplicateCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_KEYS.all });

      addToast({
        title: "Success",
        description: "Campaign duplicated successfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to duplicate campaign",
        color: "danger",
      });
    },
  });
};

export const useArchiveCampaign = () => {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => archiveCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_KEYS.all });

      addToast({
        title: "Success",
        description: "Campaign archived successfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to archive campaign",
        color: "danger",
      });
    },
  });
};

export const usePauseCampaign = () => {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => pauseCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_KEYS.all });

      addToast({
        title: "Success",
        description: "Campaign paused successfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to pause campaign",
        color: "danger",
      });
    },
  });
};

export const useDeleteCampaign = () => {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_KEYS.all });

      addToast({
        title: "Success",
        description: "Campaign deleted successfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete campaign",
        color: "danger",
      });
    },
  });
};

export const ANALYTICS_KEYS = {
  all: ["analytics"] as const,
  overview: () => [...ANALYTICS_KEYS.all, "overview"] as const,
  performance: () => [...ANALYTICS_KEYS.all, "performance"] as const,
  audience: () => [...ANALYTICS_KEYS.all, "audience"] as const,
  devices: () => [...ANALYTICS_KEYS.all, "devices"] as const,
  campaign: (id: string) => [...ANALYTICS_KEYS.all, "campaign", id] as const,
};

export const useAnalyticsOverview = () => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.overview(),
    queryFn: getEmailAnalyticsOverview,
  });
};

export const useAnalyticsPerformance = () => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.performance(),
    queryFn: getEmailAnalyticsPerformance,
  });
};

export const useAnalyticsAudience = () => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.audience(),
    queryFn: getEmailAnalyticsAudience,
  });
};

export const useAnalyticsDevices = () => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.devices(),
    queryFn: getEmailAnalyticsDevices,
  });
};

export const useCampaignAnalytics = (id: string) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.campaign(id),
    queryFn: () => getEmailAnalyticsCampaign(id),
    enabled: !!id, // Only run if ID is provided
  });
};
