import axios from "../axios";
import { Location, LocationsResponse } from "../../types/common";

export const fetchLocations = async (params?: {
  page?: number;
  limit?: number;
}): Promise<LocationsResponse<Location>> => {
  const response = axios.get("/location", { params });
  return (await response).data;
};
export const fetchLocationDetails = async (id: string): Promise<Location> => {
  const { data } = await axios.get(`/location/${id}`);
  return data;
};

export const createLocation = async (location: Location): Promise<Location> => {
  const response = axios.post("/location", location);
  return (await response).data;
};
export const updateLocation = async (
  id: string,
  location: Location
): Promise<Location> => {
  const response = axios.put(`/location/${id}`, location);
  return (await response).data;
};

export const deleteLocation = async (
  id: string
): Promise<{ message: string }> => {
  const response = axios.delete(`/location/${id}`);
  return (await response).data;
};
