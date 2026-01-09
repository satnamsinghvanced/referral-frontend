import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { BiHeart, BiLink } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { FiMessageCircle } from "react-icons/fi";

interface PostItem {
  id: number;
  content: string;
  status: "Published" | "Scheduled";
  statusColor: "green" | "blue";
  dateTime: string;
  platforms: string[];
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
}

const DUMMY_POSTS: PostItem[] = [
  {
    id: 1,
    content:
      "Transform your smile with our advanced orthodontic treatments! Schedule your consultation today. #OrthodonticCare #SmileTransformation",
    status: "Published",
    statusColor: "green",
    dateTime: "15/01/2024",
    platforms: ["Facebook", "Instagram", "LinkedIn"],
    metrics: { likes: 45, comments: 12, shares: 8, views: 234 },
  },
  {
    id: 2,
    content:
      "Did you know? Clear aligners are nearly invisible and can straighten your teeth comfortably. Learn more about our Invisalign options!",
    status: "Published",
    statusColor: "green",
    dateTime: "12/01/2024",
    platforms: ["Instagram", "Facebook"],
    metrics: { likes: 62, comments: 18, shares: 15, views: 312 },
  },
  {
    id: 3,
    content:
      "Exciting news! Our practice now offers extended hours on weekends. Book your appointment today!",
    status: "Scheduled",
    statusColor: "blue",
    dateTime: "20/01/2024",
    platforms: ["Facebook", "LinkedIn"],
    metrics: { likes: 0, comments: 0, shares: 0, views: 0 },
  },
];

const Posts = () => {
  return (
    <Card className="bg-background rounded-xl shadow-none p-5 border border-primary/15 w-full">
      <CardHeader className="flex justify-between items-center mb-5 p-0">
        <h2 className="text-sm">Recent Posts</h2>
        <Chip
          size="sm"
          radius="sm"
          className="text-[11px] text-sky-900 bg-sky-100"
        >
          3 total posts
        </Chip>
      </CardHeader>

      <CardBody className="p-0 space-y-3">
        {DUMMY_POSTS.map((post) => {
          const statusBg =
            post.statusColor === "green" ? "bg-green-100" : "bg-blue-100";
          const statusText =
            post.statusColor === "green" ? "text-green-900" : "text-blue-600";

          return (
            <Card
              key={post.id}
              className="border border-primary/15 p-4 rounded-xl shadow-none"
            >
              <p className="text-xs sm:text-sm mb-2 whitespace-pre-wrap">{post.content}</p>

              {/* Status and Published Date */}
              <div className="flex whitespace-nowrap items-center gap-3 mb-2.5">
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full ${statusText} ${statusBg} `}
                >
                  ● {post.status}
                </span>
                <span className="text-gray-500 font-extralight text-[11px]  whitespace-nowrap">
                  {post.status}: {post.dateTime}
                </span>
              </div>

              {/* Platforms (Tags) */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">

                <div className="flex flex-wrap gap-2 text-[11px]">
                  {post.platforms.map((platform, index) => (
                    <span
                      key={index}
                      className={`border border-primary/15 px-2 py-0.5 rounded-xl`}
                    >
                      {platform}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 text-gray-500 text-[12px] sm:text-[11px] mt-2 sm:mt-0">
                  <span title={`${post.metrics.likes} Likes`}>
                    <BiHeart className="inline w-4 h-4 sm:w-3 sm:h-3 relative -top-px" />{" "}
                    {post.metrics.likes}
                  </span>
                  <span title={`${post.metrics.comments} Comments`}>
                    <FiMessageCircle className="inline w-4 h-4 sm:w-3 sm:h-3 relative -top-px" />{" "}
                    {post.metrics.comments}
                  </span>
                  <span title={`${post.metrics.shares} Shares`}>
                    <BiLink className="inline w-4 h-4 sm:w-3 sm:h-3 relative -top-px" />{" "}
                    {post.metrics.shares}
                  </span>
                  <span title={`${post.metrics.views} Views`}>
                    <BsEye className="inline w-4 h-4 sm:w-3 sm:h-3 relative -top-px" />{" "}
                    {post.metrics.views}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </CardBody>
    </Card>
  );
};

export default Posts;
