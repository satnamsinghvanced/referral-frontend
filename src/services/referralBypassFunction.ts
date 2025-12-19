import {
  Referral,
  ScanTrackingParams,
  ScanTrackingResponse,
} from "../types/referral";
import axiosInstance from "./referralByPass";

export const createReferral = async (payload: Partial<Referral>) => {
  const { data } = await axiosInstance.post("/referral", payload);
  return data;
};

export const trackScan = async (
  params: ScanTrackingParams
): Promise<ScanTrackingResponse> => {
  const { userId, source } = params;

  const url = `/tracking/scan/${userId}`;

  const { data } = await axiosInstance.post<ScanTrackingResponse>(
    url,
    {},
    {
      params: {
        source: source,
        sourceId: params.sourceId,
      },
    }
  );

  return data;
};

export const fetchUserForTrackings = async (id: string) => {
  const response = await axiosInstance.get(`/users/tracking/${id}`);
  return response.data;
};
