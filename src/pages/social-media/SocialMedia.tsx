import { Tab, Tabs, Progress, addToast } from "@heroui/react";
import { useMemo, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import ComponentContainer from "../../components/common/ComponentContainer";
import { LoadingState } from "../../components/common/LoadingState";
import { useSocialOverview } from "../../hooks/useSocial";
import Analytics from "./Analytics";
import { CreatePostModal } from "./modal/CreatePostModal";
import Overview from "./Overview";
import Posts from "./Posts";
import { queryClient } from "../../providers/QueryProvider";
import { fetchPostStatus } from "../../services/social";

export default function SocialMedia() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { data, isLoading } = useSocialOverview();

  const [uploadTask, setUploadTask] = useState<{
    id: string;
    title: string;
    progress: number;
    status: "uploading" | "success" | "error";
    errorMsg?: string;
  } | null>(null);

  const handleUploadStart = (title: string, uploadPromise: Promise<any>) => {
    setUploadTask({
      id: Math.random().toString(),
      title,
      progress: 5,
      status: "uploading"
    });

    const interval = setInterval(() => {
      setUploadTask((prev) => {
        if (!prev || prev.status !== "uploading") {
          clearInterval(interval);
          return prev;
        }
        if (prev.progress < 30) {
          return { ...prev, progress: prev.progress + 10 };
        } else if (prev.progress < 75) {
          return { ...prev, progress: prev.progress + 5 };
        } else if (prev.progress < 90) {
          return { ...prev, progress: prev.progress + 2 };
        }
        return prev;
      });
    }, 400);

    uploadPromise
      .then((resData: any) => {
        clearInterval(interval);
        
        const postId = resData?.data?.postId;
        if (!postId) {
          // Fallback if no postId was returned
          setUploadTask((prev) => prev ? { ...prev, progress: 100, status: "success" } : null);
          queryClient.invalidateQueries({ queryKey: ["recent-posts"] });
          queryClient.invalidateQueries({ queryKey: ["social-overview"] });
          queryClient.invalidateQueries({ queryKey: ["posts-analytics"] });
          addToast({
            title: "Success",
            description: "Social media post created successfully.",
            color: "success",
          });
          setActiveTab("posts");
          setTimeout(() => {
            setUploadTask(null);
          }, 3000);
          return;
        }

        // Start polling the backend status for this post
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetchPostStatus(postId);
            const postStatus = statusRes?.data?.status;
            const failureReason = statusRes?.data?.failureReason;

            if (postStatus === "Published" || postStatus === "Partially Failed") {
              clearInterval(pollInterval);
              setUploadTask((prev) => prev ? { ...prev, progress: 100, status: "success" } : null);
              
              queryClient.invalidateQueries({ queryKey: ["recent-posts"] });
              queryClient.invalidateQueries({ queryKey: ["social-overview"] });
              queryClient.invalidateQueries({ queryKey: ["posts-analytics"] });

              addToast({
                title: "Success",
                description: postStatus === "Published" 
                  ? "Social media post published successfully." 
                  : "Social media post published with some errors.",
                color: postStatus === "Published" ? "success" : "warning",
              });

              setActiveTab("posts");

              setTimeout(() => {
                setUploadTask(null);
              }, 3000);
            } else if (postStatus === "Failed") {
              clearInterval(pollInterval);
              const errMsg = failureReason || "Failed to publish post to platforms.";
              setUploadTask((prev) => prev ? { ...prev, status: "error", errorMsg: errMsg } : null);
              
              addToast({
                title: "Error",
                description: errMsg,
                color: "danger",
              });

              setTimeout(() => {
                setUploadTask(null);
              }, 5000);
            } else {
              // Still "Processing": slowly increment progress bar towards 98%
              setUploadTask((prev) => {
                if (!prev || prev.status !== "uploading") {
                  clearInterval(pollInterval);
                  return prev;
                }
                const nextProgress = prev.progress < 98 ? prev.progress + 1 : prev.progress;
                return { ...prev, progress: nextProgress };
              });
            }
          } catch (err: any) {
            console.error("Error polling post status:", err.message);
          }
        }, 3000);
      })
      .catch((error: any) => {
        clearInterval(interval);
        const platformErrors = error.response?.data?.error?.errors;
        let description = error.response?.data?.message || "Failed to publish post.";
        if (platformErrors) {
          const details = Object.entries(platformErrors)
            .map(([platform, err]) => `${platform}: ${err}`)
            .join(", ");
          description = `${description} Details: ${details}`;
        }
        
        setUploadTask((prev) => prev ? { ...prev, status: "error", errorMsg: description } : null);

        addToast({
          title: "Error",
          description,
          color: "danger",
        });

        setTimeout(() => {
          setUploadTask(null);
        }, 5000);
      });
  };
  const isAnyPlatformConnected = useMemo(() => {
    if (!data?.platformPerformance) return false;
    return Object.values(data.platformPerformance).some((p) => p.connected);
  }, [data]);

  const HEADING_DATA = useMemo(
    () => ({
      heading: "Social Media",
      subHeading: "Manage your social media presence and engagement.",
      buttons: isAnyPlatformConnected
        ? [
          {
            label: "Create Post",
            onClick: () => setIsModalOpen(true),
            icon: <AiOutlinePlus fontSize={15} />,
            variant: "solid" as const,
            color: "primary" as const,
          },
        ]
        : [],
    }),
    [isAnyPlatformConnected],
  );

  const platformsData = useMemo(() => {
    if (!data?.platformPerformance) return [];
    const pp = data.platformPerformance;
    const items = [];
    if (pp.facebook?.connected) {
      items.push({
        id: "Facebook",
        stats: [
          {
            label: "Followers",
            value: pp.facebook.followers?.toString() || "0",
          },
          {
            label: "Engagement",
            value: pp.facebook.engagement?.toString() + "%" || "0%",
          },
          { label: "Posts", value: pp.facebook.posts?.toString() || "0" },
        ],
      });
    }
    if (pp.instagram?.connected) {
      items.push({
        id: "Instagram",
        stats: [
          {
            label: "Followers",
            value: pp.instagram.followers?.toString() || "0",
          },
          {
            label: "Engagement",
            value: pp.instagram.engagement?.toString() + "%" || "0%",
          },
          { label: "Posts", value: pp.instagram.posts?.toString() || "0" },
        ],
      });
    }
    if (pp.linkedin?.connected) {
      items.push({
        id: "LinkedIn",
        stats: [
          {
            label: "Followers",
            value: pp.linkedin.followers?.toString() || "0",
          },
          {
            label: "Engagement",
            value: pp.linkedin.engagement?.toString() + "%" || "0%",
          },
          { label: "Posts", value: pp.linkedin.posts?.toString() || "0" },
        ],
      });
    }
    if (pp.youtube?.connected) {
      items.push({
        id: "YouTube",
        stats: [
          {
            label: "Followers",
            value: pp.youtube.followers?.toString() || "0",
          },
          {
            label: "Engagement",
            value: pp.youtube.engagement?.toString() + "%" || "0%",
          },
          { label: "Posts", value: pp.youtube.posts?.toString() || "0" },
        ],
      });
    }
    if (pp.tiktok?.connected) {
      items.push({
        id: "TikTok",
        stats: [
          {
            label: "Followers",
            value: pp.tiktok.followers?.toString() || "0",
          },
          {
            label: "Engagement",
            value: pp.tiktok.engagement?.toString() + "%" || "0%",
          },
          { label: "Videos", value: pp.tiktok.posts?.toString() || "0" },
        ],
      });
    }
    return items;
  }, [data]);

  const recentPerformance = useMemo(() => {
    return {
      totalReach: data?.recentPerformance?.totalReach?.toLocaleString() || "0",
      totalImpressions:
        data?.recentPerformance?.totalImpressions?.toLocaleString() || "0",
      avgClickRate: data?.recentPerformance?.avgClickRate || "0%",
    };
  }, [data]);

  const contentCalendar = useMemo(() => {
    return {
      scheduledPosts: data?.contentCalender?.scheduledPosts || 0,
      draftPosts: 0,
      publishedThisMonth: data?.contentCalender?.publishedPosts || 0,
    };
  }, [data]);

  const overviewStats = useMemo(() => {
    return {
      totalFollowers: data?.overview?.totalFollowers || 0,
      totalEngagement: data?.overview?.totalEngagement
        ? `${data.overview.totalEngagement}%`
        : "0%",
      totalLikes: data?.overview?.totalLikes || 0,
      totalComments: data?.overview?.totalComments || 0,
    };
  }, [data]);

  const renderConnectionWarning = () => (
    <div className="flex flex-col items-center justify-center p-10 bg-background border border-foreground/10 rounded-xl space-y-4">
      <div className="text-4xl text-warning">⚠️</div>
      <div className="text-center space-y-2">
        <h3 className="text-md font-medium">No Platforms Integrated</h3>
        <p className="text-sm text-gray-600 dark:text-foreground/60">
          Please integrate at least one social media platform to view statistics
          and start posting.
        </p>
      </div>
    </div>
  );

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className="flex flex-col gap-4 md:gap-5">
        <div className="space-y-5">
          <Tabs
            aria-label="Options"
            variant="light"
            radius="full"
            classNames={{
              base: "bg-primary/15 dark:bg-background rounded-full p-1 w-full",
              tabList: "flex w-full rounded-full p-0 gap-0",
              tab: "flex-1 h-9 text-sm font-medium transition-all",
              cursor: "rounded-full bg-white dark:bg-primary",
              tabContent:
                "dark:group-data-[selected=true]:text-primary-foreground text-default-500 dark:text-foreground/60 transition-colors",
              panel: "p-0",
            }}
            className="w-full"
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
          >
            <Tab key="overview" title="Overview">
              {isLoading ? (
                <div className="min-h-[250px] flex items-center justify-center">
                  <LoadingState />
                </div>
              ) : !isAnyPlatformConnected ? (
                renderConnectionWarning()
              ) : (
                <Overview
                  platforms={platformsData}
                  recentPerformance={recentPerformance}
                  contentCalendar={contentCalendar}
                  stats={overviewStats}
                />
              )}
            </Tab>
            <Tab key="posts" title="Posts">
              {!isLoading && !isAnyPlatformConnected ? (
                renderConnectionWarning()
              ) : (
                <Posts />
              )}
            </Tab>
            <Tab key="analytics" title="Analytics">
              {!isLoading && !isAnyPlatformConnected ? (
                renderConnectionWarning()
              ) : (
                <Analytics />
              )}
            </Tab>
          </Tabs>
        </div>
      </div>
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadStart={handleUploadStart}
      />
      {uploadTask && (
        <div className="fixed bottom-5 right-5 z-[9999] w-80 bg-white dark:bg-content1 border border-foreground/10 rounded-xl shadow-2xl p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-start justify-between mb-3">
            <div className="space-y-1">
              <h5 className="font-bold text-[10px] text-gray-400 dark:text-foreground/40 uppercase tracking-wider">
                {uploadTask.status === "uploading" && "Creating Post"}
                {uploadTask.status === "success" && "Created Complete"}
                {uploadTask.status === "error" && "Created Failed"}
              </h5>
              <p className="text-sm font-semibold text-foreground truncate max-w-[220px]">
                {uploadTask.title}
              </p>
            </div>
            {uploadTask.status === "uploading" ? (
              <span className="flex h-2 w-2 relative mt-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            ) : uploadTask.status === "success" ? (
              <span className="text-emerald-500 text-lg font-bold">✓</span>
            ) : (
              <span className="text-red-500 text-lg font-bold">✕</span>
            )}
          </div>
          
          <div className="space-y-2">
            <Progress
              size="sm"
              value={uploadTask.progress}
              color={
                uploadTask.status === "success"
                  ? "success"
                  : uploadTask.status === "error"
                  ? "danger"
                  : "primary"
              }
              className="w-full"
            />
            
            <div className="flex justify-between items-center text-[11px] text-gray-500 dark:text-foreground/50">
              {uploadTask.status === "uploading" && (
                <>
                  <span>Creating post...</span>
                  <span className="font-bold">{uploadTask.progress}%</span>
                </>
              )}
              {uploadTask.status === "success" && (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Creating post successfully!
                </span>
              )}
              {uploadTask.status === "error" && (
                <span className="text-red-600 dark:text-red-400 font-medium truncate max-w-[240px]" title={uploadTask.errorMsg}>
                  {uploadTask.errorMsg}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </ComponentContainer>
  );
}
