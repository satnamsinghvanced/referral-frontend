import { addToast, Button, Card, CardBody, CardHeader } from "@heroui/react";
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
import APIKeysCard from "./webhooks/APIKeysCard";
import IntegrationItem from "./IntegrationItem";
import GoogleCalendarConfigModal from "./modal/GoogleCalendarConfigModal";
import TwilioConfigurationModal from "./modal/TwilioConfigurationModal";
import AddWebhookModal, { WebhookConfig } from "./webhooks/AddWebhookModal";
import WebhooksList from "./webhooks/WebhooksList";
import {
  // --- Integrated API/Webhook Hooks ---
  useIntegrationKeys,
  useCreateIntegrationKey,
  useDeleteIntegrationKey,
  useWebhooks,
  useCreateWebhook,
  useUpdateWebhook,
  useDeleteWebhook,
} from "../../hooks/useWebhook";
import {
  WebhookAction,
  WebhookType,
  WebhookSubscription,
  IntegrationKey,
} from "../../types/webhook"; // Import types for casting
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";

function Integrations() {
  const { user } = useTypedSelector((state) => state.auth);
  const userId = user?.userId;
  const [isDeleteWebhookModalOpen, setIsDeleteWebhookModalOpen] =
    useState(false);
  const [deleteWebhookId, setDeleteWebhookId] = useState("");

  const [
    isGoogleCalendarIntegrationModalOpen,
    setIsGoogleCalendarIntegrationModalOpen,
  ] = useState(false);

  const [isTwilioIntegrationModalOpen, setIsTwilioIntegrationModalOpen] =
    useState(false);

  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(
    null
  );

  // API Hooks
  const { data: integrationKeys, isLoading: isKeysLoading } =
    useIntegrationKeys();
  const { mutate: createIntegrationKey, isPending: isCreatingKey } =
    useCreateIntegrationKey();
  const { mutate: deleteIntegrationKey } = useDeleteIntegrationKey();

  const { data: webhooks, isLoading: isWebhooksLoading } = useWebhooks();
  const { mutate: createWebhook, isPending: isCreatingWebhook } =
    useCreateWebhook();
  const { mutate: updateWebhook, isPending: isUpdatingWebhook } =
    useUpdateWebhook();
  const { mutate: deleteWebhookMutation, isPending: isDeletingWebhook } =
    useDeleteWebhook();

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

  // Handler: Generate New Integration Keys
  const handleGenerateNewKeys = () => {
    // Label is required in the body, but can be generic if not used otherwise
    createIntegrationKey(
      { label: "Webhooks API Key" },
      {
        onSuccess: () => {
          addToast({
            title: "Success",
            description: "New API keys generated successfully",
            color: "success",
          });
        },
        onError: (error) => {
          addToast({
            title: "Error",
            description: error.message || "Failed to generate API keys",
            color: "danger",
          });
        },
      }
    );
  };

  // Handler: Save Webhook (Create or Update)
  const handleSaveWebhook = (webhook: WebhookConfig) => {
    // Cast string arrays to the required API types
    const type = webhook.source as WebhookType;
    const action = webhook.events as WebhookAction[];
    const status = webhook.isActive ? "active" : "inActive";

    if (editingWebhook) {
      // --- Update existing webhook ---
      updateWebhook(
        {
          id: webhook.id!, // ID is guaranteed on edit
          body: { type, action, status },
        },
        {
          onSuccess: () => {
            addToast({
              title: "Success",
              description: "Webhook updated successfully",
              color: "success",
            });
            setEditingWebhook(null);
            setIsWebhookModalOpen(false); // Close modal on success
          },
          onError: (error) => {
            addToast({
              title: "Error",
              description: error.message || "Failed to update webhook",
              color: "danger",
            });
          },
        }
      );
    } else {
      // --- Create new webhook ---
      createWebhook(
        { type, action, status },
        {
          onSuccess: () => {
            addToast({
              title: "Success",
              description: "Webhook added successfully",
              color: "success",
            });
            setIsWebhookModalOpen(false); // Close modal on success
          },
          onError: (error) => {
            addToast({
              title: "Error",
              description: error.message || "Failed to add webhook",
              color: "danger",
            });
          },
        }
      );
    }
  };

  // Handler: Edit Webhook
  const handleEditWebhook = (webhook: WebhookSubscription) => {
    // Convert WebhookSubscription (API model) to WebhookConfig (UI model)
    const webhookConfig: WebhookConfig = {
      id: webhook.id,
      source: webhook.type,
      events: webhook.action,
      isActive: webhook.status === "active",
      url: webhook.url,
    };
    setEditingWebhook(webhookConfig);
    setIsWebhookModalOpen(true);
  };

  // Handler: Delete Webhook
  const handleDeleteWebhook = (webhookId: string) => {
    setDeleteWebhookId(webhookId);
    setIsDeleteWebhookModalOpen(true);
  };

  const handleDeleteWebhookConfirm = () => {
    deleteWebhookMutation(deleteWebhookId, {
      onSuccess: () => {
        setDeleteWebhookId("");
        setIsDeleteWebhookModalOpen(false);
        addToast({
          title: "Success",
          description: "Webhook deleted successfully",
          color: "success",
        });
      },
      onError: (error) => {
        addToast({
          title: "Error",
          description: error.message || "Failed to delete webhook",
          color: "danger",
        });
      },
    });
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
            {/* API Keys Card */}
            <Card className="shadow-none border border-primary/15 rounded-xl p-5">
              <CardHeader className="p-0 pb-4">
                <h4 className="font-medium text-sm">API Keys</h4>
              </CardHeader>
              <CardBody className="p-0">
                {/* Note: integrationKeys is an array, passing the first element as per your previous logic */}
                <APIKeysCard
                  integrationKey={integrationKeys?.[0] as IntegrationKey}
                  isLoading={isKeysLoading}
                  onGenerateNew={handleGenerateNewKeys}
                  isGenerating={isCreatingKey}
                />
              </CardBody>
            </Card>

            {/* Webhooks Card */}
            <Card className="shadow-none border border-primary/15 rounded-xl p-5">
              <CardHeader className="flex items-center justify-between p-0 pb-4">
                <h4 className="font-medium text-sm">Webhooks</h4>
                <Button
                  size="sm"
                  radius="sm"
                  color="primary"
                  onPress={() => {
                    setEditingWebhook(null);
                    setIsWebhookModalOpen(true);
                  }}
                >
                  Add Webhook
                </Button>
              </CardHeader>
              <CardBody className="p-0">
                <WebhooksList
                  webhooks={webhooks || []}
                  isLoading={isWebhooksLoading}
                  onEdit={handleEditWebhook}
                  onDelete={handleDeleteWebhook}
                />
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

      <AddWebhookModal
        isOpen={isWebhookModalOpen}
        onClose={() => {
          setIsWebhookModalOpen(false);
          setEditingWebhook(null);
        }}
        onSave={handleSaveWebhook}
        editingWebhook={editingWebhook}
        isSaving={isCreatingWebhook || isUpdatingWebhook}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteWebhookModalOpen}
        onClose={() => setIsDeleteWebhookModalOpen(false)}
        onConfirm={handleDeleteWebhookConfirm}
        isLoading={isDeletingWebhook}
      />
    </>
  );
}

export default Integrations;
