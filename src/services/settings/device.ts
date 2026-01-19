import { Device } from "../../types/device";
import axios from "../axios";

export const fetchDevices = async (): Promise<Device[]> => {
  const response = await axios.get("/devices-tracking");
  return response.data.data;
};

export const toggleDevice = async (
  id: string,
  toggle: boolean,
): Promise<Device> => {
  const response = await axios.patch(`/devices-tracking/${id}`, { toggle });
  return response.data.data;
};

export const removeDevice = async (id: string): Promise<void> => {
  await axios.delete(`/devices-tracking/${id}`);
};
