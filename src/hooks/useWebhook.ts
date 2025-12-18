import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createIntegrationKey,
  getIntegrationKeys,
  deleteIntegrationKey,
  createWebhook,
  getWebhooks,
  updateWebhook,
  deleteWebhook,
} from "../services/webhook";
import {
  CreateIntegrationKeyBody,
  CreateIntegrationKeyResponse,
  IntegrationKey,
  CreateWebhookBody,
  WebhookSubscription,
  UpdateWebhookBody,
  UpdateWebhookResponse,
} from "../types/webhook";

export const queryKeys = {
  integrationKeys: ["integrationKeys"],
  webhooks: ["webhooks"],
};

export function useIntegrationKeys() {
  return useQuery<IntegrationKey[]>({
    queryKey: queryKeys.integrationKeys,
    queryFn: getIntegrationKeys,
  });
}

export function useCreateIntegrationKey() {
  const queryClient = useQueryClient();
  return useMutation<
    CreateIntegrationKeyResponse,
    Error,
    CreateIntegrationKeyBody
  >({
    mutationFn: createIntegrationKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.integrationKeys });
    },
  });
}

export function useDeleteIntegrationKey() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteIntegrationKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.integrationKeys });
    },
  });
}

export function useWebhooks() {
  return useQuery<WebhookSubscription[]>({
    queryKey: queryKeys.webhooks,
    queryFn: getWebhooks,
  });
}

export function useCreateWebhook() {
  const queryClient = useQueryClient();
  return useMutation<WebhookSubscription, Error, CreateWebhookBody>({
    mutationFn: createWebhook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks });
    },
  });
}

export function useUpdateWebhook() {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateWebhookResponse,
    Error,
    { id: string; body: UpdateWebhookBody }
  >({
    mutationFn: ({ id, body }) => updateWebhook(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks });
    },
  });
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteWebhook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks });
    },
  });
}
