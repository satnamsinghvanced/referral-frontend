import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
} from "@heroui/react";
import { FiSettings } from "react-icons/fi";
import { LuPlugZap } from "react-icons/lu";

interface PlatformItem {
  id: string;
  name: string;
  iconColor: string;
  status: "Connected" | "Not Connected";
  followers: number;
  engagementRate: string;
}

const SOCIAL_MEDIA_PLATFORMS: PlatformItem[] = [
  {
    id: "facebook",
    name: "Facebook",
    iconColor: "bg-blue-500",
    status: "Connected",
    followers: 1234,
    engagementRate: "5.2%",
  },
  {
    id: "instagram",
    name: "Instagram",
    iconColor: "bg-pink-500",
    status: "Connected",
    followers: 987,
    engagementRate: "6.1%",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    iconColor: "bg-primary-500",
    status: "Connected",
    followers: 626,
    engagementRate: "3.8%",
  },
  {
    id: "twitter",
    name: "Twitter",
    iconColor: "bg-sky-500",
    status: "Not Connected",
    followers: 0,
    engagementRate: "0%",
  },
  {
    id: "youtube",
    name: "YouTube",
    iconColor: "bg-red-500",
    status: "Not Connected",
    followers: 0,
    engagementRate: "0%",
  },
  {
    id: "tiktok",
    name: "TikTok",
    iconColor: "bg-black",
    status: "Not Connected",
    followers: 0,
    engagementRate: "0%",
  },
];

const Platforms = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {SOCIAL_MEDIA_PLATFORMS.map((platform) => {
        const isConnected = platform.status === "Connected";
        const statusColor = isConnected
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-700";
        const statusText = isConnected ? "Connected" : "Not Connected";

        return (
          <Card className="bg-background p-5 border border-primary/15 rouned-xl shadow-none">
            {/* Header: Platform Name and Status */}
            <CardHeader className="flex items-center justify-between p-0 pb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-sm ${platform.iconColor}`}
                ></div>
                <span className="text-sm font-medium">{platform.name}</span>
              </div>
              <Chip
                size="sm"
                radius="sm"
                className={`text-[11px] ${statusColor}`}
              >
                {statusText}
              </Chip>
            </CardHeader>

            {/* Stats */}
            <CardBody className="p-0 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <p className="text-gray-600">Followers</p>
                <p className="font-medium">
                  {platform.followers.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs">
                <p className="text-gray-600">Engagement Rate</p>
                <p className="font-medium">{platform.engagementRate}</p>
              </div>
            </CardBody>

            <CardFooter className="p-0 pt-5 rounded-none">
              {isConnected ? (
                <Button
                  size="sm"
                  radius="sm"
                  variant="ghost"
                  startContent={<FiSettings className="size-3.5" />}
                  onPress={() => {}}
                  fullWidth
                  className="border-small"
                >
                  Manage
                </Button>
              ) : (
                <Button
                  size="sm"
                  radius="sm"
                  variant="solid"
                  color="primary"
                  onPress={() => {}}
                  fullWidth
                >
                  Connect Account
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default Platforms;
