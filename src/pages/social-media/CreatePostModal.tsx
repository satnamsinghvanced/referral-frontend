import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import React, { useCallback, useMemo, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import {
  FiCheckCircle,
  FiHash,
  FiImage,
  FiSend,
  FiUpload,
  FiVideo,
  FiX,
} from "react-icons/fi";
import { Media } from "../../types/media";
import GalleryMediaUploadModal from "../media-management/modal/GalleryMediaUploadModal";

// --- Dynamic Data ---

const PLATFORMS = [
  { name: "Facebook", emoji: "📘" },
  { name: "Instagram", emoji: "📷" },
  { name: "LinkedIn", emoji: "💼" },
  { name: "Twitter", emoji: "🐦" },
  { name: "YouTube", emoji: "📺" },
  { name: "TikTok", emoji: "🎵" },
];

const ALL_SUGGESTED_HASHTAGS = [
  "#OrthodonticCare",
  "#SmileTransformation",
  "#BracesLife",
  "#Invisalign",
  "#HealthySmile",
  "#OrthodonticsSpecialist",
  "#StraightTeeth",
  "#DentalHealth",
  "#SmileMakeover",
  "#TeenBraces",
  "#AdultOrthodontics",
];

// --- Subcomponents ---

const PlatformButton = ({ platform, isSelected, onClick }: any) => {
  const selectedClasses = isSelected
    ? "border-none !bg-blue-50 text-primary-600 ring-2 ring-primary-600/50"
    : "border-gray-200 hover:bg-gray-50";

  return (
    <Button
      variant="light"
      className={`h-16 flex flex-col items-center justify-center gap-1 border ${selectedClasses}`}
      onPress={() => onClick(platform.name)}
    >
      <span className="text-lg">{platform.emoji}</span>
      <span className="text-xs">{platform.name}</span>
    </Button>
  );
};

// --- Main Modal Component ---

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [postContent, setPostContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [publishSchedule, setPublishSchedule] = useState("publish-now");
  const [hashtagInput, setHashtagInput] = useState("");
  const [activeHashtags, setActiveHashtags] = useState<string[]>([
    "#OrthodonticCare",
    "#BracesLife",
    "#HealthySmile",
  ]);

  const [selectedMedia, setSelectedMedia] = useState<Media[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const maxCharacters = 280;
  const isPublishDisabled =
    postContent.length === 0 || selectedPlatforms.length === 0;

  const handlePlatformToggle = (platformName: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformName)
        ? prev.filter((p) => p !== platformName)
        : [...prev, platformName]
    );
  };

  // Utility function to normalize and validate a hashtag
  const normalizeTag = (tag: string) => {
    let normalized = tag.trim().toLowerCase();
    if (normalized.length === 0) return null;
    if (!normalized.startsWith("#")) {
      normalized = "#" + normalized;
    }
    return normalized.match(/^#[a-z0-9]+$/) ? normalized : null;
  };

  // Hashtag logic (omitted for brevity, assume the previous logic is sound)
  const handleAddHashtag = useCallback((inputValue: string) => {
    const tags = inputValue
      .split(/[,;\s]+/)
      .map(normalizeTag)
      .filter((tag): tag is string => tag !== null);

    if (tags.length === 0) return;

    setActiveHashtags((prevTags) => {
      const newTags = new Set(prevTags);
      let tagsAdded = false;

      tags.forEach((tag) => {
        if (!newTags.has(tag)) {
          newTags.add(tag);
          tagsAdded = true;
        }
      });
      return tagsAdded ? Array.from(newTags) : prevTags;
    });

    setHashtagInput("");
  }, []);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddHashtag(hashtagInput);
    }
  };

  const handleInputBlur = () => {
    if (hashtagInput.trim().length > 0) {
      handleAddHashtag(hashtagInput);
    }
  };

  const handleRemoveHashtag = (tagToRemove: string) => {
    setActiveHashtags((prevTags) =>
      prevTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleSelectSuggestedTag = (tag: string) => {
    handleAddHashtag(tag);
  };

  const suggestedHashtagsToDisplay = useMemo(() => {
    const activeSet = new Set(activeHashtags.map((tag) => tag.toLowerCase()));
    return ALL_SUGGESTED_HASHTAGS.filter(
      (tag) => !activeSet.has(tag.toLowerCase())
    );
  }, [activeHashtags]);

  // --- NEW MEDIA LOGIC ---

  const handleWrapperClick = () => {
    setIsGalleryOpen(true);
  };

  // --- END NEW MEDIA LOGIC ---

  const handlePublish = () => {
    onClose();
  };

  const previewHashtags = activeHashtags.join(" ");

  // Dynamic classes for the upload area
  const uploadWrapperClasses =
    selectedMedia.length > 0
      ? "border-green-400 bg-green-50/50 hover:border-green-500"
      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50";

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="2xl"
      classNames={{
        base: `!m-0`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent className="p-0">
        <ModalHeader className="flex flex-col gap-2 p-5 font-normal">
          <h4 className="text-base leading-none font-medium">
            Create New Post
          </h4>
          <p className="text-xs text-gray-600">
            Create and schedule posts across your social media platforms
          </p>
        </ModalHeader>

        <ModalBody className="space-y-4 md:space-y-5 px-5 py-0 gap-0 max-h-[75vh] overflow-auto">
          {/* Post Content */}
          <div className="space-y-0.5">
            <Textarea
              id="content"
              label="Post Content"
              labelPlacement="outside-top"
              size="sm"
              radius="sm"
              placeholder="What's on your mind? Share updates about your practice..."
              rows={4}
              value={postContent}
              onChange={(e: any) => setPostContent(e.target.value)}
              maxLength={maxCharacters}
              classNames={{ inputWrapper: "py-2" }}
            />
            <div className="text-right">
              <span className="text-xs text-gray-500">
                {postContent.length}/{maxCharacters} characters
              </span>
            </div>
          </div>

          {/* Select Platforms */}
          <div className="space-y-2">
            <label className="text-xs block">Select Platforms</label>
            <div className="grid grid-cols-3 gap-3">
              {PLATFORMS.map((platform) => (
                <PlatformButton
                  key={platform.name}
                  platform={platform}
                  isSelected={selectedPlatforms.includes(platform.name)}
                  onClick={handlePlatformToggle}
                />
              ))}
            </div>
          </div>

          {/* Publishing Schedule */}
          <div className="space-y-3">
            <Select
              label="Publishing Schedule"
              labelPlacement="outside"
              size="sm"
              radius="sm"
              selectedKeys={[publishSchedule]}
              disabledKeys={[publishSchedule]}
              onChange={(e) => setPublishSchedule(e.target.value)}
            >
              <SelectItem
                key="publish-now"
                startContent={<FiSend className="size-3.5" />}
              >
                Publish Now
              </SelectItem>
              <SelectItem key="schedule">Schedule for Later</SelectItem>
            </Select>
          </div>

          {/* Media Upload */}
          <div className="space-y-1">
            <label className="text-xs block">Media</label>
            {/* Wrapper div now has the click handler */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer mb-0 ${uploadWrapperClasses}`}
              onClick={handleWrapperClick}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-2">
                  {selectedMedia.length > 0 ? (
                    <FiCheckCircle className="size-5 text-green-500" />
                  ) : (
                    <>
                      <FiUpload className="size-5 text-gray-400" />
                      <FiImage className="size-5 text-gray-400" />
                      <FiVideo className="size-5 text-gray-400" />
                    </>
                  )}
                </div>
                <div>
                  {selectedMedia.length > 0 ? (
                    <p className="text-xs font-medium text-green-700">
                      {selectedMedia.length} media item(s) selected. Click to
                      change.
                    </p>
                  ) : (
                    <p className="text-xs font-medium">
                      Click to select media from gallery or upload
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1.5">
                    Images: JPEG, PNG, GIF, WEBP • Videos: MP4, WEBM, MOV, AVI •
                    Max 10MB each
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hashtags */}
          <div className="space-y-3">
            <div className="flex items-end gap-2">
              <div className="relative flex-1">
                <Input
                  label="Hashtags"
                  labelPlacement="outside-top"
                  size="sm"
                  radius="sm"
                  placeholder="Add hashtags (press Enter or comma to add)"
                  startContent={<FiHash className="size-3.5 text-gray-400" />}
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  onBlur={handleInputBlur}
                />
              </div>
              <Button
                size="sm"
                radius="sm"
                variant="ghost"
                className="border-small"
                onPress={() => handleAddHashtag(hashtagInput)}
                isDisabled={!hashtagInput}
              >
                Add
              </Button>
            </div>

            {/* Display Active Hashtags */}
            <div className="flex flex-wrap gap-2">
              {activeHashtags.map((tag) => (
                <Chip
                  key={tag}
                  size="sm"
                  variant="flat"
                  color="primary"
                  className="text-[11px] cursor-pointer"
                  onClose={() => handleRemoveHashtag(tag)}
                  endContent={<FiX className="size-3" />}
                >
                  {tag}
                </Chip>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs block">Suggested hashtags:</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedHashtagsToDisplay.map((tag) => (
                  <Button
                    size="sm"
                    radius="sm"
                    key={tag}
                    variant="bordered"
                    className="border-small min-w-auto px-2 py-1 h-auto text-[11px] hover:bg-primary hover:border-primary hover:text-white"
                    onPress={() => handleSelectSuggestedTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-1">
            <p className="text-xs block">Preview</p>
            <div className="border border-gray-200 rounded-lg p-3 text-xs text-blue-700 bg-gray-50">
              {previewHashtags}
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end space-x-0 p-5">
          <Button
            variant="ghost"
            size="sm"
            radius="sm"
            onPress={onClose}
            className="border-small"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            radius="sm"
            variant="solid"
            color="primary"
            onPress={handlePublish}
            disabled={isPublishDisabled}
            startContent={<FiSend className="h-4 w-4" />}
            className="btn-brand-primary"
          >
            Publish Now
          </Button>
        </ModalFooter>
      </ModalContent>

      <GalleryMediaUploadModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelect={(media: any) => setSelectedMedia(media)}
        preselectedMedia={selectedMedia}
      />
    </Modal>
  );
}
