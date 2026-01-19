import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDevices,
  toggleDevice,
  removeDevice,
} from "../../services/settings/device";

export const useDevices = () => {
  return useQuery({
    queryKey: ["devices"],
    queryFn: fetchDevices,
  });
};

export const useToggleDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, toggle }: { id: string; toggle: boolean }) =>
      toggleDevice(id, toggle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });
};

export const useRemoveDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeDevice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });
};
