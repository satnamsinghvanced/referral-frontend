import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchDevices,
  toggleDevice,
  removeDevice,
} from "../../services/settings/device";
import { queryClient } from "../../providers/QueryProvider";

export const useDevices = (params: { page: number; limit: number }) => {
  return useQuery({
    queryKey: ["devices", params],
    queryFn: () => fetchDevices(params),
  });
};

export const useToggleDevice = () => {
  return useMutation({
    mutationFn: ({ id, toggle }: { id: string; toggle: boolean }) =>
      toggleDevice(id, toggle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });
};

export const useRemoveDevice = () => {
  return useMutation({
    mutationFn: (id: string) => removeDevice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });
};
