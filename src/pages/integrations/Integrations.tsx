import { Card, CardBody, CardHeader } from "@heroui/react";
import { useMemo, useState } from "react";
import { BsLightningCharge } from "react-icons/bs";
import { FaGoogle } from "react-icons/fa";
import { FaMeta, FaRegEnvelope } from "react-icons/fa6";
import { LuCalendar } from "react-icons/lu";
import { SiGoogleads } from "react-icons/si";
import { TbBrandTwilio } from "react-icons/tb";
import ComponentContainer from "../../components/common/ComponentContainer";
import {
  useConnectGoogleAds,
  useConnectMetaAds,
  useGoogleAdsIntegration,
  useMetaAdsIntegration,
  useUpdateGoogleAds,
  useUpdateMetaAds,
} from "../../hooks/integrations/useAds";
import {
  useFetchEmailIntegration,
  useUpdateEmailIntegration,
} from "../../hooks/integrations/useEmailMarketing";
import {
  useAnalyticsIntegration,
  useConnectAnalytics,
  useUpdateAnalytics,
} from "../../hooks/integrations/useGoogleAnalytics";
import {
  useBusinessIntegration,
  useConnectBusiness,
  useUpdateBusiness,
} from "../../hooks/integrations/useGoogleBusiness";
import {
  useCalendarIntegration,
  useConnectCalendar,
  useUpdateCalendar,
} from "../../hooks/integrations/useGoogleCalendar";
import {
  useFetchTwilioConfig,
  useUpdateTwilioConfig,
} from "../../hooks/integrations/useTwilio";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { timeAgo } from "../../utils/timeAgo";
import IntegrationItem from "./IntegrationItem";
import EmailMarketingConfigModal from "./modal/EmailMarketingConfigModal";
import TwilioConfigurationModal from "./modal/TwilioConfigurationModal";
import Webhooks from "./webhooks/Webhooks";

