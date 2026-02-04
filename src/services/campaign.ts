import {
  AudienceFilters,
  AudienceResponse,
  AudienceSegment,
  CampaignFilters,
  CampaignTemplate,
  CampaignTemplatesResponse,
  IAnalyticsOverview,
  IAudienceAnalytics,
  IAutomation,
  IAutomationListResponse,
  IAutomationTemplate,
  ICampaign,
  ICampaignAnalytics,
  ICampaignFilters,
  ICampaignPayload,
  IDashboardStats,
  IDetailedPerformance,
  IDeviceAnalytics,
} from "../types/campaign";
import axios from "./axios";

// CAMPAIGN TEMPLATES

export const getCampaignTemplates = async (
  params: CampaignFilters,
): Promise<CampaignTemplatesResponse> => {
  const response = await axios.get("/campaigns_templates", { params });
  return response.data;
};

export const getCampaignTemplateById = async (
  id: string,
): Promise<CampaignTemplate> => {
  const response = await axios.get(`${"/campaigns_templates"}/${id}`);
  return response.data;
};

export const createCampaignTemplate = async (
  formData: FormData,
): Promise<CampaignTemplate> => {
  const response = await axios.post("/campaigns_templates", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const toggleFavoriteTemplate = async (
  id: string,
): Promise<CampaignTemplate> => {
  const response = await axios.patch(`/campaigns_templates/${id}/favorite`);
  return response.data;
};

export const deleteCampaignTemplate = async (id: string): Promise<void> => {
  await axios.delete(`/campaigns_templates/${id}`);
};

// AUDIENCE SEGMENT

export const getAllAudiences = async (
  params: AudienceFilters,
): Promise<AudienceResponse> => {
  const { data } = await axios.get("/audience_segment", { params });
  return data;
};

export const getAudienceById = async (id: string): Promise<AudienceSegment> => {
  const { data } = await axios.get(`/audience_segment/${id}`);
  return data;
};

export const createAudience = async (
  payload: Partial<AudienceSegment>,
): Promise<AudienceSegment> => {
  const { data } = await axios.post("/audience_segment", payload);
  return data;
};

export const updateAudience = async (
  id: string,
  payload: Partial<AudienceSegment>,
): Promise<AudienceSegment> => {
  const { data } = await axios.put(`/audience_segment/${id}`, payload);
  return data;
};

export const deleteAudience = async (id: string): Promise<void> => {
  await axios.delete(`/audience_segment/${id}`);
};

export const importAudienceCsv = async (file: File): Promise<void> => {
  const formData = new FormData();
  formData.append("file", file);
  await axios.post(`/audience_segment/import-csv`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getAllCampaigns = async (params: ICampaignFilters) => {
  const { data } = await axios.get<{ campaigns: ICampaign[]; pagination: any }>(
    "/campaigns",
    { params },
  );
  return data;
};

export const getCampaignById = async (id: string) => {
  const { data } = await axios.get<ICampaign>(`/campaigns/${id}`);
  return data;
};

export const createCampaign = async (payload: ICampaignPayload) => {
  const { data } = await axios.post<ICampaign>("/campaigns", payload);
  return data;
};

export const updateCampaign = async (id: string, payload: ICampaignPayload) => {
  const { data } = await axios.put<ICampaign>(`/campaigns/${id}`, payload);
  return data;
};

export const duplicateCampaign = async (id: string) => {
  const { data } = await axios.post<ICampaign>(`/campaigns/${id}/duplicate`);
  return data;
};

export const archiveCampaign = async (id: string) => {
  const { data } = await axios.patch<ICampaign>(`/campaigns/${id}/archive`);
  return data;
};

export const pauseCampaign = async (id: string) => {
  const { data } = await axios.patch<ICampaign>(`/campaigns/${id}/pause`);
  return data;
};

export const deleteCampaign = async (id: string) => {
  await axios.delete(`/campaigns/${id}`);
};

export const getDashboardStats = async () => {
  const { data } = await axios.get<IDashboardStats>(
    "/campaigns/dashboard-stats",
  );
  return data;
};

export const getEmailAnalyticsOverview = async (filter?: string) => {
  const { data } = await axios.get<IAnalyticsOverview>(
    "/email_analytics/overview",
    { params: { filter } },
  );
  return data;
};

export const getEmailAnalyticsPerformance = async (filter?: string) => {
  const { data } = await axios.get<IDetailedPerformance>(
    "/email_analytics/performance",
    { params: { filter } },
  );
  return data;
};

export const getEmailAnalyticsAudience = async (filter?: string) => {
  const { data } = await axios.get<IAudienceAnalytics>(
    "/email_analytics/audience",
    { params: { filter } },
  );
  return data;
};

export const getEmailAnalyticsDevices = async (filter?: string) => {
  const { data } = await axios.get<IDeviceAnalytics>(
    "/email_analytics/devices",
    { params: { filter } },
  );
  return data;
};

export const getEmailAnalyticsCampaign = async (id: string) => {
  const { data } = await axios.get<ICampaignAnalytics>(
    `/email_analytics/campaign/${id}`,
  );
  return data;
};

export const getEmailAnalyticsExport = async (filter: string) => {
  const response = await axios.get(`/email_analytics/export`, {
    params: { filter },
    responseType: "blob",
  });
  return response;
};

// GET List
export const getAutomations = async (
  page = 1,
  limit = 12,
  search?: string,
  status?: string,
) => {
  const { data } = await axios.get<IAutomationListResponse>("/automation", {
    params: { page, limit, search, status },
  });
  return data;
};

// GET Single
export const getAutomationById = async (id: string) => {
  const { data } = await axios.get<IAutomation>(`/automation/${id}`);
  return data;
};

// GET Templates
export const getTemplates = async () => {
  const { data } = await axios.get<IAutomationTemplate[]>(
    "/automation/templates",
  );
  return data;
};

// POST Create
export const createAutomation = async (payload: Partial<IAutomation>) => {
  const { data } = await axios.post<IAutomation>("/automation", payload);
  return data;
};

// PUT Update
export const updateAutomation = async (
  id: string,
  payload: Partial<IAutomation>,
) => {
  const { data } = await axios.put<IAutomation>(`/automation/${id}`, payload);
  return data;
};

// DELETE
export const deleteAutomation = async (id: string) => {
  await axios.delete(`/automation/${id}`);
  return id;
};

// POST Duplicate
export const duplicateAutomation = async (id: string) => {
  const { data } = await axios.post<IAutomation>(`/automation/${id}/duplicate`);
  return data;
};
