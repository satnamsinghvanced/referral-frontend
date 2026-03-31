export interface TwilioConfigRequest {
  accountId?: string;
  authToken?: string;
  phone?: string; // E.g., "+12185516174"
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
}

export interface UserIdParam {
  userId: string;
}
