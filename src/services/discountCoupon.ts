import axios from "./axios";

export interface IDiscountCoupon {
  _id: string;
  title: string;
  description: string;
  code: string;
  value: number;
  type: "percent" | "fixed";
  isActive: boolean;
  expiryDate: string | null;
  maxRedemptions?: number | null;
  timesRedeemed?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IDiscountCouponPayload {
  title?: string;
  description?: string;
  code: string;
  value: number;
  type: "percent" | "fixed";
  isActive?: boolean;
  expiryDate?: string | null;
  maxRedemptions?: number | null;
}

export const fetchDiscountCoupons = async (params?: {
  search?: string;
  status?: string;
  type?: string;
}): Promise<IDiscountCoupon[]> => {
  const response = await axios.get("/superadmin/discount-coupons", { params });
  return response.data?.data || response.data || [];
};

export const fetchDiscountCouponById = async (id: string): Promise<IDiscountCoupon> => {
  const response = await axios.get(`/superadmin/discount-coupons/${id}`);
  return response.data?.data || response.data;
};

export const createDiscountCoupon = async (
  data: IDiscountCouponPayload
): Promise<IDiscountCoupon> => {
  const response = await axios.post("/superadmin/discount-coupons", data);
  return response.data?.data || response.data;
};

export const updateDiscountCoupon = async (
  id: string,
  data: Partial<IDiscountCouponPayload>
): Promise<IDiscountCoupon> => {
  const response = await axios.put(`/superadmin/discount-coupons/${id}`, data);
  return response.data?.data || response.data;
};

export const toggleDiscountCoupon = async (id: string): Promise<IDiscountCoupon> => {
  const response = await axios.patch(`/superadmin/discount-coupons/${id}/toggle`);
  return response.data?.data || response.data;
};

export const deleteDiscountCoupon = async (id: string): Promise<void> => {
  await axios.delete(`/superadmin/discount-coupons/${id}`);
};
