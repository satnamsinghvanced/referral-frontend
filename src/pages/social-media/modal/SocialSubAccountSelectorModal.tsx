import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Spinner,
  cn,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { FaFacebook, FaLinkedin, FaTiktok, FaYoutube } from "react-icons/fa6";
import {
  useConnectSocialSubAccount,
  useSocialCredentials,
  useSocialSubAccounts,
  useSyncSocialProfiles,
} from "../../../hooks/useSocial";

export type SocialPlatformType = "meta" | "linkedin" | "youtube" | "tiktok";

const CREDENTIAL_PLATFORM_KEY: Record<
  SocialPlatformType,
  "meta" | "linkedin" | "youTube" | "tikTok"
> = {
  meta: "meta",
  linkedin: "linkedin",
  youtube: "youTube",
  tiktok: "tikTok",
};

interface SelectorItem {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  isConnected: boolean;
}

const PLATFORM_CONFIG: Record<
  SocialPlatformType,
  {
    title: string;
    description: string;
    loadingMsg: string;
    icon: React.ReactNode;
  }
> = {
  meta: {
    title: "Select Facebook Page",
    description:
      "Choose the Facebook page (and linked Instagram account) you want to sync.",
    loadingMsg: "Fetching your Facebook pages...",
    icon: <FaFacebook className="w-5 h-5" />,
  },
  linkedin: {
    title: "Select LinkedIn Profile",
    description: "Choose your personal profile or company page to post from.",
    loadingMsg: "Fetching your LinkedIn profiles...",
    icon: <FaLinkedin className="w-5 h-5" />,
  },
  youtube: {
    title: "Select YouTube Channel",
    description: "Choose the channel you want to sync and publish videos to.",
    loadingMsg: "Fetching your YouTube channels...",
    icon: <FaYoutube className="w-5 h-5" />,
  },
  tiktok: {
    title: "Select TikTok Account",
    description: "Choose the TikTok account you want to connect.",
    loadingMsg: "Fetching your TikTok account...",
    icon: <FaTiktok className="w-5 h-5" />,
  },
};

const mapAccountsToItems = (
  platform: SocialPlatformType,
  accounts: any[],
): SelectorItem[] => {
  if (platform === "meta") {
    return accounts.map((acc) => ({
      id: acc.pageId,
      title: acc.name,
      subtitle: acc.isParentAccount
        ? acc.accountEmail || "Connected Meta account"
        : acc.instagramBusinessAccount?.username
          ? `@${acc.instagramBusinessAccount.username}`
          : acc.category,
      category: acc.isParentAccount
        ? "Connected Account"
        : acc.instagramBusinessAccount
          ? "Instagram linked"
          : undefined,
      isConnected: acc.isConnected,
    }));
  }
  if (platform === "linkedin") {
    return accounts.map((acc) => ({
      id: acc.id,
      title: acc.name,
      subtitle: acc.isParentAccount
        ? acc.accountEmail || "Connected LinkedIn account"
        : acc.vanityName
          ? `@${acc.vanityName}`
          : undefined,
      category: acc.isParentAccount
        ? "Connected Account"
        : acc.type === "personal"
          ? "Personal"
          : "Organization",
      isConnected: acc.isConnected,
    }));
  }
  if (platform === "youtube") {
    return accounts.map((acc) => ({
      id: acc.channelId,
      title: acc.title,
      subtitle: acc.isParentAccount
        ? "Connected YouTube account"
        : `Channel ID: ${acc.channelId}`,
      category: acc.isParentAccount ? "Connected Account" : undefined,
      isConnected: acc.isConnected,
    }));
  }
  return accounts.map((acc) => ({
    id: acc.id,
    title: acc.name,
    subtitle: acc.isParentAccount ? "Connected TikTok account" : acc.id,
    category: acc.isParentAccount ? "Connected Account" : undefined,
    isConnected: acc.isConnected,
  }));
};

const buildParentItemFromCredentials = (
  platform: SocialPlatformType,
  credential: any,
): SelectorItem | null => {
  const status = credential.status?.toLowerCase?.() || credential.status;
  if (!credential || (status !== "connected" && status !== "Connected")) return null;
  const name = credential.accountName || credential.accountEmail;
  if (!name) return null;

  const id =
    platform === "meta"
      ? credential.metaPages?.[0]?.pageId || `parent_${credential.id}`
      : platform === "linkedin"
        ? credential.linkedinPages?.[0]?.id ||
          (credential.openId
            ? `urn:li:person:${credential.openId}`
            : `parent_${credential.id}`)
        : platform === "youtube"
          ? credential.youtubeChannels?.[0]?.channelId ||
            credential.youtubeChannelId ||
            `parent_${credential.id}`
          : credential.tiktokAccounts?.[0]?.id ||
            credential.openId ||
            `parent_${credential.id}`;

  return {
    id,
    title: name,
    subtitle: credential.accountEmail || "Connected account",
    category: "Connected Account",
    isConnected: true,
  };
};

