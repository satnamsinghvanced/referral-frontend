import { EncryptionType } from "../types/integrations/emailMarketing";

export const SOURCES = [
  { value: "referral", label: "Referral" },
  { value: "review", label: "Review" },
];

export const EVENTS = [
  { value: "create", label: "Create" },
  { value: "update", label: "Update" },
  { value: "delete", label: "Delete" },
  { value: "get", label: "Get" },
  { value: "get_all", label: "Get All" },
];

export const PROVIDERS = [
  { label: "SendGrid", value: "SendGrid" },
  { label: "Mailchimp", value: "Mailchimp" },
  { label: "Custom SMTP", value: "CustomSMTP" },
];

export const ENCRYPTION_TYPES: { label: string; value: EncryptionType }[] = [
  { label: "TLS", value: "TLS" },
  { label: "SSL", value: "SSL" },
  { label: "None", value: "None" },
];
