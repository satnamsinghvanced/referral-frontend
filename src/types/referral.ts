export interface Referral {
  _id: string;
  referredBy: any;
  addedVia: string;
  name: string;
  age?: number;
  phone: string;
  email?: string;
  treatment?: string;
  priority?: string;
  estValue?: number;
  scheduledDate?: string;
  notes?: string;
  insurance?: string;
  appointment?: string;
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
  createdAt?: string;
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