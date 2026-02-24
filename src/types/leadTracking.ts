export interface Lead {
    _id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    source: string;
    priority: string;
    assignedTo: string | null;
    estimatedValue: number;
    treatments: string[];
    tags: string[];
    notes: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface LeadStatusData {
    newLead: Lead[];
    contacted: Lead[];
    appointmentScheduled: Lead[];
    noShow: Lead[];
    patientWon: Lead[];
    lost: Lead[];
}

export interface GetLeadStatusResponse {
    status: string;
    message: string;
    success: boolean;
    data: LeadStatusData;
}
