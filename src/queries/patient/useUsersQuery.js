import { useQuery } from "@tanstack/react-query";

import { fetchPatients } from "../../services/patientApi";

export function usePatientsQuery({ role = "patient", status = "", search = "", urgency = "", page = 1, limit = 10 }) {
  return useQuery({
    queryKey: ["patients", { role, status, search, urgency, page, limit }],
    queryFn: () => fetchPatients({ role, status, search, urgency, page, limit }),
    keepPreviousData: true, // keeps old data during refetch
    staleTime: 1000 * 60,  
  });
}

