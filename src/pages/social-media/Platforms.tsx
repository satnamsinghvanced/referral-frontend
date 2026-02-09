import { Card, CardBody, CardHeader } from "@heroui/react";
import { useMemo } from "react";
import { FaLinkedin, FaMeta, FaYoutube } from "react-icons/fa6";
import { LoadingState } from "../../components/common/LoadingState";
import {
  useConnectSocial,
  useSocialCredentials,
  useUpdateSocial,
} from "../../hooks/useSocial";
import IntegrationItem from "../integrations/IntegrationItem";

const Platforms = () => {
  const { data: allCredentials, isLoading: isGlobalLoading } =
    useSocialCredentials();
  const { mutate: connectSocial } = useConnectSocial();
  const { mutate: updateSocial } = useUpdateSocial();

  const SOCIAL_MEDIA_PLATFORMS = useMemo(() => {
    const normalizeStatus = (
      status: string | undefined,
    ): "Connected" | "Disconnected" | "Error" => {
      if (!status) return "Disconnected";
      if (status === "connected") return "Connected";
      if (status === "notConnected") return "Disconnected";
      return (status.charAt(0).toUpperCase() + status.slice(1)) as any;
    };

    return [
      {
        id: allCredentials?.meta?._id || "",
        platformId: "meta",
        platformKey: "metaAuthIntegration",
        name: "Meta (Facebook & Instagram)",
        icon: <FaMeta className="w-4 h-4" />,
        iconBg: "bg-blue-100 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
        status: normalizeStatus(allCredentials?.meta?.status),
        description:
          "Connect Facebook and Instagram to sync posts and track engagement.",
        badges: ["Facebook", "Instagram", "Ads Sync"],
        followers: allCredentials?.meta?.followers || 0,
        engagementRate: allCredentials?.meta?.engagementRate || 0,
      },
      {
        id: allCredentials?.linkedin?._id || "",
        platformId: "linkedin",
        platformKey: "linkedinAuthIntegration",
        name: "LinkedIn",
        icon: <FaLinkedin className="w-4 h-4" />,
        iconBg: "bg-cyan-100 dark:bg-cyan-900/20",
        iconColor: "text-cyan-600 dark:text-cyan-400",
        status: normalizeStatus(allCredentials?.linkedin?.status),
        description:
          "Share professional updates and track your network growth on LinkedIn.",
        badges: ["Professional Network", "Post Sync", "Analytics"],
        followers: allCredentials?.linkedin?.followers || 0,
        engagementRate: allCredentials?.linkedin?.engagementRate || 0,
      },
      {
        id: allCredentials?.youTube?._id || "",
        platformId: "youTube",
        platformKey: "youtubeAuthIntegration",
        name: "YouTube",
        icon: <FaYoutube className="w-4 h-4" />,
        iconBg: "bg-red-100 dark:bg-red-900/20",
        iconColor: "text-red-600 dark:text-red-400",
        status: normalizeStatus(allCredentials?.youTube?.status),
        description: "Sync your video content and monitor channel performance.",
        badges: ["Video Sync", "Channel Stats", "Views Tracking"],
        followers: allCredentials?.youTube?.followers || 0,
        engagementRate: allCredentials?.youTube?.engagementRate || 0,
      },
      // {
      //   id: allCredentials?.twitter?._id || "",
      //   platformId: "twitter",
      //   name: "Twitter (X)",
      //   icon: <FaTwitter className="w-4 h-4" />,
      //   iconBg: "bg-gray-100 dark:bg-gray-800",
      //   iconColor: "text-gray-900 dark:text-white",
      //   status: normalizeStatus(allCredentials?.twitter?.status),
      //   description: "Connect your X account to manage tweets and track reach.",
      //   badges: ["Tweets", "Reach", "Real-time Sync"],
      //   followers: allCredentials?.twitter?.followers || 0,
      //   engagementRate: allCredentials?.twitter?.engagementRate || 0,
      // },
      // {
      //   id: allCredentials?.tikTok?._id || "",
      //   platformId: "tikTok",
      //   name: "TikTok",
      //   icon: <FaTiktok className="w-4 h-4" />,
      //   iconBg: "bg-pink-100 dark:bg-pink-900/20",
      //   iconColor: "text-pink-600 dark:text-pink-400",
      //   status: normalizeStatus(allCredentials?.tikTok?.status),
      //   description: "Sync short-form video content and monitor viral trends.",
      //   badges: ["Short-form Video", "Trends", "Viral Analytics"],
      //   followers: allCredentials?.tikTok?.followers || 0,
      //   engagementRate: allCredentials?.tikTok?.engagementRate || 0,
      // },
    ];
  }, [allCredentials]);

  if (isGlobalLoading) {
    return (
      <div className="min-h-[250px] flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <Card className="shadow-none border border-foreground/10 rounded-xl p-4 bg-background">
        <CardHeader className="p-0 pb-5">
          <h4 className="font-medium text-sm text-foreground">
            Social Media Platforms
          </h4>
        </CardHeader>
        <CardBody className="divide-y divide-gray-100 dark:divide-default-100/50 p-0">
          {SOCIAL_MEDIA_PLATFORMS.map((platform) => (
            <IntegrationItem
              key={platform.platformId}
              {...platform}
              onConnect={() =>
                connectSocial({
                  platform: platform.platformId,
                  platformKey: platform.platformKey,
                })
              }
              onReconnect={() =>
                connectSocial({
                  platform: platform.platformId,
                  platformKey: platform.platformKey,
                })
              }
              isSwitchChecked={platform.status === "Connected"}
              onSwitchChange={() => {
                updateSocial({
                  id: platform.id,
                  payload: {
                    status:
                      platform.status === "Connected"
                        ? "Disconnected"
                        : "Connected",
                  },
                });
              }}
            />
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

export default Platforms;
