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

// 1. Export Account Data
export const exportAccountData = async (): Promise<any> => {
  const response = await axios.get("/users/export-data");
  return response;
};

// 2. Delete Account
export const deleteAccount = async (): Promise<ActionResponse> => {
  const response = await axios.post("/users/delete-account");
  return response.data;
};

// 3. Export Referrals
export const exportReferrals = async (): Promise<ReferralExportItem[]> => {
  const response = await axios.get("/users/export-referral");
  return response.data;
};

// 4. Export Analytics
export const exportAnalytics = async (): Promise<AnalyticsExportResponse> => {
  const response = await axios.get("/users/export-analytics");
  return response.data;
};

// 5. Export Reviews
export const exportReviews = async (): Promise<ReviewsExportResponse> => {
  const response = await axios.get("/users/export-reviews");
  return response.data;
};

export const logoutUser = async (): Promise<LogoutResponse> => {
  const response = await axios.post("/users/logout");
  return response.data;
};
