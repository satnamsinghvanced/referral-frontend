import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePatient } from "../../services/patientApi";

interface PatientData {
  name: string;
  age: number;
  email: string;
}

interface UpdatePatientVariables {
  id: string;
  patientData: PatientData;
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patientData }: UpdatePatientVariables) => updatePatient(id, patientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (error: unknown) => {
      console.error("❌ Update failed:", error);
    },
  });
}
