import axios from "./axios";

export const getFacebookConversations = async (): Promise<any> => {
  const { data } = await axios.get("/conversations/facebook");
  return data;
};

export const sendFacebookMessage = async (
  recipientId: string,
  text: string
): Promise<any> => {
  const { data } = await axios.post("/conversations/facebook", {
    recipientId,
    text,
  });
  return data;
};

export const markFacebookSeen = async (
  recipientId: string
): Promise<any> => {
  const { data } = await axios.post("/conversations/facebook/seen", {
    recipientId,
  });
  return data;
};
