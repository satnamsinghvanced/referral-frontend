import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLeadStatus, addLead, getLeadStats, updateLead } from "../services/leadTracking";
import { addToast } from "@heroui/react";

export const useLeadStatus = (params?: any) => {
    return useQuery({
        queryKey: ["leadStatus", params],
        queryFn: () => getLeadStatus(params),
    });
};

export const useLeadStats = () => {
    return useQuery({
        queryKey: ["leadStats"],
        queryFn: getLeadStats,
    });
};

export const useAddLead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addLead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leadStatus"] });
            queryClient.invalidateQueries({ queryKey: ["leadStats"] });
            addToast({
                title: "Success",
                description: "Lead added successfully",
                color: "success",
            });
        },
        onError: (error: any) => {
            addToast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to add lead",
                color: "danger",
            });
        },
    });
};

export const useUpdateLead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateLead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leadStatus"] });
            queryClient.invalidateQueries({ queryKey: ["leadStats"] });
            addToast({
                title: "Success",
                description: "Lead updated successfully",
                color: "success",
            });
        },
        onError: (error: any) => {
            addToast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update lead",
                color: "danger",
            });
        },
    });
};
