import axios from "./axios";

export interface ConversationQueryParams {
  locationId?: string;
  search?: string;
  q?: string;
  filter?: "all" | "unread" | "starred" | "archived" | "active" | string;
  status?: string;
  includeUnassigned?: boolean | string;
}

export const getInstagramConversations = async (params?: ConversationQueryParams): Promise<any> => {
  const { data } = await axios.get("/conversations/instagram", { params });
  return data;
};

export const sendInstagramMessage = async (
  recipientId: string,
  text: string,
  file?: { name: string; url: string; type: string },
  messaging_type: string = "MESSAGE_TAG",
  tag: string = "HUMAN_AGENT"
): Promise<any> => {
  const { data } = await axios.post("/conversations/instagram", {
    recipientId,
    text,
    file,
    messaging_type,
    tag,
  });
  return data;
};

export const markInstagramSeen = async (
  recipientId: string,
  conversationId?: string,
  lastMessageId?: string
): Promise<any> => {
  const { data } = await axios.post("/conversations/instagram/seen", {
    recipientId,
    conversationId,
    lastMessageId,
  });
  return data;
};

