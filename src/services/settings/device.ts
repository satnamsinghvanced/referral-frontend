import { Device, DeviceResponse } from "../../types/device";
import axios from "../axios";

export const fetchDevices = async (params: {
  page: number;
  limit: number;
}): Promise<DeviceResponse> => {
  const response = await axios.get("/devices-tracking", { params });
  return response.data;
};

export const toggleDevice = async (
  id: string,
  toggle: boolean,
): Promise<Device> => {
  const response = await axios.patch(`/devices-tracking/${id}`, { toggle });
  return response.data;
};

export const removeDevice = async (id: string): Promise<void> => {
  await axios.delete(`/devices-tracking/${id}`);
};
