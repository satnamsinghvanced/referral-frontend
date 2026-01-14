import {
  CreateNFCDeskPayload,
  NFCDeskResponse,
  UpdateNFCDeskPayload,
} from "../types/nfcDesk";
import axios from "./axios";

export const createNFCDesk = async (
  payload: CreateNFCDeskPayload
): Promise<NFCDeskResponse> => {
  const response = await axios.post("/nfc_desk", payload);
  return response as any;
};

export const updateNFCDesk = async (
  id: string,
  payload: UpdateNFCDeskPayload
): Promise<NFCDeskResponse> => {
  const response = await axios.patch(`/nfc_desk/${id}`, payload);
  return response as any;
};

export const fetchNFCDesks = async (
  page: number = 1,
  limit: number = 10
): Promise<any> => {
  const response = await axios.get("/nfc_desk", {
    params: { page, limit },
  });
  return response.data;
};

export const deleteNFCDesk = async (id: string): Promise<any> => {
  const response = await axios.delete(`/nfc_desk/${id}`);
  return response as any;
};

export const scanNFCDesk = async (tagId: string): Promise<any> => {
  const response = await axios.post(`/nfc_desk/${tagId}`);
  return response as any;
};

export const fetchNFCDeskById = async (tagId: string): Promise<any> => {
  const response = await axios.get(`/nfc_desk/${tagId}`);
  return response.data;
};

export const submitNFCReview = async (
  tagId: string,
  payload: { locationId: string; review: string }
): Promise<any> => {
  const response = await axios.post(`/nfc_desk/review/${tagId}`, payload);
  return response as any;
};
