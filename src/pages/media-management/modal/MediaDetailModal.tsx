import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { useState } from "react";
import { FiDownload, FiPlus } from "react-icons/fi";
import { Media } from "../../../types/media";
import { formatDateToReadable } from "../../../utils/formatDateToReadable";
import { formatFileSize } from "../../../utils/formatFileSize";

interface MediaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: Media | null;
  onAddTag: (mediaId: string, tag: string) => void;
  onDownload: (mediaPath: string, mediaName: string) => void;
}

const MediaPreview = ({ media }: { media: Media }) => {
  const isVideo = media.type.startsWith("video/");
  if (isVideo) {
    return (
      <div className="w-full relative flex items-center justify-center bg-black">
        <video
          src={`${import.meta.env.VITE_IMAGE_URL}${media.path}`}
          controls
          className="max-w-full max-h-full object-contain"
        />
      </div>
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center">
      <img
        src={`${import.meta.env.VITE_IMAGE_URL}${media.path}`}
        alt={media.name}
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
};

export function MediaDetailModal({
  isOpen,
  onClose,
  media,
  onAddTag,
  onDownload,
}: MediaDetailModalProps) {
  const [newTag, setNewTag] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [tagError, setTagError] = useState<string | null>(null);

  if (!media) return null;

  const handleAddTag = () => {
    setTagError(null);
    const trimmedTag = newTag.trim();
    const tagExists = media.tags.some(
      (tag) => tag.toLowerCase() === trimmedTag.toLowerCase()
    );
    if (!trimmedTag) {
      setTagError("Tag cannot be empty.");
      return;
    }
    if (tagExists) {
      setTagError(`Tag '${trimmedTag}' already exists.`);
      return;
    }
    if (trimmedTag.length > 30) {
      setTagError("Tag is too long (max 30 characters).");
      return;
    }
    onAddTag(media._id, trimmedTag);
    setNewTag("");
    setIsPopoverOpen(false);
  };

  const handlePopoverChange = (open: boolean) => {
    setIsPopoverOpen(open);
    if (!open) {
      setNewTag("");
      setTagError(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent className="max-h-[90vh] p-5">
        <ModalHeader className="flex flex-col gap-2 text-center sm:text-left p-0 font-normal">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-base font-medium">{media.name}</h4>
              <p className="text-gray-500 text-xs p-0">
                Preview and manage media file details, tags, and metadata
              </p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="max-h-[70vh] overflow-auto px-0 py-4">
          <div className="space-y-4">
            <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center bg-primary/5 py-4">
              <MediaPreview media={media} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-xs font-medium space-y-0.5">
                <p className="text-gray-600">File Size</p>
                <p>{formatFileSize(media.size)}</p>
              </div>
              <div className="text-xs font-medium space-y-0.5">
                <p className="text-gray-600">Type</p>
                <p>{media.type}</p>
              </div>
              <div className="text-xs font-medium space-y-0.5">
                <p className="text-gray-600">Uploaded</p>
                <p>{formatDateToReadable(media.createdAt, true)}</p>
              </div>
              <div className="text-xs font-medium space-y-0.5">
                <p className="text-gray-600">Folder</p>
                <p>{media.folderName}</p>
              </div>
            </div>

            <div className="text-xs space-y-0.5">
              <p className="font-medium text-gray-600">Tags</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {media.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full text-[11px] font-medium px-2 py-0.5 border border-primary/15"
                  >
                    {tag}
                  </span>
                ))}
                {media.tags.length === 0 && (
                  <p className="text-xs text-gray-500 italic">
                    No tags applied.
                  </p>
                )}
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="p-0">
          <Popover
            isOpen={isPopoverOpen}
            onOpenChange={handlePopoverChange}
            radius="md"
          >
            <PopoverTrigger>
              <Button
                size="sm"
                radius="sm"
                variant="ghost"
                startContent={<FiPlus className="h-3.5 w-3.5" />}
                className="border-small"
              >
                Add Tag
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2.5 z-50">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a new tag..."
                  size="sm"
                  radius="sm"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className={tagError ? "border-danger" : ""}
                />
                <Button
                  size="sm"
                  radius="sm"
                  isIconOnly
                  color="primary"
                  onPress={handleAddTag}
                >
                  <FiPlus className="h-4 w-4" />
                </Button>
              </div>
              {tagError && (
                <p className="text-xs text-danger mt-2 font-medium">
                  {tagError}
                </p>
              )}
            </PopoverContent>
          </Popover>

          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            startContent={<FiDownload className="size-3.5" />}
            onPress={() => onDownload(media.path, media.name)}
            className="border-small"
          >
            Download
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
