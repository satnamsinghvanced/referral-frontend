import { Card, CardBody, CardHeader, addToast, Modal, ModalContent, ModalHeader, ModalBody, Spinner, Input, Button } from "@heroui/react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { BsLightningCharge } from "react-icons/bs";
import { FaGoogle } from "react-icons/fa";
import { FaMeta, FaRegEnvelope } from "react-icons/fa6";
import { LuCalendar } from "react-icons/lu";
import { SiGoogleads } from "react-icons/si";
import { TbBrandTwilio } from "react-icons/tb";
import axios from "../../services/axios";
import { useQueryClient } from "@tanstack/react-query";
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
  useConnectEmail,
  useConnectSendGrid,
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
  useWindsorAuth,
  useSyncBusinessProfiles,
  BUSINESS_KEYS,
  useConnectGooglePlaces,
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
import SendGridConfigModal from "./modal/SendGridConfigModal";
import TwilioConfigurationModal from "./modal/TwilioConfigurationModal";
import GoogleIntegrationSelectorModal from "./modal/GoogleIntegrationSelectorModal";
import GoogleCalendarConfigModal from "./modal/GoogleCalendarConfigModal";
import Webhooks from "./webhooks/Webhooks";
import TwilioDashboard from "./components/TwilioDashboard";

