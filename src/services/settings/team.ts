import axios from "../axios"; // your axios instance

export interface TeamMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: { role: "Admin" | "Manager" | "Staff" | string; _id: string };
  invitationStatus: string;
  avatar?: string;
  invitedAt: string;
}

export interface PendingInvite {
  id: string;
  email: string;
  role: string;
  invitedAt: string;
}

// Fetch all team members
export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
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
