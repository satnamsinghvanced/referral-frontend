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
