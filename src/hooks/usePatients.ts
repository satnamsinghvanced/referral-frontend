// src/hooks/usePatients.ts
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import {
  createPatient,
  // fetchPatients,
  fetchReferral,
  fetchReferrer,
  PatientData,
  updatePatient,
} from "../services/referral";
import { queryClient } from "../providers/QueryProvider";

// 🔹 Patients Query
interface UsePatientsQueryParams {
  role?: string;
  status?: string;
  search?: string;
  urgency?: string;
  locations?: string[];
  page?: number;
  limit?: number;
}

export function usefetchReferralQuery(params: UsePatientsQueryParams) {
  return useQuery({
    queryKey: ["referral", params],
    queryFn: () => fetchReferral(params),
    placeholderData: keepPreviousData,
    // staleTime: 1000 * 60, // 1 min cache
  });
}

export function usefetchReferrerQuery(params: UsePatientsQueryParams) {
  return useQuery({
    queryKey: ["referrer", params],
    queryFn: () => fetchReferrer(params),
    placeholderData: keepPreviousData,
    // staleTime: 1000 * 60, // 1 min cache
  });
}

// 🔹 Create Patient
export function useCreatePatient() {
  return useMutation({
    mutationFn: (params: { patientData: PatientData; type: string }) => createPatient(params.patientData, params.type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["createPatient"] });
    },
  });
}


// 🔹 Update Patient
interface UpdatePatientVariables {
  id: string;
  patientData: PatientData;
}

export function useUpdatePatient() {
  return useMutation({
    mutationFn: ({ id, patientData }: UpdatePatientVariables) =>
      updatePatient(id, patientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (error: unknown) => {
      console.error("❌ Update failed:", error);
    },
  });
}
