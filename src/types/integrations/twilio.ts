export interface TwilioConfigRequest {
  accountId?: string;
  authToken?: string;
  phone?: string;
  status?: string;
}

export interface TwilioConfigResponse {
  _id: string;
  userId: string;
  accountId: string;
  authToken: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
  accountName?: string;
  accountEmail?: string;
  accountAvatar?: string;
  balance?: number;
  minutesLimit?: number;
  minutesUsed?: number;
}

export interface UserIdParam {
  userId: string;
}
