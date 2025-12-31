import axios from "../axios"; // your axios instance

export interface TeamMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  locations: any[]; // using any[] for now as Location type might need to be imported or defined
  role: {
    role: string;
    _id: string;
    title?: string;
    description?: string;
    permissions?: string[];
  } | null;
  status: string;
  avatar?: string;
  invitedAt?: string;
  permissions?: any[]; // permissions can be populated
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

// Fetch all team members
export const fetchTeamMembers = async (): Promise<TeamMembersResponse> => {
  const { data } = await axios.get("/team-member");
  return data;
};

// Update a team member
export const updateTeamMember = async (id: string, teamMember: any) => {
  const { data } = await axios.put(`/team-member/${id}`, teamMember);
  return data;
};

// Delete a team member or pending invite
export const deleteTeamMember = async (id: string) => {
  const { data } = await axios.delete(`/team-member/${id}`);
  return data;
};

// Resend an invitation
export const resendTeamInvite = async (id: string) => {
  const { data } = await axios.post(`/team-member/${id}`);
  return data;
};

// Invite a new team member
export const inviteTeamMember = async (payload: any) => {
  const { data } = await axios.post("/team-member", payload);
  return data;
};

// Set team member password
export const setTeamMemberPassword = async (payload: {
  email: string;
  password: string;
}) => {
  const { data } = await axios.post("/team-member/set-password", payload);
  return data;
};
