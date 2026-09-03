import axios from "./axios";

export interface IPhonePlanFeature {
  _id?: string;
  name: string;
  isEnabled: boolean;
}

export interface IPhonePlan {
  _id: string;
  planId: string;
  name: string;
  price: number;
  description: string;
  isPopular: boolean;
  callMinutes: number;
  textSegments: number;
  overageRate?: string | number;
  overageCallRate?: number;
  overageTextRate?: number;
  features?: IPhonePlanFeature[];
  isActive: boolean;
  order: number;
}

export const fetchPhonePlans = async (): Promise<IPhonePlan[]> => {
  const response = await axios.get("/superadmin/phone-plans");
  return response.data?.data || response.data || [];
};

export const createPhonePlan = async (data: Partial<IPhonePlan>): Promise<IPhonePlan> => {
  const response = await axios.post("/superadmin/phone-plans", data);
  return response.data?.data || response.data;
};

export const updatePhonePlan = async (id: string, data: Partial<IPhonePlan>): Promise<IPhonePlan> => {
  const response = await axios.put(`/superadmin/phone-plans/${id}`, data);
  return response.data?.data || response.data;
};

export const deletePhonePlan = async (id: string): Promise<void> => {
  await axios.delete(`/superadmin/phone-plans/${id}`);
};
