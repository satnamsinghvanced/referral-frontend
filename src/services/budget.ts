import {
  BudgetCategory,
  BudgetItem,
  BudgetListResponse,
  CreateBudgetItemRequest,
  FetchBudgetItemsParams,
  UpdateBudgetItemRequest,
} from "../types/budget";
import axios from "./axios";

export const getBudgetCategories = async (): Promise<BudgetCategory[]> => {
  const response = await axios.get("/budget-category/");
  return response.data;
};
export const getBudgetItems = async (
  params: FetchBudgetItemsParams
): Promise<BudgetListResponse> => {
  const response = await axios.get("/marketing-budget", { params });
  return response.data;
};
export const getBudgetItemById = async (id: string): Promise<BudgetItem> => {
  const response = await axios.get(`/marketing-budget/${id}`);
  return response.data;
};
export const createBudgetItem = async (
  data: CreateBudgetItemRequest
): Promise<BudgetItem> => {
  const response = await axios.post("/marketing-budget/", data);
  return response.data;
};
export const updateBudgetItem = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateBudgetItemRequest;
}): Promise<BudgetItem> => {
  const response = await axios.put(`/marketing-budget/${id}`, data);
  return response.data;
};
export const deleteBudgetItem = async (id: string): Promise<void> => {
  await axios.delete(`/marketing-budget/${id}`);
};
export const importBudgetItemsCSV = async (
  formData: FormData
): Promise<any> => {
  const response = await axios.post("/marketing-budget/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const exportBudgetItems = async ({
  type,
  period,
  startDate,
  endDate,
}: {
  type: "csv" | "excel" | "pdf";
  period?: string;
  startDate?: string;
  endDate?: string;
}): Promise<Blob> => {
  const response = await axios.post(
    "/marketing-budget/export",
    { type, period, startDate, endDate },
    {
      responseType: "blob",
    }
  );
  return response as any;
};
