import { useQuery } from "@tanstack/react-query";
import {
  fetchActivityTypes,
  fetchPermissions,
  fetchRoles,
  fetchSpecialties,
} from "../services/common";
import { ActivityType, Permission, Role, Specialty } from "../types/common";

export const useSpecialties = () =>
  useQuery<Specialty[]>({
    queryKey: ["specialties"],
    queryFn: fetchSpecialties,
  });

export const useRoles = () =>
  useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

export const usePermissions = () =>
  useQuery<Permission[]>({
    queryKey: ["permissions"],
    queryFn: fetchPermissions,
  });

export const useActivityTypes = () =>
  useQuery<ActivityType[]>({
    queryKey: ["activity_types"],
    queryFn: fetchActivityTypes,
  });
