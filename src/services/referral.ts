import { CreateReferrerPayload, FetchReferrersParams, Referrer, ReferrersResponse } from "../types/partner";
import {
  CreateReferralPayload,
  FetchReferralsParams,
  Referral,
  ReferralsResponse,
  TrackingRequestBody,
  TrackingResponseData,
} from "../types/referral";
import axios from "./axios";

export const createReferral = async (payload: CreateReferralPayload) => {
  const { data } = await axios.post("/referral", payload);
  return data;
};

export const getReferralById = async (id: string) => {
  const { data } = await axios.get(`/referral/${id}`);
  return data;
};

export const fetchReferrals = async (
  params: FetchReferralsParams
): Promise<ReferralsResponse> => {
  const { data } = await axios.get<ReferralsResponse>("/referral", {
    params: params,
  });
  return data;
};

export const updateReferral = async (
  id: string,
  payload: Partial<Referral>
) => {
  const { data } = await axios.put(`/referral/${id}`, payload);
  return data;
};

export const deleteReferral = async (id: string) => {
  const { data } = await axios.delete(`/referral/${id}`);
  return data;
};

export const createReferrer = async (
  type: string,
  payload: CreateReferrerPayload
) => {
  const { data } = await axios.post(`/referrers`, payload, {
    params: { type },
  });
  return data;
};

export const fetchReferrers = async (
  params: FetchReferrersParams
): Promise<ReferrersResponse> => {
  const { filter = "", page = 1, limit = 10, search = "" } = params;

  const { data } = await axios.get<ReferrersResponse>("/referrers", {
    params: { filter, page, limit, search },
  });
  return data;
};

export const getReferrerById = async (id: string): Promise<Referrer> => {
  const { data } = await axios.get(`/referrers/${id}`);
  return data;
};

export const updateReferrer = async (
  id: string,
  type: string,
  payload: Partial<CreateReferrerPayload>
) => {
  const { data } = await axios.put(`/referrers/${id}`, payload, {
    params: { type },
  });
  return data;
};

export const deleteReferrer = async (id: string) => {
  const { data } = await axios.delete(`/api/referrers/${id}`);
  return data;
};

export const createTrackingSetup = async (
  data: TrackingRequestBody
): Promise<TrackingResponseData> => {
  const response = await axios.post<TrackingResponseData>("/tracking/", data);
  return response.data;
};

export const updateTracking = async (
  trackingId: string,
  payload: any
) => {
  const { data } = await axios.put(`/tracking/${trackingId}`, payload);
  return data;
};

export const fetchTrackings = async (id: any) => {
  const { data } = await axios.get(`/tracking/${id}`);
  return data;
};

export const logTrackingScan = async (
  trackingId: string,
  source: "QR" | "NFC"
) => {
  const { data } = await axios.post(`/tracking/scan/${trackingId}`, null, {
    params: { source },
  });
  return data;
};

export const importReferralsCSV = async (formData: FormData) => {
  const { data } = await axios.post("/referral/import-csv/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const createPatientDetails = async (payload: any) => {
  const { data } = await axios.post("/patient-details", payload);
  return data;
};
