import { Referral } from "./referral";
import axiosInstance from "./referralByPass";

export const createReferral = async (payload: Partial<Referral>) => {
    console.log('sending data to server: ', payload)
    const { data } = await axiosInstance.post("/referral", payload);
    console.log('response: ', data)
    return data;
};