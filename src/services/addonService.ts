import axios from "./axios";

export interface AddonData {
  _id?: string;
  id?: string;
  title: string;
  price: number;
  unit: string;
  description: string;
  isActive?: boolean;
  order?: number;
}

export const fetchAddons = async () => {
  const response = await axios.get("/superadmin/addons");
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
