import { Card, CardBody, CardHeader, addToast, Modal, ModalContent, ModalHeader, ModalBody, Input, Button } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { BsLightningCharge } from "react-icons/bs";
import { FaGoogle } from "react-icons/fa";
import { FaMeta, FaRegEnvelope, FaYoutube } from "react-icons/fa6";
import {
  useConnectSocial,
  useSocialCredentials,
  useUpdateSocial,
} from "../../hooks/useSocial";
import SocialSubAccountSelectorModal, {
  SocialPlatformType,
} from "../social-media/modal/SocialSubAccountSelectorModal";
import SocialConnectConfirmModal, {
  PendingSocialConnect,
} from "../social-media/modal/SocialConnectConfirmModal";
import { LuCalendar } from "react-icons/lu";
import { SiGoogleads } from "react-icons/si";
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
  useFetchTwilioConfig
} from "../../hooks/integrations/useTwilio";
import { useBilling } from "../../hooks/settings/useBilling";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useGBPRecentReviews } from "../../hooks/useReviews";
import { timeAgo } from "../../utils/timeAgo";
import IntegrationItem from "./IntegrationItem";
import SendGridConfigModal from "./modal/SendGridConfigModal";
import TwilioConfigurationModal from "./modal/TwilioConfigurationModal";
import GoogleIntegrationSelectorModal from "./modal/GoogleIntegrationSelectorModal";
import GoogleCalendarConfigModal from "./modal/GoogleCalendarConfigModal";
import Webhooks from "./webhooks/Webhooks";
import TwilioDashboard from "./components/TwilioDashboard";

