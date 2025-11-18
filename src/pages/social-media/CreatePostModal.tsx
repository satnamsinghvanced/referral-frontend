import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { FiHash, FiImage, FiSend, FiUpload, FiVideo } from "react-icons/fi";
import { BiChevronDown } from "react-icons/bi";

// --- Dynamic Data ---

const PLATFORMS = [
  { name: "Facebook", emoji: "📘" },
  { name: "Instagram", emoji: "📷" },
  { name: "LinkedIn", emoji: "💼" },
  { name: "Twitter", emoji: "🐦" },
  { name: "YouTube", emoji: "📺" },
  { name: "TikTok", emoji: "🎵" },
];

const SUGGESTED_HASHTAGS = [
  "#OrthodonticCare",
  "#SmileTransformation",
  "#BracesLife",
  "#Invisalign",
  "#HealthySmile",
  "#OrthodonticsSpecialist",
  "#StraightTeeth",
  "#DentalHealth",
];

const PUBLISHING_SCHEDULES = [
  { key: "publish-now", label: "Publish Now", icon: FiSend },
  { key: "schedule", label: "Schedule for Later", icon: null },
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

  const handlePublish = () => {
    console.log("Publishing/Scheduling Post:", {
      content: postContent,
      platforms: selectedPlatforms,
      schedule: publishSchedule,
    });
    // Add Tanstack Mutation logic here later
    onClose();
  };

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
      <ModalContent className="p-5">
        <ModalHeader className="flex flex-col gap-2 p-0 font-normal">
          <h4 className="text-base leading-none font-medium">
            Create New Post
          </h4>
          <p className="text-xs text-gray-600">
            Create and schedule posts across your social media platforms
          </p>
        </ModalHeader>

        <ModalBody className="space-y-4 py-4 px-0 gap-0">
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
            <label className="text-xs inline-block">Select Platforms</label>
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
              onChange={(e) => setPublishSchedule(e.target.value)}
            >
              {PUBLISHING_SCHEDULES.map((schedule) => (
                <SelectItem key={schedule.key}>
                  <div className="flex items-center gap-2">
                    {schedule.icon && <schedule.icon className="size-3.5" />}
                    {schedule.label}
                  </div>
                </SelectItem>
              ))}
            </Select>
            {/* Conditional input for scheduling date/time would go here */}
          </div>

          {/* Media Upload */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Media</label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer border-gray-200 hover:border-gray-300 hover:bg-gray-50">
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-2">
                  <FiUpload className="h-6 w-6 text-gray-400" />
                  <FiImage className="h-6 w-6 text-gray-400" />
                  <FiVideo className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Drop files here or click to upload
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Images: JPEG, PNG, GIF, WEBP • Videos: MP4, WEBM, MOV, AVI •
                    Max 10MB each
                  </p>
                </div>
              </div>
            </div>
            <input
              id="media-upload-input"
              type="file"
              multiple
              className="hidden"
            />
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
                />
              </div>
              <Button size="sm" radius="sm" disabled>
                Add
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Suggested hashtags:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_HASHTAGS.map((tag) => (
                  <Button
                    key={tag}
                    variant="light"
                    className="h-auto py-1 px-2 text-xs hover:bg-blue-600 hover:text-white border-gray-200"
                    onPress={() => console.log(`Added ${tag}`)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end space-x-0 pt-4 pb-0 px-0">
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
    </Modal>
  );
}
