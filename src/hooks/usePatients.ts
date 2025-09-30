// src/hooks/usePatients.ts
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import {
  createPatient,
  fetchPatients,
  PatientData,
  updatePatient,
} from "../services/patient";
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

export function usePatientsQuery(params: UsePatientsQueryParams) {
  return useQuery({
    queryKey: ["patients", params],
    queryFn: () => fetchPatients(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60, // 1 min cache
  });
}

// 🔹 Create Patient
export function useCreatePatient() {
  return useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
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
