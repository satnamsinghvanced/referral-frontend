import axios from "./axios";

export interface WebhookConfig {
  webhookUrl: string;
  secretKey?: string;
  status: "Connected" | "Disconnected";
  isActive?: boolean;
}

export const fetchWebhookConfig = async (): Promise<WebhookConfig> => {
  const response = await axios.get("/webhook/referral");
  return response.data;
};

export const generateWebhookSecret = async (): Promise<{
  webhookSecret: string;
  webhookUrl: string;
}> => {
  const response = await axios.post("/webhook/referral");
  return response.data;
};
