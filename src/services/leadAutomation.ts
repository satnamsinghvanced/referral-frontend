import axios from "./axios";

export const getLeadAutomations = async (): Promise<any> => {
  const response = await axios.get("/lead-automation");
  return response.data;
};

export const createLeadAutomation = async (data: any): Promise<any> => {
  const response = await axios.post("/lead-automation", data);
  return response.data;
};

export const updateLeadAutomation = async ({
  id,
  data,
}: {
  id: string;
  data: any;
}): Promise<any> => {
  const response = await axios.put(`/lead-automation/${id}`, data);
  return response.data;
};

export const deleteLeadAutomation = async (id: string): Promise<any> => {
  const response = await axios.delete(`/lead-automation/${id}`);
  return response.data;
};

export const toggleLeadAutomation = async (id: string): Promise<any> => {
  const response = await axios.patch(`/lead-automation/${id}/toggle`);
  return response.data;
};
