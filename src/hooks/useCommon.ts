import { useQuery } from "@tanstack/react-query";
import {
  fetchActivityTypes,
  fetchPermissions,
  fetchRoles,
  fetchSpecialties,
} from "../services/common";

export const useSpecialties = () =>
  useQuery({
    queryKey: ["specialties"],
    queryFn: fetchSpecialties,
  });

export const useRoles = () =>
  useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

export const usePermissions = () =>
  useQuery({
    queryKey: ["permissions"],
    queryFn: fetchPermissions,
  });

export const useActivityTypes = () =>
  useQuery({
    queryKey: ["activity_types"],
    queryFn: fetchActivityTypes,
  });
