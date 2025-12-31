import { ActivityType, Permission, Role, Specialty } from "../types/common";
import axios from "./axios";

export const fetchSpecialties = async (): Promise<Specialty[]> => {
  const response = await axios.get("/practice");
  return response.data;
};

export const fetchRoles = async (): Promise<Role[]> => {
  const response = await axios.get("/role");
  return response.data;
};

export const fetchPermissions = async (): Promise<Permission[]> => {
  const response = await axios.get("/permission");
  return response.data;
};

export const fetchActivityTypes = async (): Promise<ActivityType[]> => {
  const response = await axios.get("/activity-type");
  return response.data;
};

// You can add more similar requests here
