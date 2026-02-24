import { GetLeadStatusResponse, LeadStatusData } from "../types/leadTracking";
import axios from "./axios";

export const getLeadStatus = async (): Promise<LeadStatusData> => {
    const response: any = await axios.get<GetLeadStatusResponse>("/lead/status");
    return response.data;
};

