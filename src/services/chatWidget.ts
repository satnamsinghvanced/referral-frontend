import axios from "./axios";

export interface ChatWidgetConfig {
  _id?: string;
  userId?: string;
  businessName: string;
  bubbleText: string;
  primaryColor?: string;
  widgetPosition?: string;
  bubbleIcon?: string;
  logoUrl?: string;
  welcomeMessage: string;
  welcomeDelay: number;
  enableAutoReply?: boolean;
  autoReplyMessage?: string;
  offlineMessage: string;
  workingHours?: boolean;
  enableSmsTransition?: boolean;
  smsPromptMessage?: string;
  smsConsentText?: string;
  triggerAfterMessages?: boolean;
  triggerOnScheduling?: boolean;
  triggerImmediately?: boolean;
  hipaaMode?: boolean;
  requirePatientConsent?: boolean;
  privacyPolicyUrl?: string;
  dataRetentionPeriod: number;
  requireName?: boolean;
  requireEmail?: boolean;
  requirePhone?: boolean;
  selectedPlatform?: string;
}

export const fetchChatWidgetConfig = async (): Promise<{
  success: boolean;
  message: string;
  data: ChatWidgetConfig;
}> => {
  const response: any = await axios.get("/chat-widget");
  return response;
};

export const saveChatWidgetConfig = async (
  payload: ChatWidgetConfig
): Promise<{
  success: boolean;
  message: string;
  data: ChatWidgetConfig;
}> => {
  const response: any = await axios.post("/chat-widget", payload);
  return response;
};

export interface ChatWidgetStatsData {
  activeWebsites: number;
  totalConversations: number;
  smsOptIns: number;
  avgResponseTime: string;
}

export const fetchChatWidgetStats = async (): Promise<{
  success: boolean;
  message: string;
  data: ChatWidgetStatsData;
}> => {
  const response: any = await axios.get("/chat-widget/stats");
  return response;
};

export const getWebConversations = async (): Promise<any> => {
  const { data } = await axios.get("/chat-widget/conversations");
  return data;
};

export const sendWebMessage = async (
  leadId: string,
  text: string
): Promise<any> => {
  const { data } = await axios.post("/chat-widget/reply", {
    leadId,
    text,
  });
  return data;
};
