import axios from "./axios"; // your axios instance

// ---------------------------
// Referral Interfaces
// ---------------------------
export interface Referral {
  _id: string;
  referredBy: string;
  addedVia: string;
  name: string;
  age?: number;
  phone: string;
  email?: string;
  treatment?: string;
  status: string;
  priority?: string;
  estValue?: number;
  scheduledDate?: string;
  notes?: string;
  insurance?: string;
  appointment?: string;
  reason?: string;
}

// ---------------------------
// Referrer Interfaces
// ---------------------------
export interface Referrer {
  _id: string;
  name: string;
  phone: string;
  email: string;
  practiceName: string;
  practiceAddress: string;
  practiceEmail?: string;
  practicePhone?: string;
  partnershipLevel?: string;
  practiceType?: string;
  notes?: string;
  staff?: {
    name: string;
    role: string;
    email: string;
    phone: string;
    isDentist: boolean;
  };
}

// ---------------------------
// Referral APIs
// ---------------------------

// Create new referral
export const createReferral = async (payload: Partial<Referral>) => {
  console.log('sending data to server: ', payload)
  debugger
  const { data } = await axios.post("/referral", payload);
  console.log('response: ', data)
  return data;
};

// Get referral by ID
export const getReferralById = async (id: string) => {
  const { data } = await axios.get(`/referral/${id}`);
  return data;
};

// Get list of referrals with pagination
export const fetchReferrals = async (params: any) => {
  console.log(params, "HEHEHEHEHHH");
  const { data } = await axios.get("/referral", {
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
export const fetchReferrers = async (filter: string, page = 1, limit = 10) => {
  const { data } = await axios.get("/referrers/", {
    params: { filter, page, limit },
  });
  return data;
};

// Get referrer by ID
export const getReferrerById = async (id: string) => {
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
export const createTracking = async (
  adminId: string,
  payload:
    | {
      referralUrl: string;
      nfcUrl: string;
      isActive: boolean;
      image: File | string;
    }
    | FormData // allow FormData too
) => {
  const { data } = await axios.post(`/tracking/${adminId}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
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
export const fetchTrackings = async (id: any) => {
  const { data } = await axios.get(`/tracking/${id}`);
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
