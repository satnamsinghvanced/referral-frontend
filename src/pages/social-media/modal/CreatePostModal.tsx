import {
  addToast,
  Button,
  Chip,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  TimeInput,
} from "@heroui/react";
import {
  getLocalTimeZone,
  parseDate,
  Time,
  today,
} from "@internationalized/date";
import { useFormik } from "formik";
import React, { useCallback, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiHash,
  FiImage,
  FiSend,
  FiUpload,
  FiVideo,
  FiX,
} from "react-icons/fi";
import * as Yup from "yup";
import {
  useCreateSocialPost,
  useSocialOverview,
} from "../../../hooks/useSocial";
import { Media } from "../../../types/media";
import GalleryMediaUploadModal from "../../media-management/modal/GalleryMediaUploadModal";
import { formatCalendarDate } from "../../../utils/formatCalendarDate";
import { parseStringTime } from "../../../utils/parseStringTime";

// --- Dynamic Data ---

const PLATFORMS = [
  { name: "facebook", emoji: "📘", label: "Facebook" },
  { name: "instagram", emoji: "📷", label: "Instagram" },
  { name: "linkedin", emoji: "💼", label: "LinkedIn" },
  { name: "youtube", emoji: "📺", label: "YouTube" },
];

const PLATFORM_MEDIA_SPEC = {
  facebook: {
    images: {
      formats: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      maxSize: 4 * 1024 * 1024,
    },
    videos: {
      formats: ["video/mp4", "video/quicktime"],
      maxSize: 1024 * 1024 * 1024,
    },
  },
  instagram: {
    images: {
      formats: ["image/jpeg", "image/png"],
      maxSize: 8 * 1024 * 1024,
    },
    videos: {
      formats: ["video/mp4", "video/quicktime"],
      maxSize: 100 * 1024 * 1024,
    },
  },
  linkedin: {
    images: {
      formats: ["image/jpeg", "image/png", "image/gif"],
      maxSize: 5 * 1024 * 1024,
    },
    videos: {
      formats: ["video/mp4"],
      maxSize: 200 * 1024 * 1024,
    },
  },
  youtube: {
    images: {
      formats: [] as string[], // YouTube posts don't support images via this API
      maxSize: 0,
    },
    videos: {
      formats: [
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
        "video/x-ms-wmv",
      ],
      maxSize: 128 * 1024 * 1024 * 1024,
    },
  },
};

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
    ? "border-none !bg-blue-50 dark:!bg-blue-500/10 text-primary-600 dark:text-blue-400 ring-2 ring-primary-600/50 dark:ring-blue-500/50"
    : "border-foreground/10 hover:bg-gray-50 dark:hover:bg-content2";

  return (
    <Button
      variant="light"
      className={`h-16 flex flex-col items-center justify-center gap-1 border ${selectedClasses}`}
      onPress={() => onClick(platform.name)}
    >
      <span className="text-lg">{platform.emoji}</span>
      <span className="text-xs">{platform.label}</span>
    </Button>
  );
};

// --- Main Modal Component ---

