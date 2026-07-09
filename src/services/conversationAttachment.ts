import axios from "./axios";

export const uploadChatAttachment = async (file: File): Promise<{
  success: boolean;
  message: string;
  data: {
    name: string;
    url: string;
    type: string;
  };
}> => {
  const formData = new FormData();
  formData.append("file", file);

  const response: any = await axios.post("/conversations/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data || response;
};
