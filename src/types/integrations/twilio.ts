export interface TwilioConfigRequest {
  accountId: string;
  authToken: string;
  phone: string; // E.g., "+12185516174"
}

export interface TwilioConfigResponse {
  _id: string;
  userId: string;
  accountId: string;
  authToken: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserIdParam {
  userId: string;
}
