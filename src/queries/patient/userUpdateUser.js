import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePatient } from "../../services/patientApi";

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patientData }) => updatePatient(id, patientData),
    onSuccess: () => {
      queryClient.invalidateQueries(["patients"]);
    },
    onError: (error) => {
      console.error("❌ Update failed:", error);
    },
  });
}
