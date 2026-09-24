import axios from "./axios";

export interface AddonData {
  _id?: string;
  id?: string;
  title: string;
  price: number;
  billingType?: "one_time" | "monthly" | "annually" | string;
  isAutopay?: boolean;
  unit: string;
  description: string;
  isActive?: boolean;
  order?: number;
  signinUrl?: string;
  checkoutUrl?: string;
}

export interface UserAddonData {
  _id: string;
  id?: string;
  userId: string;
  addonId: string;
  title: string;
  price: number;
  quantity?: number;
  billingType: "one_time" | "monthly" | "annually" | string;
  validityType?: "base_plan" | "fixed_duration" | "lifetime" | string;
  isAutopay: boolean;
  unit: string;
  description: string;
  status: "active" | "canceled" | "expired";
  stripePaymentIntentId?: string;
  purchaseDate: string;
  nextBillingDate?: string;
  canceledAt?: string;
  createdAt: string;
}

export interface PurchaseAddonPayload {
  addonId: string;
  useSavedCard?: boolean | undefined;
  paymentMethodId?: string | undefined;
  token?: string | undefined;
  cardNumber?: string | undefined;
  expire?: string | undefined;
  cvc?: string | undefined;
  cardholderName?: string | undefined;
  couponCode?: string | undefined;
}

export const fetchAddons = async () => {
  const response = await axios.get("/superadmin/addons");
  return response.data;
};

export const fetchAddonById = async (id: string) => {
  const response = await axios.get(`/addons/${id}`);
  return response.data;
};

export const createAddon = async (payload: Partial<AddonData>) => {
  const response = await axios.post("/superadmin/addons", payload);
  return response.data;
};

export const updateAddon = async (id: string, payload: Partial<AddonData>) => {
  const response = await axios.put(`/superadmin/addons/${id}`, payload);
  return response.data;
};

export const deleteAddon = async (id: string) => {
  const response = await axios.delete(`/superadmin/addons/${id}`);
  return response.data;
};

export const purchaseAddon = async (payload: PurchaseAddonPayload) => {
  const response = await axios.post("/billing/addons/purchase", payload);
  return response.data;
};

export const fetchUserAddons = async () => {
  const response = await axios.get("/billing/addons/my-addons");
  return response.data;
};

export const cancelUserAddon = async (id: string) => {
  const response = await axios.post(`/billing/addons/cancel/${id}`);
  return response.data;
};
