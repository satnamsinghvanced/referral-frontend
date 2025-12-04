import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";
import {
  CreateBudgetItemRequest,
  FetchBudgetItemsParams,
  UpdateBudgetItemRequest,
} from "../types/budget";
import {
  createBudgetItem,
  deleteBudgetItem,
  getBudgetCategories,
  getBudgetItemById,
  getBudgetItems,
  updateBudgetItem,
} from "../services/budget";

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
      queryClient.invalidateQueries({
        queryKey: ["budget-items"],
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
      queryClient.invalidateQueries({
        queryKey: ["budget-items"],
      });
      queryClient.invalidateQueries({
        queryKey: BUDGET_ITEM_QUERY_KEY(itemId),
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
      queryClient.invalidateQueries({
        queryKey: BUDGET_LIST_QUERY_KEY(listQueryParams),
      });
    },
  });
};
