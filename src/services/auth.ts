import axios from "./axios";

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  accessToken: string; // Replace with your user type
  refreshToken: string;
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axios.post("/users/login", payload);
  return response.data;
};
