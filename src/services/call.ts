import axios from "./axios";
import {
  CallRecord,
  GetCallRecordsParams,
  GetCallRecordsResponse,
  UpdateCallRecordPayload,
} from "../types/call";

export const getCallRecords = async (
  params: GetCallRecordsParams
): Promise<GetCallRecordsResponse> => {
  const { data } = await axios.get(`/twilio-record`, { params });
  return data;
};

export const updateCallRecord = async (
  id: string,
  payload: UpdateCallRecordPayload
): Promise<CallRecord> => {
  const { data } = await axios.put(`/twilio-record/${id}`, payload);
  return data;
};

export const fetchCallRecordingBlob = async (id: string): Promise<Blob> => {
  const { data } = await axios.get(`/twilio-record/${id}/recording`, {
    responseType: "blob",
  });
  return data;
};
