import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../providers/QueryProvider";
import {
  fetchDevices,
  removeDevice,
  toggleDevice,
} from "../../services/settings/device";

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

      addToast({
        title: "Device Session Terminated",
        description: "Device session successfully terminated.",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Device Session Termination Failed",
        description: "Device session termination failed.",
        color: "danger",
      });
    },
  });
};

export const useRemoveDevice = () => {
  return useMutation({
    mutationFn: (id: string) => removeDevice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });

      addToast({
        title: "Device Session Terminated",
        description: "Device session successfully terminated.",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Device Session Termination Failed",
        description: "Device session termination failed.",
        color: "danger",
      });
    },
  });
};
