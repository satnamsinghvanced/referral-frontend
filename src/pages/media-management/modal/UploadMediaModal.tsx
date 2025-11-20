import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import React, { useState, useRef } from "react";
import { FiUpload } from "react-icons/fi";
import { useUploadMedia } from "../../../hooks/useMedia";
import { UploadMediaRequest } from "../../../types/media";

interface UploadMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderId: string | null;
  folderName: string;
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
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

  // --- TanStack Mutation Integration ---
  const uploadMutation = useUploadMedia();
  // --- End TanStack Mutation Integration ---

  // Utility function to reset modal state
  const resetModalState = () => {
    setFilesToUpload([]);
    setTags("");
    setIsDragOver(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear file input
    }
  };

  // Function to process and set the selected files
  const handleFileSelect = (newFiles: FileList | null) => {
    if (newFiles && newFiles.length > 0) {
      // Concatenate new files with existing ones
      setFilesToUpload((prevFiles) => [...prevFiles, ...Array.from(newFiles)]);
    }
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
    if (filesToUpload.length === 0) {
      alert("Please select files and ensure a folder is selected.");
      return;
    }

    // 1. Separate files into images and non-images (files)
    const images: File[] = [];
    const files: File[] = [];

    filesToUpload.forEach((file) => {
      if (file.type.startsWith("image/")) {
        images.push(file);
      } else {
        files.push(file);
      }
    });

    // NOTE: The backend only requires tags for updating *after* upload.
    // However, if the API was designed to accept a default tag string for all files,
    // we would process it here: const tagsArray = tags.split(",").map(t => t.trim()).filter(t => t.length > 0);
    // For now, we only pass the necessary file and folder data.

    const requestData: UploadMediaRequest = {
      folderId,
      images,
      files,
      tags: tags.trim().split(", "),
    };

    try {
      console.log(
        `Uploading ${filesToUpload.length} files to folder ${folderId}...`
      );

      // 2. Execute Mutation
      await uploadMutation.mutateAsync(requestData);

      // 3. Success: Close modal and reset state
      resetModalState();
      onClose();
    } catch (error) {
      console.error("Media upload failed:", error);
      // Display a user-friendly error message
      alert("Upload failed. Please try again.");
    }
  };

  const handleCancel = () => {
    resetModalState();
    onClose();
  };

  const isUploading = uploadMutation.isPending;
  const isUploadDisabled =
    filesToUpload.length === 0 || isUploading || folderId === null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent className="p-5">
        {/* Modal Header */}
        <ModalHeader className="flex flex-col gap-1 font-normal p-0">
          <h4 className="text-base font-medium">Upload Media</h4>
          <p className="text-xs text-gray-500">
            Uploading to: {folderId === null ? "Root" : folderName}
          </p>
        </ModalHeader>

        {/* Modal Body */}
        <ModalBody className="gap-0 space-y-4 px-0 pt-4 pb-5">
          {/* Tags Input (Retained for potential future use, though not currently in upload API) */}
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

          {/* Drag and Drop Area */}
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
                ? `${filesToUpload.length} file(s) selected.`
                : "Drag files here or click to browse"}
            </p>
            <p className="text-xs text-gray-500">
              Images (JPG, PNG, GIF, WebP, SVG) and videos (MP4, WebM, MOV)
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

          {/* File List Display (Optional, but helpful) */}
          {filesToUpload.length > 0 && (
            <div className="max-h-32 overflow-auto border border-gray-200 rounded-lg p-3 text-sm bg-gray-50">
              <p className="font-medium text-xs mb-1">
                Selected Files ({filesToUpload.length}):
              </p>
              <ul className="list-disc list-inside text-xs space-y-0.5">
                {filesToUpload.map((file, index) => (
                  <li key={index} className="truncate">
                    {file.name} (
                    {file.type.startsWith("image/") ? "Image" : "Video/File"})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {uploadMutation.isError && (
            <p className="text-sm text-red-500">
              Error: {uploadMutation.error.message || "Upload failed."}
            </p>
          )}
        </ModalBody>

        {/* Modal Footer (Buttons) */}
        <ModalFooter className="flex justify-end gap-1.5 p-0">
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
            isDisabled={isUploading}
            isLoading={isUploading}
            onPress={handleUploadClick}
          >
            {isUploading
              ? `Uploading ${filesToUpload.length} file(s)...`
              : `Upload ${filesToUpload.length} file(s)`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
