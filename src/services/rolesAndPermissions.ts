import axios from "./axios";

export interface IPermission {
  _id: string;
  title: string;
  description?: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface IRole {
  _id: string;
  title?: string;
  role: string;
  description?: string;
  permissions: IPermission[] | string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRolePayload {
  title?: string;
  role: string;
  description?: string;
  permissions?: string[];
}

export interface UpdateRolePayload {
  title?: string;
  role?: string;
  description?: string;
  permissions?: string[];
}

export interface CreatePermissionPayload {
  title: string;
  description?: string;
  status?: "active" | "inactive";
}

export interface UpdatePermissionPayload {
  title?: string;
  description?: string;
  status?: "active" | "inactive";
}

export const fetchRolesList = async (): Promise<IRole[]> => {
  const response = await axios.get("/role");
  const data = response.data?.data ?? response.data;
  return Array.isArray(data) ? data : [];
};

export const fetchRoleById = async (id: string): Promise<IRole> => {
  const response = await axios.get(`/role/${id}`);
  return response.data?.data ?? response.data;
};

export const createRole = async (payload: CreateRolePayload): Promise<IRole> => {
  const response = await axios.post("/role", payload);
  return response.data?.data ?? response.data;
};

export const updateRole = async (id: string, payload: UpdateRolePayload): Promise<IRole> => {
  const response = await axios.put(`/role/${id}`, payload);
  return response.data?.data ?? response.data;
};

export const deleteRole = async (id: string): Promise<any> => {
  const response = await axios.delete(`/role/${id}`);
  return response.data;
};

export const fetchPermissionsList = async (): Promise<IPermission[]> => {
  const response = await axios.get("/permission");
  const data = response.data?.data ?? response.data;
  return Array.isArray(data) ? data : [];
};

export const fetchPermissionById = async (id: string): Promise<IPermission> => {
  const response = await axios.get(`/permission/${id}`);
  return response.data?.data ?? response.data;
};

export const createPermission = async (payload: CreatePermissionPayload): Promise<IPermission> => {
  const response = await axios.post("/permission", payload);
  return response.data?.data ?? response.data;
};

export const updatePermission = async (id: string, payload: UpdatePermissionPayload): Promise<IPermission> => {
  const response = await axios.put(`/permission/${id}`, payload);
  return response.data?.data ?? response.data;
};

export const deletePermission = async (id: string): Promise<any> => {
  const response = await axios.delete(`/permission/${id}`);
  return response.data;
};
