import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchTeamMembers,
  deleteTeamMember,
  resendTeamInvite,
  inviteTeamMember,
  TeamMember,
  updateTeamMember,
} from "../../services/settings/team";
import { queryClient } from "../../providers/QueryProvider";
import { AxiosError } from "axios";
import { addToast } from "@heroui/react";

// 🔹 Fetch Team Members
export const useFetchTeamMembers = () =>
  useQuery<TeamMember[], Error>({
    queryKey: ["team-members"],
    queryFn: fetchTeamMembers,
  });

// 🔹 Delete Team Member or Pending Invite
export const useUpdateTeamMember = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateTeamMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      queryClient.invalidateQueries({ queryKey: ["pending-invites"] });

      addToast({
        title: "Success",
        description: "Team member updated successfully",
        color: "success",
      });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to update team member";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};

// 🔹 Delete Team Member or Pending Invite
export const useDeleteTeamMember = () => {
  return useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      queryClient.invalidateQueries({ queryKey: ["pending-invites"] });

      addToast({
        title: "Success",
        description: "Team member deleted successfully",
        color: "success",
      });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to delete team member";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};

// 🔹 Resend Invitation
export const useResendInvite = () => {
  return useMutation({
    mutationFn: resendTeamInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-invites"] });

      addToast({
        title: "Success",
        description: "Invitation email sent",
        color: "success",
      });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to resend invitation email";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};

// 🔹 Invite New Team Member
export const useInviteTeamMember = () => {
  return useMutation({
    mutationFn: inviteTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      queryClient.invalidateQueries({ queryKey: ["pending-invites"] });

      addToast({
        title: "Success",
        description: "Invitation email sent",
        color: "success",
      });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to send invitation email";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};
