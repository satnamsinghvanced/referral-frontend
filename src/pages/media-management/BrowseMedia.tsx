import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState } from "react";
import { FaRegFolder } from "react-icons/fa";
import { FiImage, FiSearch, FiUpload } from "react-icons/fi";
import {
  LuDownload,
  LuFolderOpen,
  LuFolderPlus,
  LuTrash2,
} from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { FaDownload, FaEye } from "react-icons/fa";
import {
  useGetFolderDetails,
  useDeleteFolder,
  useSearchImages,
  useDeleteImage,
  useUpdateImageTags,
  useGetAllFolders,
  useTagsQuery,
} from "../../hooks/useMedia";
import { CreateFolderModal } from "./modal/CreateFolderModal";
import { UploadMediaModal } from "./modal/UploadMediaModal";
import EmptyState from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MediaDetailModal } from "./modal/MediaDetailModal";
import { Media } from "../../types/media";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import { useDebouncedValue } from "../../hooks/common/useDebouncedValue";

const Breadcrumb = ({ path, onNavigate }: any) => (
  <p className="text-sm flex items-center space-x-1">
    <span
      className="cursor-pointer hover:underline underline-offset-2"
      onClick={() => onNavigate(null)}
    >
      Root
    </span>
    {path.map((item: any) => (
      <span key={item.id} className="flex items-center space-x-1">
        <span className="text-gray-400">/</span>
        <span
          className="cursor-pointer hover:underline underline-offset-2"
          onClick={() => onNavigate(item.id)}
        >
          {item.name}
        </span>
      </span>
    ))}
  </p>
);

