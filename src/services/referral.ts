import {
  FetchReferrersParams,
  Referrer,
  ReferrersResponse,
} from "../types/partner";
import {
  FetchReferralsParams,
  Referral,
  ReferralsResponse,
  TrackingRequestBody,
  TrackingResponseData,
} from "../types/referral";
import axios from "./axios";

export const createReferral = async (payload: Partial<Referral>) => {
  const { data } = await axios.post("/referral", payload);
  return data;
};

// Get referral by ID
export const getReferralById = async (id: string) => {
  const { data } = await axios.get(`/referral/${id}`);
  return data;
};

// Get list of referrals with pagination
export const fetchReferrals = async (
  params: FetchReferralsParams
): Promise<ReferralsResponse> => {
  const { data } = await axios.get<ReferralsResponse>("/referral", {
    params: params,
  });
  return data;
};

// Update referral by ID
export const updateReferral = async (
  id: string,
  payload: Partial<Referral>
) => {
  const { data } = await axios.put(`/referral/${id}`, payload);
  return data;
};

// Delete referral by ID
export const deleteReferral = async (id: string) => {
  const { data } = await axios.delete(`/referral/${id}`);
  return data;
};

// ---------------------------
// Referrer APIs
// ---------------------------

// Add a new referrer (doctor/patient)
export const createReferrer = async (
  id: string,
  type: string,
  payload: Partial<Referrer>
) => {
  const { data } = await axios.post(`/referrers/${id}`, payload, {
    params: { type },
  });
  return data;
};

// Fetch referrers list with filter & pagination
export const fetchReferrers = async (
  params: FetchReferrersParams
): Promise<ReferrersResponse> => {
  const { filter = "", page = 1, limit = 10 } = params;

  const { data } = await axios.get<ReferrersResponse>("/referrers/", {
    params: { filter, page, limit },
  });
  return data;
};

// Get referrer by ID
export const getReferrerById = async (id: string): Promise<Referrer> => {
  const { data } = await axios.get(`/referrers/${id}`);
  return data;
};

// Update referrer by ID
export const updateReferrer = async (
  id: string,
  type: string,
  payload: Partial<Referrer>
) => {
  const { data } = await axios.put(`/referrers/${id}`, payload, {
    params: { type },
  });
  return data;
};

// Delete referrer by ID
export const deleteReferrer = async (id: string) => {
  const { data } = await axios.delete(`/api/referrers/${id}`);
  return data;
};

// ---------------------------
// Tracking APIs
// ---------------------------

// 1. Create a new tracking entry with FormData
export const createTrackingSetup = async (
  data: TrackingRequestBody
): Promise<TrackingResponseData> => {
  const response = await axios.post<TrackingResponseData>("/tracking/", data);
  return response.data;
};

// 2. Update an existing tracking entry
export const updateTracking = async (
  trackingId: string,
  payload: any // same structure as create or partial update
) => {
  const { data } = await axios.put(`/tracking/${trackingId}`, payload);
  return data;
};

// 3. Fetch tracking entries with pagination
export const fetchTrackings = async () => {
  const { data } = await axios.get("/tracking/");
  return data;
};

// 4. Log a scan event (QR/NFC) for a tracking entry
export const logTrackingScan = async (
  trackingId: string,
  source: "QR" | "NFC"
) => {
  const { data } = await axios.post(`/tracking/scan/${trackingId}`, null, {
    params: { source },
  });
  return data;
};
