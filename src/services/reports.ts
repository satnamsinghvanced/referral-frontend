import axios from "./axios";
import {
  GenerateReportPayload,
  ReportsResponse,
  Report,
} from "../types/reports";

export const fetchReports = async (
  page = 1,
  limit = 10,
): Promise<ReportsResponse> => {
  const response = await axios.get("/reports", {
    params: { page, limit },
  });
  return response.data;
};

export const createReport = async (
  payload: GenerateReportPayload,
): Promise<{ report: Report }> => {
  const response = (await axios.post("/reports", payload)) as any;
  return response.data;
};
