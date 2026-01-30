import {
  AudienceFilters,
  AudienceResponse,
  AudienceSegment,
  CampaignFilters,
  CampaignTemplate,
  CampaignTemplatesResponse,
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
): Promise<{ data: CampaignTemplate }> => {
  const response = await axios.get(`${"/campaigns_templates"}/${id}`);
  return response.data;
};

export const createCampaignTemplate = async (
  formData: FormData,
): Promise<{ data: CampaignTemplate }> => {
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
