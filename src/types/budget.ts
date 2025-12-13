export interface BudgetCategory {
  _id: string;
  createdBy: string;
  title: string;
  subCategories: SubCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  _id: string;
  createdBy: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface BudgetReference {
  _id: string;
  title: string;
  color: string;
}

export interface BudgetItem {
  _id: string;
  createdBy: {
    _id: string;
    email: string;
  };
  marketingCategory: BudgetReference;
  subCategory: BudgetReference;
  budget: number;
  period: string; // e.g., "yearly", "monthly"
  priority: string; // e.g., "high", "medium"
  status: string; // e.g., "active", "paused"
  description: string;
  spent: number;
  progressBar: number; // Percentage
  roi: number;
  startDate: string; // ISO 8601 Date String
  endDate: string; // ISO 8601 Date String
  createdAt: string;
  updatedAt: string;
  remainingBudget: number;
  color?: string;
}

export interface BudgetListResponse {
  budgetItems: BudgetItem[];
  monthlyStats: any;
  budgetByCategoryGraph: any;
  stats: {
    totalBudget: number;
    totalSpent: number;
    remainingBudget: number;
    averageROI: number;
  };
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface CreateBudgetItemRequest {
  marketingCategory: string; // ID
  subCategory: string; // ID
  budget: number;
  period: string;
  priority: string;
  status: string;
  description: string;
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
}

export type UpdateBudgetItemRequest = CreateBudgetItemRequest;

export interface FetchBudgetItemsParams {
  period: string; // e.g., 'yearly', 'monthly'
  page: number;
  limit: number;
}
