export interface BudgetCategory {
  _id: string;
  title: string;
  subCategory: SubCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  _id: string;
  subCategory: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCategoryRef {
  _id: string;
  category: string;
}

export interface SubCategoryRef {
  _id: string;
  subCategory: string;
}

export interface BudgetItem {
  _id: string;
  userId: string;
  category: string | BudgetCategoryRef;
  subCategory: string | SubCategoryRef;
  amount: number;
  spent: string | number;
  remainingBudget: string | number;
  budgetUtilization: string | number;
  roi: string | number;
  conversions: number;
  conversionsValue?: string;
  currency?: string;
  type?: "google" | "meta" | "tiktok" | "local";
  status: string;
  startDate: string | null;
  endDate: string | null;
  period?: string;
  priority?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetStats {
  totalBudget: string;
  totalSpent: {
    value: string;
    percentage: string;
    status?: "increment" | "decrement";
  };
  remainingBudget: {
    value: string;
    percentage: string;
    status?: "increment" | "decrement";
  };
  budgetUtilization: string;
  avgROI: string;
}

export interface MonthlyBudgetGraphItem {
  month: string;
  budget: string;
  spend: string;
}

export interface BudgetByCategoryItem {
  name: string;
  amount: string;
  [key: string]: any;
}

export interface BudgetGraphs {
  monthlyBudgetGraph: MonthlyBudgetGraphItem[];
  budgetByCategory: BudgetByCategoryItem[];
}

export interface BudgetListResponse {
  budgets: BudgetItem[];
  stats: BudgetStats;
  graphs: BudgetGraphs;
  pagination: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateBudgetItemRequest {
  category: string; // ID
  subCategory: string; // ID
  amount: number;
  period: string;
  priority: string;
  status: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  spent?: number;
  roi?: number;
}

export type UpdateBudgetItemRequest = CreateBudgetItemRequest;

export interface FetchBudgetItemsParams {
  period: string;
  page: number;
  limit: number;
}
