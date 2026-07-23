import axios from "./axios";

export const getLeadStatus = async (params?: any): Promise<any> => {
  const response: any = await axios.get<any>("/lead/status", { params });
  return response.data;
};

export const addLead = async (leadData: any): Promise<any> => {
  const response = await axios.post("/lead", leadData);
  return response.data;
};

export const getLeadStats = async (): Promise<any> => {
  const response = await axios.get("/lead/stats");
  return response.data;
};

export const updateLead = async ({
  id,
  data,
}: {
  id: string;
  data: any;
}): Promise<any> => {
  const response = await axios.put(`/lead/${id}`, data);
  return response.data;
};

export const sendLeadEmail = async ({
  id,
  subject,
  body,
}: {
  id: string;
  subject: string;
  body: string;
}): Promise<any> => {
  const response = await axios.post(`/lead/send-email/${id}`, { subject, body });
  return response.data;
};

export const sendLeadSms = async ({
  id,
  body,
}: {
  id: string;
  body: string;
}): Promise<any> => {
  const response = await axios.post(`/lead/send-sms/${id}`, { body });
  return response.data;
};

export const sendLeadAppointment = async ({
  id,
  appointmentType,
  date,
  time,
  provider,
  notes,
}: {
  id: string;
  appointmentType: string;
  date: string;
  time: string;
  provider: string;
  notes?: string;
}): Promise<any> => {
  const response = await axios.post(`/lead/send-appointment/${id}`, {
    appointmentType,
    date,
    time,
    provider,
    notes,
  });
  return response.data;
};

export const sendLeadQuote = async ({
  id,
  lineItems,
  personalNote,
  sendType,
}: {
  id: string;
  lineItems: any[];
  personalNote?: string;
  sendType?: "email" | "sms" | "both";
}): Promise<any> => {
  const response = await axios.post(`/lead/send-quote/${id}`, { lineItems, personalNote, sendType });
  return response.data;
};


export const getLeadCommunicationHistory = async (id: string): Promise<any> => {
  const response = await axios.get(`/lead/communication-history/${id}`);
  return response.data;
};

export const reorderLeads = async (data: {
  status?: string;
  leadIds?: string[];
  leadId?: string;
  targetStatus?: string;
  targetIds?: string[];
  sourceStatus?: string;
  sourceIds?: string[];
}): Promise<any> => {
  const response = await axios.put("/lead/reorder", data);
  return response.data;
};

export const deleteLead = async (id: string): Promise<any> => {
  const response = await axios.delete(`/lead/${id}`);
  return response.data;
};

export const exportLeadsPDF = async (params?: any): Promise<Blob> => {
  const response = await axios.get("/lead/export/pdf", {
    params,
    responseType: "blob",
  });
  return response as any;
};
