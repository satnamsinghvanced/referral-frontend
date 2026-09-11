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

export interface InvoiceItem {
  id: string;
  number: string | null;
  date: string | null;
  amount: number;
  currency: string;
  status: string;
  pdfUrl: string | null;
  hostedUrl: string | null;
  invoiceUrl: string | null;
  isReceipt?: boolean;
}

export const getLatestInvoice = async () => {
  const response = await axios.get("/billing/latest-invoice");
  return response.data;
};

export const getAllInvoices = async (): Promise<InvoiceItem[]> => {
  const response = await axios.get("/billing/invoices");
  return response.data?.data || response.data || [];
};

export const downloadInvoicePdf = async ({
  invoiceId,
  url,
}: {
  invoiceId?: string;
  url?: string | null;
  filename?: string;
}): Promise<Blob> => {
  const res: any = await axios.get("/billing/download-invoice", {
    params: { id: invoiceId, url },
    responseType: "blob",
  });
  if (res instanceof Blob) {
    return res;
  }
  if (res?.data instanceof Blob) {
    return res.data;
  }
  return new Blob([res], { type: "application/pdf" });
};

export interface UpgradePlanPayload {
  planId: string;
  billingCycle?: "monthly" | "annual" | undefined;
  cardNumber?: string | undefined;
  expire?: string | undefined;
  cvc?: string | undefined;
  couponCode?: string | undefined;
}

export const upgradePlan = async (payload: UpgradePlanPayload) => {
  const response = await axios.post("/billing/upgrade-plan", payload);
  return response.data || response;
};