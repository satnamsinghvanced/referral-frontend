import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTeamMembers,
  fetchPendingInvites,
  deleteTeamMember,
  resendTeamInvite,
  inviteTeamMember,
  TeamMember,
  PendingInvite,
} from "../../services/settings/team";

// 🔹 Fetch Team Members
export const useFetchTeamMembers = () =>
  useQuery<TeamMember[], Error>({
    queryKey: ["team-members"],
    queryFn: fetchTeamMembers,
  });

// 🔹 Fetch Pending Invites
export const useFetchPendingInvites = () =>
  useQuery<PendingInvite[], Error>({
    queryKey: ["pending-invites"],
    queryFn: fetchPendingInvites,
  });

// 🔹 Delete Team Member or Pending Invite
export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      queryClient.invalidateQueries({ queryKey: ["pending-invites"] });
    },
    onError: () => {},
  });
};

// 🔹 Resend Invitation
export const useResendInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resendTeamInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-invites"] });
    },
    onError: () => {},
  });
};

// 🔹 Invite New Team Member
export const useInviteTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inviteTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      queryClient.invalidateQueries({ queryKey: ["pending-invites"] });
    },
    onError: () => {},
  });
};
