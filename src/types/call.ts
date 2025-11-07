export interface Tag {
  label: string;
  type: "status" | "action" | "category";
}

export interface CallRecord {
  id: string;
  callerName: string;
  callerPhone: string;
  timeAgo: string;
  sentiment: "positive" | "negative" | "neutral";
  duration: string;
  isVerified: boolean;
  tags: Tag[];
  type: "incoming" | "outgoing" | "missed";
  status: "completed" | "voicemail" | "recorded" | string;
}

export interface CallFilters {
  search: string;
  type: string;
  status: string;
}

export interface TwilioConfigRequest {
  accountId: string;
  authToken: string;
  phone: string; // E.g., "+12185516174"
}

export interface TwilioConfigResponse {
  _id: string;
  userId: string;
  accountId: string;
  authToken: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserIdParam {
  userId: string;
}

// --- 1. Call Initiation Types ---

export interface TwilioCallRequestBody {
  to: string; // The phone number to call (e.g., "+917009101804")
  referredBy: string; // Additional reference string (can be empty)
}

export interface TwilioCallResponseData {
  sid: string; // Twilio Call SID (e.g., "CA56efbcba1e23a1231f6372a6f2f73d39")
  status: string; // Current call status (e.g., "queued")
}

export interface TwilioCallResponse {
  status: "success" | "error";
  message: string;
  success: boolean;
  data: TwilioCallResponseData;
}

// --- 2. Call History Types ---

export interface TwilioCallHistoryItem {
  id: string; // Unique ID for the history record
  phone: string;
  type: "outgoing" | "incoming";
  status: string; // Call status (e.g., "completed")
  duration: string; // Duration in seconds (as a string)
  callSid: string;
  recordingUrl: string | null;
  transcription: string | null;
  createdAt: string; // ISO date string
}

export interface TwilioCallHistoryResponse {
  total: number;
  page: number;
  limit: number;
  data: TwilioCallHistoryItem[];
}
