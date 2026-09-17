export interface PhoneNumber {
  id: string;
  phoneNumber: string;
  label: string;
  status: "Active" | "Pending" | string;
  capabilities: { voice: boolean; SMS: boolean; MMS: boolean };
}

export interface A2PRegistrationData {
  _id?: string;
  status?: "pending" | "approved" | "failed" | string;
  customerProfileStatus?: string;
  customerProfileBundleSid?: string;
  brandStatus?: string;
  brandSid?: string;
  campaignStatus?: string;
  campaignSid?: string;
  campaignName?: string;
  ein?: string;
  selectedNumbers?: string[];
  rejectionReason?: string;
  [key: string]: any;
}

export interface StageStatus {
  status: string;
  label: string;
  type: "success" | "warning" | "danger" | "neutral";
}
