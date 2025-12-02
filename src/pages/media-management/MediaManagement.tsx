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
import { LuFolderOpen, LuFolderPlus, LuMove, LuTrash2 } from "react-icons/lu";
import ComponentContainer from "../../components/common/ComponentContainer";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import EmptyState from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";
import { useDebouncedValue } from "../../hooks/common/useDebouncedValue";
import {
  useDeleteFolder,
  useDeleteImages,
  useGetAllFolders,
  useGetFolderDetails,
  useSearchImages,
  useTagsQuery,
  useUpdateImageTags,
} from "../../hooks/useMedia";
import { Media } from "../../types/media";
import FolderBreadcrumb from "./FolderBreadcrumb";
import MediaItem from "./MediaItem";
import { CreateFolderModal } from "./modal/CreateFolderModal";
import { MediaDetailModal } from "./modal/MediaDetailModal";
import { MoveMediaModal } from "./modal/MoveMediaModal";
import { UploadMediaModal } from "./modal/UploadMediaModal";

function MediaManagement() {
  const HEADING_DATA = {
    heading: "Media Management",
    subHeading:
      "Organize and manage your images and videos with tags and folders.",
    buttons: [],
  };

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumbPath, setBreadcrumbPath] = useState<
    { id: string; name: string }[]
  >([]);

  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isUploadMediaModalOpen, setIsUploadMediaModalOpen] = useState(false);
  const [deleteFolderId, setDeleteFolderId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteMediaId, setDeleteMediaId] = useState<string>("");
  const [viewMedia, setViewMedia] = useState<Media | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<any>([]);

  const [currentFilters, setCurrentFilters] = useState<any>({
    search: "",
    type: "all",
    tags: [],
  });

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
  const deleteImagesMutation = useDeleteImages();

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
    setCurrentFilters((prev: any) => {
      const newTags = prev.tags.includes(tagName)
        ? prev.tags.filter((t: string) => t !== tagName)
        : [...prev.tags, tagName];
      return { ...prev, tags: newTags };
    });
  };

  const clearAllTags = () => {
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
      onNavigateFolder(parentId as string);
    }
  };

  const handleConfirmImagesDelete = async () => {
    await deleteImagesMutation.mutateAsync(
      {
        imageIds: deleteMediaId ? [deleteMediaId] : selectedMedia,
      },
      {
        onSuccess: () => {
          setSelectedMedia([]);
          setDeleteMediaId("");
        },
      }
    );
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
      <ComponentContainer headingData={HEADING_DATA}>
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4 border border-gray-200 rounded-xl p-4 bg-white">
            <FolderBreadcrumb
              path={breadcrumbPath}
              onNavigate={(id: string) => onNavigateFolder(id)}
            />
            <div className="space-x-2">
              {selectedMedia.length > 0 && (
                <>
                  {/* <Button
                    size="sm"
                    radius="sm"
                    variant="ghost"
                    color="danger"
                    startContent={<LuTrash2 fontSize={15} />}
                    className="border-small"
                    onPress={() => {
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    Delete
                  </Button> */}
                  <Button
                    size="sm"
                    radius="sm"
                    variant="ghost"
                    startContent={<LuMove fontSize={15} />}
                    className="border-small"
                    onPress={() => setIsMoveModalOpen(true)}
                  >
                    Move
                  </Button>
                </>
              )}
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

            {availableTags && availableTags.length > 0 && (
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
            )}
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
                        onClick={() =>
                          onNavigateFolder(folder._id, folder.name)
                        }
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
                        onDelete={(id) => {
                          setIsDeleteModalOpen(true);
                          setDeleteMediaId(id);
                        }}
                        onView={handleMediaView}
                        onDownload={handleMediaDownload}
                        onSelect={(isSelected, mediaId) => {
                          if (isSelected) {
                            setSelectedMedia((prev: any) => [...prev, mediaId]);
                          } else {
                            setSelectedMedia((prev: any) =>
                              prev?.filter((item: string) => item != mediaId)
                            );
                          }
                        }}
                        selectedMedia={selectedMedia}
                      />
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </ComponentContainer>

      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        parentFolderId={currentFolderId || ""}
      />

      <MoveMediaModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        selectedMedia={selectedMedia}
        setSelectedMedia={setSelectedMedia}
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
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmImagesDelete}
        isLoading={deleteImagesMutation.isPending}
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

export default MediaManagement;
