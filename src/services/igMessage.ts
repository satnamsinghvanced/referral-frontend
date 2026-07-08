import axios from "./axios";

export const getInstagramConversations = async (): Promise<any> => {
  const { data } = await axios.get("/conversations/instagram");
  return data;
};

export const sendInstagramMessage = async (
  recipientId: string,
  text: string
): Promise<any> => {
  const { data } = await axios.post("/conversations/instagram", {
    recipientId,
    text,
  });
  return data;
};

export const markInstagramSeen = async (
  recipientId: string
): Promise<any> => {
  const { data } = await axios.post("/conversations/instagram/seen", {
    recipientId,
  });
  return data;
};

