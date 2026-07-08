import axios from "./axios";

export const getInstagramConversations = async (): Promise<any> => {
  const { data } = await axios.get("/conversations/instagram");
  return data;
};

export const sendInstagramMessage = async (
  recipientId: string,
  text: string,
  file?: { name: string; url: string; type: string }
): Promise<any> => {
  const { data } = await axios.post("/conversations/instagram", {
    recipientId,
    text,
    file,
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

