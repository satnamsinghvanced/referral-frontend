import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { Progress, Button, Card, CardBody, addToast } from "@heroui/react";
import { FiX, FiCheck, FiLoader, FiAlertCircle } from "react-icons/fi";
import { uploadMedia } from "../services/media";
import { UploadMediaRequest } from "../types/media";
import { queryClient } from "./QueryProvider";

interface UploadState {
  id: string;
  fileName: string;
  progress: number;
  status: "uploading" | "completed" | "error" | "cancelled";
  controller: AbortController;
  type: "image" | "video" | "media";
  isHidden?: boolean;
}

interface UploadContextType {
  startUpload: (data: UploadMediaRequest, fileName: string, type: "image" | "video" | "media") => Promise<void>;
  cancelUpload: (id: string) => void;
  removeUpload: (id: string) => void;
  activeUploads: UploadState[];
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUpload must be used within an UploadProvider");
  }
  return context;
};

export const UploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeUploads, setActiveUploads] = useState<UploadState[]>([]);
  const uploadsRef = useRef<Record<string, UploadState>>({});

  const startUpload = async (data: UploadMediaRequest, fileName: string, type: "image" | "video" | "media") => {
    const id = Math.random().toString(36).substring(7);
    const controller = new AbortController();

    const newUpload: UploadState = {
      id,
      fileName,
      progress: 0,
      status: "uploading",
      controller,
      type,
    };

    setActiveUploads((prev) => [...prev, newUpload]);
    uploadsRef.current[id] = newUpload;

    try {
      await uploadMedia(
        data,
        (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setActiveUploads((prev) =>
              prev.map((u) => (u.id === id ? { ...u, progress: Math.min(percentCompleted, 99) } : u))
            );
          }
        },
        controller.signal
      );

      setActiveUploads((prev) =>
        prev.map((u) => (u.id === id ? { ...u, progress: 100, status: "completed" } : u))
      );
      const typeLabel = type === "image" ? "Image" : type === "video" ? "Video" : "Media";
      addToast({
        title: "Success",
        description: `${typeLabel} uploaded successfully.`,
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["images"] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      setTimeout(() => {
        setActiveUploads((prev) => prev.filter((u) => u.id !== id));
        delete uploadsRef.current[id];
      }, 3000);

    } catch (error: any) {
      if (error.name === "CanceledError" || error.name === "AbortError") {
        setActiveUploads((prev) =>
          prev.map((u) => (u.id === id ? { ...u, status: "cancelled" } : u))
        );
      } else {
        setActiveUploads((prev) =>
          prev.map((u) => (u.id === id ? { ...u, status: "error" } : u))
        );
        addToast({
          title: "Error",
          description: `Failed to upload ${fileName}.`,
          color: "danger",
        });
      }
      setTimeout(() => {
        setActiveUploads((prev) => prev.filter((u) => u.id !== id));
        delete uploadsRef.current[id];
      }, 5000);
    }
  };

  const cancelUpload = (id: string) => {
    const upload = activeUploads.find((u) => u.id === id);
    if (upload && upload.status === "uploading") {
      upload.controller.abort();
    }
  };

  const removeUpload = (id: string) => {
    setActiveUploads((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isHidden: true } : u))
    );
  };

  return (
    <UploadContext.Provider value={{ startUpload, cancelUpload, removeUpload, activeUploads }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 w-80 max-md:w-[calc(100%-2rem)]">
        {activeUploads.filter(u => !u.isHidden).map((upload) => (
          <Card key={upload.id} className="shadow-lg border border-foreground/10" radius="sm">
            <CardBody className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  {upload.status === "uploading" && <FiLoader className="animate-spin text-primary shrink-0" />}
                  {upload.status === "completed" && <FiCheck className="text-green-500 shrink-0" />}
                  {upload.status === "error" && <FiAlertCircle className="text-danger shrink-0" />}
                  {upload.status === "cancelled" && <FiX className="text-gray-400 shrink-0" />}
                  <span className="text-xs font-medium truncate">{upload.fileName}</span>
                </div>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  radius="full"
                  onPress={() => removeUpload(upload.id)}
                  className="h-6 w-6 min-w-0"
                >
                  <FiX />
                </Button>
              </div>

              <Progress
                size="sm"
                radius="sm"
                value={upload.progress}
                color={
                  upload.status === "completed" ? "success" :
                    upload.status === "error" ? "danger" :
                      "primary"
                }
                className="mb-1"
              />

              <div className="flex justify-between items-center text-[10px] text-gray-500">
                <span>
                  {upload.status === "uploading" && `Uploading... ${upload.progress}%`}
                  {upload.status === "completed" && "Completed"}
                  {upload.status === "error" && "Failed"}
                  {upload.status === "cancelled" && "Cancelled"}
                </span>
                {upload.status === "uploading" && (
                  <span className="text-primary hover:underline cursor-pointer" onClick={() => cancelUpload(upload.id)}>
                    Cancel
                  </span>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </UploadContext.Provider>
  );
};
