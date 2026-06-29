import axios from "../axios";

export interface TeamMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  locations: any[];
  role: {
    role: string;
    _id: string;
    title?: string;
    description?: string;
    permissions?: string[];
  } | null;
  status: string;
  avatar?: string;
  createdAt?: string;
  permissions?: any[];
  isVerified?: boolean;
  termsAccepted?: boolean;
}

export interface TeamMembersResponse {
  data: TeamMember[];
  totalData: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const fetchTeamMembers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<TeamMembersResponse> => {
  const { data } = await axios.get("/team-member", { params });
  return data;
};

export const fetchPendingTeamMembers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<TeamMembersResponse> => {
  const { data } = await axios.get("/team-member/pending-member", { params });
  return data;
};

export const updateTeamMember = async (id: string, teamMember: any) => {
  const { data } = await axios.put(`/team-member/${id}`, teamMember);
  return data;
};

export const deleteTeamMember = async (id: string) => {
  const { data } = await axios.delete(`/team-member/${id}`);
  return data;
};

export const resendTeamInvite = async (id: string) => {
  const { data } = await axios.post(`/team-member/${id}`);
  return data;
};

export const inviteTeamMember = async (payload: any) => {
  const { data } = await axios.post("/team-member", payload);
  return data;
};

export const setTeamMemberPassword = async (payload: {
  email: string;
  password: string;
}) => {
  const { data } = await axios.post("/team-member/set-password", payload);
  return data;
};
