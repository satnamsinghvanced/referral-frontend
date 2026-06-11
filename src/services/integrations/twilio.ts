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

export const createCreditsCheckoutSession = async (
  amount: number,
  packageName: string
): Promise<{ url: string }> => {
  const response = await axios.post<any>(`/twilio-checkout/create-credits-checkout-session`, {
    amount,
    packageName,
  });
  return response.data;
};

export const fetchA2PRegistration = async (): Promise<any> => {
  const response = await axios.get<any>(`/twilio-checkout/a2p-registration`);
  return response.data;
};

export const createA2PRegistration = async (data: any): Promise<any> => {
  const response = await axios.post<any>(`/twilio-checkout/a2p-registration`, data);
  return response.data;
};

export const updateA2PRegistration = async (data: any): Promise<any> => {
  const response = await axios.put<any>(`/twilio-checkout/a2p-registration`, data);
  return response.data;
};

export const deleteA2PRegistration = async (): Promise<any> => {
  const response = await axios.delete<any>(`/twilio-checkout/a2p-registration`);
  return response.data;
};

