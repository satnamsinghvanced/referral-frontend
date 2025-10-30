import {
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