function Integrations() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, token } = useTypedSelector((state) => state.auth);
  const userId = user?.userId;
  const [selectorPlatform, setSelectorPlatform] =
    useState<SocialPlatformType | null>(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [pendingConnect, setPendingConnect] =
    useState<PendingSocialConnect | null>(null);
  const { data: allSocialCredentials } = useSocialCredentials();
  const { mutate: connectSocial, isPending: isSocialConnecting } = useConnectSocial();
  const { mutate: updateSocial, isPending: isUpdatingSocial } = useUpdateSocial();
  const handleConfirmSocialConnect = () => {
    if (!pendingConnect) return;
    if (pendingConnect.onConfirm) {
      const action = pendingConnect.onConfirm;
      setPendingConnect(null);
      action();
      return;
    }
    if (pendingConnect.platformId && pendingConnect.platformKey) {
      connectSocial(
        {
          platform: pendingConnect.platformId,
          platformKey: pendingConnect.platformKey,
        },
        {
          onSettled: () => setPendingConnect(null),
        },
      );
    }
  };
  const { data: billingData } = useBilling();
  const planAccess = billingData?.access;
  const planPrice = billingData?.price;
  const isStarterPlan =
    planPrice === 199 ||
    billingData?.planId === "starter_199" ||
    billingData?.name?.toLowerCase() === "starter";
  const hasAdsAccess =
    !isStarterPlan &&
    (planPrice ? planPrice >= 399 : billingData?.access?.roi_analytics === true);
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
  const rawCalendarData = (googleCalendarExistingConfig as any)?.data ?? googleCalendarExistingConfig;
  const googleCalendarConfig = Array.isArray(rawCalendarData)
    ? rawCalendarData[0]
    : rawCalendarData;
  const { mutate: updateGoogleCalendarIntegration, isPending: isUpdatingGoogleCalendar } = useUpdateCalendar();
  const { mutate: connectCalendar } = useConnectCalendar();
  const { data: emailExistingConfig, isLoading: isEmailConfigLoading } =
    useFetchEmailIntegration();
  const { mutate: updateEmailIntegration, isPending: isUpdatingEmail } = useUpdateEmailIntegration();
  const { mutate: connectEmail } = useConnectEmail();
  const { mutate: connectSendGrid } = useConnectSendGrid();
  const {
    data: twilioConfig,
    isLoading: isTwilioConfigLoading,
    isError: isTwilioConfigError,
  } = useFetchTwilioConfig();
  useEffect(() => {
    console.log("[Integrations] twilioConfig state:", { twilioConfig, isTwilioConfigLoading, isTwilioConfigError });
  }, [twilioConfig, isTwilioConfigLoading, isTwilioConfigError]);
  const { data: googleAdsConfig, isLoading: isGoogleAdsConfigLoading } =
    useGoogleAdsIntegration();
  const { mutate: updateGoogleAdsIntegration, isPending: isUpdatingGoogleAds } = useUpdateGoogleAds();
  const { mutate: connectGoogleAds } = useConnectGoogleAds();
  const { data: metaAdsConfig, isLoading: isMetaAdsConfigLoading } =
    useMetaAdsIntegration();
  const { mutate: updateMetaAdsIntegration, isPending: isUpdatingMetaAds } = useUpdateMetaAds();
  const { mutate: connectMetaAds } = useConnectMetaAds();
  const location = useLocation();
  const [highlightedKey, setHighlightedKey] = useState<string | null>(null);

  useEffect(() => {
    const highlightParam = searchParams.get("highlight");
    const hashParam = location.hash
      ? location.hash.replace("#integration-", "").replace("#", "")
      : null;
    const targetId = highlightParam || hashParam;

    if (targetId) {
      const normalizedMap: Record<string, string> = {
        google_review: "google_business",
        google_reviews: "google_business",
        googlebusiness: "google_business",
        google_business: "google_business",
        google_ads: "google_ads",
        googleads: "google_ads",
        google_calendar: "google_calendar",
        googlecalendar: "google_calendar",
        meta_ads: "meta_ads",
        metaads: "meta_ads",
        google_analytics: "google_analytics",
        googleanalytics: "google_analytics",
        reviews: "reviews",
        sendgrid: "email_marketing",
        smtp: "email_marketing",
        email_marketing: "email_marketing",
        twilio: "twilio",
        meta: "meta",
        youtube: "youTube",
      };

      const finalKey = normalizedMap[targetId.toLowerCase()] || targetId;
      setHighlightedKey(finalKey);

      const timer = setTimeout(() => {
        const el = document.getElementById(`integration-${finalKey}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 250);

      const clearTimer = setTimeout(() => {
        setHighlightedKey(null);
      }, 4500);

      return () => {
        clearTimeout(timer);
        clearTimeout(clearTimer);
      };
    }
  }, [location.search, location.hash, searchParams]);

  useEffect(() => {
    const status = searchParams.get("status");
    const message = searchParams.get("message");
    if (status === "success" && message && message.toLowerCase().includes("google business")) {
      setIsGoogleBusinessLocationModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const [isGoogleBusinessConnecting, setIsGoogleBusinessConnecting] = useState(false);
  const [onboardingWindow, setOnboardingWindow] = useState<Window | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const {
    data: googleBusinessConfig,
    isLoading: isGoogleBusinessConfigLoading,
  } = useBusinessIntegration() as any;
  const { data: gbpReviewsData } = useGBPRecentReviews();
  const { mutate: syncBusinessProfiles, isPending: isSyncingBusiness } = useSyncBusinessProfiles();
  const { mutate: updateGoogleBusinessIntegration, isPending: isUpdatingGoogleBusiness } = useUpdateBusiness();
  const { mutate: connectGoogleBusiness } = useConnectBusiness();
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
    if (searchParams.get("socialMediaRedirect") === "true") {
      const status = searchParams.get("status");
      const platform = searchParams.get("platform");
      const message = searchParams.get("message");
      if (status === "success") {
        addToast({
          title: "Connection Successful",
          description: `${platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : "Integration"} connected successfully!`,
          color: "success",
        });
        const normPlatform = platform?.toLowerCase().replace(/[\s_]/g, "");
        if (normPlatform === "googlebusiness") {
          setIsGoogleBusinessLocationModalOpen(true);
        } else if (normPlatform === "googlecalendar") {
          setSelectedCalendarConfig(googleCalendarConfig);
          setIsGoogleCalendarConfigModalOpen(true);
        } else if (normPlatform === "googleads") {
          setIsGoogleAdsAccountModalOpen(true);
        } else if (normPlatform === "metaads") {
          setIsMetaAdsAccountModalOpen(true);
        } else if (normPlatform === "googleanalytics") {
          setIsGoogleAnalyticsPropertyModalOpen(true);
        } else if (normPlatform === "twilio") {
          setIsTwilioIntegrationModalOpen(true);
        } else if (normPlatform === "meta" || normPlatform === "youtube" || normPlatform === "linkedin" || normPlatform === "tiktok") {
          setSelectorPlatform(normPlatform as SocialPlatformType);
          setIsSelectorOpen(true);
        }
      } else if (status === "error") {
        addToast({
          title: "Connection Failed",
          description: message || "Failed to connect integration.",
          color: "danger",
        });
      }
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("socialMediaRedirect");
          next.delete("status");
          next.delete("platform");
          next.delete("message");
          return next;
        },
        { replace: true }
      );
      queryClient.invalidateQueries({ queryKey: ["email-integration"] });
      queryClient.invalidateQueries({ queryKey: ["calendar-integration"] });
      queryClient.invalidateQueries({ queryKey: ["google-ads-integration"] });
      queryClient.invalidateQueries({ queryKey: ["analytics-integration"] });
      queryClient.invalidateQueries({ queryKey: BUSINESS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    }
  }, [searchParams, setSearchParams, queryClient, googleCalendarConfig]);

  const {
    data: googleAnalyticsConfig,
    isLoading: isGoogleAnalyticsConfigLoading,
  } = useAnalyticsIntegration();
  const { mutate: updateGoogleAnalyticsIntegration, isPending: isUpdatingGoogleAnalytics } = useUpdateAnalytics();
  const { mutate: connectGoogleAnalytics } = useConnectAnalytics();
  const rawEmailData = (emailExistingConfig as any)?.data ?? emailExistingConfig;
  const emailConfigsList = Array.isArray(rawEmailData)
    ? rawEmailData
    : rawEmailData
      ? [rawEmailData]
      : [];
  const smtpConfig = emailConfigsList.find(
    (cfg: any) => cfg && typeof cfg === "object" && cfg.provider !== "SendGrid"
  );
  const sendGridConfig = emailConfigsList.find(
    (cfg: any) => cfg && typeof cfg === "object" && cfg.provider === "SendGrid"
  );

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
      googleBusinessConfig?.status === "Connected";
    list.push({
      key: "google_business",
      id: googleBusinessConfig?._id || "",
      name: "Google My Business",
      icon: <FaGoogle className="w-4 h-4" />,
      iconBg: "bg-red-100 dark:bg-red-900/20",
      iconColor: "text-red-600 dark:text-red-400",
      status: isGoogleBusinessConnected
        ? "Connected"
        : googleBusinessConfig?.status === "Error"
          ? "Error"
          : googleBusinessConfig?.status === "Pending"
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
      onConnect: () =>
        setPendingConnect({
          key: "google_business",
          name: "Google Business Profile",
          onConfirm: () => connectGoogleBusiness(),
        }),
      onReconnect: () =>
        setPendingConnect({
          key: "google_business",
          name: "Google Business Profile",
          onConfirm: () => connectGoogleBusiness(),
        }),
      onSync: undefined,
      isSyncing: isConnectingPlaces,
      syncButtonText: undefined,
      onConfigure: () => {
        setIsGoogleBusinessLocationModalOpen(true);
      },
      isSwitchChecked: isGoogleBusinessConnected,
      isSwitchLoading: isUpdatingGoogleBusiness,
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
      reviews: gbpReviewsData?.reviews?.length ? {
        items: gbpReviewsData.reviews,
        averageRating: gbpReviewsData.stats?.averageRating,
        totalCount: gbpReviewsData.stats?.totalReviewCount ?? gbpReviewsData.reviews?.length,
      } : undefined,
    });

    list.push({
      key: "google_calendar",
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
      onConnect: () =>
        setPendingConnect({
          key: "google_calendar",
          name: "Google Calendar Integration",
          onConfirm: () => connectCalendar(),
        }),
      onReconnect: () =>
        setPendingConnect({
          key: "google_calendar",
          name: "Google Calendar Integration",
          onConfirm: () => connectCalendar(),
        }),
      onConfigure: () => {
        setSelectedCalendarConfig(googleCalendarConfig);
        setIsGoogleCalendarConfigModalOpen(true);
      },
      isSwitchChecked: googleCalendarConfig?.status === "Connected",
      isSwitchLoading: isUpdatingGoogleCalendar,
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

    if (hasAdsAccess) {
      list.push({
        key: "google_ads",
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
        lastSync: googleAdsConfig?.lastSyncAt || googleAdsConfig?.updatedAt
          ? timeAgo(googleAdsConfig.lastSyncAt || googleAdsConfig.updatedAt)
          : undefined,
        onConnect: () =>
          setPendingConnect({
            key: "google_ads",
            name: "Google Ads",
            onConfirm: () => connectGoogleAds(),
          }),
        onReconnect: () =>
          setPendingConnect({
            key: "google_ads",
            name: "Google Ads",
            onConfirm: () => connectGoogleAds(),
          }),
        onConfigure: () => setIsGoogleAdsAccountModalOpen(true),
        connectedLocation: googleAdsConfig?.customerAccounts?.find(
          (acc: any) => acc.isConnected,
        )?.descriptiveName,
        isSwitchChecked: googleAdsConfig?.status === "Connected",
        isSwitchLoading: isUpdatingGoogleAds,
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
      list.push({
        key: "meta_ads",
        id: metaAdsConfig?._id || "",
        name: "Meta Ads",
        icon: <FaMeta className="w-4 h-4" />,
        iconBg: "bg-blue-100 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
        status: metaAdsConfig?.status || "Disconnected",
        description: "Sync Facebook and Instagram ad performance with your dashboard",
        badges: [
          "Ad campaign tracking",
          "Lead attribution",
          "Ad spend analytics",
        ],
        lastSync: metaAdsConfig?.lastSyncAt || metaAdsConfig?.updatedAt
          ? timeAgo(metaAdsConfig.lastSyncAt || metaAdsConfig.updatedAt)
          : undefined,
        onConnect: () =>
          setPendingConnect({
            key: "meta_ads",
            name: "Meta Ads",
            onConfirm: () => connectMetaAds(),
          }),
        onReconnect: () =>
          setPendingConnect({
            key: "meta_ads",
            name: "Meta Ads",
            onConfirm: () => connectMetaAds(),
          }),
        onConfigure: () => setIsMetaAdsAccountModalOpen(true),
        connectedLocation: metaAdsConfig?.adAccounts?.find(
          (acc: any) => acc.isConnected,
        )?.name,
        isSwitchChecked: metaAdsConfig?.status === "Connected",
        isSwitchLoading: isUpdatingMetaAds,
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
        account: {
          accountName: metaAdsConfig?.accountName,
          accountEmail: metaAdsConfig?.accountEmail,
          accountAvatar: metaAdsConfig?.accountAvatar,
        },
      });
    }
    list.push({
      key: "google_analytics",
      id: googleAnalyticsConfig?._id || "",
      name: "Google Analytics",
      icon: <BsLightningCharge className="w-4 h-4" />,
      iconBg: "bg-yellow-100 dark:bg-yellow-900/20",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      status: googleAnalyticsConfig?.status || "Disconnected",
      description: "Advanced reporting and GA4 property data visualization",
      badges: ["GA4 Reporting", "Activity Visualization", "Data Insights"],
      lastSync: googleAnalyticsConfig?.lastSyncAt || googleAnalyticsConfig?.updatedAt
        ? timeAgo(googleAnalyticsConfig.lastSyncAt || googleAnalyticsConfig.updatedAt)
        : undefined,
      onConnect: () =>
        setPendingConnect({
          key: "google_analytics",
          name: "Google Analytics",
          onConfirm: () => connectGoogleAnalytics(),
        }),
      onReconnect: () =>
        setPendingConnect({
          key: "google_analytics",
          name: "Google Analytics",
          onConfirm: () => connectGoogleAnalytics(),
        }),
      onConfigure: () => setIsGoogleAnalyticsPropertyModalOpen(true),
      connectedLocation: googleAnalyticsConfig?.properties?.find(
        (p: any) => p.isConnected,
      )?.displayName,
      isSwitchChecked: googleAnalyticsConfig?.status === "Connected",
      isSwitchLoading: isUpdatingGoogleAnalytics,
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

    list.push({
      key: "email_marketing",
      id: smtpConfig?._id || "",
      name: "Email Marketing Platform",
      icon: <FaRegEnvelope className="w-4 h-4" />,
      iconBg: "bg-green-100 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
      status: smtpConfig?.status || "Disconnected",
      description:
        "Connect your Google account to send automated referral notifications",
      badges: ["OAuth Authentication", "Automated Emails", "Gmail Integration"],
      lastSync: smtpConfig?.lastSyncAt || smtpConfig?.updatedAt
        ? timeAgo(smtpConfig.lastSyncAt || smtpConfig.updatedAt)
        : undefined,
      onConnect: () =>
        setPendingConnect({
          key: "email_marketing",
          name: "Email Marketing Platform",
          onConfirm: () => connectEmail(),
        }),
      onReconnect: () =>
        setPendingConnect({
          key: "email_marketing",
          name: "Email Marketing Platform",
          onConfirm: () => connectEmail(),
        }),
      isSwitchChecked: smtpConfig?.status === "Connected",
      isSwitchLoading: isUpdatingEmail,
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
        accountName: smtpConfig?.accountName || smtpConfig?.username,
        accountEmail: smtpConfig?.accountEmail || smtpConfig?.username,
        accountAvatar: smtpConfig?.accountAvatar,
      },
    });

    const isSendGridConnected = sendGridConfig?.status === "Connected";
    // list.push({
    //   id: sendGridConfig?._id || "",
    //   name: "SendGrid Integration",
    //   icon: <FaRegEnvelope className="w-4 h-4" />,
    //   iconBg: "bg-blue-100 dark:bg-blue-900/20",
    //   iconColor: "text-blue-600 dark:text-blue-400",
    //   status: isSendGridConnected
    //     ? "Connected"
    //     : sendGridConfig?.status === "Error"
    //       ? "Error"
    //       : "Disconnected",
    //   description:
    //     "Connect your SendGrid account seamlessly to send high-deliverability campaigns",
    //   badges: ["Direct Integration", "Automated Campaigns", "High Deliverability"],
    //   onConnect: () => setIsSendGridConfigModalOpen(true),
    //   onConfigure: () => setIsSendGridConfigModalOpen(true),
    //   isSwitchChecked: isSendGridConnected,
    //   onSwitchChange: () => {
    //     if (sendGridConfig?._id) {
    //       updateEmailIntegration({
    //         id: sendGridConfig._id,
    //         // @ts-ignore
    //         data: {
    //           status:
    //             sendGridConfig.status === "Connected"
    //               ? "Disconnected"
    //               : "Connected",
    //         },
    //       });
    //     }
    //   },
    //   account: isSendGridConnected ? {
    //     accountName: sendGridConfig?.accountName || "SendGrid Admin",
    //     accountEmail: sendGridConfig?.accountEmail || sendGridConfig?.username,
    //     accountAvatar: sendGridConfig?.accountAvatar,
    //   } : undefined,
    // });

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
    googleAnalyticsConfig,
    updateGoogleAnalyticsIntegration,
    connectGoogleAnalytics,
    hasAdsAccess,
  ]);

  const SOCIAL_MEDIA_INTEGRATIONS = useMemo(() => {
    const list: any[] = [];
    const socialCredentials = (allSocialCredentials && typeof allSocialCredentials === "object" && "data" in allSocialCredentials && allSocialCredentials.data)
      ? (allSocialCredentials.data as any)
      : allSocialCredentials;
    const metaCreds = socialCredentials?.meta;
    const youtubeCreds = socialCredentials?.youTube;
    const connectedMetaPage = metaCreds?.metaPages?.find((p: any) => p.isConnected) || metaCreds?.metaPages?.[0];
    const instagramUsername = connectedMetaPage?.instagramBusinessAccount?.username;
    const normalizeStatus = (
      status: string | undefined,
    ): "Connected" | "Disconnected" | "Error" => {
      if (!status) return "Disconnected";
      if (status === "connected" || status === "Connected") return "Connected";
      if (status === "notConnected" || status === "Disconnected")
        return "Disconnected";
      return (status.charAt(0).toUpperCase() + status.slice(1)) as
        | "Connected"
        | "Disconnected"
        | "Error";
    };
    const metaStatus = normalizeStatus(metaCreds?.status);
    const youtubeStatus = normalizeStatus(youtubeCreds?.status);
    const openSocialConnectModal = (platform: {
      platformId: string;
      platformKey: string;
      name: string;
      selectorPlatform: SocialPlatformType;
    }) => {
      setPendingConnect({
        platformId: platform.platformId,
        platformKey: platform.platformKey,
        name: platform.name,
        selectorPlatform: platform.selectorPlatform,
      });
    };
    list.push({
      key: "meta",
      id: metaCreds?.id || "",
      platformId: "meta",
      platformKey: "metaAuthIntegration",
      selectorPlatform: "meta" as SocialPlatformType,
      name: "Meta (Facebook & Instagram)",
      icon: <FaMeta className="w-4 h-4" />,
      iconBg: "bg-blue-100 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      status: metaStatus,
      description:
        "Connect Facebook and Instagram to sync posts and track engagement.",
      badges: ["Facebook", "Instagram", "Ads Sync"],
      lastSync: metaCreds?.lastSyncAt || metaCreds?.updatedAt
        ? timeAgo(metaCreds.lastSyncAt || metaCreds.updatedAt)
        : undefined,
      onConnect: () => openSocialConnectModal({
        platformId: "meta",
        platformKey: "metaAuthIntegration",
        name: "Meta (Facebook & Instagram)",
        selectorPlatform: "meta",
      }),
      onReconnect: () => openSocialConnectModal({
        platformId: "meta",
        platformKey: "metaAuthIntegration",
        name: "Meta (Facebook & Instagram)",
        selectorPlatform: "meta",
      }),
      onConfigure: () => {
        setSelectorPlatform("meta");
        setIsSelectorOpen(true);
      },
      isSwitchChecked: metaStatus === "Connected",
      isSwitchLoading: isUpdatingSocial,
      onSwitchChange: () => {
        updateSocial({
          id: metaCreds?.id,
          payload: {
            status:
              metaStatus === "Connected"
                ? "Disconnected"
                : "Connected",
          },
        });
      },
      account: {
        accountName:
          metaCreds?.accountName ||
          metaCreds?.metaPages?.[0]?.name,
        accountEmail: metaCreds?.accountEmail,
        accountAvatar: metaCreds?.accountAvatar,
        instagramUsername,
      },
    });
    list.push({
      key: "youTube",
      id: youtubeCreds?.id || "",
      platformId: "youTube",
      platformKey: "youtubeAuthIntegration",
      selectorPlatform: "youtube" as SocialPlatformType,
      name: "YouTube",
      icon: <FaYoutube className="w-4 h-4" />,
      iconBg: "bg-red-100 dark:bg-red-900/20",
      iconColor: "text-red-600 dark:text-red-400",
      status: youtubeStatus,
      description: "Sync your video content and monitor channel performance.",
      badges: ["Video Sync", "Channel Stats", "Views Tracking"],
      lastSync: youtubeCreds?.lastSyncAt || youtubeCreds?.updatedAt
        ? timeAgo(youtubeCreds.lastSyncAt || youtubeCreds.updatedAt)
        : undefined,
      onConnect: () => openSocialConnectModal({
        platformId: "youTube",
        platformKey: "youtubeAuthIntegration",
        name: "YouTube",
        selectorPlatform: "youtube",
      }),
      onReconnect: () => openSocialConnectModal({
        platformId: "youTube",
        platformKey: "youtubeAuthIntegration",
        name: "YouTube",
        selectorPlatform: "youtube",
      }),
      onConfigure: () => {
        setSelectorPlatform("youtube");
        setIsSelectorOpen(true);
      },
      isSwitchChecked: youtubeStatus === "Connected",
      isSwitchLoading: isUpdatingSocial,
      onSwitchChange: () => {
        updateSocial({
          id: youtubeCreds?.id,
          payload: {
            status:
              youtubeStatus === "Connected"
                ? "Disconnected"
                : "Connected",
          },
        });
      },
      account: {
        accountName: youtubeCreds?.accountName,
        accountEmail: youtubeCreds?.accountEmail,
        accountAvatar: youtubeCreds?.accountAvatar,
      },
    });
    return list;
  }, [allSocialCredentials, updateSocial, isUpdatingSocial]);

  return (
    <>
      <ComponentContainer headingData={HEADING_DATA}>
        <div className="flex flex-col gap-4 md:gap-5">
          {planAccess?.sms_marketing !== false && (
            <div id="integration-twilio">
              <TwilioDashboard twilioConfig={twilioConfig} />
            </div>
          )}
          <Card className="shadow-none border border-foreground/10 rounded-xl p-4 bg-background">
            <CardHeader className="p-0 pb-5">
              <h4 className="font-medium text-sm text-foreground">
                Available Integrations
              </h4>
            </CardHeader>
            <CardBody className="divide-y divide-gray-100 dark:divide-default-100/50 p-0">
              {AVAILABLE_INTEGRATIONS.map((item, index) => (
                <div key={item.key || index} id={`integration-${item.key}`}>
                  <IntegrationItem
                    {...item}
                    isHighlighted={highlightedKey === item.key}
                  />
                </div>
              ))}
            </CardBody>
          </Card>

          {planAccess?.social_media !== false && (
            <Card className="shadow-none border border-foreground/10 rounded-xl p-4 bg-background">
              <CardHeader className="p-0 pb-5">
                <h4 className="font-medium text-sm text-foreground">
                  Social Media Integrations
                </h4>
              </CardHeader>
              <CardBody className="divide-y divide-gray-100 dark:divide-default-100/50 p-0">
                {SOCIAL_MEDIA_INTEGRATIONS.map((item, index) => (
                  <div key={item.key || index} id={`integration-${item.key}`}>
                    <IntegrationItem
                      {...item}
                      isHighlighted={highlightedKey === item.key}
                    />
                  </div>
                ))}
              </CardBody>
            </Card>
          )}
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
        existingConfig={selectedCalendarConfig || googleCalendarConfig}
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
      {selectorPlatform && (
        <SocialSubAccountSelectorModal
          platform={selectorPlatform}
          isOpen={isSelectorOpen}
          onClose={() => {
            setIsSelectorOpen(false);
            setSelectorPlatform(null);
          }}
        />
      )}
      <SocialConnectConfirmModal
        pending={pendingConnect}
        isOpen={!!pendingConnect}
        onClose={() => setPendingConnect(null)}
        onConfirm={handleConfirmSocialConnect}
        isConnecting={isSocialConnecting}
      />
    </>
  );
}

export default Integrations;
