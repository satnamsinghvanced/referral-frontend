export interface ClientAccount {
  id: string;
  displayClientId?: string;
  initials: string;
  practiceName: string;
  owner: string;
  email?: string;
  phone?: string;
  location: string;
  status: "Active" | "Trial" | "Past Due" | "Onboarding" | "Suspended" | "Cancelled";
  statusSubtext?: string;
  plan: "Growth" | "Scale" | "Starter" | "Enterprise";
  mrr: number | null;
  lastActive: string;
  updatedAt?: string;
  nextBillingDate?: string;
  leads?: number;
  referrals?: number;
  reviewScore?: string;
  joinedDate?: string;
  assignedRep?: string;
  tags?: string[];
  internalNotes?: string;
  phoneService?: any;
  telecom?: any;
}

export interface StatsSummary {
  total: number;
  active: number;
  trials: number;
  atRisk: number;
  mrr: number;
}

export interface FormMessage {
  text: string;
  isError: boolean;
}

export interface ImpersonatePayload {
  adminId: string;
  email: string;
}

export interface ImpersonateResponse {
  accessToken?: string;
  refreshToken?: string;
  user?: any;
  message?: string;
}

export interface UpdateNotesTagsPayload {
  tags?: string[];
  internalNotes?: string;
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface LoginSuperAdminPayload {
  email: string;
  password: string;
}