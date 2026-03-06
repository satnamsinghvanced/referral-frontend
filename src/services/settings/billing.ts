import axiosInstance from "../axios";

export interface BillingData {
    id: string;
    name: string;
    price: number;
    nextBillingDate: string;
    billingCycle: string;
    paymentMethod: string;
    cardNumber: string;
    expire: string;
    status: string;
}

export interface BillingResponse {
    status: string;
    message: string;
    success: boolean;
    data: BillingData;
}

export const getBilling = async (): Promise<BillingResponse> => {
    return await axiosInstance.get("/billing");
};
