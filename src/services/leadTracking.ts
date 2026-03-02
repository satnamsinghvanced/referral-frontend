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
