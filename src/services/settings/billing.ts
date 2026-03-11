import { BillingData } from "../../types/billing";
import axios from "../axios";

export const getBilling = async (): Promise<BillingData> => {
  const response = await axios.get("/billing");
  return response.data;
};
