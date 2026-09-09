import axios from "./axios";

export const getFormTemplates = async (): Promise<any> => {
  const response = await axios.get("/lead-Tracking-form");
  return response;
};

export const createFormTemplate = async (templateData: { name: string; fields: any[] }): Promise<any> => {
  const response = await axios.post("/lead-Tracking-form", templateData);
  return response;
};

export const sendFormLink = async (payload: {
  leadId?: string;
  conversationId?: string;
  formName: string;
  fields: any[];
  sendType: "email" | "sms" | "both";
}): Promise<any> => {
  const response = await axios.post("/lead-Tracking-form/send", payload);
  return response;
};

export const getPublicForm = async (token: string): Promise<any> => {
  const response = await axios.get(`/lead-Tracking-form/public/${token}`);
  return response;
};

export const submitPublicForm = async (token: string, submittedData: Record<string, any>): Promise<any> => {
  const response = await axios.post(`/lead-Tracking-form/public/${token}/submit`, { submittedData });
  return response;
};
