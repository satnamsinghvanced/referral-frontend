import { addToast } from "@heroui/react";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { queryClient } from "../providers/QueryProvider";
import {
  createFolder,
  deleteFolder,
  deleteImages,
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
  DeleteImagesRequest,
  GetAllFoldersQuery,
  GetTagsResponse,
  MoveImagesRequest,
  SearchImagesQuery,
  UpdateFolderRequest,
  UpdateImageTagsRequest,
  UploadMediaRequest,
} from "../types/media";

const FOLDER_KEYS = {
  all: ["folders"] as const,
  list: (query: GetAllFoldersQuery) =>
    [...FOLDER_KEYS.all, "list", query] as const,
  detail: (folderId: string) => [...FOLDER_KEYS.all, folderId] as const,
};

const IMAGE_KEYS = {
  all: ["images"] as const,
  search: (query: SearchImagesQuery) =>
    [...IMAGE_KEYS.all, "search", query] as const,
  detail: (imageId: string) => [...IMAGE_KEYS.all, imageId] as const,
};

const TAGS_KEYS = ["tags"];

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

export const useCreateFolder = () => {
  return useMutation({
    mutationFn: (data: CreateFolderRequest) => createFolder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.all });
      addToast({
        title: "Success",
        description: "Folder created successfully.",
        color: "success",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to create folder";
      addToast({ title: "Error", description: errorMessage, color: "danger" });
    },
  });
};

export const useUpdateFolderName = (folderId: string) => {
  return useMutation({
    mutationFn: (data: UpdateFolderRequest) => updateFolderName(folderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: IMAGE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.detail(folderId) });
      addToast({
        title: "Success",
        description: "Folder name updated successfully.",
        color: "success",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to update folder";
      addToast({ title: "Error", description: errorMessage, color: "danger" });
    },
  });
};

export const useDeleteFolder = (folderId: string) => {
  return useMutation({
    mutationFn: () => deleteFolder(folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: IMAGE_KEYS.all });
      addToast({
        title: "Success",
        description: "Folder deleted successfully.",
        color: "success",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to delete folder";
      addToast({ title: "Error", description: errorMessage, color: "danger" });
    },
  });
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

export const useUploadMedia = (
  onUploadProgress?: (progressEvent: any) => void
) => {
  return useMutation({
    mutationFn: (data: UploadMediaRequest) =>
      uploadMedia(data, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: IMAGE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: TAGS_KEYS });
      addToast({
        title: "Success",
        description: "Media uploaded successfully.",
        color: "success",
      });
    },
    onError: (error: any) => {
      console.log(error);
      const status = error.response?.status;
      const data = error.response?.data as { message?: string; code?: string };

      let errorMessage =
        data?.message || error.message || "Failed to upload media";

      // Enhanced error messages based on status codes and Multer codes
      if (status === 413) {
        errorMessage =
          "File size is too large. Please upload smaller files or check the server limits.";
      } else if (status === 400 && data?.code) {
        switch (data.code) {
          case "LIMIT_FILE_SIZE":
            errorMessage =
              "The file you are trying to upload exceeds the maximum allowed size.";
            break;
          case "LIMIT_FILE_COUNT":
            errorMessage =
              "You have exceeded the maximum number of files allowed.";
            break;
          case "LIMIT_UNEXPECTED_FILE":
            errorMessage = "Unexpected file type or field found in the upload.";
            break;
          case "LIMIT_FIELD_KEY":
            errorMessage = "Field name in the upload is too long.";
            break;
          case "LIMIT_FIELD_VALUE":
            errorMessage = "Field value in the upload is too long.";
            break;
          case "LIMIT_FIELD_COUNT":
            errorMessage = "Too many textual fields in the upload.";
            break;
          default:
            break;
        }
      } else if (status >= 500) {
        errorMessage = "Server error occurred. Please try again later.";
      }

      addToast({ title: "Error", description: errorMessage, color: "danger" });
    },
  });
};

export const useUpdateImageTags = (imageId: string) => {
  return useMutation({
    mutationFn: (data: UpdateImageTagsRequest) =>
      updateImageTags(imageId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: IMAGE_KEYS.detail(imageId) });
      queryClient.invalidateQueries({ queryKey: IMAGE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: TAGS_KEYS });
      addToast({
        title: "Success",
        description: "Image tags updated successfully.",
        color: "success",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to update image tags";
      addToast({ title: "Error", description: errorMessage, color: "danger" });
    },
  });
};

export const useDeleteImages = () => {
  return useMutation({
    mutationFn: (data: DeleteImagesRequest) => deleteImages(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: IMAGE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: TAGS_KEYS });
      addToast({
        title: "Success",
        description: "Selected media deleted successfully.",
        color: "success",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to delete media";
      addToast({ title: "Error", description: errorMessage, color: "danger" });
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
    onError: (error: any) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to move media";
      addToast({ title: "Error", description: errorMessage, color: "danger" });
    },
  });
};

export const useTagsQuery = (): UseQueryResult<GetTagsResponse> => {
  return useQuery({
    queryKey: TAGS_KEYS,
    queryFn: getTags,
  });
};
