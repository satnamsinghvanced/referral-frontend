import {
  CreateFolderRequest,
  CreateFolderResponse,
  GetAllFoldersQuery,
  GetAllFoldersResponse,
  GetFolderDetailsResponse,
  GetImageDetailsResponse,
  MoveImagesRequest,
  SearchImagesQuery,
  SearchImagesResponse,
  UpdateFolderRequest,
  UpdateFolderResponse,
  UpdateImageTagsRequest,
  UpdateImageTagsResponse,
  UploadMediaRequest,
  UploadMediaResponse,
} from "../types/media";
import axios from "./axios";

const FOLDER_API_BASE = "/folder";

export const createFolder = (userId: string, data: CreateFolderRequest) => {
  return axios.post<CreateFolderResponse>(`${FOLDER_API_BASE}/${userId}`, data);
};

export const updateFolderName = (
  folderId: string,
  data: UpdateFolderRequest
) => {
  return axios.put<UpdateFolderResponse>(
    `${FOLDER_API_BASE}/${folderId}`,
    data
  );
};

export const deleteFolder = (folderId: string) => {
  return axios.delete(`${FOLDER_API_BASE}/${folderId}`);
};

export const getFolderDetails = (folderId: string) => {
  return axios.get<GetFolderDetailsResponse>(`${FOLDER_API_BASE}/${folderId}`);
};

export const getAllFolders = (params: GetAllFoldersQuery) => {
  return axios.get<GetAllFoldersResponse>(FOLDER_API_BASE, { params });
};

const IMAGES_API_BASE = "/images";

export const uploadMedia = (data: UploadMediaRequest) => {
  const formData = new FormData();
  formData.append("folderId", data.folderId || "");
  data.images.forEach((file: any) => formData.append("images", file));
  data.files.forEach((file: any) => formData.append("files", file));
  data.tags.forEach((tag: any) => formData.append("tags", tag));

  return axios.post<UploadMediaResponse>(IMAGES_API_BASE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getImageDetails = (imageId: string) => {
  return axios.get<GetImageDetailsResponse>(`${IMAGES_API_BASE}/${imageId}`);
};

export const updateImageTags = (
  imageId: string,
  data: UpdateImageTagsRequest
) => {
  return axios.put<UpdateImageTagsResponse>(
    `${IMAGES_API_BASE}/${imageId}`,
    data
  );
};

export const deleteImage = (imageId: string) => {
  return axios.delete(`${IMAGES_API_BASE}/${imageId}`);
};

export const searchImages = (params: SearchImagesQuery) => {
  return axios.get<SearchImagesResponse>(IMAGES_API_BASE, { params });
};

export const moveImages = (data: MoveImagesRequest) => {
  return axios.post(`${IMAGES_API_BASE}/move`, data);
};
