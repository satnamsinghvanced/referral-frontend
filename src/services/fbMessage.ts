import axios from "./axios";

export const getFacebookConversations = async (): Promise<any> => {
  const { data } = await axios.get("/conversations/facebook");
  return data;
};

export const sendFacebookMessage = async (
  recipientId: string,
  text: string,
  file?: { name: string; url: string; type: string }
): Promise<any> => {
  const { data } = await axios.post("/conversations/facebook", {
    recipientId,
    text,
    file,
  });
  return data;
};

export const markFacebookSeen = async (
  recipientId: string,
  conversationId?: string,
  lastMessageId?: string
): Promise<any> => {
  const { data } = await axios.post("/conversations/facebook/seen", {
    recipientId,
    conversationId,
    lastMessageId,
  });
  return data;
};
