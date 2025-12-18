export interface IntegrationKey {
  _id: string;
  label: string;
  publicKey: string;
  secretKey: string;
  status?: "connected" | "disconnected";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateIntegrationKeyBody {
  label: string;
}

export type CreateIntegrationKeyResponse = Pick<
  IntegrationKey,
  "_id" | "publicKey" | "secretKey"
>;

export type WebhookType = "referral" | "review";
export type WebhookAction = "create" | "update" | "delete" | "getAll";
export type WebhookStatus = "active" | "inActive";

export interface CreateWebhookBody {
  type: WebhookType;
  action: WebhookAction[];
  status: WebhookStatus;
}

export interface WebhookSubscription {
  id: string;
  userId?: string;
  url: string;
  type: WebhookType;
  action: WebhookAction[];
  status: WebhookStatus;
  createdAt: string;
  updatedAt: string;
}

export type UpdateWebhookBody = Partial<CreateWebhookBody>;

export type UpdateWebhookResponse = Pick<
  WebhookSubscription,
  "id" | "type" | "url" | "action" | "status" | "updatedAt"
>;
