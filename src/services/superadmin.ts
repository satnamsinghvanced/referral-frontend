import axios from "./axios";
import {
  ImpersonatePayload,
  ImpersonateResponse,
  UpdateNotesTagsPayload,
  UpdateProfilePayload,
  UpdatePasswordPayload,
  ForgotPasswordPayload,
  LoginSuperAdminPayload,
} from "../types/superadmin";

export const loginSuperAdmin = async (payload: LoginSuperAdminPayload) => {
  const response = await axios.post("/superadmin/login", payload);
  return response.data;
}

/**
 * Fetch all admin accounts list
 */
export const fetchSuperAdminList = async () => {
  const response = await axios.get("/superadmin/admins");
  return response.data;
};

/**
 * Fetch detailed metrics & info for a single admin account by ID
 */
export const fetchSuperAdminDetail = async (id: string) => {
  const response = await axios.get(`/superadmin/admins/${id}`);
  return response.data;
};

/**
 * Impersonate a client account
 */
export const impersonateClientAccount = async (payload: ImpersonatePayload): Promise<ImpersonateResponse> => {
  const response = await axios.post<ImpersonateResponse>("/superadmin/impersonate", payload);
  return response.data;
};

/**
 * Update tags and internal notes for a client account
 */
export const updateClientNotesAndTags = async (
  id: string,
  payload: UpdateNotesTagsPayload
) => {
  const response = await axios.put(`/superadmin/admins/${id}/notes-tags`, payload);
  return response.data;
};

/**
 * Recover a deleted client account
 */
export const recoverClientAccount = async (id: string) => {
  const response = await axios.post(`/superadmin/admins/${id}/recover`);
  return response.data;
};

/**
 * Suspend a client account with reason
 */
export const suspendClientAccount = async (id: string, reason: string) => {
  const response = await axios.post(`/superadmin/admins/${id}/suspend`, { reason });
  return response.data;
};

/**
 * Unsuspend / reactivate a suspended client account
 */
export const unsuspendClientAccount = async (id: string) => {
  const response = await axios.post(`/superadmin/admins/${id}/unsuspend`);
  return response.data;
};

/**
 * Update Super Admin Profile
 */
export const updateSuperAdminProfile = async (payload: UpdateProfilePayload) => {
  const response = await axios.put("/superadmin/profile", payload);
  return response.data;
};

/**
 * Update Super Admin Password
 */
export const updateSuperAdminPassword = async (payload: UpdatePasswordPayload) => {
  const response = await axios.put("/superadmin/password", payload);
  return response.data;
};

export const forgotSuperAdminPassword = async (payload: ForgotPasswordPayload) => {
  const response: any = await axios.post("/superadmin/forgot-password", payload);
  return response?.data !== undefined && response?.data !== null ? response.data : response;
};

export const forgotSuperAdminPasssword = forgotSuperAdminPassword;

export const resetSuperAdminPassword = async (payload: { email: string; password: string; token?: string }) => {
  const response: any = await axios.post("/superadmin/reset-password", payload);
  return response?.data !== undefined && response?.data !== null ? response.data : response;
};