const PostValidationSchema = Yup.object().shape({
  title: Yup.string().required("Post Title is required."),
  postContent: Yup.string().required("Post Content is required."),
  selectedPlatforms: Yup.array()
    .min(1, "Please select at least one platform.")
    .required(),
  publishSchedule: Yup.string().required(),
  scheduledDate: Yup.date().when("publishSchedule", {
    is: "schedule",
    then: (schema) => schema.required("Scheduled Date is required."),
  }),
  scheduledTime: Yup.string().when("publishSchedule", {
    is: "schedule",
    then: (schema) => schema.required("Scheduled Time is required."),
  }),
});

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreatePostModal({
  isOpen,
  onClose,
  onSuccess,
}: CreatePostModalProps) {
  const { data: overviewData } = useSocialOverview();
  const localTimeZone = getLocalTimeZone();
  const [hashtagInput, setHashtagInput] = useState("");
  const [activeHashtags, setActiveHashtags] = useState<string[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const { mutate: createPost, isPending } = useCreateSocialPost();

  const availablePlatforms = useMemo(() => {
    if (!overviewData?.platformPerformance) return [];
    return PLATFORMS.filter(
      (p) => (overviewData.platformPerformance as any)[p.name]?.connected,
    );
  }, [overviewData]);

  const formik = useFormik({
    initialValues: {
      title: "",
      postContent: "",
      selectedPlatforms: [] as string[],
      publishSchedule: "publish-now",
      scheduledDate: "",
      scheduledTime: "",
    },
    validationSchema: PostValidationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.postContent);
      formData.append("platforms", values.selectedPlatforms.join(","));
      formData.append("hashtags", activeHashtags.join(",").replace(/#/g, ""));
      formData.append("media", selectedMedia.map((m) => m._id).join(","));

      if (values.publishSchedule === "schedule") {
        formData.append("scheduledDate", values.scheduledDate);
        formData.append("scheduledTime", values.scheduledTime);
      }

      createPost(formData, {
        onSuccess: () => {
          addToast({
            title: "Success",
            description: "Social media post created successfully.",
            color: "success",
          });
          formik.resetForm();
          setActiveHashtags([]);
          setSelectedMedia([]);
          if (onSuccess) onSuccess();
          onClose();
        },
        onError: (error: any) => {
          const platformErrors = error.response?.data?.error?.errors;
          let description =
            error.response?.data?.message || "Failed to create post.";

          if (platformErrors) {
            const details = Object.entries(platformErrors)
              .map(([platform, err]) => `${platform}: ${err}`)
              .join(", ");
            description = `${description} Details: ${details}`;
          }

          addToast({
            title: "Error",
            description,
            color: "danger",
          });
        },
      });
    },
  });

  const safeMediaConstraints = useMemo(() => {
    const selected = formik.values.selectedPlatforms;
    if (selected.length === 0) {
      return {
        allowedImageFormats: [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ],
        maxImageSize: 4 * 1024 * 1024,
        allowedVideoFormats: ["video/mp4", "video/quicktime"],
        maxVideoSize: 100 * 1024 * 1024,
      };
    }

    let imageFormats: string[] | null = null;
    let videoFormats: string[] | null = null;
    let maxImageSize = Infinity;
    let maxVideoSize = Infinity;

    selected.forEach((p) => {
      const spec = PLATFORM_MEDIA_SPEC[p as keyof typeof PLATFORM_MEDIA_SPEC];
      if (!spec) return;

      if (imageFormats === null) {
        imageFormats = [...spec.images.formats];
      } else {
        imageFormats = imageFormats.filter((f) =>
          spec.images.formats.includes(f),
        );
      }
      maxImageSize = Math.min(maxImageSize, spec.images.maxSize);

      if (videoFormats === null) {
        videoFormats = [...spec.videos.formats];
      } else {
        videoFormats = videoFormats.filter((f) =>
          spec.videos.formats.includes(f),
        );
      }
      maxVideoSize = Math.min(maxVideoSize, spec.videos.maxSize);
    });

    return {
      allowedImageFormats: imageFormats || [],
      maxImageSize: maxImageSize === Infinity ? 0 : maxImageSize,
      allowedVideoFormats: videoFormats || [],
      maxVideoSize: maxVideoSize === Infinity ? 0 : maxVideoSize,
    };
  }, [formik.values.selectedPlatforms]);

  const maxCharacters = 280;

  const handlePlatformToggle = (platformName: string) => {
    const current = formik.values.selectedPlatforms;
    const next = current.includes(platformName)
      ? current.filter((p) => p !== platformName)
      : [...current, platformName];
    formik.setFieldValue("selectedPlatforms", next);
  };

  const normalizeTag = (tag: string) => {
    let normalized = tag.trim().toLowerCase();
    if (normalized.length === 0) return null;
    if (!normalized.startsWith("#")) {
      normalized = "#" + normalized;
    }
    return normalized.match(/^#[a-z0-9]+$/) ? normalized : null;
  };

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
      prevTags.filter((tag) => tag !== tagToRemove),
    );
  };

  const handleSelectSuggestedTag = (tag: string) => {
    handleAddHashtag(tag);
  };

  const suggestedHashtagsToDisplay = useMemo(() => {
    const activeSet = new Set(activeHashtags.map((tag) => tag.toLowerCase()));
    return ALL_SUGGESTED_HASHTAGS.filter(
      (tag) => !activeSet.has(tag.toLowerCase()),
    );
  }, [activeHashtags]);

  const handleWrapperClick = () => {
    setIsGalleryOpen(true);
  };

  const previewHashtags = activeHashtags.join(" ");

  const uploadWrapperClasses =
    selectedMedia.length > 0
      ? "border-green-400 bg-green-50/50 dark:bg-green-500/10 dark:border-green-500/50 hover:border-green-500"
      : "border-foreground/10 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-content2";

  const hasError = (field: keyof typeof formik.initialValues) =>
    !!(formik.touched[field] && formik.errors[field]);

  const ErrorText = ({
    field,
  }: {
    field: keyof typeof formik.initialValues;
  }) =>
    hasError(field) ? (
      <p className="text-[11px] text-danger mt-1">
        {formik.errors[field] as string}
      </p>
    ) : null;

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
        <ModalHeader className="flex flex-col gap-2 p-4 font-normal">
          <h4 className="text-base leading-none font-medium">
            Create New Post
          </h4>
          <p className="text-gray-600 dark:text-foreground/60 text-xs font-normal">
            Create and schedule posts across your social media platforms
          </p>
        </ModalHeader>

        <ModalBody className="space-y-4 md:space-y-5 px-4 py-0 gap-0 max-h-[75vh] overflow-auto">
          {/* Post Title */}
          <div className="space-y-0.5">
            <Input
              label="Post Title"
              labelPlacement="outside"
              size="sm"
              radius="sm"
              isRequired
              placeholder="Enter a title for your records..."
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={hasError("title")}
            />
            <ErrorText field="title" />
          </div>

          {/* Post Content */}
          <div className="space-y-0.5">
            <Textarea
              id="postContent"
              name="postContent"
              label="Post Content"
              labelPlacement="outside-top"
              size="sm"
              radius="sm"
              isRequired
              placeholder="What's on your mind? Share updates about your practice..."
              rows={4}
              value={formik.values.postContent}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={hasError("postContent")}
              maxLength={maxCharacters}
              classNames={{ inputWrapper: "py-2" }}
            />
            <div className="flex justify-between items-start">
              <ErrorText field="postContent" />
              <div className="text-right">
                <span className="text-xs text-gray-500 dark:text-foreground/60">
                  {formik.values.postContent.length}/{maxCharacters} characters
                </span>
              </div>
            </div>
          </div>

          {/* Select Platforms */}
          <div className="space-y-2">
            <label className="text-xs block">
              Select Platforms <span className="text-danger">*</span>
            </label>
            <div className="grid grid-cols-4 gap-3">
              {availablePlatforms.map((platform) => (
                <PlatformButton
                  key={platform.name}
                  platform={platform}
                  isSelected={formik.values.selectedPlatforms.includes(
                    platform.name,
                  )}
                  onClick={handlePlatformToggle}
                />
              ))}
            </div>
            {formik.values.selectedPlatforms.includes("youtube") && (
              <p className="text-[11px] text-warning-600 mt-2 font-medium bg-warning-50 px-2 py-1 rounded-md">
                ⚠️ YouTube requires at least one video to be selected.
              </p>
            )}
            <ErrorText field="selectedPlatforms" />
          </div>

          {/* Publishing Schedule */}
          <div className="space-y-4">
            <Select
              label="Publishing Schedule"
              labelPlacement="outside"
              size="sm"
              radius="sm"
              isRequired
              selectedKeys={[formik.values.publishSchedule]}
              disabledKeys={[formik.values.publishSchedule]}
              onSelectionChange={(keys: any) =>
                formik.setFieldValue(
                  "publishSchedule",
                  Array.from(keys)[0] as string,
                )
              }
            >
              <SelectItem
                key="publish-now"
                startContent={<FiSend className="size-3.5" />}
              >
                Publish Now
              </SelectItem>
              <SelectItem key="schedule">Schedule for Later</SelectItem>
            </Select>

            {formik.values.publishSchedule === "schedule" && (
              <div className="flex flex-col gap-1">
                <div className="flex gap-3">
                  <DatePicker
                    label="Scheduled Date"
                    labelPlacement="outside"
                    size="sm"
                    radius="sm"
                    isRequired
                    name="scheduledDate"
                    minValue={today(localTimeZone)}
                    value={
                      formik.values.scheduledDate
                        ? parseDate(formik.values.scheduledDate)
                        : today(localTimeZone)
                    }
                    onChange={(value) => {
                      if (value) {
                        formik.setFieldValue(
                          "scheduledDate",
                          formatCalendarDate(value),
                        );
                      }
                    }}
                    onBlur={() => formik.setFieldTouched("scheduledDate", true)}
                    isInvalid={hasError("scheduledDate")}
                  />
                  <TimeInput
                    label="Scheduled Time"
                    labelPlacement="outside"
                    size="sm"
                    radius="sm"
                    isRequired
                    name="scheduledTime"
                    value={
                      formik.values.scheduledTime
                        ? parseStringTime(formik.values.scheduledTime)
                        : new Time(9, 0)
                    }
                    onChange={(timeValue) => {
                      const timeString = `${String(timeValue?.hour).padStart(
                        2,
                        "0",
                      )}:${String(timeValue?.minute).padStart(2, "0")}`;
                      formik.setFieldValue("scheduledTime", timeString);
                    }}
                    onBlur={() => formik.setFieldTouched("scheduledTime", true)}
                    isInvalid={hasError("scheduledTime")}
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <ErrorText field="scheduledDate" />
                  </div>
                  <div className="flex-1 ml-0.5">
                    <ErrorText field="scheduledTime" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Media Upload */}
          <div className="space-y-1">
            <label className="text-xs block">Media (Max 5)</label>
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
                  <p className="text-xs text-gray-500 dark:text-foreground/60 mt-1.5 leading-relaxed">
                    {safeMediaConstraints.allowedImageFormats.length > 0 &&
                      `Images: ${safeMediaConstraints.allowedImageFormats
                        .map((f) => f.split("/")[1]?.toUpperCase() || "FILE")
                        .join(", ")} (max ${Math.round(
                        safeMediaConstraints.maxImageSize / (1024 * 1024),
                      )}MB)`}
                    {safeMediaConstraints.allowedImageFormats.length > 0 &&
                      safeMediaConstraints.allowedVideoFormats.length > 0 &&
                      " • "}
                    {safeMediaConstraints.allowedVideoFormats.length > 0 &&
                      `Videos: ${safeMediaConstraints.allowedVideoFormats
                        .map((f) => f.split("/")[1]?.toUpperCase() || "FILE")
                        .join(", ")} (max ${Math.round(
                        safeMediaConstraints.maxVideoSize / (1024 * 1024),
                      )}MB)`}
                    {safeMediaConstraints.allowedImageFormats.length === 0 &&
                      safeMediaConstraints.allowedVideoFormats.length === 0 &&
                      "No media formats safe for all selected platforms."}
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

            {activeHashtags.length > 0 && (
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
            )}
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
            <div className="border border-foreground/10 rounded-lg p-3 text-xs text-blue-700 dark:text-blue-300 bg-gray-50 dark:bg-content2">
              {previewHashtags || "No hashtags added yet"}
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end space-x-0 p-4">
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
            onPress={() => formik.handleSubmit()}
            isDisabled={isPending}
            isLoading={isPending}
            startContent={!isPending && <FiSend className="h-4 w-4" />}
            className="btn-brand-primary"
          >
            {formik.values.publishSchedule === "schedule"
              ? "Schedule Post"
              : "Publish Now"}
          </Button>
        </ModalFooter>
      </ModalContent>

      <GalleryMediaUploadModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelect={(media: any) => {
          if (media.length > 5) {
            addToast({
              title: "Limit Exceeded",
              description: "You can only select up to 5 media files.",
              color: "warning",
            });
            setSelectedMedia(media.slice(0, 5));
          } else {
            setSelectedMedia(media);
          }
        }}
        preselectedMedia={selectedMedia}
        allowedImageFormats={safeMediaConstraints.allowedImageFormats}
        maxImageSize={safeMediaConstraints.maxImageSize}
        allowedVideoFormats={safeMediaConstraints.allowedVideoFormats}
        maxVideoSize={safeMediaConstraints.maxVideoSize}
      />
    </Modal>
  );
}
