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
