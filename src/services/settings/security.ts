import axios from "../axios";

// --- Types ---
export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// --- API Request ---
export const updatePassword = async (payload: UpdatePasswordPayload) => {
  const response = await axios.put("/users/", payload);
  return response.data;
};

export const verifyUpdatePassword = async (otp: string) => {
  const response = await axios.post("/users/verify-update-password", { otp });
  return response.data;
};

export const enable2FA = async () => {
  const response = await axios.post("/users/enable-2fa");
  return response.data;
};

export const verifyEnable2FA = async (otp: string) => {
  const response = await axios.post("/users/verify-enable-2fa", { otp });
  return response.data;
};

export const disable2FA = async () => {
  const response = await axios.post("/users/disable-2fa");
  return response.data;
};
