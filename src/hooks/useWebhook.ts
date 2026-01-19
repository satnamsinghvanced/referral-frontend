import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/react";
import {
  fetchWebhookConfig,
  generateWebhookSecret,
  WebhookConfig,
} from "../services/webhook";

export const useWebhookConfig = () => {
  return useQuery<WebhookConfig>({
    queryKey: ["webhookConfig"],
    queryFn: fetchWebhookConfig,
  });
};

export const useGenerateWebhookSecret = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateWebhookSecret,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhookConfig"] });
      addToast({
        title: "Success",
        description: "Webhook secret generated successfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to generate webhook secret",
        color: "danger",
      });
    },
  });
};
