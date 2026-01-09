import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../providers/QueryProvider";
import {
  createEmailIntegration,
  fetchEmailIntegration,
  fetchEmailIntegrationById,
  updateEmailIntegration,
} from "../../services/integrations/emailMarketing";
import { EmailIntegrationBody } from "../../types/integrations/emailMarketing";
import { addToast } from "@heroui/react";
import { AxiosError } from "axios";

const EMAIL_KEY = "email-integration";

export const useFetchEmailIntegration = (id?: string) => {
  return useQuery({
    queryKey: id ? [EMAIL_KEY, id] : [EMAIL_KEY],
    queryFn: () =>
      id ? fetchEmailIntegrationById(id) : fetchEmailIntegration(),
  });
};

export const useCreateEmailIntegration = () => {
  return useMutation({
    mutationFn: (data: EmailIntegrationBody) => createEmailIntegration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMAIL_KEY] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      addToast({
        title: "Error",
        description: error.response?.data?.message,
        color: "danger",
      });
    },
  });
};

export const useUpdateEmailIntegration = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmailIntegrationBody }) =>
      updateEmailIntegration(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [EMAIL_KEY] });
      queryClient.invalidateQueries({ queryKey: [EMAIL_KEY, data._id] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      addToast({
        title: "Error",
        description: error.response?.data?.message,
        color: "danger",
      });
    },
  });
};
