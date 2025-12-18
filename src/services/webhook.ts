import {
  CreateIntegrationKeyBody,
  CreateIntegrationKeyResponse,
  CreateWebhookBody,
  IntegrationKey,
  UpdateWebhookBody,
  UpdateWebhookResponse,
  WebhookSubscription,
} from "../types/webhook";
import axios from "./axios";

export const createIntegrationKey = async (
  body: CreateIntegrationKeyBody
): Promise<CreateIntegrationKeyResponse> => {
  const response = await axios.post(`/integration_keys`, body);
  return response.data;
};

export const getIntegrationKeys = async (): Promise<IntegrationKey[]> => {
  const response = await axios.get(`/integration_keys/`);
  return [response.data as IntegrationKey];
};

export const deleteIntegrationKey = async (keyId: string): Promise<void> => {
  await axios.delete(`/integration_keys/${keyId}`);
};

export const createWebhook = async (
  body: CreateWebhookBody
): Promise<WebhookSubscription> => {
  const response = await axios.post(`/webhook`, body);
  return response.data;
};

export const getWebhooks = async (): Promise<WebhookSubscription[]> => {
  const response = await axios.get(`/webhook`);
  return response.data;
};

export const updateWebhook = async (
  webhookId: string,
  body: UpdateWebhookBody
): Promise<UpdateWebhookResponse> => {
  const response = await axios.put(`/webhook/${webhookId}`, body);
  return response.data;
};

export const deleteWebhook = async (webhookId: string): Promise<void> => {
  await axios.delete(`/webhook/${webhookId}`);
};
