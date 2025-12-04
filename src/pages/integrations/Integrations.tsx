import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Switch,
} from "@heroui/react";
import { useState } from "react";
import { BiCheckCircle } from "react-icons/bi";
import { BsLightningCharge } from "react-icons/bs";
import { FaGoogle, FaTiktok } from "react-icons/fa";
import { FaMeta, FaRegEnvelope } from "react-icons/fa6";
import { FiAlertCircle, FiExternalLink, FiSettings } from "react-icons/fi";
import { LuCalendar } from "react-icons/lu";
import { PiDatabase } from "react-icons/pi";
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
import GoogleCalendarConfigModal from "./modal/GoogleCalendarConfigModal";

interface IntegrationItemProps {
  name: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  status: "Connected" | "Disconnected" | "Error" | string;
  description: string;
  badges: string[];
  lastSync?: string;
  onConfigure?: () => void;
  onConnect?: () => void;
  isSwitchChecked?: boolean;
  onSwitchChange?: (checked: boolean) => void;
}

const IntegrationItem: React.FC<IntegrationItemProps> = ({
  name,
  icon,
  iconBg,
  iconColor,
  status,
  description,
  badges,
  lastSync,
  onConfigure,
  onConnect,
  isSwitchChecked = true,
  onSwitchChange,
}) => {
  const isConnected = status === "Connected";
  const isError = status === "Error";

  let statusClasses = "";
  let StatusIcon = null;
  switch (status) {
    case "Connected":
      statusClasses = "bg-green-100 text-green-700";
      StatusIcon = <BiCheckCircle className="h-4 w-4 text-green-600" />;
      break;
    case "Disconnected":
      statusClasses = "bg-secondary text-secondary-foreground";
      break;
    case "Error":
      statusClasses =
        "bg-red text-white focus-visible:ring-red/20 dark:bg-red/60";
      StatusIcon = <FiAlertCircle className="h-4 w-4 text-red-600" />;
      break;
  }

  const actionButton = isConnected ? (
    <>
      {onConfigure && (
        <Button
          size="sm"
          radius="sm"
          variant="ghost"
          onPress={onConfigure}
          startContent={<FiSettings className="size-3.5" />}
          className="border-small"
        >
          Configure
        </Button>
      )}
      <Switch
        size="sm"
        isSelected={isSwitchChecked}
        onValueChange={onSwitchChange}
      />
    </>
  ) : (
    // @ts-ignore
    <Button
      size="sm"
      radius="sm"
      variant="solid"
      color="primary"
      onPress={onConnect}
      endContent={<FiExternalLink className="size-3.5" />}
    >
      Connect
    </Button>
  );

  return (
    <div className="flex items-start justify-between py-5 first:pt-0 last:pb-4">
      <div className="flex items-start gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-sm font-normal">{name}</h3>
            {StatusIcon}
            <Chip
              size="sm"
              radius="sm"
              className={`text-[11px] capitalize h-5 ${statusClasses}`}
            >
              {status}
            </Chip>
          </div>
          <p className="text-xs text-gray-600 mb-3">{description}</p>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Chip
                key={badge}
                size="sm"
                variant="bordered"
                className="text-[11px] border-small h-5"
              >
                {badge}
              </Chip>
            ))}
          </div>
          {lastSync && (
            <p className="text-xs text-gray-600 mt-2">Last sync: {lastSync}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">{actionButton}</div>
    </div>
  );
};

function Integrations() {
  const { user } = useTypedSelector((state) => state.auth);
  const userId = user?.userId;

  const [
    isGoogleCalendarIntegrationModalOpen,
    setIsGoogleCalendarIntegrationModalOpen,
  ] = useState(false);

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

    // ------------------------------------------
    // 📌 NEW INTEGRATIONS ADDED BELOW
    // ------------------------------------------

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
    },

    {
      name: "Analytics Platform",
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
        <div className="flex flex-col gap-6">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-none border border-primary/15 rounded-xl p-5">
              <CardHeader className="p-0 pb-5">
                <h4 className="font-medium text-sm">API Keys</h4>
              </CardHeader>
              <CardBody className="space-y-4 p-0">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs">Public API Key</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-white border-small h-7 px-2"
                    >
                      Copy
                    </Button>
                  </div>
                  <code className="text-xs text-gray-600 font-mono">
                    pk_live_1234567890abcdef...
                  </code>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-xs">Secret Key</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-white border-small h-7 px-2"
                    >
                      Reveal
                    </Button>
                  </div>
                  <code className="text-xs text-gray-600 font-mono">
                    sk_live_••••••••••••••••••••
                  </code>
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
              <CardBody className="space-y-4 p-0">
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
    </>
  );
}

export default Integrations;
