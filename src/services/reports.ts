import axios from "./axios";
import {
  GenerateReportPayload,
  ReportsResponse,
  Report,
  UpdateReportPayload,
} from "../types/reports";

export const fetchReports = async (params: any): Promise<ReportsResponse> => {
  const response = await axios.get("/reports", {
    params,
  });
  return response.data;
};

export const createReport = async (
  payload: GenerateReportPayload,
): Promise<{ report: Report }> => {
  const response = (await axios.post("/reports", payload)) as any;
  return response.data;
};

export const updateReport = async (
  id: string,
  payload: UpdateReportPayload,
): Promise<{ report: Report }> => {
  const response = await axios.patch(`/reports/${id}`, payload);
  return response.data;
};
