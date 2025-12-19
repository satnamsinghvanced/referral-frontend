import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
} from "@heroui/react";
import React, { useRef, useState } from "react";
import { FiAlertCircle, FiUpload, FiX } from "react-icons/fi";
import { useUploadMedia } from "../../../hooks/useMedia";
import { UploadMediaRequest } from "../../../types/media";

interface UploadMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderId: string | null;
  folderName: string;
}

// Constants for validation
const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB in bytes
const MAX_FILES_COUNT = 10;

interface FileWithError {
  file: File;
  error?: string;
}

export function UploadMediaModal({
  isOpen,
  onClose,
  folderId,
  folderName,
}: UploadMediaModalProps) {
  const [tags, setTags] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<FileWithError[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadMutation = useUploadMedia((progressEvent) => {
    if (progressEvent.total) {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      // Cap at 90% during upload, will show 100% only on success
      setUploadProgress(Math.min(percentCompleted, 90));
    }
  });

  const resetModalState = () => {
    setFilesToUpload([]);
    setTags("");
    setIsDragOver(false);
    setUploadProgress(0);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const validateFile = (file: File): string | undefined => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File exceeds 1GB limit (${formatFileSize(file.size)})`;
    }
    return undefined;
  };

  const handleFileSelect = (newFiles: FileList | null) => {
    if (!newFiles || newFiles.length === 0) return;

    const currentCount = filesToUpload.length;
    const newFilesArray = Array.from(newFiles);

    // Check if adding these files would exceed the limit
    if (currentCount + newFilesArray.length > MAX_FILES_COUNT) {
      addToast({
        title: "Too Many Files",
        description: `You can only upload up to ${MAX_FILES_COUNT} files at once. Currently selected: ${currentCount}`,
        color: "warning",
        classNames: {
          title: "text-warning-800",
          description: "text-warning-700",
        },
      });
      return;
    }

    // Validate each file
    const filesWithErrors: FileWithError[] = newFilesArray.map((file) => {
      const error = validateFile(file);
      return error ? { file, error } : { file };
    });

    // Show warnings for invalid files
    const invalidFiles = filesWithErrors.filter((f) => f.error);
    if (invalidFiles.length > 0) {
      addToast({
        title: "Invalid Files Detected",
        description: `${invalidFiles.length} file(s) exceed the 1GB size limit and will be marked.`,
        color: "warning",
        classNames: {
          title: "text-warning-800",
          description: "text-warning-700",
        },
      });
    }

    setFilesToUpload((prevFiles) => [...prevFiles, ...filesWithErrors]);
  };

  const handleRemoveFile = (index: number) => {
    setFilesToUpload((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleUploadClick = async () => {
    // Filter out files with errors
    const validFiles = filesToUpload.filter((f) => !f.error);

    if (validFiles.length === 0) {
      addToast({
        title: "No Valid Files",
        description: "Please select valid files to upload.",
        color: "warning",
        classNames: {
          title: "text-warning-800",
          description: "text-warning-700",
        },
      });
      return;
    }

    const images: File[] = [];
    const files: File[] = [];

    validFiles.forEach(({ file }) => {
      if (file.type.startsWith("image/")) {
        images.push(file);
      } else {
        files.push(file);
      }
    });

    const requestData: UploadMediaRequest = {
      folderId,
      images,
      files,
      tags: tags
        .trim()
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    };

    setIsUploading(true);
    try {
      await uploadMutation.mutateAsync(requestData);
      // Set to 100% on successful completion
      setUploadProgress(100);
      // Small delay to show 100% before closing
      await new Promise((resolve) => setTimeout(resolve, 500));
      resetModalState();
      onClose();
    } catch (error) {
      console.error("Media upload failed:", error);
      // Error toast is handled by the hook
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    resetModalState();
    onClose();
  };

  const validFilesCount = filesToUpload.filter((f) => !f.error).length;
  const invalidFilesCount = filesToUpload.filter((f) => f.error).length;
  const isUploadDisabled = validFilesCount === 0 || isUploading;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      size="lg"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent className="p-4">
        <ModalHeader className="flex flex-col gap-1 font-normal p-0">
          <h4 className="text-base font-medium">Upload Media</h4>
          <p className="text-xs text-gray-500">
            Uploading to: {folderId === null ? "Root" : folderName}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Max: {MAX_FILES_COUNT} files, 1GB per file
          </p>
        </ModalHeader>

        <ModalBody className="gap-0 space-y-4 px-0 py-4">
          <div>
            <Input
              size="sm"
              radius="sm"
              id="mediaTags"
              type="text"
              label="Tags (comma-separated, optional)"
              labelPlacement="outside-top"
              placeholder="e.g., marketing, product, campaign"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              isDragOver
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <FiUpload className="size-6 mx-auto mb-2 text-gray-400" />
            <p className="text-sm mb-1">
              {filesToUpload.length > 0
                ? `${filesToUpload.length} file(s) selected`
                : "Drag files here or click to browse"}
            </p>
            <p className="text-xs text-gray-500 mb-1">
              Images (JPG, PNG, GIF, WebP, SVG) and videos (MP4, WebM, MOV)
            </p>
            <p className="text-xs text-gray-400">
              {filesToUpload.length}/{MAX_FILES_COUNT} files
            </p>
            <Input
              size="sm"
              radius="sm"
              type="file"
              multiple
              accept="image/*,video/*"
              ref={fileInputRef}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {filesToUpload.length > 0 && (
            <div className="max-h-48 overflow-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium text-xs">
                  Selected Files ({filesToUpload.length})
                </p>
                {invalidFilesCount > 0 && (
                  <span className="text-xs text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="size-3" />
                    {invalidFilesCount} invalid
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {filesToUpload.map((fileWithError, index) => (
                  <div
                    key={index}
                    className={`flex items-start justify-between gap-2 p-2 rounded text-xs ${
                      fileWithError.error
                        ? "bg-red-50 border border-red-200"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">
                        {fileWithError.file.name}
                      </p>
                      <p className="text-gray-500 text-[11px]">
                        {formatFileSize(fileWithError.file.size)} •{" "}
                        {fileWithError.file.type.startsWith("image/")
                          ? "Image"
                          : "Video"}
                      </p>
                      {fileWithError.error && (
                        <p className="text-red-600 text-[11px] mt-0.5 flex items-center gap-1">
                          <FiAlertCircle className="size-3" />
                          {fileWithError.error}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(index);
                      }}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1"
                      title="Remove file"
                    >
                      <FiX className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="border-1 border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading {validFilesCount} file(s)...
                </span>
                <span className="text-xs font-medium">{uploadProgress}%</span>
              </div>
              <Progress
                size="md"
                radius="sm"
                color="primary"
                value={uploadProgress}
                className="w-full"
                classNames={{
                  base: "max-w-full h-2",
                  track: "bg-primary/20",
                  indicator: "bg-primary",
                }}
              />
              <p className="text-xs text-gray-600 mt-2">
                {uploadProgress === 100
                  ? "Upload complete! Closing..."
                  : "Please wait while your files are being uploaded. Do not close this window."}
              </p>
            </div>
          )}
        </ModalBody>

        <ModalFooter className="flex justify-between items-center p-0">
          <div className="text-xs text-gray-600">
            {validFilesCount > 0 && (
              <span className="text-green-600 font-medium">
                {validFilesCount} valid file(s)
              </span>
            )}
          </div>
          <div className="flex gap-1.5">
            <Button
              size="sm"
              radius="sm"
              variant="ghost"
              className="border-small"
              onPress={handleCancel}
              isDisabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              radius="sm"
              variant="solid"
              color="primary"
              className="border-small"
              isDisabled={isUploadDisabled}
              isLoading={isUploading}
              onPress={handleUploadClick}
            >
              {isUploading
                ? `Uploading ${validFilesCount} file(s)...`
                : `Upload ${validFilesCount} file(s)`}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
