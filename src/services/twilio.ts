import {
  TwilioCallHistoryResponse,
  TwilioCallRequestBody,
  TwilioCallResponse,
  TwilioConfigRequest,
  TwilioConfigResponse,
  UserIdParam,
} from "../types/call";
import axios from "./axios";

export const saveTwilioConfig = async (
  userId: UserIdParam["userId"],
  data: TwilioConfigRequest
): Promise<TwilioConfigResponse> => {
  const response = await axios.post<TwilioConfigResponse>(
    `/twilio/${userId}`,
    data
  );
  return response.data;
};

export const fetchTwilioConfig = async (
  userId: UserIdParam["userId"]
): Promise<TwilioConfigResponse> => {
  const response = await axios.get<TwilioConfigResponse>(`/twilio/${userId}`);
  return response.data;
};

export const updateTwilioConfig = async (
  userId: UserIdParam["userId"],
  data: TwilioConfigRequest
): Promise<TwilioConfigResponse> => {
  const response = await axios.put<TwilioConfigResponse>(
    `/twilio/${userId}`,
    data
  );
  return response.data;
};

export const initiateCall = async (
  userId: string,
  body: TwilioCallRequestBody
): Promise<TwilioCallResponse> => {
  const url = `/twilio/call/${userId}`;
  const response = await axios.post<TwilioCallResponse>(url, body);
  return response.data;
};

export const getCallHistory = async (
  userId: string
  // Optional: You can add parameters for pagination here if supported by API
  // page: number = 1, limit: number = 10
): Promise<TwilioCallHistoryResponse> => {
  const url = `/twilio/history/${userId}`;
  const response = await axios.get<TwilioCallHistoryResponse>(url);
  return response.data;
};
