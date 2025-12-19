import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
} from "@heroui/react";
import { useState } from "react";
import { FiSettings } from "react-icons/fi";
import { useGetSocialMediaCredentials } from "../../hooks/useSocial";
import GoogleBusinessConfigModal from "../integrations/modal/GoogleBusinessConfigModal";
import SocialMediaConfigModal from "./modal/SocialMediaConfigModal";

interface PlatformItem {
  id: string;
  name: string;
  iconColor: string;
  status: any;
  followers: number;
  engagementRate: string;
}

const Platforms = () => {
  const [openPlatform, setOpenPlatform] = useState<any>(null);

  const { data: allCredentials, isLoading: isGlobalLoading } =
    useGetSocialMediaCredentials();

  const SOCIAL_MEDIA_PLATFORMS: PlatformItem[] = [
    {
      id: "meta",
      name: "Meta (Facebook & Instagram)",
      iconColor: "bg-[#0081FB]",
      status: "Not Connected",
      followers: 1234,
      engagementRate: "5.2%",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      iconColor: "bg-[#0077B5]",
      status: allCredentials?.linkedin?.status as string,
      followers: 626,
      engagementRate: "3.8%",
    },
    {
      id: "youTube",
      name: "YouTube",
      iconColor: "bg-[#FF0000]",
      status: allCredentials?.youTube?.status as string,
      followers: 0,
      engagementRate: "0%",
    },
    {
      id: "googleBusiness",
      name: "Google Business",
      iconColor: "bg-[#0F9D58]",
      status: "Not Connected",
      followers: 987,
      engagementRate: "6.1%",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SOCIAL_MEDIA_PLATFORMS.map((platform) => {
          const isConnected = platform.status === "connected";
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
                    onPress={() => setOpenPlatform(platform.id)}
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
                    onPress={() => setOpenPlatform(platform.id)}
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

      {openPlatform === "googleBusiness" ? (
        <GoogleBusinessConfigModal
          isOpen={!!openPlatform}
          onClose={() => setOpenPlatform(null)}
          allCredentials={allCredentials}
          isGlobalLoading={isGlobalLoading}
        />
      ) : (
        openPlatform && (
          <SocialMediaConfigModal
            platform={openPlatform}
            isOpen={!!openPlatform}
            onClose={() => setOpenPlatform(null)}
            allCredentials={allCredentials}
            isGlobalLoading={isGlobalLoading}
          />
        )
      )}
    </>
  );
};

export default Platforms;
