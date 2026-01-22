import { useMutation, useQuery } from "@tanstack/react-query";
import { getCallRecords, updateCallRecord } from "../services/call";
import { GetCallRecordsParams, UpdateCallRecordPayload } from "../types/call";
import { queryClient } from "../providers/QueryProvider";

export const CALL_RECORDS_QUERY_KEY = "callRecords";

export const useFetchCallRecords = (params: GetCallRecordsParams) => {
  return useQuery({
    queryKey: [CALL_RECORDS_QUERY_KEY, params],
    queryFn: () => getCallRecords(params),
  });
};

export const useUpdateCallRecord = () => {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCallRecordPayload;
    }) => updateCallRecord(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CALL_RECORDS_QUERY_KEY] });
    },
  });
};
