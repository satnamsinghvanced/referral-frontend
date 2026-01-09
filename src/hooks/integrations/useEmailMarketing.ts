import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmailIntegration,
  fetchEmailIntegration,
  fetchEmailIntegrationById,
  updateEmailIntegration,
} from "../../services/integrations/emailMarketing";
import { EmailIntegrationBody } from "../../types/integrations/emailMarketing";

const EMAIL_KEY = "email-integration";

export const useFetchEmailIntegration = (id?: string) => {
  return useQuery({
    queryKey: id ? [EMAIL_KEY, id] : [EMAIL_KEY],
    queryFn: () =>
      id ? fetchEmailIntegrationById(id) : fetchEmailIntegration(),
  });
};

export const useCreateEmailIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EmailIntegrationBody) => createEmailIntegration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMAIL_KEY] });
    },
  });
};

export const useUpdateEmailIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmailIntegrationBody }) =>
      updateEmailIntegration(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [EMAIL_KEY] });
      queryClient.invalidateQueries({ queryKey: [EMAIL_KEY, data._id] });
    },
  });
};
