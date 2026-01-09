import axios from "../axios";
import { Location, LocationsResponse } from "../../types/common";

// 🔹 Get all locations
// 🔹 Get all locations
export const fetchLocations = async (params?: {
  page?: number;
  limit?: number;
}): Promise<LocationsResponse<Location>> => {
  const response = axios.get("/location", { params });
  return (await response).data;
};
export const fetchLocationDetails = async (id: string): Promise<Location> => {
  const { data } = await axios.get(`/location/${id}`);
  return data; // backend should return a single location object
};

// 🔹 Create new location
export const createLocation = async (location: Location): Promise<Location> => {
  const response = axios.post("/location", location);
  return (await response).data;
};
// 🔹 Update location
export const updateLocation = async (
  id: string,
  location: Location
): Promise<Location> => {
  const response = axios.put(`/location/${id}`, location);
  return (await response).data;
};

// 🔹 Delete location
export const deleteLocation = async (
  id: string
): Promise<{ message: string }> => {
  const response = axios.delete(`/location/${id}`);
  return (await response).data;
};