function Integrations() {
  const queryClient = useQueryClient();
  const { user, token } = useTypedSelector((state) => state.auth);
  const userId = user?.userId;
  const [isTwilioIntegrationModalOpen, setIsTwilioIntegrationModalOpen] =
    useState(false);
  const [isSendGridConfigModalOpen, setIsSendGridConfigModalOpen] =
    useState(false);
  const [isGoogleBusinessLocationModalOpen, setIsGoogleBusinessLocationModalOpen] =
    useState(false);
  const [isGoogleAdsAccountModalOpen, setIsGoogleAdsAccountModalOpen] =
    useState(false);
  const [isMetaAdsAccountModalOpen, setIsMetaAdsAccountModalOpen] =
    useState(false);
  const [
    isGoogleAnalyticsPropertyModalOpen,
    setIsGoogleAnalyticsPropertyModalOpen,
  ] = useState(false);
  const [isGoogleCalendarConfigModalOpen, setIsGoogleCalendarConfigModalOpen] =
    useState(false);
  const [selectedCalendarConfig, setSelectedCalendarConfig] = useState<any>(undefined);
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
  const { mutate: connectEmail } = useConnectEmail();
  const { mutate: connectSendGrid } = useConnectSendGrid();

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

  const [isGoogleBusinessConnecting, setIsGoogleBusinessConnecting] = useState(false);
  const [onboardingWindow, setOnboardingWindow] = useState<Window | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const {
    data: googleBusinessConfig,
    isLoading: isGoogleBusinessConfigLoading,
  } = useBusinessIntegration() as any;

  const { mutate: syncBusinessProfiles, isPending: isSyncingBusiness } = useSyncBusinessProfiles();

  const { mutate: updateGoogleBusinessIntegration } = useUpdateBusiness();
  const { mutate: connectGoogleBusiness } = useConnectBusiness();
  const { mutate: connectWindsor, isPending: isConnectingWindsor } = useWindsorAuth((win: Window | null) => {
    setOnboardingWindow(win);
    setIsGoogleBusinessConnecting(true);
  });

  const [isPlacesModalOpen, setIsPlacesModalOpen] = useState(false);
  const [placeIdInput, setPlaceIdInput] = useState("");
  const { mutate: connectPlaces, isPending: isConnectingPlaces } = useConnectGooglePlaces();

  const handleConnectPlaces = () => {
    if (!placeIdInput.trim()) return;
    connectPlaces(placeIdInput.trim(), {
      onSuccess: () => {
        addToast({
          title: "Success",
          description: "Google Places integration connected successfully!",
          color: "success",
        });
        setIsPlacesModalOpen(false);
        setPlaceIdInput("");
      },
      onError: (err: any) => {
        addToast({
          title: "Error",
          description: err.response?.data?.message || err.message || "Failed to connect Google Places",
          color: "danger",
        });
      },
    });
  };

  useEffect(() => {
    if (!onboardingWindow) return;

    let isPolling = true;
    let pollTimer: any;
    let countdownTimer: any;

    const currentLocIds = new Set(
      (googleBusinessConfig?.locations || []).map((l: any) => l.locationId)
    );

    const checkStatus = async () => {
      if (!isPolling) return;
      try {
        const res = (await axios.get(`/auth/status?userId=${userId}`)) as any;

        if (res && res.success && res.data?.isSynced) {
          isPolling = false;
          if (onboardingWindow && !onboardingWindow.closed) {
            onboardingWindow.close();
          }
          let secondsLeft = 3;
          setCountdown(3);
          countdownTimer = setInterval(() => {
            secondsLeft -= 1;
            if (secondsLeft <= 0) {
              clearInterval(countdownTimer);
              setOnboardingWindow(null);
              setCountdown(null);
              setIsGoogleBusinessConnecting(false);
              window.location.reload();
            } else {
              setCountdown(secondsLeft);
            }
          }, 1000);
          return;
        }
      } catch (err) {
        console.error("Polling error:", err);
      }

      if (onboardingWindow.closed) {
        isPolling = false;
        setOnboardingWindow(null);
        syncBusinessProfiles(undefined, {
          onSuccess: () => {
            addToast({ title: "Success", description: "Google Business connected and synced successfully!", color: "success" });
            setIsGoogleBusinessConnecting(false);
          },
          onError: (err: any) => {
            addToast({ title: "Error", description: err.response?.data?.message || err.message || "Failed to sync profiles", color: "danger" });
            setIsGoogleBusinessConnecting(false);
          },
        });
        return;
      }

      if (isPolling) {
        pollTimer = setTimeout(checkStatus, 3000);
      }
    };

    pollTimer = setTimeout(checkStatus, 3000);

    return () => {
      isPolling = false;
      clearTimeout(pollTimer);
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [onboardingWindow, googleBusinessConfig, token, syncBusinessProfiles, userId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("socialMediaRedirect") === "true") {
      const status = params.get("status");
      const platform = params.get("platform");
      const message = params.get("message");

      if (status === "success") {
        addToast({
          title: "Connection Successful",
          description: `${platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : "Integration"} connected successfully!`,
          color: "success",
        });
        const normPlatform = platform?.toLowerCase().replace(/[\s_]/g, "");
        if (normPlatform === "googlebusiness") {
          setIsGoogleBusinessLocationModalOpen(true);
        }
      } else if (status === "error") {
        addToast({
          title: "Connection Failed",
          description: message || "Failed to connect integration.",
          color: "danger",
        });
      }

      const url = new URL(window.location.href);
      url.searchParams.delete("socialMediaRedirect");
      url.searchParams.delete("status");
      url.searchParams.delete("platform");
      url.searchParams.delete("message");
      window.history.replaceState({}, "", url.toString());

      queryClient.invalidateQueries({ queryKey: ["email-integration"] });
      queryClient.invalidateQueries({ queryKey: ["googleCalendar"] });
      queryClient.invalidateQueries({ queryKey: ["googleAds"] });
      queryClient.invalidateQueries({ queryKey: ["googleAnalytics"] });
      queryClient.invalidateQueries({ queryKey: BUSINESS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    }
  }, [queryClient]);

  const {
    data: googleAnalyticsConfig,
    isLoading: isGoogleAnalyticsConfigLoading,
  } = useAnalyticsIntegration();

  const { mutate: updateGoogleAnalyticsIntegration } = useUpdateAnalytics();
  const { mutate: connectGoogleAnalytics } = useConnectAnalytics();
  const emailConfigsList = Array.isArray(emailExistingConfig)
    ? emailExistingConfig
    : emailExistingConfig
      ? [emailExistingConfig]
      : [];

  const smtpConfig = emailConfigsList.find(
    (cfg: any) => cfg.provider !== "SendGrid"
  );
  const sendGridConfig = emailConfigsList.find(
    (cfg: any) => cfg.provider === "SendGrid"
  );
  const googleCalendarConfig = Array.isArray(googleCalendarExistingConfig)
    ? googleCalendarExistingConfig[0]
    : googleCalendarExistingConfig;
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
    const list: any[] = [];

    const isGoogleBusinessConnected =
      googleBusinessConfig?.status === "Connected"
    list.push({
      id: googleBusinessConfig?._id || "",
      name: "Google My Business",
      icon: <FaGoogle className="w-4 h-4" />,
      iconBg: "bg-red-100 dark:bg-red-900/20",
      iconColor: "text-red-600 dark:text-red-400",
      status: isGoogleBusinessConnected
        ? "Connected"
        : googleBusinessConfig?.status === "Error"
          ? "Error"
          : googleBusinessConfig?.status === "Pending" || isGoogleBusinessConnecting
            ? "Pending"
            : "Disconnected",
      isFullyConnected: isGoogleBusinessConnected,
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
      onConnect: () => {
        connectGoogleBusiness();
      },
      onReconnect: () => {
        connectGoogleBusiness();
      },
      onSync: undefined,
      isSyncing: isGoogleBusinessConnecting || isConnectingPlaces,
      syncButtonText: undefined,
      onConfigure: () => {
        setIsGoogleBusinessLocationModalOpen(true);
      },
      isSwitchChecked: isGoogleBusinessConnected,
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
      account: {
        accountName: googleBusinessConfig?.locations?.find((l: any) => l.isConnected)?.name || googleBusinessConfig?.accountName,
        accountEmail: googleBusinessConfig?.accountEmail,
        accountAvatar: googleBusinessConfig?.accountAvatar,
      },
    });

    list.push({
      id: googleCalendarConfig?._id || "",
      name: "Google Calendar Integration",
      icon: <LuCalendar className="w-4 h-4" />,
      iconBg: "bg-purple-100 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      status: googleCalendarConfig?.status || "Disconnected",
      description:
        "Sync marketing activities and referral events with Google Calendar",
      badges: ["Activity Sync", "Event Management", "Calendar Integration"],
      lastSync: googleCalendarConfig?.lastSyncAt
        ? timeAgo(googleCalendarConfig.lastSyncAt)
        : undefined,
      onConnect: () => connectCalendar(),
      onReconnect: () => connectCalendar(),
      onConfigure: () => {
        setSelectedCalendarConfig(googleCalendarConfig);
        setIsGoogleCalendarConfigModalOpen(true);
      },
      isSwitchChecked: googleCalendarConfig?.status === "Connected",
      onSwitchChange: () => {
        updateGoogleCalendarIntegration({
          id: googleCalendarConfig?._id as string,
          payload: {
            status: googleCalendarConfig?.status === "Connected" ? "Disconnected" : "Connected",
          },
        });
      },
      account: googleCalendarConfig
        ? {
          accountName: googleCalendarConfig.accountName,
          accountEmail: googleCalendarConfig.accountEmail,
          accountAvatar: googleCalendarConfig.accountAvatar,
        }
        : undefined,
    });

    // Google Ads
    list.push({
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
      onConfigure: () => setIsGoogleAdsAccountModalOpen(true),
      connectedLocation: googleAdsConfig?.customerAccounts?.find(
        (acc: any) => acc.isConnected,
      )?.descriptiveName,
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
      account: {
        accountName: googleAdsConfig?.accountName,
        accountEmail: googleAdsConfig?.accountEmail,
        accountAvatar: googleAdsConfig?.accountAvatar,
      },
    });

    // Google Analytics
    list.push({
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
      onConfigure: () => setIsGoogleAnalyticsPropertyModalOpen(true),
      connectedLocation: googleAnalyticsConfig?.properties?.find(
        (p: any) => p.isConnected,
      )?.displayName,
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
      account: {
        accountName: googleAnalyticsConfig?.accountName,
        accountEmail: googleAnalyticsConfig?.accountEmail,
        accountAvatar: googleAnalyticsConfig?.accountAvatar,
      },
    });

    // Email Marketing SMTP
    list.push({
      id: smtpConfig?._id || "",
      name: "Email Marketing Platform",
      icon: <FaRegEnvelope className="w-4 h-4" />,
      iconBg: "bg-green-100 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
      status: smtpConfig?.status || "Disconnected",
      description:
        "Connect your Google account to send automated referral notifications",
      badges: ["OAuth Authentication", "Automated Emails", "Gmail Integration"],
      onConnect: () => connectEmail(),
      onReconnect: () => connectEmail(),
      isSwitchChecked: smtpConfig?.status === "Connected",
      onSwitchChange: () => {
        if (smtpConfig?._id) {
          updateEmailIntegration({
            id: smtpConfig._id,
            // @ts-ignore
            data: {
              status:
                smtpConfig.status === "Connected"
                  ? "Disconnected"
                  : "Connected",
            },
          });
        }
      },
      account: {
        accountName: smtpConfig?.accountName,
        accountEmail: smtpConfig?.accountEmail,
        accountAvatar: smtpConfig?.accountAvatar,
      },
    });

    // SendGrid Integration
    const isSendGridConnected = sendGridConfig?.status === "Connected";
    list.push({
      id: sendGridConfig?._id || "",
      name: "SendGrid Integration",
      icon: <FaRegEnvelope className="w-4 h-4" />,
      iconBg: "bg-blue-100 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      status: isSendGridConnected
        ? "Connected"
        : sendGridConfig?.status === "Error"
          ? "Error"
          : "Disconnected",
      description:
        "Connect your SendGrid account seamlessly to send high-deliverability campaigns",
      badges: ["Direct Integration", "Automated Campaigns", "High Deliverability"],
      onConnect: () => setIsSendGridConfigModalOpen(true),
      onConfigure: () => setIsSendGridConfigModalOpen(true),
      isSwitchChecked: isSendGridConnected,
      onSwitchChange: () => {
        if (sendGridConfig?._id) {
          updateEmailIntegration({
            id: sendGridConfig._id,
            // @ts-ignore
            data: {
              status:
                sendGridConfig.status === "Connected"
                  ? "Disconnected"
                  : "Connected",
            },
          });
        }
      },
      account: isSendGridConnected ? {
        accountName: sendGridConfig?.accountName || "SendGrid Admin",
        accountEmail: sendGridConfig?.accountEmail || sendGridConfig?.username,
        accountAvatar: sendGridConfig?.accountAvatar,
      } : undefined,
    });

    // Twilio Integration
    list.push({
      id: twilioConfig?._id || "",
      name: "Twilio Calling Integration",
      icon: <TbBrandTwilio className="w-4 h-4" />,
      iconBg: "bg-red-100 dark:bg-red-900/20",
      iconColor: "text-red-600 dark:text-red-400",
      status: twilioConfig?.status || "Disconnected",
      description:
        "Track patient calls and monitor referral communications with recordings",
      badges: ["Call Analytics", "Call Tracking", "Call Recordings"],
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
      account: {
        accountName: twilioConfig?.accountName,
        accountEmail: twilioConfig?.accountEmail,
        accountAvatar: twilioConfig?.accountAvatar,
      },
    });

    return list;
  }, [
    smtpConfig,
    sendGridConfig,
    googleCalendarConfig,
    updateEmailIntegration,
    updateGoogleCalendarIntegration,
    connectCalendar,
    connectEmail,
    connectSendGrid,
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
    connectWindsor,
    googleAnalyticsConfig,
    updateGoogleAnalyticsIntegration,
    connectGoogleAnalytics,
  ]);

  return (
    <>
      <ComponentContainer headingData={HEADING_DATA}>
        <div className="flex flex-col gap-4 md:gap-5">
          <TwilioDashboard twilioConfig={twilioConfig} />
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

      <GoogleIntegrationSelectorModal
        type="business"
        isOpen={isGoogleBusinessLocationModalOpen}
        onClose={() => setIsGoogleBusinessLocationModalOpen(false)}
      />


      <GoogleIntegrationSelectorModal
        type="analytics"
        isOpen={isGoogleAnalyticsPropertyModalOpen}
        onClose={() => setIsGoogleAnalyticsPropertyModalOpen(false)}
      />

      <GoogleIntegrationSelectorModal
        type="ads"
        isOpen={isGoogleAdsAccountModalOpen}
        onClose={() => setIsGoogleAdsAccountModalOpen(false)}
      />

      <GoogleIntegrationSelectorModal
        type="meta_ads"
        isOpen={isMetaAdsAccountModalOpen}
        onClose={() => setIsMetaAdsAccountModalOpen(false)}
      />

      <GoogleCalendarConfigModal
        userId={userId as string}
        isOpen={isGoogleCalendarConfigModalOpen}
        onClose={() => setIsGoogleCalendarConfigModalOpen(false)}
        existingConfig={selectedCalendarConfig}
        isLoading={isGoogleCalendarConfigLoading}
        isError={isGoogleCalendarConfigError}
      />

      <SendGridConfigModal
        isOpen={isSendGridConfigModalOpen}
        onOpenChange={setIsSendGridConfigModalOpen}
        existingConfig={sendGridConfig}
        isLoading={isEmailConfigLoading}
      />

      <Modal isOpen={isPlacesModalOpen} onOpenChange={setIsPlacesModalOpen} size="md">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Connect Google Places</ModalHeader>
          <ModalBody className="pb-6">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-default-500">
                Enter your Google Maps Place ID to sync reviews and display location details.
              </p>
              <Input
                label="Place ID"
                placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83A2zs"
                variant="bordered"
                value={placeIdInput}
                onValueChange={setPlaceIdInput}
                isRequired
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="light" onPress={() => setIsPlacesModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={isConnectingPlaces}
                  onPress={handleConnectPlaces}
                  isDisabled={!placeIdInput.trim()}
                >
                  Connect Location
                </Button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {countdown !== null && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 backdrop-blur-xl bg-background/80 text-foreground px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] flex items-center gap-4 border border-foreground/10 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/15 text-success animate-bounce">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Connection Successful</span>
            <span className="text-xs text-foreground-500">
              Refreshing dashboard in{" "}
              <span className="font-bold text-primary dark:text-primary-400 text-sm inline-block min-w-[12px] text-center">
                {countdown}
              </span>{" "}
              seconds...
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default Integrations;
