import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../providers/QueryProvider";
import {
  addLead,
  getLeadStats,
  getLeadStatus,
  updateLead,
  sendLeadEmail,
  sendLeadSms,
  getLeadCommunicationHistory,
  reorderLeads,
  deleteLead,
  exportLeadsPDF,
} from "../services/leadPipeline";

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

export const useSendLeadEmail = () => {
  return useMutation({
    mutationFn: sendLeadEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadStatus"] });
      queryClient.invalidateQueries({ queryKey: ["leadStats"] });
      queryClient.invalidateQueries({ queryKey: ["leadCommunicationHistory"] });
      addToast({
        title: "Success",
        description: "Email sent successfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to send email",
        color: "danger",
      });
    },
  });
};

export const useLeadCommunicationHistory = (id: string) => {
  return useQuery({
    queryKey: ["leadCommunicationHistory", id],
    queryFn: () => getLeadCommunicationHistory(id),
    enabled: !!id,
  });
};

export const useReorderLeads = () => {
  return useMutation({
    mutationFn: reorderLeads,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadStatus"] });
      queryClient.invalidateQueries({ queryKey: ["leadStats"] });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to reorder leads",
        color: "danger",
      });
    },
  });
};

export const useDeleteLead = () => {
  return useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadStatus"] });
      queryClient.invalidateQueries({ queryKey: ["leadStats"] });
      addToast({
        title: "Success",
        description: "Lead deleted successfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete lead",
        color: "danger",
      });
    },
  });
};

export const useExportLeadsPDF = () => {
  return useMutation({
    mutationFn: (params?: any) => exportLeadsPDF(params),
    onSuccess: (blob) => {
      if (
        !blob ||
        !(blob as Blob).size ||
        (blob as Blob).type === "application/json"
      ) {
        addToast({
          title: "Error",
          description: "Invalid file format received from server.",
          color: "danger",
        });
        return;
      }
      const url = window.URL.createObjectURL(blob as Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads_report_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      addToast({
        title: "Success",
        description: "PDF report exported successfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to export PDF",
        color: "danger",
      });
    },
  });
};

export const useSendLeadSms = () => {
  return useMutation({
    mutationFn: sendLeadSms,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadStatus"] });
      queryClient.invalidateQueries({ queryKey: ["leadStats"] });
      queryClient.invalidateQueries({ queryKey: ["leadCommunicationHistory"] });
      addToast({
        title: "Success",
        description: "SMS sent successfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to send SMS",
        color: "danger",
      });
    },
  });
};

