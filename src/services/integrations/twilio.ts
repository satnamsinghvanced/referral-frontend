import {
  TwilioConfigRequest,
  TwilioConfigResponse,
  UserIdParam,
} from "../../types/integrations/twilio";
import axios from "../axios";

export const saveTwilioConfig = async (
  data: TwilioConfigRequest
): Promise<TwilioConfigResponse> => {
  const response = await axios.post<TwilioConfigResponse>(`/twilio`, data);
  return response.data;
};

export const fetchTwilioConfig = async (): Promise<TwilioConfigResponse> => {
  const response = await axios.get<TwilioConfigResponse>(`/twilio`);
  return response.data;
};

export const updateTwilioConfig = async (
  id: string,
  data: TwilioConfigRequest
): Promise<TwilioConfigResponse> => {
  const response = await axios.put<TwilioConfigResponse>(`/twilio/${id}`, data);
  return response.data;
};
