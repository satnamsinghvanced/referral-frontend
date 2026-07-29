export interface PlanLimits {
  referral_connections: number;
  email_contacts: number;
  automation_flows: number;
  user_accounts: number;
  sms_messages: number;
  locations: number;
}

export interface PlanAccess {
  basic_referral_tracking: boolean;
  advanced_referral_tracking: boolean;
  marketing_calendar: boolean;
  budget_tracking: boolean;
  google_business: boolean;
  social_media: boolean;
  basic_analytics: boolean;
  roi_analytics: boolean;
  call_tracking: boolean;
  sms_marketing: boolean;
  canva_integration: boolean;
  white_label: boolean;
  custom_integrations: boolean;
  advanced_automation: boolean;
  dedicated_account_manager: boolean;
}

export interface BillingData {
  id: string;
  planId?: string;
  name: string;
  price: number;
  nextBillingDate: string;
  billingCycle: string;
  paymentMethod: string;
  cardNumber: string;
  expire: string;
  status: string;
  limits?: PlanLimits;
  access?: PlanAccess;
  features?: string[];
}
