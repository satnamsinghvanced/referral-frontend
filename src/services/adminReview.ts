import axios from "./axios";
import type { ReviewItem } from "../types/adminReview";

import { AdminReviewApiResponse, MobileAdminReviewApiResponse } from "../types/adminReview";

export const fetchAdminReviewData = async (params?: {
  locationId?: string | undefined;
  module?: string | undefined;
  status?: string | undefined;
  priority?: string | undefined;
  search?: string | undefined;
  sortBy?: string | undefined;
  sortOrder?: "asc" | "desc" | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}): Promise<AdminReviewApiResponse> => {
  const response = await axios.get("/admin-review", { params });
  return response.data?.data || response.data;
};

export const fetchMobileAdminReviewData = async (params?: {
  locationId?: string | undefined;
  module?: string | undefined;
  status?: string | undefined;
  priority?: string | undefined;
  search?: string | undefined;
  sortBy?: string | undefined;
  sortOrder?: "asc" | "desc" | undefined;
}): Promise<MobileAdminReviewApiResponse> => {
  const response = await axios.get("/admin-review/mobile", { params });
  return response.data?.data || response.data;
};

export const updateAdminReviewItemStatus = async (
  id: string,
  data: {
    status: "inReview" | "flagged" | "archived";
    module?: string;
    notes?: string;
  }
) => {
  const response = await axios.patch(`/admin-review/${id}/status`, data);
  return response.data;
};
