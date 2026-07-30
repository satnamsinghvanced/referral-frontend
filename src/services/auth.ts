import {
  ActionResponse,
  AnalyticsExportResponse,
  LogoutResponse,
  ReferralExportItem,
  ReviewsExportResponse,
} from "../types/auth";
import axios from "./axios";

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  twoFactorRequired?: boolean;
  userId?: string;
}

export interface Verify2FAPayload {
  userId: string;
  otp: string;
  rememberMe: boolean;
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axios.post("/users/login", payload);
  return response.data;
};

export const verify2FA = async (
  payload: Verify2FAPayload,
): Promise<LoginResponse> => {
  const response = await axios.post("/users/verify-2fa", payload);
  return response.data;
};

export const exportAccountData = async (): Promise<any> => {
  const response = await axios.get("/users/export-data");
  return response;
};

export const deleteAccount = async (payload?: { otp?: string }): Promise<ActionResponse> => {
  const dataPayload = payload && typeof payload === "object" && typeof payload.otp === "string" ? { otp: payload.otp } : undefined;
  const response = await axios.delete("/users/delete-account", { data: dataPayload });
  return response as any;
};

export const exportReferrals = async (): Promise<ReferralExportItem[]> => {
  const response = await axios.get("/users/export-referral");
  return response.data;
};


export const exportAnalytics = async (): Promise<AnalyticsExportResponse> => {
  const response = await axios.get("/users/export-analytics");
  return response.data as any;
};

export const exportAnalyticsPDF = async (): Promise<Blob> => {
  const response = await axios.get("/users/export-analytics?format=pdf", {
    responseType: "blob",
  });
  return response as unknown as Blob;
};

export const exportReviews = async (): Promise<ReviewsExportResponse> => {
  const response = await axios.get("/users/export-reviews");
  return response.data as any;
};

export const exportReviewsPDF = async (): Promise<Blob> => {
  const response = await axios.get("/users/export-reviews?format=pdf", {
    responseType: "blob",
  });
  return response as unknown as Blob;
};

export const logoutUser = async (): Promise<LogoutResponse> => {
  const response = await axios.post("/users/logout");
  return response.data as any;
};
