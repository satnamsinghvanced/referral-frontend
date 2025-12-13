import { addToast } from "@heroui/react";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  createBudgetItem,
  deleteBudgetItem,
  getBudgetCategories,
  getBudgetItemById,
  getBudgetItems,
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
  const queryClient = useQueryClient();
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
  const queryClient = useQueryClient();
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
  listQueryParams: FetchBudgetItemsParams
) => {
  const queryClient = useQueryClient();
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
