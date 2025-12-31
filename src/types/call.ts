export interface TwilioContact {
  id: string;
  model: string;
  name: string;
  phone: string;
  status: string;
  callTime: string;
}

export interface CallStats {
  totalCalls: number;
  completedCalls: number;
  missedCalls: number;
  answerRate: string;
  avgDuration: string;
  recordings: number;
  followUps: number;
}

export interface CallRecord {
  _id: string;
  userId: string;
  callSid: string;
  from: string;
  to: string;
  direction: "Outgoing" | "Incoming";
  recordingUrl: string | null;
  transcriptionText: string;
  status: string;
  duration: string;
  followUp: boolean;
  appointment: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  contact: TwilioContact;
}

export interface PaginatedCalls {
  data: CallRecord[];
  totalData: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetCallRecordsResponse {
  stats: CallStats;
  paginatedCalls: PaginatedCalls;
}

export interface GetCallRecordsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
}

export interface UpdateCallRecordPayload {
  notes?: string;
  followUp?: boolean;
  appointment?: boolean;
  date?: string;
}
