import {
  ActivityItem,
  ActivityPayload,
  DeleteActivityResponse,
  GetActivitiesQuery,
  GetActivitiesResponse,
  GetActivityDetailResponse,
} from "../types/marketing";
import axios from "./axios";

const BASE_URL = "/marketing-calendar";

export const fetchMarketingActivities = async (
  query: GetActivitiesQuery
): Promise<GetActivitiesResponse> => {
  const response = await axios.get<GetActivitiesResponse>(BASE_URL, {
    params: query,
  });
  return response.data;
};

export const createMarketingActivity = async (
  payload: ActivityPayload
): Promise<ActivityItem> => {
  const response = await axios.post<ActivityItem>(BASE_URL, payload);
  return response.data;
};

export const fetchActivityDetail = async (
  activityId: string
): Promise<GetActivityDetailResponse> => {
  const response = await axios.get<GetActivityDetailResponse>(
    `${BASE_URL}/${activityId}`
  );
  return response.data;
};

export const updateMarketingActivity = async (
  activityId: string,
  payload: ActivityPayload
): Promise<ActivityItem> => {
  const response = await axios.put<ActivityItem>(
    `${BASE_URL}/${activityId}`,
    payload
  );
  return response.data;
};

export const deleteMarketingActivity = async (
  activityId: string
): Promise<DeleteActivityResponse> => {
  const response = await axios.delete<DeleteActivityResponse>(
    `${BASE_URL}/${activityId}`
  );
  return response.data;
};
