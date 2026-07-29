import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState } from "react";
import { BiHeart, BiSolidError } from "react-icons/bi";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FiClock, FiMessageCircle } from "react-icons/fi";
import { LuEye } from "react-icons/lu";
import { RiLinksFill } from "react-icons/ri";
import { LoadingState } from "../../components/common/LoadingState";
import Pagination from "../../components/common/Pagination";
import { EVEN_PAGINATION_LIMIT } from "../../consts/consts";
import { useRecentPosts } from "../../hooks/useSocial";
import { formatDateToReadable } from "../../utils/formatDateToReadable";
import { usePaginationAdjustment } from "../../hooks/common/usePaginationAdjustment";

const Posts = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const limit = EVEN_PAGINATION_LIMIT;
  const { data, isLoading } = useRecentPosts(page, limit, statusFilter);

  const posts = data?.posts || [];
  const pagination = data?.pagination;

  usePaginationAdjustment({
    totalPages: pagination?.totalPages || 0,
    currentPage: page,
    onPageChange: (newPage) => setPage(newPage),
    isLoading,
  });

  if (isLoading)
    return (
      <div className="min-h-[250px] flex items-center justify-center">
        <LoadingState />
      </div>
    );

  return (
    <div className="space-y-4 w-full">
      <Card className="bg-background rounded-xl shadow-none p-4 border border-foreground/10 w-full">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 p-0">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <h2 className="text-sm font-medium">Recent Posts</h2>
            <Select
              aria-label="Filter by Status"
              placeholder="All Posts"
              size="sm"
              className="w-40"
              selectedKeys={new Set([statusFilter])}
              onSelectionChange={(keys) => {
                const val = Array.from(keys)[0] as string;
                setStatusFilter(val || "all");
                setPage(1);
              }}
            >
              <SelectItem key="all" className="capitalize">
                All Posts
              </SelectItem>
              <SelectItem key="Scheduled" className="capitalize">
                Scheduled
              </SelectItem>
              <SelectItem key="Published" className="capitalize">
                Published
              </SelectItem>
            </Select>
          </div>
          <Chip
            size="sm"
            radius="sm"
            className="text-[11px] text-sky-900 bg-sky-100 dark:bg-sky-500/10 dark:text-sky-300 max-sm:self-end"
          >
            {pagination?.total || 0} total posts
          </Chip>
        </CardHeader>

        <CardBody className="p-0 space-y-3">
          {posts.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-foreground/60 text-sm">
              No posts found.
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {posts.map((post) => {
                  const statusColors = {
                    Published: {
                      text: "text-green-900 dark:text-green-300",
                      bg: "bg-green-100 dark:bg-green-500/20",
                    },
                    Scheduled: {
                      text: "text-blue-600 dark:text-blue-300",
                      bg: "bg-blue-100 dark:bg-blue-500/20",
                    },
                    Failed: {
                      text: "text-red-600 dark:text-red-300",
                      bg: "bg-red-100 dark:bg-red-500/20",
                    },
                    "Partially Failed": {
                      text: "text-amber-700 dark:text-amber-400",
                      bg: "bg-amber-100/70 dark:bg-amber-500/10",
                    },
                    Processing: {
                      text: "text-purple-600 dark:text-purple-300",
                      bg: "bg-purple-100 dark:bg-purple-500/20",
                    },
                  }[post.status] || {
                    text: "text-gray-600 dark:text-foreground/60",
                    bg: "bg-gray-100 dark:bg-gray-500/20",
                  };

                  return (
                    <Card
                      key={post._id}
                      className="border border-foreground/10 p-3 md:p-4 rounded-xl shadow-none"
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <h4 className="text-sm font-medium">{post.title}</h4>
                      </div>
                      <p className="text-xs mb-2.5 whitespace-pre-wrap text-gray-700 dark:text-foreground/80">
                        {post.description}
                      </p>

                      <div className="flex whitespace-nowrap items-center gap-3 mb-2.5">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full ${statusColors.text} ${statusColors.bg} flex items-center gap-1`}
                        >
                          {post.status === "Failed" ? (
                            <BiSolidError />
                          ) : post.status === "Partially Failed" ? (
                            <BiSolidError className="text-amber-600 dark:text-amber-400" />
                          ) : post.status === "Published" ? (
                            <FaRegCircleCheck className="w-2.5 h-2.5" />
                          ) : post.status === "Processing" ? (
                            <FiClock className="w-2.5 h-2.5 animate-spin" />
                          ) : (
                            <FiClock className="w-2.5 h-2.5" />
                          )}{" "}
                          {post.status}
                        </span>
                        <span className="text-gray-500 dark:text-foreground/60 font-extralight text-[11px] whitespace-nowrap">
                          {post.status === "Published" || post.status === "Partially Failed" ? (
                            <>
                              Published:{" "}
                              {formatDateToReadable(
                                post.publishedTime || post.updatedAt,
                                true,
                              )}
                            </>
                          ) : post.status === "Scheduled" ? (
                            <>
                              Scheduled:{" "}
                              {formatDateToReadable(
                                post.scheduledTime || post.updatedAt,
                                true,
                              )}
                            </>
                          ) : (
                            <>
                              Modified:{" "}
                              {formatDateToReadable(
                                post.updatedAt,
                                true,
                              )}
                            </>
                          )}
                        </span>
                      </div>

                      {/* Helpers for platform statuses */}
                      {(() => {
                        const getPlatformStatus = (platform: string) => {
                          if (post.status === "Published") return "Published";
                          if (post.status === "Scheduled") return "Scheduled";

                          const normKey = platform.toLowerCase();
                          if (post.platformIds && post.platformIds[normKey]) {
                            const record = post.platformIds[normKey];
                            if (record && typeof record === "object" && "success" in record) {
                              return record.success ? "Published" : "Failed";
                            }
                            return "Published";
                          }

                          let parsedErrors: Record<string, string> = {};
                          try {
                            if (post.failureReason && post.failureReason.trim().startsWith("{")) {
                              parsedErrors = JSON.parse(post.failureReason);
                            }
                          } catch (e) {}

                          if (parsedErrors[normKey]) {
                            return "Failed";
                          }

                          if (post.status === "Failed" || post.status === "Partially Failed") {
                            return "Failed";
                          }
                          return post.status;
                        };

                        const getPlatformBadgeClasses = (platform: string) => {
                          const status = getPlatformStatus(platform);
                          if (status === "Published") {
                            return "border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10";
                          }
                          if (status === "Failed") {
                            return "border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10";
                          }
                          if (status === "Scheduled") {
                            return "border-blue-200 dark:border-blue-900/30 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10";
                          }
                          if (status === "Processing") {
                            return "border-purple-200 dark:border-purple-900/30 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10";
                          }
                          return "border-foreground/10 text-foreground/60 bg-foreground/5";
                        };

                        return (
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <div className="flex flex-wrap gap-2 text-[11px]">
                              {post.platforms.map((platform, index) => (
                                <span
                                  key={index}
                                  className={`border px-2 py-0.5 rounded-xl capitalize ${getPlatformBadgeClasses(platform)}`}
                                >
                                  {platform}
                                </span>
                              ))}
                            </div>

                            <div className="flex flex-wrap gap-3 text-gray-500 dark:text-foreground/60 text-xs mt-2">
                              <span title={`${post.summary?.likes || 0} Likes`}>
                                <BiHeart className="inline w-3.5 h-3.5 max-sm:w-3 max-sm:h-3 relative -top-px" />{" "}
                                {post.summary?.likes || 0}
                              </span>
                              <span
                                title={`${post.summary?.comments || 0} Comments`}
                              >
                                <FiMessageCircle className="inline w-3.5 h-3.5 max-sm:w-3 max-sm:h-3 relative -top-px" />{" "}
                                {post.summary?.comments || 0}
                              </span>
                              <span title={`${post.summary?.views || 0} Views`}>
                                <LuEye className="inline w-3.5 h-3.5 max-sm:w-3 max-sm:h-3 relative -top-px" />{" "}
                                {post.summary?.views || 0}
                              </span>
                              <span title={`${post.summary?.shares || 0} Shares`}>
                                <RiLinksFill className="inline w-3.5 h-3.5 max-sm:w-3 max-sm:h-3 relative -top-px" />{" "}
                                {post.summary?.shares || 0}
                              </span>
                            </div>
                          </div>
                        );
                      })()}

                    </Card>
                  );
                })}
              </div>
              {pagination && pagination.totalPages > 1 ? (
                <Pagination
                  identifier="posts"
                  limit={limit}
                  totalItems={pagination?.total || 0}
                  currentPage={page}
                  totalPages={pagination?.totalPages || 0}
                  handlePageChange={setPage}
                />
              ) : (
                ""
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Posts;
