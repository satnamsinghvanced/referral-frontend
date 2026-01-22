import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { FaRegFolder } from "react-icons/fa";
import { FiImage, FiSearch, FiUpload } from "react-icons/fi";
import { LuFolderOpen, LuFolderPlus } from "react-icons/lu";
import { LoadingState } from "../../../components/common/LoadingState";
import { useDebouncedValue } from "../../../hooks/common/useDebouncedValue";
import {
  useGetAllFolders,
  useGetFolderDetails,
  useSearchImages,
  useTagsQuery,
} from "../../../hooks/useMedia";
import { Media } from "../../../types/media";
import FolderBreadcrumb from "../FolderBreadcrumb";
import MediaItem from "../MediaItem";
import { CreateFolderModal } from "./CreateFolderModal";
import { UploadMediaModal } from "./UploadMediaModal";

interface GalleryMediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: Media[]) => void;
  preselectedMedia?: Media[];
  allowedImageFormats?: string[];
  maxImageSize?: number;
  allowedVideoFormats?: string[];
  maxVideoSize?: number;
}

function GalleryMediaUploadModal({
  isOpen,
  onClose,
  onSelect,
  preselectedMedia = [],
  allowedImageFormats,
  maxImageSize,
  allowedVideoFormats,
  maxVideoSize,
}: GalleryMediaUploadModalProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumbPath, setBreadcrumbPath] = useState<
    { id: string; name: string }[]
  >([]);

  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isUploadMediaModalOpen, setIsUploadMediaModalOpen] = useState(false);
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [selectedMediaItems, setSelectedMediaItems] = useState<Media[]>([]);

  const [currentFilters, setCurrentFilters] = useState<any>({
    search: "",
    type: "all",
    tags: [],
  });

  const { data: allFolders, isLoading: isAllFoldersLoading } = useGetAllFolders(
    {
      page: 1,
      limit: 10,
    },
  );

  const { data: folderData, isLoading: isLoadingFolder } = useGetFolderDetails(
    currentFolderId as string,
  );

  const { data: availableTagsData } = useTagsQuery();
  const availableTags = availableTagsData?.tags;

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

  const currentFolderMediaGroup = mediaData?.find(
    (group: any) =>
      group.folderName ===
      (currentFolderName === "Root" ? "Root" : currentFolderName),
  );
  const currentFolderMedia = currentFolderMediaGroup?.images || [];

  // Initialize selection from preselected media when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedMediaItems(preselectedMedia);
      setSelectedMediaIds(preselectedMedia.map((m) => m._id));
    }
  }, [isOpen, preselectedMedia]);

  const handleMediaSelect = (isSelected: boolean, media: Media) => {
    if (isSelected) {
      const isImage = media.type.startsWith("image/");
      const isVideo = media.type.startsWith("video/");

      if (isImage) {
        if (allowedImageFormats && !allowedImageFormats.includes(media.type)) {
          addToast({
            title: "Invalid Format",
            description: `Image format ${media.type
              .split("/")[1]
              ?.toUpperCase()} is not supported for selected platforms.`,
            color: "warning",
          });
          return;
        }
        if (maxImageSize && media.size > maxImageSize) {
          addToast({
            title: "File Too Large",
            description: `This image exceeds the size limit for selected platforms.`,
            color: "warning",
          });
          return;
        }
      } else if (isVideo) {
        if (allowedVideoFormats && !allowedVideoFormats.includes(media.type)) {
          addToast({
            title: "Invalid Format",
            description: `Video format ${media.type
              .split("/")[1]
              ?.toUpperCase()} is not supported for selected platforms.`,
            color: "warning",
          });
          return;
        }
        if (maxVideoSize && media.size > maxVideoSize) {
          addToast({
            title: "File Too Large",
            description: `This video exceeds the size limit for selected platforms.`,
            color: "warning",
          });
          return;
        }
      }

      setSelectedMediaIds((prev) => [...prev, media._id]);
      setSelectedMediaItems((prev) => [...prev, media]);
    } else {
      setSelectedMediaIds((prev) => prev.filter((id) => id !== media._id));
      setSelectedMediaItems((prev) =>
        prev.filter((item) => item._id !== media._id),
      );
    }
  };

  const handleConfirmSelect = () => {
    onSelect(selectedMediaItems);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="center"
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: `!m-0 max-h-[90vh]`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 font-normal px-4 pb-4">
          <h4 className="text-base font-medium text-foreground">
            Select Media
          </h4>
          <p className="text-xs text-default-500 dark:text-foreground/40">
            Select images or videos from your library or upload new ones.
          </p>
        </ModalHeader>
        <ModalBody className="px-4 py-0">
          <div className="flex flex-col gap-3.5">
            {/* Top Bar: Breadcrumbs & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 border border-default-200/50 rounded-xl p-3 bg-background">
              <FolderBreadcrumb
                path={breadcrumbPath}
                onNavigate={(id: string) => onNavigateFolder(id)}
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  radius="sm"
                  variant="ghost"
                  startContent={<LuFolderPlus fontSize={15} />}
                  onPress={() => setIsCreateFolderModalOpen(true)}
                  className="border-small border-gray-300 dark:border-default-200 text-gray-700 dark:text-foreground/70"
                >
                  New Folder
                </Button>
                <Button
                  size="sm"
                  radius="sm"
                  variant="solid"
                  color="primary"
                  startContent={<FiUpload fontSize={15} />}
                  onPress={() => setIsUploadMediaModalOpen(true)}
                >
                  Upload Here
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="border border-default-200/50 rounded-xl p-3 bg-background flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search media..."
                    size="sm"
                    value={currentFilters.search}
                    onValueChange={(value) =>
                      onFilterChange("search", value as string)
                    }
                    startContent={
                      <FiSearch className="text-default-400 h-4 w-4" />
                    }
                    classNames={{ inputWrapper: "bg-default-100" }}
                  />
                </div>
                <div className="min-w-[150px]">
                  <Select
                    aria-label="Filter Type"
                    size="sm"
                    selectedKeys={new Set([currentFilters.type])}
                    onSelectionChange={(keys) =>
                      onFilterChange("type", Array.from(keys)[0] as string)
                    }
                    classNames={{ trigger: "bg-default-100" }}
                  >
                    <SelectItem key="all">All Media</SelectItem>
                    <SelectItem key="image">Images</SelectItem>
                    <SelectItem key="video">Videos</SelectItem>
                  </Select>
                </div>
              </div>

              {availableTags && availableTags.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-medium text-default-500 dark:text-foreground/60">
                    Tags:
                  </span>
                  {availableTags?.map((tag) => (
                    <div
                      key={tag}
                      className={`text-[11px] px-2 py-0.5 rounded-full cursor-pointer transition-colors border ${
                        currentFilters.tags.includes(tag)
                          ? "bg-primary text-white border-primary"
                          : "bg-default-100 dark:bg-default-100/50 text-default-600 dark:text-foreground/60 border-default-200 hover:bg-default-200 dark:hover:bg-default-100"
                      }`}
                      onClick={() => handleToggleTag(tag)}
                    >
                      {tag}
                    </div>
                  ))}
                  {currentFilters.tags.length > 0 && (
                    <span
                      className="text-[11px] cursor-pointer underline underline-offset-2 ml-1"
                      onClick={clearAllTags}
                    >
                      Clear
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Folders */}
            <div className="space-y-3.5">
              {/* Folders Section */}
              {subfolders && subfolders.length > 0 && (
                <Card className="shadow-none border border-default-200/50 bg-content1">
                  <CardHeader className="p-3 pb-0">
                    <h5 className="text-small font-medium flex items-center gap-2 text-foreground">
                      <FaRegFolder /> Folders
                    </h5>
                  </CardHeader>
                  <CardBody className="p-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {subfolders.map((folder: any) => (
                        <div
                          key={folder._id}
                          className="flex flex-col items-center justify-center p-3 border border-default-200 rounded-lg cursor-pointer hover:bg-default-100 dark:hover:bg-default-100/50 transition-colors"
                          onClick={() =>
                            onNavigateFolder(folder._id, folder.name)
                          }
                        >
                          <LuFolderOpen className="text-blue-500 text-2xl mb-1" />
                          <span className="text-xs font-medium truncate w-full text-center text-foreground">
                            {folder.name}
                          </span>
                          <span className="text-[10px] text-default-400 dark:text-foreground/40">
                            {folder.totalItems} items
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Media Section */}
              <Card className="shadow-none border border-default-200/50 min-h-[200px] bg-content1">
                <CardHeader className="p-3 pb-0 flex justify-between items-center">
                  <h5 className="text-small font-medium flex items-center gap-2 text-foreground">
                    <FiImage /> Media ({currentFolderMedia.length})
                  </h5>
                </CardHeader>
                <CardBody className="p-3">
                  {isFoldersLoading || isLoadingMedia ? (
                    <LoadingState />
                  ) : currentFolderMedia.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-default-400 dark:text-foreground/20">
                      <FiImage className="text-4xl mb-2 opacity-30 text-gray-400 dark:text-foreground/30" />
                      <p className="text-small text-gray-500 dark:text-foreground/40">
                        No media found in {currentFolderName}.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {currentFolderMedia.map((media: Media) => (
                        <MediaItem
                          key={media._id}
                          media={media}
                          // Disable unrelated actions
                          onDelete={() => {}}
                          onView={() => {}}
                          onDownload={() => {}}
                          onSelect={(isSelected) =>
                            handleMediaSelect(isSelected, media)
                          }
                          selectedMedia={selectedMediaIds}
                        />
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="p-4">
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            color="default"
            onPress={onClose}
            className="border-small border-gray-300 dark:border-default-200 text-gray-700 dark:text-foreground/70"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            radius="sm"
            variant="solid"
            color="primary"
            onPress={handleConfirmSelect}
            isDisabled={selectedMediaIds.length === 0}
          >
            Select{" "}
            {selectedMediaIds.length > 0 && `(${selectedMediaIds.length})`}
          </Button>
        </ModalFooter>
      </ModalContent>

      {/* Sub-modals */}
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
        allowedImageFormats={allowedImageFormats}
        maxImageSize={maxImageSize}
        allowedVideoFormats={allowedVideoFormats}
        maxVideoSize={maxVideoSize}
      />
    </Modal>
  );
}

export default GalleryMediaUploadModal;
