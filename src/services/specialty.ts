import axios from "./axios";
import { SpecialtyItem, CreateSpecialtyPayload, UpdateSpecialtyPayload } from "../types/specialty";

export const fetchSpecialtiesList = async (): Promise<SpecialtyItem[]> => {
  const res: any = await axios.get("/practice");
  const responseData = res?.data || res;
  if (Array.isArray(responseData)) {
    return responseData;
  }
  if (Array.isArray(responseData?.data)) {
    return responseData.data;
  }
  return [];
};

export const createSpecialty = async (payload: CreateSpecialtyPayload): Promise<SpecialtyItem> => {
  const res: any = await axios.post("/practice", payload);
  return res?.data || res;
};

export const updateSpecialty = async (id: string, payload: UpdateSpecialtyPayload): Promise<SpecialtyItem> => {
  const res: any = await axios.put(`/practice/${id}`, payload);
  return res?.data || res;
};

export const deleteSpecialty = async (id: string): Promise<any> => {
  const res: any = await axios.delete(`/practice/${id}`);
  return res?.data || res;
};
