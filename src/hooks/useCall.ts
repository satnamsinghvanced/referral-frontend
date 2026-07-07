import { useMutation, useQuery } from "@tanstack/react-query";
import { getCallRecords, updateCallRecord, deleteCallRecord } from "../services/call";
import { GetCallRecordsParams, UpdateCallRecordPayload } from "../types/call";
import { queryClient } from "../providers/QueryProvider";
import { addToast } from "@heroui/react";

export const CALL_RECORDS_QUERY_KEY = "callRecords";

export const useFetchCallRecords = (params: GetCallRecordsParams) => {
  return useQuery({
    queryKey: [CALL_RECORDS_QUERY_KEY, params],
    queryFn: () => getCallRecords(params),
  });
};

export const useUpdateCallRecord = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCallRecordPayload; }) => updateCallRecord(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CALL_RECORDS_QUERY_KEY] });
    },
  });
};

export const useDeleteCallRecord = () => {
  return useMutation({
    mutationFn: (id: string) => deleteCallRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CALL_RECORDS_QUERY_KEY] });
      addToast({
        title: "Success",
        description: "Call record and recording deleted successfully.",
        color: "success",
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || "Failed to delete call record";
      addToast({
        title: "Error",
        description: message,
        color: "danger",
      });
    },
  });
};
