import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
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

const Posts = () => {
  const [page, setPage] = useState(1);
  const limit = EVEN_PAGINATION_LIMIT;
  const { data, isLoading } = useRecentPosts(page, limit);

  const posts = data?.posts || [];
  const pagination = data?.pagination;

  if (isLoading)
    return (
      <div className="min-h-[250px] flex items-center justify-center">
        <LoadingState />
      </div>
    );

  return (
    <div className="space-y-4 w-full">
      <Card className="bg-background rounded-xl shadow-none p-4 border border-foreground/10 w-full">
        <CardHeader className="flex justify-between items-center mb-4 p-0">
          <h2 className="text-sm">Recent Posts</h2>
          <Chip
            size="sm"
            radius="sm"
            className="text-[11px] text-sky-900 bg-sky-100 dark:bg-sky-500/10 dark:text-sky-300"
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
                  }[post.status] || {
                    text: "text-gray-600 dark:text-foreground/60",
                    bg: "bg-gray-100 dark:bg-gray-500/20",
                  };

                  return (
                    <Card
                      key={post._id}
                      className="border border-foreground/10 p-3 md:p-4 rounded-xl shadow-none"
                    >
                      <div className="flex justify-between items-start mb-1.5">
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
                          ) : post.status === "Published" ? (
                            <FaRegCircleCheck className="w-2.5 h-2.5" />
                          ) : (
                            <FiClock className="w-2.5 h-2.5" />
                          )}{" "}
                          {post.status}
                        </span>
                        <span className="text-gray-500 dark:text-foreground/60 font-extralight text-[11px] whitespace-nowrap">
                          {post.status === "Published"
                            ? "Published"
                            : "Modified"}
                          :{" "}
                          {formatDateToReadable(
                            post.publishedTime || post.updatedAt,
                            true,
                          )}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div className="flex flex-wrap gap-2 text-[11px]">
                          {post.platforms.map((platform, index) => (
                            <span
                              key={index}
                              className={`border border-foreground/10 px-2 py-0.5 rounded-xl capitalize`}
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

                      {post.status === "Failed" && post.failureReason && (
                        <div className="mt-3 p-2 bg-red-50 dark:bg-red-500/10 rounded-lg text-[11px] text-red-700 dark:text-red-300 border border-red-100 dark:border-red-500/20">
                          <strong>Failure Reason:</strong> {post.failureReason}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
              <Pagination
                identifier="posts"
                limit={limit}
                totalItems={pagination?.total || 0}
                currentPage={page}
                totalPages={pagination?.totalPages || 0}
                handlePageChange={setPage}
              />
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Posts;
