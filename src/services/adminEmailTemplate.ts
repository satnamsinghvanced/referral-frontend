import axios from "./axios";
import { CampaignTemplate } from "../types/campaign";

export interface AdminEmailTemplatesStats {
  totalTemplates: number;
  popularCount: number;
  categoriesCount: number;
  totalUsage: number;
}

export interface AdminEmailTemplatesResponse {
  templates: CampaignTemplate[];
  total: number;
  stats: AdminEmailTemplatesStats;
}

export const fetchAdminEmailTemplates = async (params?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<AdminEmailTemplatesResponse> => {
  const response = await axios.get("/superadmin/email-templates", { params });
  return response.data;
};

export const fetchAdminEmailTemplateById = async (id: string): Promise<CampaignTemplate> => {
  const response = await axios.get(`/superadmin/email-templates/${id}`);
  return response.data;
};

export const createAdminEmailTemplate = async (formData: FormData): Promise<CampaignTemplate> => {
  const response = await axios.post("/superadmin/email-templates", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateAdminEmailTemplate = async (
  id: string,
  formData: FormData
): Promise<CampaignTemplate> => {
  const response = await axios.put(`/superadmin/email-templates/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteAdminEmailTemplate = async (id: string): Promise<void> => {
  await axios.delete(`/superadmin/email-templates/${id}`);
};