export default function SocialSubAccountSelectorModal({
  platform,
  isOpen,
  onClose,
}: {
  platform: SocialPlatformType;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data, isLoading, isError, refetch } = useSocialSubAccounts(platform, isOpen);
  const { data: credentials } = useSocialCredentials();
  const syncMutation = useSyncSocialProfiles(platform);
  const connectMutation = useConnectSocialSubAccount(platform);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const config = PLATFORM_CONFIG[platform];

  const items: SelectorItem[] = useMemo(() => {
    const accounts = data?.accounts || [];
    const mapped = mapAccountsToItems(platform, accounts);
    if (mapped.length > 0) return mapped;

    const credential = credentials?.[CREDENTIAL_PLATFORM_KEY[platform]];
    const parentItem = buildParentItemFromCredentials(platform, credential);
    if (parentItem) return [parentItem];

    if (data?.connectedAccount) {
      return [
        {
          id: data.connectedAccount.id,
          title: data.connectedAccount.name,
          subtitle: data.connectedAccount.email || "Connected account",
          category: "Connected Account",
          isConnected: true,
        },
      ];
    }

    return [];
  }, [data, platform, credentials]);

  const connectedAccountId = useMemo(
    () => items.find((item) => item.isConnected)?.id ?? null,
    [items],
  );

  useEffect(() => {
    if (items.length > 0) {
      const connected = items.find((item) => item.isConnected);
      setSelectedId(connected?.id || items[0].id);
    }
  }, [items]);

  const canConnectSelected = useMemo(() => {
    if (!selectedId) return false;
    if (!connectedAccountId) return true;
    return selectedId !== connectedAccountId;
  }, [selectedId, connectedAccountId]);

  const handleSync = async () => {
    try {
      await syncMutation.mutateAsync();
      await refetch();
      addToast({
        title: "Success",
        description: "Profiles synced successfully.",
        color: "success",
      });
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to sync profiles.",
        color: "danger",
      });
    }
  };

  const handleConnect = async () => {
    if (!selectedId) return;
    try {
      await connectMutation.mutateAsync(selectedId);
      addToast({
        title: "Success",
        description: "Account connected successfully.",
        color: "success",
      });
      onClose();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to connect account.",
        color: "danger",
      });
    }
  };

  const isSyncing = syncMutation.isPending;
  const isConnecting = connectMutation.isPending;
  const isUsingConnectedAccount = items.some(
    (item) => item.category === "Connected Account",
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="lg"
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">{config.title}</h2>
          <p className="text-sm font-normal text-default-500">
            {isUsingConnectedAccount
              ? "No separate pages found. Your connected account is shown below."
              : config.description}
          </p>
        </ModalHeader>
        <ModalBody>
          {isLoading || isSyncing ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Spinner size="lg" />
              <p className="text-sm text-default-500">{config.loadingMsg}</p>
            </div>
          ) : isError ? (
            <div className="text-center py-10">
              <p className="text-danger">Failed to load accounts. Please try again.</p>
              <Button
                size="sm"
                variant="flat"
                color="primary"
                className="mt-4"
                onPress={handleSync}
              >
                Retry Sync
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-default-500">
                No connected account found. Please connect the platform first.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">
                  {isUsingConnectedAccount ? "Connected Account" : `${items.length} Items Found`}
                </p>
                {!isUsingConnectedAccount && (
                  <Button
                    size="sm"
                    variant="light"
                    color="primary"
                    onPress={handleSync}
                    isLoading={isSyncing}
                  >
                    Refresh List
                  </Button>
                )}
              </div>
              <RadioGroup
                value={selectedId || ""}
                onValueChange={setSelectedId}
                classNames={{ wrapper: "gap-3" }}
              >
                {items.map((item) => (
                  <Radio
                    key={item.id}
                    value={item.id}
                    classNames={{
                      base: cn(
                        "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                        "flex-row-reverse max-w-full cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
                        "data-[selected=true]:border-primary",
                      ),
                    }}
                  >
                    <div className="flex gap-3 items-center">
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                        {config.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{item.title}</span>
                        {item.subtitle && (
                          <span className="text-xs text-default-400">{item.subtitle}</span>
                        )}
                        {item.category && (
                          <span className="text-[10px] text-primary font-medium uppercase mt-1">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </Radio>
                ))}
              </RadioGroup>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleConnect}
            isLoading={isConnecting}
            isDisabled={!canConnectSelected || isSyncing}
          >
            Connect Selected
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
