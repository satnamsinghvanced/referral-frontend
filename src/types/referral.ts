export interface Referral {
  _id: string;
  referredBy: any;
  addedVia: string;
  name: string;
  age?: number | null;
  phone: string;
  email?: string;
  treatment?: string;
  priority?: string;
  estValue?: number;
  appointmentTime?: string;
  notes?: string;
  insurance?: string;
  appointment?: string;
  scheduledDate?: string;
  reason?: string;
  status:
    | "new"
    | "contacted"
    | "appointed"
    | "scheduled"
    | "consultation"
    | "inProcess"
    | "started"
    | "inTreatment"
    | "completed"
    | "declined"
    | "noShow";
  statusNotes?: string;
  createdAt?: string;
  additionalNotes?: string;
}

export interface FilterStats {
  totalReferrals: number;
  totalValue: number;
  highPriorityCount: number;
  activeCount: number;
}

export interface GeneralStats {
  totalReferrals: number;
  nfcReferralTotal: number;
  qrReferralTotal: number;
  totalValue: number;
}

export interface StatusStats {
  contacted: number;
  appointed: number;
  inProcess: number;
  started: number;
  declined: number;
  new: number;
  scheduled: number;
  consultation: number;
  inTreatment: number;
  completed: number;
  noShow: number;
}

// 3. Type for the overall API response structure
export interface ReferralsResponse {
  data: Referral[];
  filterStats: FilterStats;
  stats: GeneralStats;
  statusStats: StatusStats;
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

// 4. Type for the query parameters (TanStack/Axios Request)
export interface FetchReferralsParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: string;
  source?: string;
}

export interface ScanTrackingParams {
  userId: string; // From URL path
  source: "NFC" | "QR" | string; // From URL query
}

export interface ScanTrackingResponse {
  message: string;
  success: boolean;
}

// Define the shape of the form data
export interface StatusUpdateFormValues {
  estValue: number;
  status: string;
  statusNotes: string;
}

// Define the shape of the data being sent to the API
export interface UpdateStatusPayload {
  referralId: string;
  newStatus: string;
  notes: string;
}

export interface TrackingRequestBody {
  customPath: string;
  id: string;
}

export interface PersonalizedQR {
  totalScan: number;
  qrCode: string;
  referralUrl: string;
  nfcUrl: string;
  customPath: string;
  todayScan: number;
  active: boolean;
  scanHistory: any[];
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingResponseData {
  userId: string;
  personalizedQR: PersonalizedQR[];
  activeQR: number;
  totalScans: number;
  nfcSetup: number;
  conversionRate: number;
}
