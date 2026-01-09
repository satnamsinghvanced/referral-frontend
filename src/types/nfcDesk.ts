
export interface NFCDeskCard {
    _id: string;
    userId: string;
    type: string;
    name: string;
    nfcId: string;
    totalTab: number;
    totalReview: number;
    locations: string[];
    teamMember: string | null;
    platform: string;
    status: "active" | "inActive";
    lastScan: string | null;
    createdAt: string;
    updatedAt: string;
    url: string;
}

export interface CreateNFCDeskPayload {
    type: string;
    name: string;
    locations: string[];
    teamMember?: string;
    platform: string;
}

export interface UpdateNFCDeskPayload {
    status?: "active" | "inActive";
    name?: string;
    locations?: string[];
    teamMember?: string;
    platform?: string;
}

export interface NFCDeskResponse {
    status: string;
    message: string;
    success: boolean;
    data: NFCDeskCard;
}

export interface NFCDeskListResponse {
    status: string;
    message: string;
    success: boolean;
    data: {
        docs: NFCDeskCard[];
        totalDocs: number;
        limit: number;
        totalPages: number;
        page: number;
        pagingCounter: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        prevPage: number | null;
        nextPage: number | null;
    };
}
