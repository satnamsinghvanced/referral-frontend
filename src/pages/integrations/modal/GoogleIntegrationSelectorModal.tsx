import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  RadioGroup,
  Radio,
  cn,
} from "@heroui/react";
import { useState, useEffect, useMemo } from "react";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { SiGoogleanalytics } from "react-icons/si";
import {
  useBusinessLocations,
  useConnectBusinessLocation,
  useSyncBusinessProfiles,
} from "../../../hooks/integrations/useGoogleBusiness";
import {
  useAnalyticsProperties,
  useConnectAnalyticsProperty,
  useSyncAnalyticsProperties,
} from "../../../hooks/integrations/useGoogleAnalytics";
import {
  useGoogleAdsAccounts,
  useSyncGoogleAdsAccounts,
  useConnectGoogleAdsAccount,
  useMetaAdsAccounts,
  useSyncMetaAdsAccounts,
  useConnectMetaAdsAccount,
} from "../../../hooks/integrations/useAds";

type IntegrationType = "business" | "analytics" | "ads" | "meta_ads";

interface SelectorItem {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  isConnected: boolean;
}

export default function GoogleIntegrationSelectorModal({
  type,
  isOpen,
  onClose,
}: {
  type: IntegrationType;
  isOpen: boolean;
  onClose: () => void;
}) {
  // Hooks for Business
  const businessData = useBusinessLocations(isOpen && type === "business");
  const businessSync = useSyncBusinessProfiles();
  const businessConnect = useConnectBusinessLocation();

  // Hooks for Analytics
  const analyticsData = useAnalyticsProperties(isOpen && type === "analytics");
  const analyticsSync = useSyncAnalyticsProperties();
  const analyticsConnect = useConnectAnalyticsProperty();

  // Hooks for Ads
  const adsData = useGoogleAdsAccounts(isOpen && type === "ads");
  const adsSync = useSyncGoogleAdsAccounts();
  const adsConnect = useConnectGoogleAdsAccount();

  // Hooks for Meta Ads
  const metaAdsData = useMetaAdsAccounts(isOpen && type === "meta_ads");
  const metaAdsSync = useSyncMetaAdsAccounts();
  const metaAdsConnect = useConnectMetaAdsAccount();

  // Resolve active hooks based on type
  const { data, isLoading, isError, sync, isSyncing, connect, isConnecting } = useMemo(() => {
    if (type === "business") {
      return {
        data: businessData.data,
        isLoading: businessData.isLoading,
        isError: businessData.isError,
        sync: businessSync.mutateAsync,
        isSyncing: businessSync.isPending,
        connect: businessConnect.mutateAsync,
        isConnecting: businessConnect.isPending,
      };
    } else if (type === "analytics") {
      return {
        data: analyticsData.data,
        isLoading: analyticsData.isLoading,
        isError: analyticsData.isError,
        sync: analyticsSync.mutateAsync,
        isSyncing: analyticsSync.isPending,
        connect: analyticsConnect.mutateAsync,
        isConnecting: analyticsConnect.isPending,
      };
    } else if (type === "ads") {
      return {
        data: adsData.data,
        isLoading: adsData.isLoading,
        isError: adsData.isError,
        sync: adsSync.mutateAsync,
        isSyncing: adsSync.isPending,
        connect: adsConnect.mutateAsync,
        isConnecting: adsConnect.isPending,
      };
    } else {
      return {
        data: metaAdsData.data,
        isLoading: metaAdsData.isLoading,
        isError: metaAdsData.isError,
        sync: metaAdsSync.mutateAsync,
        isSyncing: metaAdsSync.isPending,
        connect: metaAdsConnect.mutateAsync,
        isConnecting: metaAdsConnect.isPending,
      };
    }
  }, [type, businessData, businessSync, businessConnect, analyticsData, analyticsSync, analyticsConnect, adsData, adsSync, adsConnect, metaAdsData, metaAdsSync, metaAdsConnect]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Map raw data to common item format
  const items: SelectorItem[] = useMemo(() => {
    if (type === "business") {
      return ((data as any)?.locations || []).map((loc: any) => ({
        id: loc.locationId,
        title: loc.name,
        subtitle: loc.address,
        category: loc.primaryCategory,
        isConnected: loc.isConnected,
      }));
    } else if (type === "analytics") {
      return ((data as any)?.properties || []).map((prop: any) => ({
        id: prop.propertyId,
        title: prop.displayName,
        subtitle: `ID: ${prop.propertyId}`,
        category: `Account: ${prop.accountId}`,
        isConnected: prop.isConnected,
      }));
    } else if (type === "ads") {
      return ((data as any)?.customerAccounts || []).map((acc: any) => ({
        id: acc.customerId,
        title: acc.descriptiveName || `Customer ID: ${acc.customerId}`,
        subtitle: `ID: ${acc.customerId}`,
        category: acc.timeZone ? `${acc.timeZone} (${acc.currencyCode})` : undefined,
        isConnected: acc.isConnected,
      }));
    } else {
      return ((data as any)?.adAccounts || []).map((acc: any) => ({
        id: acc.adAccountId,
        title: acc.name || `Account ID: ${acc.adAccountId}`,
        subtitle: `ID: ${acc.adAccountId}`,
        category: acc.timezone ? `${acc.timezone} (${acc.currency})` : undefined,
        isConnected: acc.isConnected,
      }));
    }
  }, [type, data]);

  useEffect(() => {
    if (items.length > 0) {
      const connected = items.find((item) => item.isConnected);
      if (connected) {
        setSelectedId(connected.id);
      }
    }
  }, [items]);

  const handleConnect = async () => {
    if (!selectedId) return;
    try {
      await connect(selectedId);
      addToast({
        title: "Success",
        description: "Connected successfully.",
        color: "success",
      });
      onClose();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to connect.",
        color: "danger",
      });
    }
  };

  const handleSync = async () => {
    try {
      await sync();
      addToast({
        title: "Success",
        description: "Profiles synced successfully.",
        color: "success",
      });
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to sync.",
        color: "danger",
      });
    }
  };

  const config = {
    business: {
      title: "Select Business Location",
      description: "Choose the specific business profile you want to connect.",
      icon: <HiOutlineOfficeBuilding className="w-5 h-5" />,
      emptyMsg: "No locations found in your Google account.",
      loadingMsg: "Fetching your business locations...",
    },
    analytics: {
      title: "Select Analytics Property",
      description: "Choose the GA4 property you want to use for your dashboard.",
      icon: <SiGoogleanalytics className="w-5 h-5" />,
      emptyMsg: "No GA4 properties found in your Google account.",
      loadingMsg: "Fetching your analytics properties...",
    },
    ads: {
      title: "Select Google Ads Account",
      description: "Choose the specific customer account you want to connect.",
      icon: <HiOutlineOfficeBuilding className="w-5 h-5" />,
      emptyMsg: "No Google Ads accounts found in your Google account.",
      loadingMsg: "Fetching your Ads accounts...",
    },
    meta_ads: {
      title: "Select Meta Ads Account",
      description: "Choose the specific ad account you want to connect.",
      icon: <HiOutlineOfficeBuilding className="w-5 h-5" />,
      emptyMsg: "No Meta Ads accounts found in your Meta account.",
      loadingMsg: "Fetching your Meta accounts...",
    },
  }[type];

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
          <p className="text-sm font-normal text-default-500">{config.description}</p>
        </ModalHeader>
        <ModalBody>
          {isLoading || isSyncing ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Spinner size="lg" />
              <p className="text-sm text-default-500">{config.loadingMsg}</p>
            </div>
          ) : isError ? (
            <div className="text-center py-10">
              <p className="text-danger">Failed to load data. Please try again.</p>
              <Button size="sm" variant="flat" color="primary" className="mt-4" onClick={handleSync}>
                Retry Sync
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-default-500">{config.emptyMsg}</p>
              <Button size="sm" variant="flat" color="primary" className="mt-4" onClick={handleSync}>
                Sync Now
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">{items.length} Items Found</p>
                <Button size="sm" variant="light" color="primary" onClick={handleSync} isLoading={isSyncing}>
                  Refresh List
                </Button>
              </div>
              <RadioGroup
                value={selectedId || ""}
                onValueChange={setSelectedId}
                classNames={{
                  wrapper: "gap-3",
                }}
              >
                {items.map((item) => (
                  <Radio
                    key={item.id}
                    value={item.id}
                    classNames={{
                      base: cn(
                        "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                        "flex-row-reverse max-w-full cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
                        "data-[selected=true]:border-primary"
                      ),
                    }}
                  >
                    <div className="flex gap-3 items-center">
                      <div className="p-2 bg-primary/10 rounded-full text-primary">{config.icon}</div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{item.title}</span>
                        <span className="text-xs text-default-400">{item.subtitle}</span>
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
            isDisabled={!selectedId || isSyncing}
          >
            Connect Selected
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
