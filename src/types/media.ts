interface Pagination {
  totalData: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface Folder {
  _id: string;
  userId: string;
  name: string;
  parentFolder: string | null;
  images: any[];
  createdAt: string;
  updatedAt: string;
  totalImages: number;
}

export interface CreateFolderRequest {
  name: string;
  parentFolder: string | null;
}

export type CreateFolderResponse = Omit<Folder, "totalImages">;

export interface UpdateFolderRequest {
  name: string;
}

export type UpdateFolderResponse = Omit<Folder, "totalImages">;

export interface GetFolderDetailsResponse {
  folder: Folder;
  subfolders: Folder[];
  subfolderPagination: Omit<Pagination, "pageSize">;
}

export interface GetAllFoldersQuery {
  page: number;
  limit: number;
}

export interface GetAllFoldersResponse {
  folders: Folder[];
  pagination: Pagination;
}

export interface Media {
  _id: string;
  name: string;
  path: string;
  type: string; // e.g., 'image/png', 'video/mp4'
  size: number; // e.g., "0.00 MB"
  createdAt: string; // e.g., "11/18/2025, 4:00:24 PM"
  folderName: string; // e.g., "Root"
  tags: string[]; // e.g., ["abc", "referral"]
}

export interface Image {
  _id: string;
  userId: string;
  name: string;
  size: number | string;
  type: string;
  path: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UploadMediaRequest {
  folderId: string | null;
  images: File[];
  files: File[];
  tags: string[];
}

export type UploadMediaResponse = Image[];

export interface GetImageDetailsResponse extends Omit<Image, "size"> {
  size: string;
  folder: {
    name: string;
    createdAt: string;
  };
}

export interface UpdateImageTagsRequest {
  tags: string[];
}

export type UpdateImageTagsResponse = Omit<Image, "size"> & { size: number };

export interface SearchImagesQuery {
  filter: "all" | "images" | "videos" | string;
  search: string;
}

export interface SearchImageItem extends Omit<Image, "size"> {
  size: number;
  folderName: string;
}

export interface SearchImagesGroup {
  folderName: string;
  images: SearchImageItem[];
}

export type SearchImagesResponse = SearchImagesGroup[];

export interface MoveImagesRequest {
  imageIds: string[];
  folderId: string;
}

export interface DeleteImagesRequest {
  ids: string[];
}

export type Tag = string;

// Define the structure of the API response data
export interface GetTagsResponse {
  tags: Tag[];
  totalTags: number;
}
