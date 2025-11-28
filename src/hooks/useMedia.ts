import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { queryClient } from "../providers/QueryProvider";
import {
  createFolder,
  deleteFolder,
  deleteImage,
  getAllFolders,
  getAllFoldersWithChildFolders,
  getFolderDetails,
  getImageDetails,
  getTags,
  moveImages,
  searchImages,
  updateFolderName,
  updateImageTags,
  uploadMedia,
} from "../services/media";
import {
  CreateFolderRequest,
  GetAllFoldersQuery,
  GetTagsResponse,
  MoveImagesRequest,
  SearchImagesQuery,
  UpdateFolderRequest,
  UpdateImageTagsRequest,
  UploadMediaRequest,
} from "../types/media";
import { addToast } from "@heroui/react";

const FOLDER_KEYS = {
  all: ["folders"] as const,
  list: (query: GetAllFoldersQuery) =>
    [...FOLDER_KEYS.all, "list", query] as const,
  detail: (folderId: string) => [...FOLDER_KEYS.all, folderId] as const,
};

export const useGetAllFolders = (query: GetAllFoldersQuery) => {
  return useQuery({
    queryKey: FOLDER_KEYS.list(query),
    queryFn: async () => (await getAllFolders(query)).data,
    placeholderData: (previousData) => previousData,
  });
};

export const useGetAllFoldersWithChildFolders = () => {
  return useQuery({
    queryKey: ["folders"],
    queryFn: async () => (await getAllFoldersWithChildFolders()).data,
  });
};

export const useGetFolderDetails = (folderId: string) => {
  return useQuery({
    queryKey: FOLDER_KEYS.detail(folderId),
    queryFn: async () => (await getFolderDetails(folderId)).data,
    enabled: !!folderId,
  });
};

export const useCreateFolder = (userId: string) => {
  return useMutation({
    mutationFn: (data: CreateFolderRequest) => createFolder(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.all });
    },
    onError: (error) => {
      addToast({
        title: "Failed",
        description:
          error.response.data.message || "An unknown error occurred.",
        color: "danger",
      });
    },
  });
};

export const useUpdateFolderName = (folderId: string) => {
  return useMutation({
    mutationFn: (data: UpdateFolderRequest) => updateFolderName(folderId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.detail(folderId) });
      queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.all });
    },
    onError: (error) => {
      addToast({
        title: "Failed",
        description:
          error.response.data.message || "An unknown error occurred.",
        color: "danger",
      });
    },
  });
};

export const useDeleteFolder = (folderId: string) => {
  return useMutation({
    mutationFn: () => deleteFolder(folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: IMAGE_KEYS.all });
    },
    onError: (error) => {
      addToast({
        title: "Failed",
        description:
          error.response.data.message || "An unknown error occurred.",
        color: "danger",
      });
    },
  });
};

const IMAGE_KEYS = {
  all: ["images"] as const,
  search: (query: SearchImagesQuery) =>
    [...IMAGE_KEYS.all, "search", query] as const,
  detail: (imageId: string) => [...IMAGE_KEYS.all, imageId] as const,
};

export const useSearchImages = (query: SearchImagesQuery) => {
  return useQuery({
    queryKey: IMAGE_KEYS.search(query),
    queryFn: async () => (await searchImages(query)).data,
  });
};

export const useGetImageDetails = (imageId: string) => {
  return useQuery({
    queryKey: IMAGE_KEYS.detail(imageId),
    queryFn: async () => (await getImageDetails(imageId)).data,
    enabled: !!imageId,
  });
};

export const useUploadMedia = () => {
  return useMutation({
    mutationFn: (data: UploadMediaRequest) => uploadMedia(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: IMAGE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.all });
    },
    onError: (error) => {
      addToast({
        title: "Failed",
        description:
          error.response.data.message || "An unknown error occurred.",
        color: "danger",
      });
    },
  });
};

export const useUpdateImageTags = (imageId: string) => {
  return useMutation({
    mutationFn: (data: UpdateImageTagsRequest) =>
      updateImageTags(imageId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: IMAGE_KEYS.detail(imageId) });
      queryClient.invalidateQueries({ queryKey: IMAGE_KEYS.all });
    },
    onError: (error) => {
      addToast({
        title: "Failed",
        description:
          error.response.data.message || "An unknown error occurred.",
        color: "danger",
      });
    },
  });
};

export const useDeleteImage = (imageId: string) => {
  return useMutation({
    mutationFn: () => deleteImage(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: IMAGE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.all });
    },
    onError: (error) => {
      addToast({
        title: "Failed",
        description:
          error.response.data.message || "An unknown error occurred.",
        color: "danger",
      });
    },
  });
};

export const useMoveImages = () => {
  return useMutation({
    mutationFn: (data: MoveImagesRequest) => moveImages(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: IMAGE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.all });

      addToast({
        title: "Success",
        description: "Media moved successfully.",
        color: "success",
      });
    },
  });
};

const TAGS_QUERY_KEY = ["tags"];

/**
 * Custom hook to fetch the list of image tags.
 * @returns A Tanstack Query result object.
 */
export const useTagsQuery = (): UseQueryResult<GetTagsResponse> => {
  return useQuery({
    queryKey: TAGS_QUERY_KEY,
    queryFn: getTags,
  });
};
