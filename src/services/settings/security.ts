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
