export interface GoogleApiKeyRequest {
  googleKey: string;
}

export interface GoogleApiKeyResponse {
  _id: string;
  userId: string;
  googleKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserIdParam {
  userId: string;
}
