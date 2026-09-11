import axios from "./axios";

export interface PlanFeatureItem {
  _id?: string;
  name: string;
  isEnabled: boolean;
  description?: string | undefined;
}

export interface FeatureData {
  _id?: string;
  name: string;
  description?: string | undefined;
  isEnabled: boolean;
  plans?: string[];
  category?: string | undefined;
  order?: number | undefined;
}

export interface MonthlyPricing {
  price: number;
  discountPercent?: number;
  totalValue?: number;
  description: string;
}

export interface AnnualPricing {
  price: number;
  discountPercent: number;
  totalValue?: number;
  description: string;
}

export interface PlanData {
  _id?: string;
  planId: string;
  name: string;
  isPopular: boolean;
  monthlyPricing?: MonthlyPricing | undefined;
  annualPricing?: AnnualPricing | undefined;
  features?: PlanFeatureItem[] | undefined;
  price?: number | undefined;
  annualPrice?: number | undefined;
  discountPercent?: number | undefined;
  description?: string | undefined;
  yearlyDescription?: string | undefined;
  monthlyFeatures?: PlanFeatureItem[] | undefined;
  yearlyFeatures?: PlanFeatureItem[] | undefined;
  featuresList?: PlanFeatureItem[] | undefined;
  isActive?: boolean;
}

export const fetchPlansAndFeatures = async () => {
  const response = await axios.get("/plans");
  return response.data;
};

export const createPricingPlan = async (payload: Partial<PlanData>) => {
  const response = await axios.post("/superadmin/plans", payload);
  return response.data;
};

export const updatePricingPlan = async (id: string, payload: Partial<PlanData>) => {
  const response = await axios.put(`/superadmin/plans/${id}`, payload);
  return response.data;
};

export const deletePricingPlan = async (id: string) => {
  const response = await axios.delete(`/superadmin/plans/${id}`);
  return response.data;
};

export const addPlanFeatureItem = async (
  planId: string,
  feature: { name: string; isEnabled?: boolean; description?: string; cycle?: "monthly" | "yearly" }
) => {
  const response = await axios.post(`/superadmin/plans/${planId}/features`, feature);
  return response.data;
};

export const updatePlanFeatureItem = async (
  planId: string,
  featureId: string,
  payload: { name?: string; isEnabled?: boolean; description?: string; cycle?: "monthly" | "yearly" }
) => {
  const response = await axios.put(`/superadmin/plans/${planId}/features/${featureId}`, payload);
  return response.data;
};

export const togglePlanFeatureItemStatus = async (
  planId: string,
  featureId: string,
  isEnabled: boolean,
  cycle: "monthly" | "yearly" = "monthly"
) => {
  const response = await axios.patch(`/superadmin/plans/${planId}/features/${featureId}/toggle`, { isEnabled, cycle });
  return response.data;
};

export const deletePlanFeatureItem = async (
  planId: string,
  featureId: string,
  cycle: "monthly" | "yearly" = "monthly"
) => {
  const response = await axios.delete(`/superadmin/plans/${planId}/features/${featureId}?cycle=${cycle}`);
  return response.data;
};
