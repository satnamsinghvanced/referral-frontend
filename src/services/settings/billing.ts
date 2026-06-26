import { BillingData } from "../../types/billing";
import axios from "../axios";

export const getBilling = async (): Promise<BillingData> => {
  const response = await axios.get("/billing");
  return response.data;
};

export const validateDiscount = async (code: string) => {
  const response = await axios.get(`/billing/discount/${code}`);
  return response;
};