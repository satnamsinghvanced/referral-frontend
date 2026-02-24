import { useQuery } from "@tanstack/react-query";
import { getLeadStatus } from "../services/leadTracking";

export const useLeadStatus = () => {
    return useQuery({
        queryKey: ["leadStatus"],
        queryFn: getLeadStatus,
    });
};
