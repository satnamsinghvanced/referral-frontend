import { Card, CardBody, CardHeader } from "@heroui/react";
import { useMemo, useState } from "react";
import { BsLightningCharge } from "react-icons/bs";
import { FaGoogle, FaTiktok } from "react-icons/fa";
import { FaMeta, FaRegEnvelope } from "react-icons/fa6";
import { LuCalendar } from "react-icons/lu";
import { SiGoogleads } from "react-icons/si";
import { TbBrandTwilio, TbDatabase } from "react-icons/tb";
import ComponentContainer from "../../components/common/ComponentContainer";
import {
  useFetchGoogleCalendarIntegration,
  useUpdateGoogleCalendarIntegration,
} from "../../hooks/integrations/useGoogleCalendar";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { GoogleCalendarIntegrationResponse } from "../../types/integrations/googleCalendar";
import { timeAgo } from "../../utils/timeAgo";
import IntegrationItem from "./IntegrationItem";
import GoogleCalendarConfigModal from "./modal/GoogleCalendarConfigModal";
import TwilioConfigurationModal from "./modal/TwilioConfigurationModal";
import EmailMarketingConfigModal from "./modal/EmailMarketingConfigModal";
import {
  useFetchEmailIntegration,
  useUpdateEmailIntegration,
} from "../../hooks/integrations/useEmailMarketing";
import {
  useFetchTwilioConfig,
  useUpdateTwilioConfig,
} from "../../hooks/integrations/useTwilio";
import { updateTwilioConfig } from "../../services/integrations/twilio";

function Integrations() {
  const { user } = useTypedSelector((state) => state.auth);
  const userId = user?.userId;

  const [
    isGoogleCalendarIntegrationModalOpen,
    setIsGoogleCalendarIntegrationModalOpen,
  ] = useState(false);

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
  } = useFetchGoogleCalendarIntegration();

  const { mutate: updateGoogleCalendarIntegration } =
    useUpdateGoogleCalendarIntegration();

  const { data: emailExistingConfig, isLoading: isEmailConfigLoading } =
    useFetchEmailIntegration();

  const { mutate: updateEmailIntegration } = useUpdateEmailIntegration();

  const {
    data: twilioConfig,
    isLoading: isTwilioConfigLoading,
    isError: isTwilioConfigError,
  } = useFetchTwilioConfig();

  const { mutate: updateTwilioConfig } = useUpdateTwilioConfig();

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
        id: "",
        name: "Google My Business",
        icon: <FaGoogle className="w-4 h-4" />,
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        status: "Disconnected" as const,
        description:
          "Automatically sync reviews and manage your practice listing",
        badges: [
          "Review sync",
          "Business listing management",
          "Analytics integration",
        ],
        lastSync: "2 hours ago",
      },
      {
        id: "",
        name: "Practice Management System",
        icon: <TbDatabase className="w-4 h-4" />,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        status: "Disconnected" as const,
        description:
          "Connect your PMS to automatically track patient referrals",
        badges: [
          "Patient data sync",
          "Appointment tracking",
          "Referral automation",
        ],
        lastSync: "15 minutes ago",
      },
      {
        id: emailConfig?._id || "",
        name: "Email Marketing Platform",
        icon: <FaRegEnvelope className="w-4 h-4" />,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        status: emailConfig?.status,
        description: "Send automated follow-up emails to referred patients",
        badges: [
          "Automated campaigns",
          "Patient follow-ups",
          "Email analytics",
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
        id: googleCalendarExistingConfig?._id || "",
        name: "Google Calendar Integration",
        icon: <LuCalendar className="w-4 h-4" />,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        status: googleCalendarExistingConfig?.status || "Disconnected",
        description: "Sync appointments and referral scheduling",
        badges: [
          "Appointment sync",
          "Referral scheduling",
          "Availability management",
        ],
        lastSync: timeAgo(
          googleCalendarExistingConfig?.lastSyncAt || new Date().toISOString()
        ),
        onConnect: () => setIsGoogleCalendarIntegrationModalOpen(true),
        onConfigure: () => setIsGoogleCalendarIntegrationModalOpen(true),
        isSwitchChecked: googleCalendarExistingConfig?.status === "Connected",
        onSwitchChange: () => {
          updateGoogleCalendarIntegration({
            id: googleCalendarExistingConfig?._id as string,
            data: {
              status:
                googleCalendarExistingConfig?.status === "Connected"
                  ? "Disconnected"
                  : "Connected",
            },
          });
        },
      },
      {
        id: "",
        name: "Google Ads",
        icon: <SiGoogleads className="w-4 h-4" />,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        status: "Disconnected" as const,
        description:
          "Sync ad performance and optimize referral-based campaigns",
        badges: [
          "Campaign tracking",
          "Conversion attribution",
          "Ad spend analytics",
        ],
      },
      {
        id: "",
        name: "Meta Ads",
        icon: <FaMeta className="w-4 h-4" />,
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
        status: "Disconnected" as const,
        description: "Connect Facebook & Instagram Ads for referral targeting",
        badges: [
          "Audience sync",
          "Lead tracking",
          "Campaign performance insights",
        ],
      },
      {
        id: "",
        name: "TikTok Ads",
        icon: <FaTiktok className="w-4 h-4" />,
        iconBg: "bg-gray-100",
        iconColor: "text-gray-700",
        status: "Disconnected" as const,
        description: "Track TikTok ad campaigns and boost referral engagement",
        badges: ["Pixel tracking", "Campaign reporting", "Audience insights"],
      },
      {
        id: twilioConfig?._id || "",
        name: "Twilio Calling Integration",
        icon: <TbBrandTwilio className="w-4 h-4" />,
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        status: isTwilioConnected ? "Connected" : "Disconnected",
        description:
          "Automate patient calls and streamline referral communication",
        badges: [
          "Click-to-call",
          "Call analytics",
          "Automated voice follow-ups",
        ],
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
      {
        id: "",
        name: "Google Analytics",
        icon: <BsLightningCharge className="w-4 h-4" />,
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-600",
        status: "Disconnected" as const,
        description: "Advanced reporting and data visualization tools",
        badges: ["Custom dashboards", "Advanced analytics", "Data export"],
      },
    ];
  }, [
    emailConfig,
    googleCalendarExistingConfig,
    updateEmailIntegration,
    updateGoogleCalendarIntegration,
    twilioConfig,
    isTwilioConnected,
  ]);

  return (
    <>
      <ComponentContainer headingData={HEADING_DATA}>
        <div className="flex flex-col gap-4 md:gap-5">
          <Card className="shadow-none border border-primary/15 rounded-xl p-5">
            <CardHeader className="p-0 pb-6">
              <h4 className="font-medium text-sm">Available Integrations</h4>
            </CardHeader>
            <CardBody className="divide-y divide-gray-100 p-0">
              {AVAILABLE_INTEGRATIONS.map((item, index) => (
                <IntegrationItem key={index} {...item} />
              ))}
            </CardBody>
          </Card>
        </div>
      </ComponentContainer>

      <GoogleCalendarConfigModal
        isOpen={isGoogleCalendarIntegrationModalOpen}
        onClose={() => setIsGoogleCalendarIntegrationModalOpen(false)}
        userId={userId as string}
        existingConfig={
          googleCalendarExistingConfig as GoogleCalendarIntegrationResponse
        }
        isLoading={isGoogleCalendarConfigLoading}
        isError={isGoogleCalendarConfigError}
      />

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
