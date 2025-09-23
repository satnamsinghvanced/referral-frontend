import { useQuery } from "@tanstack/react-query";

import { fetchPatients } from "../../services/patientApi";

interface UsePatientsQueryParams {
  role?: string;
  status?: string;
  search?: string;
  urgency?: string;
  locations?: string[];
  page?: number;
  limit?: number;
}

export function usePatientsQuery({ role, status, search, urgency, locations, page, limit }: UsePatientsQueryParams) {
  return useQuery({
    queryKey: ["patients", { role, status, search, urgency, locations, page, limit }],
    queryFn: () => fetchPatients({ role, status, search, urgency, locations, page, limit }),
    keepPreviousData: true,
    staleTime: 1000 * 60,
  });
}

