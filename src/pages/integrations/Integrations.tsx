import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { useState } from "react";
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

function Integrations() {
  const { user } = useTypedSelector((state) => state.auth);
  const userId = user?.userId;

  const [
    isGoogleCalendarIntegrationModalOpen,
    setIsGoogleCalendarIntegrationModalOpen,
  ] = useState(false);

  const [isTwilioIntegrationModalOpen, setIsTwilioIntegrationModalOpen] =
    useState(false);

  const {
    data: googleCalendarExistingConfig,
    isLoading: isGoogleCalendarConfigLoading,
    isError: isGoogleCalendarConfigError,
  } = useFetchGoogleCalendarIntegration();

  const { mutate: updateGoogleCalendarIntegration } =
    useUpdateGoogleCalendarIntegration();

  const HEADING_DATA = {
    heading: "Integrations",
    subHeading:
      "Connect your favorite tools and services to streamline your referral workflow.",
    buttons: [],
  };

  const AVAILABLE_INTEGRATIONS = [
    {
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
      name: "Practice Management System",
      icon: <TbDatabase className="w-4 h-4" />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      status: "Disconnected" as const,
      description: "Connect your PMS to automatically track patient referrals",
      badges: [
        "Patient data sync",
        "Appointment tracking",
        "Referral automation",
      ],
      lastSync: "15 minutes ago",
    },
    {
      name: "Email Marketing Platform",
      icon: <FaRegEnvelope className="w-4 h-4" />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      status: "Disconnected" as const,
      description: "Send automated follow-up emails to referred patients",
      badges: ["Automated campaigns", "Patient follow-ups", "Email analytics"],
    },
    {
      name: "Google Calendar Integration",
      icon: <LuCalendar className="w-4 h-4" />,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      status:
        (googleCalendarExistingConfig?.status as string) || "Disconnected",
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
      name: "Google Ads",
      icon: <SiGoogleads className="w-4 h-4" />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      status: "Disconnected" as const,
      description: "Sync ad performance and optimize referral-based campaigns",
      badges: [
        "Campaign tracking",
        "Conversion attribution",
        "Ad spend analytics",
      ],
    },
    {
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
      name: "TikTok Ads",
      icon: <FaTiktok className="w-4 h-4" />,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-700",
      status: "Disconnected" as const,
      description: "Track TikTok ad campaigns and boost referral engagement",
      badges: ["Pixel tracking", "Campaign reporting", "Audience insights"],
    },
    {
      name: "Twilio Calling Integration",
      icon: <TbBrandTwilio className="w-4 h-4" />,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      status: "Disconnected" as const,
      description:
        "Automate patient calls and streamline referral communication",
      badges: ["Click-to-call", "Call analytics", "Automated voice follow-ups"],
      onConnect: () => setIsTwilioIntegrationModalOpen(true),
      onConfigure: () => setIsTwilioIntegrationModalOpen(true),
    },

    {
      name: "Google Analytics",
      icon: <BsLightningCharge className="w-4 h-4" />,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      status: "Disconnected" as const,
      description: "Advanced reporting and data visualization tools",
      badges: ["Custom dashboards", "Advanced analytics", "Data export"],
    },
  ];

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="shadow-none border border-primary/15 rounded-xl p-5">
              <CardHeader className="p-0 pb-5">
                <h4 className="font-medium text-sm">API Keys</h4>
              </CardHeader>
              <CardBody className="space-y-3 p-0">
                <div className="p-4 bg-gray-50 rounded-lg flex items-start justify-between">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-medium text-xs">Public API Key</span>
                    <code className="text-xs text-gray-600 font-mono">
                      pk_live_1234567890abcdef...
                    </code>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-background border-small h-7 px-2"
                  >
                    Copy
                  </Button>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg flex items-start justify-between">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-medium text-xs">Secret Key</span>
                    <code className="text-xs text-gray-600 font-mono">
                      pk_live_1234567890abcdef...
                    </code>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-background border-small h-7 px-2"
                  >
                    Reveal
                  </Button>
                </div>

                <Button
                  size="sm"
                  radius="sm"
                  variant="ghost"
                  fullWidth
                  className="border-small"
                >
                  Generate New Keys
                </Button>
              </CardBody>
            </Card>

            <Card className="shadow-none border border-primary/15 rounded-xl p-5">
              <CardHeader className="flex items-center justify-between p-0 pb-5">
                <h4 className="font-medium text-sm">Webhooks</h4>
                <Button size="sm" radius="sm" color="primary">
                  Add Webhook
                </Button>
              </CardHeader>
              <CardBody className="space-y-3 p-0">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-xs">
                      New Referral Webhook
                    </span>
                    <Chip
                      size="sm"
                      color="primary"
                      className="text-[11px] h-5 capitalize"
                    >
                      active
                    </Chip>
                  </div>
                  <p className="text-xs text-gray-600 font-mono mb-2">
                    https://api.yourapp.com/webhooks/new-referral
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Chip
                      size="sm"
                      variant="bordered"
                      className="border-small text-[11px]"
                    >
                      referral.created
                    </Chip>
                    <Chip
                      size="sm"
                      variant="bordered"
                      className="border-small text-[11px]"
                    >
                      referral.updated
                    </Chip>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-xs">
                      Review Notification
                    </span>
                    <Chip
                      size="sm"
                      className="text-[11px] h-5 bg-gray-100 text-gray-700 capitalize"
                    >
                      inactive
                    </Chip>
                  </div>
                  <p className="text-xs text-gray-600 font-mono mb-2">
                    https://api.yourapp.com/webhooks/new-review
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Chip
                      size="sm"
                      variant="bordered"
                      className="border-small text-[11px]"
                    >
                      review.created
                    </Chip>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
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
      />
    </>
  );
}

export default Integrations;