function Integrations() {
  const { user } = useTypedSelector((state) => state.auth);
  const userId = user?.userId;

  const [isTwilioIntegrationModalOpen, setIsTwilioIntegrationModalOpen] =
    useState(false);

  const [
    isEmailMarketingIntegrationModalOpen,
    setIsEmailMarketingIntegrationModalOpen,
  ] = useState(false);

  const {
    data: googleCalendarExistingConfig,
    isLoading: isGoogleCalendarConfigLoading,
    isError: isGoogleCalendarConfigError,
  } = useCalendarIntegration();

  const { mutate: updateGoogleCalendarIntegration } = useUpdateCalendar();

  const { mutate: connectCalendar } = useConnectCalendar();

  const { data: emailExistingConfig, isLoading: isEmailConfigLoading } =
    useFetchEmailIntegration();

  const { mutate: updateEmailIntegration } = useUpdateEmailIntegration();

  const {
    data: twilioConfig,
    isLoading: isTwilioConfigLoading,
    isError: isTwilioConfigError,
  } = useFetchTwilioConfig();

  const { mutate: updateTwilioConfig } = useUpdateTwilioConfig();

  const { data: googleAdsConfig, isLoading: isGoogleAdsConfigLoading } =
    useGoogleAdsIntegration();

  const { mutate: updateGoogleAdsIntegration } = useUpdateGoogleAds();
  const { mutate: connectGoogleAds } = useConnectGoogleAds();

  const { data: metaAdsConfig, isLoading: isMetaAdsConfigLoading } =
    useMetaAdsIntegration();

  const { mutate: updateMetaAdsIntegration } = useUpdateMetaAds();
  const { mutate: connectMetaAds } = useConnectMetaAds();

  const {
    data: googleBusinessConfig,
    isLoading: isGoogleBusinessConfigLoading,
  } = useBusinessIntegration();

  const { mutate: updateGoogleBusinessIntegration } = useUpdateBusiness();
  const { mutate: connectGoogleBusiness } = useConnectBusiness();

  const {
    data: googleAnalyticsConfig,
    isLoading: isGoogleAnalyticsConfigLoading,
  } = useAnalyticsIntegration();

  const { mutate: updateGoogleAnalyticsIntegration } = useUpdateAnalytics();
  const { mutate: connectGoogleAnalytics } = useConnectAnalytics();

  // Normalize email config to handle both single object and array responses
  const emailConfig = Array.isArray(emailExistingConfig)
    ? emailExistingConfig[0]
    : emailExistingConfig;

  const HEADING_DATA = {
    heading: "Integrations",
    subHeading:
      "Connect your favorite tools and services to streamline your referral workflow.",
    buttons: [],
  };

  const isTwilioConnected = !!(
    twilioConfig &&
    twilioConfig.authToken &&
    twilioConfig.accountId &&
    twilioConfig.phone
  );

  const AVAILABLE_INTEGRATIONS = useMemo(() => {
    return [
      {
        id: googleBusinessConfig?._id || "",
        name: "Google My Business",
        icon: <FaGoogle className="w-4 h-4" />,
        iconBg: "bg-red-100 dark:bg-red-900/20",
        iconColor: "text-red-600 dark:text-red-400",
        status: googleBusinessConfig?.status || "Disconnected",
        description:
          "Automatically sync reviews and manage your practice listing",
        badges: [
          "Review sync",
          "Business listing management",
          "Analytics integration",
        ],
        lastSync: googleBusinessConfig?.lastSyncAt
          ? timeAgo(googleBusinessConfig.lastSyncAt)
          : undefined,
        onConnect: () => connectGoogleBusiness(),
        onReconnect: () => connectGoogleBusiness(),
        isSwitchChecked: googleBusinessConfig?.status === "Connected",
        onSwitchChange: () => {
          updateGoogleBusinessIntegration({
            id: googleBusinessConfig?._id as string,
            payload: {
              status:
                googleBusinessConfig?.status === "Connected"
                  ? "Disconnected"
                  : "Connected",
            },
          });
        },
      },
      // {
      //   id: "",
      //   name: "Practice Management System",
      //   icon: <TbDatabase className="w-4 h-4" />,
      //   iconBg: "bg-blue-100",
      //   iconColor: "text-blue-600",
      //   status: "Disconnected" as const,
      //   description:
      //     "Connect your PMS to automatically track patient referrals",
      //   badges: [
      //     "Patient data sync",
      //     "Appointment tracking",
      //     "Referral automation",
      //   ],
      //   lastSync: "15 minutes ago",
      // },

      {
        id: googleCalendarExistingConfig?._id || "",
        name: "Google Calendar Integration",
        icon: <LuCalendar className="w-4 h-4" />,
        iconBg: "bg-purple-100 dark:bg-purple-900/20",
        iconColor: "text-purple-600 dark:text-purple-400",
        status: googleCalendarExistingConfig?.status || "Disconnected",
        description:
          "Sync marketing activities and referral events with Google Calendar",
        badges: ["Activity Sync", "Event Management", "Calendar Integration"],
        lastSync: googleCalendarExistingConfig?.lastSyncAt
          ? timeAgo(googleCalendarExistingConfig.lastSyncAt)
          : undefined,
        onConnect: () => connectCalendar(),
        onReconnect: () => connectCalendar(),
        isSwitchChecked: googleCalendarExistingConfig?.status === "Connected",
        onSwitchChange: () => {
          updateGoogleCalendarIntegration({
            id: googleCalendarExistingConfig?._id as string,
            payload: {
              status:
                googleCalendarExistingConfig?.status === "Connected"
                  ? "Disconnected"
                  : "Connected",
            },
          });
        },
      },
      {
        id: googleAdsConfig?._id || "",
        name: "Google Ads",
        icon: <SiGoogleads className="w-4 h-4" />,
        iconBg: "bg-blue-100 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
        status: googleAdsConfig?.status || "Disconnected",
        description:
          "Sync ad performance and optimize referral-based campaigns",
        badges: [
          "Campaign tracking",
          "Conversion attribution",
          "Ad spend analytics",
        ],
        onConnect: () => connectGoogleAds(),
        onReconnect: () => connectGoogleAds(),
        isSwitchChecked: googleAdsConfig?.status === "Connected",
        onSwitchChange: () => {
          updateGoogleAdsIntegration({
            id: googleAdsConfig?._id as string,
            payload: {
              status:
                googleAdsConfig?.status === "Connected"
                  ? "Disconnected"
                  : "Connected",
            },
          });
        },
      },
      {
        id: googleAnalyticsConfig?._id || "",
        name: "Google Analytics",
        icon: <BsLightningCharge className="w-4 h-4" />,
        iconBg: "bg-yellow-100 dark:bg-yellow-900/20",
        iconColor: "text-yellow-600 dark:text-yellow-400",
        status: googleAnalyticsConfig?.status || "Disconnected",
        description: "Advanced reporting and GA4 property data visualization",
        badges: ["GA4 Reporting", "Activity Visualization", "Data Insights"],
        lastSync: googleAnalyticsConfig?.lastSyncAt
          ? timeAgo(googleAnalyticsConfig.lastSyncAt)
          : undefined,
        onConnect: () => connectGoogleAnalytics(),
        onReconnect: () => connectGoogleAnalytics(),
        isSwitchChecked: googleAnalyticsConfig?.status === "Connected",
        onSwitchChange: () => {
          updateGoogleAnalyticsIntegration({
            id: googleAnalyticsConfig?._id as string,
            payload: {
              status:
                googleAnalyticsConfig?.status === "Connected"
                  ? "Disconnected"
                  : "Connected",
            },
          });
        },
      },
      {
        id: emailConfig?._id || "",
        name: "Email Marketing Platform",
        icon: <FaRegEnvelope className="w-4 h-4" />,
        iconBg: "bg-green-100 dark:bg-green-900/20",
        iconColor: "text-green-600 dark:text-green-400",
        status: emailConfig?.status,
        description:
          "Configure SMTP settings to send automated referral notifications",
        badges: [
          "Automated Campaigns",
          "Referral Notifications",
          "Email Analytics",
        ],
        lastSync: emailConfig?.lastTestedAt
          ? timeAgo(emailConfig.lastTestedAt)
          : undefined,
        onConnect: () => setIsEmailMarketingIntegrationModalOpen(true),
        onConfigure: () => setIsEmailMarketingIntegrationModalOpen(true),
        isSwitchChecked: emailConfig?.status === "Connected",
        onSwitchChange: () => {
          if (emailConfig?._id) {
            updateEmailIntegration({
              id: emailConfig._id,
              // @ts-ignore
              data: {
                status:
                  emailConfig.status === "Connected"
                    ? "Disconnected"
                    : "Connected",
              },
            });
          }
        },
      },

      {
        id: metaAdsConfig?._id || "",
        name: "Meta Ads",
        icon: <FaMeta className="w-4 h-4" />,
        iconBg: "bg-indigo-100 dark:bg-indigo-900/20",
        iconColor: "text-indigo-600 dark:text-indigo-400",
        status: metaAdsConfig?.status || "Disconnected",
        description: "Connect Facebook & Instagram Ads for referral targeting",
        badges: [
          "Audience sync",
          "Lead tracking",
          "Campaign performance insights",
        ],
        onConnect: () => connectMetaAds(),
        onReconnect: () => connectMetaAds(),
        isSwitchChecked: metaAdsConfig?.status === "Connected",
        onSwitchChange: () => {
          updateMetaAdsIntegration({
            id: metaAdsConfig?._id as string,
            payload: {
              status:
                metaAdsConfig?.status === "Connected"
                  ? "Disconnected"
                  : "Connected",
            },
          });
        },
      },
      // {
      //   id: "",
      //   name: "TikTok Ads",
      //   icon: <FaTiktok className="w-4 h-4" />,
      //   iconBg: "bg-gray-100",
      //   iconColor: "text-gray-700",
      //   status: "Disconnected" as const,
      //   description: "Track TikTok ad campaigns and boost referral engagement",
      //   badges: ["Pixel tracking", "Campaign reporting", "Audience insights"],
      // },
      {
        id: twilioConfig?._id || "",
        name: "Twilio Calling Integration",
        icon: <TbBrandTwilio className="w-4 h-4" />,
        iconBg: "bg-red-100 dark:bg-red-900/20",
        iconColor: "text-red-600 dark:text-red-400",
        status: twilioConfig?.status || "Disconnected",
        description:
          "Track patient calls and monitor referral communications with recordings",
        badges: ["Call Analytics", "Call Tracking", "Call Recordings"],
        onConnect: () => setIsTwilioIntegrationModalOpen(true),
        onConfigure: () => setIsTwilioIntegrationModalOpen(true),
        isSwitchChecked: twilioConfig?.status === "Connected",
        onSwitchChange: () => {
          updateTwilioConfig({
            id: twilioConfig?._id as string,
            data: {
              status:
                twilioConfig?.status === "Connected"
                  ? "Disconnected"
                  : "Connected",
            },
          });
        },
      },
    ];
  }, [
    emailConfig,
    googleCalendarExistingConfig,
    updateEmailIntegration,
    updateGoogleCalendarIntegration,
    connectCalendar,
    twilioConfig,
    isTwilioConnected,
    googleAdsConfig,
    updateGoogleAdsIntegration,
    connectGoogleAds,
    metaAdsConfig,
    updateMetaAdsIntegration,
    connectMetaAds,
    googleBusinessConfig,
    updateGoogleBusinessIntegration,
    connectGoogleBusiness,
    googleAnalyticsConfig,
    updateGoogleAnalyticsIntegration,
    connectGoogleAnalytics,
  ]);

  return (
    <>
      <ComponentContainer headingData={HEADING_DATA}>
        <div className="flex flex-col gap-4 md:gap-5">
          <Card className="shadow-none border border-foreground/10 rounded-xl p-4 bg-background">
            <CardHeader className="p-0 pb-5">
              <h4 className="font-medium text-sm text-foreground">
                Available Integrations
              </h4>
            </CardHeader>
            <CardBody className="divide-y divide-gray-100 dark:divide-default-100/50 p-0">
              {AVAILABLE_INTEGRATIONS.map((item, index) => (
                <IntegrationItem key={index} {...item} />
              ))}
            </CardBody>
          </Card>
          <Webhooks />
        </div>
      </ComponentContainer>

      <TwilioConfigurationModal
        userId={userId as string}
        isOpen={isTwilioIntegrationModalOpen}
        onClose={() => setIsTwilioIntegrationModalOpen(false)}
        existingConfig={twilioConfig}
        isLoading={isTwilioConfigLoading}
        isError={isTwilioConfigError}
      />

      <EmailMarketingConfigModal
        isOpen={isEmailMarketingIntegrationModalOpen}
        onOpenChange={setIsEmailMarketingIntegrationModalOpen}
        existingConfig={emailConfig}
        isLoading={isEmailConfigLoading}
      />
    </>
  );
}

export default Integrations;
