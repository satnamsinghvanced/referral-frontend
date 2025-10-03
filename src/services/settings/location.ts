import axios from "../axios";

export interface Location {
  _id?: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
  };
  phone: string;
  isPrimary: boolean;
}

// 🔹 Get all locations
export const fetchLocations = async (): Promise<Location[]> => {
  const response = axios.get("/location");
  return (await response).data;
};

export const fetchLocationDetails = async (id: string): Promise<Location> => {
  const { data } = await axios.get(`/location/${id}`);
  return data; // backend should return a single location object
};

// 🔹 Create new location
export const createLocation = async (location: Location): Promise<Location> => {
  const response = axios.post("/location/create", location);
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
