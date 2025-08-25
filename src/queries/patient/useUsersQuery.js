import { useQuery } from "@tanstack/react-query";

import { fetchPatients } from "../../services/patientApi";

export function usePatientsQuery({ role, status, search, urgency, locations, page, limit }) {
  return useQuery({
    queryKey: ["patients", { role, status, search, urgency, locations, page, limit }],
    queryFn: () => fetchPatients({ role, status, search, urgency, locations, page, limit }),
    keepPreviousData: true,
    staleTime: 1000 * 60,
  });
}