const MediaItem = ({
  media,
  onDelete,
  onView,
  onDownload,
}: {
  media: Media;
  onDelete: (id: string) => void;
  onView: (media: Media) => void;
  onDownload: (path: string, name: string) => void;
}) => {
  const isVideo = media.type.startsWith("video/");

  return (
    <div
      key={media._id}
      className="relative border border-gray-200 rounded-lg overflow-hidden group bg-white"
    >
      <div className="w-full h-32 flex items-center justify-center bg-gray-100 overflow-hidden">
        {isVideo ? (
          <video
            src={media.path}
            controls={false}
            muted
            className="w-full h-full object-cover"
            title={media.name}
          />
        ) : (
          <img
            src={media.path}
            alt={media.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="p-2">
        <p className="text-xs font-medium truncate mb-0.5">{media.name}</p>
        <div className="space-x-1">
          {media?.tags?.map((tag: string) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full text-[10px] font-medium px-2 py-0.5 border border-primary/15"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex space-x-1.5">
          <Button
            size="sm"
            radius="sm"
            variant="solid"
            color="primary"
            isIconOnly
            onPress={() => onView(media)}
            className="p-0 size-7 min-w-0"
            title="View Media"
          >
            <MdOutlineRemoveRedEye fontSize={14} />
          </Button>

          <Button
            size="sm"
            radius="sm"
            variant="solid"
            color="primary"
            isIconOnly
            onPress={() => onDownload(media.path, media.name)}
            className="p-0 size-7 min-w-0"
            title="Download Media"
          >
            <LuDownload fontSize={14} />
          </Button>

          <Button
            size="sm"
            radius="sm"
            variant="solid"
            color="danger"
            isIconOnly
            onPress={() => onDelete(media._id)}
            className="p-0 size-7 min-w-0"
            title="Delete Media"
          >
            <LuTrash2 fontSize={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

const mockTags = [
  { name: "woman", isSelected: false, color: "bg-blue-500" },
  { name: "red shirt", isSelected: false, color: "bg-red-500" },
  { name: "beach", isSelected: false, color: "bg-cyan-500" },
  { name: "smile", isSelected: false, color: "bg-gray-200" },
];

function BrowseMedia() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumbPath, setBreadcrumbPath] = useState<
    { id: string; name: string }[]
  >([]);

  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isUploadMediaModalOpen, setIsUploadMediaModalOpen] = useState(false);
  const [deleteFolderId, setDeleteFolderId] = useState<string | null>(null);
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);
  const [viewMedia, setViewMedia] = useState<Media | null>(null);

  const [currentFilters, setCurrentFilters] = useState<any>({
    search: "",
    type: "all",
    tags: [],
  });
  // const [availableTags, setAvailableTags] = useState(mockTags);

  const { data: allFolders, isLoading: isAllFoldersLoading } = useGetAllFolders(
    {
      page: 1,
      limit: 10,
    }
  );

  const { data: folderData, isLoading: isLoadingFolder } = useGetFolderDetails(
    currentFolderId as string
  );

  const { data: availableTagsData, isLoading: isTagsLoading } = useTagsQuery();
  const availableTags = availableTagsData?.tags;

  const { mutate: updateImageTags } = useUpdateImageTags(
    viewMedia?._id as string
  );

  const subfolders = folderData?.subfolders || allFolders?.folders;
  const currentFolderName =
    currentFolderId && folderData?.folder?.name
      ? folderData.folder.name
      : "Root";

  const debouncedSearch = useDebouncedValue(currentFilters.search, 500);

  const searchQueryParams = {
    filter: currentFilters.type,
    search: debouncedSearch,
    tags: currentFilters.tags,
  };

  const { data: mediaData, isLoading: isLoadingMedia } =
    useSearchImages(searchQueryParams);

  const isFoldersLoading = isAllFoldersLoading || isLoadingFolder;

  const deleteFolderMutation = useDeleteFolder(deleteFolderId || "");
  const deleteImageMutation = useDeleteImage(deleteImageId || "");

  const onNavigateFolder = (folderId: string | null, folderName?: string) => {
    setCurrentFolderId(folderId);

    if (folderId === null) {
      setBreadcrumbPath([]);
    } else {
      let newPath = [...breadcrumbPath];
      const existingIndex = newPath.findIndex((item) => item.id === folderId);

      if (existingIndex !== -1) {
        newPath = newPath.slice(0, existingIndex + 1);
      } else if (folderName) {
        newPath.push({ id: folderId, name: folderName });
      }

      setBreadcrumbPath(newPath);
    }
  };

  const onFilterChange = (key: string, value: string) => {
    setCurrentFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleToggleTag = (tagName: string) => {
    // setAvailableTags((prevTags) =>
    //   prevTags.map((tag) =>
    //     tag.name === tagName ? { ...tag, isSelected: !tag.isSelected } : tag
    //   )
    // );
    setCurrentFilters((prev: any) => {
      const newTags = prev.tags.includes(tagName)
        ? prev.tags.filter((t: string) => t !== tagName)
        : [...prev.tags, tagName];
      return { ...prev, tags: newTags };
    });
  };

  const clearAllTags = () => {
    // setAvailableTags((prevTags) =>
    //   prevTags.map((tag) => ({ ...tag, isSelected: false }))
    // );
    setCurrentFilters((prev: any) => ({ ...prev, tags: [] }));
  };

  const handleConfirmFolderDelete = async () => {
    if (deleteFolderId) {
      const parentId =
        breadcrumbPath.length > 1
          ? breadcrumbPath[breadcrumbPath.length - 2]?.id
          : null;

      await deleteFolderMutation.mutateAsync();

      setDeleteFolderId(null);
      // Navigate back to the parent folder (or Root if the deleted folder was a top-level folder)
      onNavigateFolder(parentId as string);
    }
  };

  const handleConfirmImageDelete = async () => {
    if (deleteImageId) {
      await deleteImageMutation.mutateAsync();
      setDeleteImageId(null);
    }
  };

  const handleMediaDownload = async (path: string, name: string) => {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {}
  };

  const handleUpdateTags = (mediaId: string, tag: string) => {
    if (viewMedia && viewMedia._id === mediaId) {
      updateImageTags({
        tags: [...viewMedia.tags, tag],
      });

      setViewMedia((prev) =>
        prev ? { ...prev, tags: [...prev.tags, tag] } : null
      );
    }
  };

  const handleMediaView = (media: Media) => {
    setViewMedia(media);
  };

  const currentFolderMediaGroup = mediaData?.find(
    (group: any) =>
      group.folderName ===
      (currentFolderName === "Root" ? "Root" : currentFolderName)
  );
  const currentFolderMedia = currentFolderMediaGroup?.images || [];
  const mediaCount = currentFolderMedia.length;

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4 border border-gray-200 rounded-xl p-4 bg-white">
          <Breadcrumb
            path={breadcrumbPath}
            onNavigate={(id: string) => onNavigateFolder(id)}
          />
          <div className="space-x-2">
            <Button
              size="sm"
              radius="sm"
              variant="ghost"
              startContent={<LuFolderPlus fontSize={15} />}
              className="border-small"
              onPress={() => setIsCreateFolderModalOpen(true)}
            >
              New Folder
            </Button>
            <Button
              size="sm"
              radius="sm"
              variant="ghost"
              startContent={<FiUpload fontSize={15} />}
              className="border-small"
              onPress={() => setIsUploadMediaModalOpen(true)}
            >
              Upload Here
            </Button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-4 bg-white">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search media by name or tags..."
                size="sm"
                value={currentFilters.search}
                onValueChange={(value) =>
                  onFilterChange("search", value as string)
                }
                startContent={<FiSearch className="text-gray-400 h-4 w-4" />}
                className="h-9"
              />
            </div>

            <div className="min-w-[200px]">
              <Select
                aria-label="Media Types"
                size="sm"
                selectedKeys={new Set([currentFilters.type])}
                disabledKeys={new Set([currentFilters.type])}
                onSelectionChange={(keys) =>
                  onFilterChange("type", Array.from(keys)[0] as string)
                }
              >
                <SelectItem key="all">All Media</SelectItem>
                <SelectItem key="image">Images</SelectItem>
                <SelectItem key="video">Videos</SelectItem>
              </Select>
            </div>
          </div>

          <div className="pt-4">
            <h5 className="text-xs font-medium mb-3">Filter by tags:</h5>
            <div className="flex flex-wrap gap-2">
              {availableTags?.map((tag) => {
                const base =
                  "inline-flex items-center rounded-full text-[11px] font-medium px-3 py-0.5 cursor-pointer transition-colors";
                const active = "bg-primary text-white";
                const inactive = "bg-gray-100 hover:bg-gray-200";

                return (
                  <span
                    key={tag}
                    className={`${base} ${
                      currentFilters.tags.includes(tag) ? active : inactive
                    }`}
                    onClick={() => handleToggleTag(tag)}
                  >
                    {tag}
                  </span>
                );
              })}

              {currentFilters.tags.length > 0 && (
                <Button
                  size="sm"
                  radius="full"
                  onPress={clearAllTags}
                  className="border-small p-0 px-1.5 h-auto font-medium border-none bg-transparent underline underline-offset-2 text-gray-600"
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <Card className="border border-gray-200 p-5 shadow-none">
            <CardHeader className="p-0 pb-5 flex justify-between items-center">
              <h4 className="flex items-center gap-2 text-sm font-medium">
                <FaRegFolder className="size-4" />
                Folders
              </h4>
              {currentFolderId && (
                <Button
                  size="sm"
                  radius="sm"
                  variant="ghost"
                  color="danger"
                  startContent={<LuTrash2 fontSize={15} />}
                  className="border-small"
                  onPress={() => setDeleteFolderId(currentFolderId)}
                >
                  Delete Current Folder
                </Button>
              )}
            </CardHeader>
            <CardBody className="p-0">
              {isFoldersLoading ? (
                <LoadingState />
              ) : subfolders?.length === 0 ? (
                <EmptyState title="No subfolders found." />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
                  {subfolders?.map((folder: any) => (
                    <div
                      key={folder._id}
                      className="relative p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => onNavigateFolder(folder._id, folder.name)}
                    >
                      <div className="text-center">
                        <LuFolderOpen className="size-6 mx-auto mb-2 text-blue-500" />
                        <p className="text-sm truncate font-medium mb-1">
                          {folder.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {folder.totalItems} items
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card className="border border-gray-200 p-5 shadow-none">
            <CardHeader className="p-0 pb-5">
              <div className="flex justify-between items-center">
                <h4 className="flex items-center gap-2 text-sm font-medium">
                  <FiImage className="size-4" /> Media ({mediaCount})
                </h4>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              {isFoldersLoading || isLoadingMedia ? (
                <LoadingState />
              ) : mediaCount === 0 ? (
                <div className="text-center text-gray-500 py-12 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <FiImage className="size-10 mx-auto mb-4 opacity-50 text-gray-400" />
                  <p className="mb-4 text-sm">
                    No media found in {currentFolderName}.
                  </p>
                  <Button
                    size="sm"
                    radius="sm"
                    variant="ghost"
                    startContent={<FiUpload className="w-4 h-4" />}
                    className="border-small"
                    onPress={() => setIsUploadMediaModalOpen(true)}
                  >
                    Upload Media
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {currentFolderMedia.map((media: Media) => (
                    <MediaItem
                      key={media._id}
                      media={media}
                      onDelete={setDeleteImageId}
                      onView={handleMediaView}
                      onDownload={handleMediaDownload}
                    />
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        parentFolderId={currentFolderId || ""}
      />

      <UploadMediaModal
        isOpen={isUploadMediaModalOpen}
        onClose={() => setIsUploadMediaModalOpen(false)}
        folderId={currentFolderId}
        folderName={currentFolderName}
      />

      <DeleteConfirmationModal
        isOpen={!!deleteFolderId}
        onClose={() => setDeleteFolderId(null)}
        onConfirm={handleConfirmFolderDelete}
        isLoading={deleteFolderMutation.isPending}
      />

      <DeleteConfirmationModal
        isOpen={!!deleteImageId}
        onClose={() => setDeleteImageId(null)}
        onConfirm={handleConfirmImageDelete}
        isLoading={deleteImageMutation.isPending}
      />

      <MediaDetailModal
        isOpen={!!viewMedia}
        onClose={() => setViewMedia(null)}
        media={viewMedia}
        onAddTag={handleUpdateTags}
        onDownload={handleMediaDownload}
      />
    </>
  );
}

export default BrowseMedia;
