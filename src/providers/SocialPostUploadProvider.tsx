import React, { createContext, useContext, useState } from "react";
import { Progress, Button, addToast } from "@heroui/react";
import { queryClient } from "./QueryProvider";
import { fetchPostStatus } from "../services/social";

interface SocialPostUploadTask {
  id: string;
  title: string;
  platforms: string[];
  progress: number;
  status: "uploading" | "success" | "error";
  errorMsg?: string;
}

interface SocialPostUploadContextType {
  startSocialPostUpload: (
    title: string,
    platforms: string[],
    uploadPromise: Promise<any>,
    registerUploadProgress?: (cb: (percent: number) => void) => void
  ) => void;
  socialPostUploadTask: SocialPostUploadTask | null;
  setSocialPostUploadTask: React.Dispatch<React.SetStateAction<SocialPostUploadTask | null>>;
}

const SocialPostUploadContext = createContext<SocialPostUploadContextType | undefined>(undefined);

export const useSocialPostUpload = () => {
  const context = useContext(SocialPostUploadContext);
  if (!context) {
    throw new Error("useSocialPostUpload must be used within a SocialPostUploadProvider");
  }
  return context;
};

const formatPlatformName = (p: string) => {
  if (p.toLowerCase() === "youtube") return "YouTube";
  if (p.toLowerCase() === "tiktok") return "TikTok";
  if (p.toLowerCase() === "googlebusiness") return "Google Business";
  return p.charAt(0).toUpperCase() + p.slice(1);
};

