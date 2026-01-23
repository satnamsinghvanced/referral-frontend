import { addToast } from "@heroui/react";
import { QueryKey, useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { queryClient } from "../providers/QueryProvider";
import {
  createBudgetItem,
  deleteBudgetItem,
  exportBudgetItems,
  getBudgetCategories,
  getBudgetItemById,
  getBudgetItems,
  importBudgetItemsCSV,
  updateBudgetItem,
} from "../services/budget";
import {
  CreateBudgetItemRequest,
  FetchBudgetItemsParams,
  UpdateBudgetItemRequest,
} from "../types/budget";

const BUDGET_CATEGORY_QUERY_KEY: QueryKey = ["budget-categories"];
const BUDGET_LIST_QUERY_KEY = (params: FetchBudgetItemsParams) => [
  "budget-items",
  params,
];
const BUDGET_ITEM_QUERY_KEY = (id: string) => ["budget-item", id];

export const useBudgetCategories = () => {
  return useQuery({
    queryKey: BUDGET_CATEGORY_QUERY_KEY,
    queryFn: getBudgetCategories,
  });
};

export const useBudgetItems = (params: FetchBudgetItemsParams) => {
  return useQuery({
    queryKey: BUDGET_LIST_QUERY_KEY(params),
    queryFn: () => getBudgetItems(params),
  });
};

export const useBudgetItem = (id: string) => {
  return useQuery({
    queryKey: BUDGET_ITEM_QUERY_KEY(id),
    queryFn: () => getBudgetItemById(id),
    enabled: !!id,
  });
};

export const useCreateBudgetItem = () => {
  return useMutation({
    mutationFn: (data: CreateBudgetItemRequest) => createBudgetItem(data),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Budget item created successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["budget-items"],
      });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to create budget item";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};

export const useUpdateBudgetItem = (itemId: string) => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudgetItemRequest }) =>
      updateBudgetItem({ id, data }),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Budget item updated successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["budget-items"],
      });
      queryClient.invalidateQueries({
        queryKey: BUDGET_ITEM_QUERY_KEY(itemId),
      });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to update budget item";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};

export const useDeleteBudgetItem = (
  listQueryParams: FetchBudgetItemsParams,
) => {
  return useMutation({
    mutationFn: (id: string) => deleteBudgetItem(id),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Budget item deleted successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({
        queryKey: BUDGET_LIST_QUERY_KEY(listQueryParams),
      });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to delete budget item";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};

export const useImportBudgetItemsCSV = () => {
  return useMutation({
    mutationFn: (formData: FormData) => importBudgetItemsCSV(formData),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Budget items imported successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["budget-items"],
      });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to import budget items";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};

export const useExportBudgetItems = () => {
  return useMutation({
    mutationFn: (params: {
      type: "csv" | "excel" | "pdf";
      period?: string;
      startDate?: string;
      endDate?: string;
    }) => exportBudgetItems(params),
    onSuccess: (blob, variables) => {
      const { type } = variables;
      if (
        !blob ||
        !(blob as Blob).size ||
        (blob as Blob).type === "application/json"
      ) {
        addToast({
          title: "Error",
          description: "Invalid file format received from server.",
          color: "danger",
        });
        return;
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Set filename based on type
      const fileExtension = type === "excel" ? "xlsx" : type;
      a.download = `budget_export_${new Date().toISOString().split("T")[0]
        }.${fileExtension}`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      addToast({
        title: "Success",
        description: `Budget data exported successfully as ${type.toUpperCase()}.`,
        color: "success",
      });
    },
    onError: async (error: AxiosError) => {
      let errorMessage = "Failed to export budget items";

      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const data = JSON.parse(text);
          errorMessage = data.message || errorMessage;
        } catch (e) {
          console.error("Error parsing blob error response", e);
        }
      } else {
        errorMessage =
          (error.response?.data as { message?: string })?.message ||
          error.message ||
          errorMessage;
      }

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};
