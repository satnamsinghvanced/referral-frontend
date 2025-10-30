import {
  GoogleApiKeyRequest,
  GoogleApiKeyResponse,
  UserIdParam,
} from "../types/google";
import axios from "./axios";

export const saveGoogleApiKey = async (
  userId: UserIdParam["userId"],
  data: GoogleApiKeyRequest
): Promise<GoogleApiKeyResponse> => {
  const response = await axios.post<GoogleApiKeyResponse>(
    `/review-config/${userId}`,
    data
  );
  return response.data;
};

export const fetchGoogleApiKey = async (
  userId: UserIdParam["userId"]
): Promise<GoogleApiKeyResponse> => {
  const response = await axios.get<GoogleApiKeyResponse>(
    `/review-config/${userId}`
  );
  return response.data;
};

export const updateGoogleApiKey = async (
  userId: UserIdParam["userId"],
  data: GoogleApiKeyRequest
): Promise<GoogleApiKeyResponse> => {
  const response = await axios.put<GoogleApiKeyResponse>(
    `/review-config/${userId}`,
    data
  );
  return response.data;
};
