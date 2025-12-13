import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { queryClient } from "../../providers/QueryProvider";
import {
  deleteTeamMember,
  fetchTeamMembers,
  inviteTeamMember,
  resendTeamInvite,
  TeamMember,
  updateTeamMember,
} from "../../services/settings/team";

export const useFetchTeamMembers = () =>
  useQuery<TeamMember[], Error>({
    queryKey: ["team-members"],
    queryFn: fetchTeamMembers,
  });

export const useUpdateTeamMember = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateTeamMember(id, data),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Team member updated successfully.",
        color: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      queryClient.invalidateQueries({ queryKey: ["pending-invites"] });
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

export const useDeleteTeamMember = () => {
  return useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Team member deleted successfully.",
        color: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      queryClient.invalidateQueries({ queryKey: ["pending-invites"] });
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
