import axios from "./axios";
import {
  ImpersonatePayload,
  ImpersonateResponse,
  UpdateNotesTagsPayload,
  UpdateProfilePayload,
  UpdatePasswordPayload,
} from "../types/superadmin";

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
