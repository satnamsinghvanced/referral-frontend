import axios from "../axios"; // your axios instance

export interface TeamMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: { role: "Admin" | "Manager" | "Staff" | string };
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

// Fetch pending invites
export const fetchPendingInvites = async (): Promise<PendingInvite[]> => {
  const { data } = await axios.get("/team/pending-invites");
  return data;
};

// Delete a team member or pending invite
export const deleteTeamMember = async (id: string) => {
  const { data } = await axios.delete(`/team/member/${id}`);
  return data;
};

// Resend an invitation
export const resendTeamInvite = async (id: string) => {
  const { data } = await axios.post(`/team/resend-invite/${id}`);
  return data;
};

// Invite a new team member
export const inviteTeamMember = async (payload: {
  name: string;
  email: string;
  role: string;
}) => {
  const { data } = await axios.post("/team/invite", payload);
  return data;
};