export const SocialPostUploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socialPostUploadTask, setSocialPostUploadTask] = useState<SocialPostUploadTask | null>(null);

  const startSocialPostUpload = (
    title: string,
    platforms: string[],
    uploadPromise: Promise<any>,
    registerUploadProgress?: (cb: (percent: number) => void) => void
  ) => {
    setSocialPostUploadTask({
      id: Math.random().toString(),
      title,
      platforms,
      progress: 0,
      status: "uploading",
    });

    if (registerUploadProgress) {
      registerUploadProgress((percent) => {
        setSocialPostUploadTask((prev) => {
          if (!prev || prev.status !== "uploading") return prev;
          const mappedProgress = Math.round(percent * 0.9);
          return { ...prev, progress: Math.max(prev.progress, mappedProgress) };
        });
      });
    }

    uploadPromise
      .then((resData: any) => {
        const postId = resData?.postId || resData?.data?.postId;
        if (!postId) {
          setSocialPostUploadTask((prev) =>
            prev ? { ...prev, progress: 100, status: "success" } : null
          );
          queryClient.invalidateQueries({ queryKey: ["recent-posts"] });
          queryClient.invalidateQueries({ queryKey: ["social-overview"] });
          queryClient.invalidateQueries({ queryKey: ["posts-analytics"] });
          addToast({
            title: "Success",
            description: "Social media post created successfully.",
            color: "success",
          });
          setTimeout(() => {
            setSocialPostUploadTask(null);
          }, 3000);
          return;
        }

        setSocialPostUploadTask((prev) =>
          prev ? { ...prev, progress: 90 } : null
        );

        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetchPostStatus(postId);
            const postStatus = statusRes?.status || statusRes?.data?.status;
            const failureReason = statusRes?.failureReason || statusRes?.data?.failureReason;

            if (postStatus === "Published" || postStatus === "Partially Failed" || postStatus === "Scheduled") {
              clearInterval(pollInterval);
              setSocialPostUploadTask((prev) =>
                prev ? { ...prev, progress: 100, status: "success" } : null
              );

              queryClient.invalidateQueries({ queryKey: ["recent-posts"] });
              queryClient.invalidateQueries({ queryKey: ["social-overview"] });
              queryClient.invalidateQueries({ queryKey: ["posts-analytics"] });

              if (postStatus === "Published") {
                addToast({
                  title: "Success",
                  description: "Social media post published successfully.",
                  color: "success",
                });
              } else if (postStatus === "Scheduled") {
                addToast({
                  title: "Success",
                  description: "Social media post scheduled successfully.",
                  color: "success",
                });
              } else {
                addToast({
                  title: "Warning",
                  description: "Social media post published with some errors.",
                  color: "warning",
                });
              }

              setTimeout(() => {
                setSocialPostUploadTask(null);
              }, 3000);
            } else if (postStatus === "Failed") {
              clearInterval(pollInterval);
              let errMsg = "Failed to publish post to platforms.";
              try {
                if (failureReason && failureReason.trim().startsWith("{")) {
                  const parsed = JSON.parse(failureReason);
                  errMsg = Object.entries(parsed)
                    .map(([platform, err]) => `${platform}: ${err}`)
                    .join(", ");
                } else if (failureReason) {
                  errMsg = failureReason;
                }
              } catch (e) {}

              setSocialPostUploadTask((prev) =>
                prev ? { ...prev, status: "error", errorMsg: errMsg } : null
              );

              addToast({
                title: "Error",
                description: errMsg,
                color: "danger",
              });
            } else {
              setSocialPostUploadTask((prev) => {
                if (!prev || prev.status !== "uploading") {
                  return prev;
                }
                const nextProgress =
                  prev.progress < 98 ? prev.progress + 1 : prev.progress;
                return { ...prev, progress: nextProgress };
              });
            }
          } catch (error) {
            // ignore polling errors
          }
        }, 5000);
      })
      .catch((err: any) => {
        setSocialPostUploadTask((prev) =>
          prev ? { ...prev, status: "error", errorMsg: err?.message || "Failed to create post" } : null
        );
        addToast({
          title: "Error",
          description: err?.message || "Failed to create post",
          color: "danger",
        });
      });
  };

  const formattedPlatforms = socialPostUploadTask?.platforms.map(formatPlatformName).join(", ") || "";

  return (
    <SocialPostUploadContext.Provider value={{ startSocialPostUpload, socialPostUploadTask, setSocialPostUploadTask }}>
      {children}
      {socialPostUploadTask && (
        <div className="fixed bottom-5 right-5 z-[9999] w-80 bg-white dark:bg-content1 border border-foreground/10 rounded-xl shadow-2xl p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-start justify-between mb-3">
            <div className="space-y-1">
              <h5 className="font-bold text-[10px] text-gray-400 dark:text-foreground/40 uppercase tracking-wider">
                {socialPostUploadTask.status === "uploading" && "Creating Post"}
                {socialPostUploadTask.status === "success" && "Created Complete"}
                {socialPostUploadTask.status === "error" && "Created Failed"}
              </h5>
              <p className="text-sm font-semibold text-foreground truncate max-w-[220px]">
                {socialPostUploadTask.title}
              </p>
            </div>
            {socialPostUploadTask.status === "uploading" ? (
              <span className="flex h-2 w-2 relative mt-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            ) : socialPostUploadTask.status === "success" ? (
              <span className="text-emerald-500 text-lg font-bold">✓</span>
            ) : (
              <span className="text-red-500 text-lg font-bold">✕</span>
            )}
          </div>

          <div className="space-y-2">
            <Progress
              size="sm"
              value={socialPostUploadTask.progress}
              color={
                socialPostUploadTask.status === "success"
                  ? "success"
                  : socialPostUploadTask.status === "error"
                    ? "danger"
                    : "primary"
              }
              className="w-full"
            />

            <div className="flex justify-between items-center text-[11px] text-gray-500 dark:text-foreground/50">
              {socialPostUploadTask.status === "uploading" && (
                <>
                  <span className="truncate max-w-[200px]" title={`Uploading post on ${formattedPlatforms}`}>
                    Uploading post on {formattedPlatforms}
                  </span>
                  <span className="font-bold">{socialPostUploadTask.progress}%</span>
                </>
              )}
              {socialPostUploadTask.status === "success" && (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Post uploaded successfully!
                </span>
              )}
              {socialPostUploadTask.status === "error" && (
                <span className="text-red-600 dark:text-red-400 font-medium truncate max-w-[240px]" title={socialPostUploadTask.errorMsg}>
                  {socialPostUploadTask.errorMsg}
                </span>
              )}
            </div>

            {socialPostUploadTask.status === "error" && (
              <div className="flex justify-end pt-2 mt-2 border-t border-foreground/5">
                <Button
                  size="sm"
                  radius="sm"
                  variant="flat"
                  color="danger"
                  className="h-7 text-xs font-semibold"
                  onPress={() => setSocialPostUploadTask(null)}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </SocialPostUploadContext.Provider>
  );
};
