import {
  addToast,
  Button,
  Input,
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
import { FiSearch } from "react-icons/fi";
import {
  useBusinessLocations,
  useConnectBusinessLocation,
  useSyncBusinessProfiles,
  useSearchGooglePlaces,
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

export default function GoogleIntegrationSelectorModal({ type, isOpen, onClose }: {
  type: IntegrationType;
  isOpen: boolean;
  onClose: () => void;
}) {
  const businessData = useBusinessLocations(isOpen && type === "business");
  const businessSync = useSyncBusinessProfiles();
  const businessConnect = useConnectBusinessLocation();
  const searchPlacesMutation = useSearchGooglePlaces();
  const analyticsData = useAnalyticsProperties(isOpen && type === "analytics");
  const analyticsSync = useSyncAnalyticsProperties();
  const analyticsConnect = useConnectAnalyticsProperty();
  const adsData = useGoogleAdsAccounts(isOpen && type === "ads");
  const adsSync = useSyncGoogleAdsAccounts();
  const adsConnect = useConnectGoogleAdsAccount();
  const metaAdsData = useMetaAdsAccounts(isOpen && type === "meta_ads");
  const metaAdsSync = useSyncMetaAdsAccounts();
  const metaAdsConnect = useConnectMetaAdsAccount();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SelectorItem[] | null>(null);

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
  const items: SelectorItem[] = useMemo(() => {
    if (type === "business") {
      const rawLocations = (data as any)?.locations || [];
      return rawLocations.map((loc: any) => ({
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

  const displayItems = searchResults !== null ? searchResults : items;

  // Debounced live autocomplete search effect
  useEffect(() => {
    if (type !== "business") return;
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults(null);
      return;
    }
    if (query.length < 2) return;

    const timer = setTimeout(async () => {
      try {
        const res = await searchPlacesMutation.mutateAsync(query);
        const foundLocations = res?.locations || [];
        const mapped: SelectorItem[] = foundLocations.map((loc: any) => ({
          id: loc.locationId,
          title: loc.name,
          subtitle: loc.address,
          category: loc.primaryCategory || "Places Profile",
          isConnected: false,
        }));
        setSearchResults(mapped);
        if (mapped.length > 0) {
          setSelectedId(mapped[0]?.id || null);
        } else {
          setSelectedId(null);
        }
      } catch (err: any) {
        console.error("Autocomplete search error:", err.message);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery, type]);

  useEffect(() => {
    if (displayItems.length > 0) {
      const connected = displayItems.find((item) => item.isConnected);
      if (connected) {
        setSelectedId(connected.id);
      } else if (searchResults !== null) {
        setSelectedId(displayItems[0]?.id || null);
      }
    }
  }, [displayItems, searchResults]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      const res = await searchPlacesMutation.mutateAsync(searchQuery.trim());
      const foundLocations = res?.locations || [];
      const mapped: SelectorItem[] = foundLocations.map((loc: any) => ({
        id: loc.locationId,
        title: loc.name,
        subtitle: loc.address,
        category: loc.primaryCategory || "Places Profile",
        isConnected: false,
      }));
      setSearchResults(mapped);
      if (mapped.length > 0) {
        setSelectedId(mapped[0]?.id || null);
      } else {
        setSelectedId(null);
      }
    } catch (error: any) {
      addToast({
        title: "Search Error",
        description: error.response?.data?.message || "Failed to search locations.",
        color: "danger",
      });
    }
  };

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
      setSearchResults(null);
      setSearchQuery("");
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
      description: "Choose or search the specific business profile you want to connect.",
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
        <ModalBody className="py-4 space-y-4">
          {type === "business" && (
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                size="sm"
                radius="sm"
                placeholder="Search by exact business name, address, or Place ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startContent={<FiSearch className="text-default-400" />}
                isClearable
                onClear={() => {
                  setSearchQuery("");
                  setSearchResults(null);
                }}
              />
              <Button
                size="sm"
                radius="sm"
                color="primary"
                type="submit"
                isLoading={searchPlacesMutation.isPending}
                isDisabled={!searchQuery.trim() || searchPlacesMutation.isPending}
              >
                Search
              </Button>
            </form>
          )}

          {isLoading || isSyncing || (type === "business" && searchPlacesMutation.isPending) ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Spinner size="lg" />
              <p className="text-sm text-default-500">
                {searchPlacesMutation.isPending ? "Searching Google Places..." : config.loadingMsg}
              </p>
            </div>
          ) : isError ? (
            <div className="text-center py-10">
              <p className="text-danger">Failed to load data. Please try again.</p>
              <Button size="sm" variant="flat" color="primary" className="mt-4" onClick={handleSync}>
                Retry Sync
              </Button>
            </div>
          ) : displayItems.length === 0 ? (
            <div className="text-center py-8 bg-default-50 rounded-lg border border-dashed border-default-200">
              <p className="text-sm text-default-600 font-medium mb-1">
                {searchResults !== null
                  ? "No matching locations found for your search."
                  : type === "business"
                  ? "Enter your business location above to search."
                  : config.emptyMsg}
              </p>
              <p className="text-xs text-default-400 max-w-xs mx-auto mb-3">
                {type === "business"
                  ? "Type your exact practice name, city, or street address in the search box above to search and connect your location."
                  : "Click below to refresh profiles."}
              </p>
              <Button size="sm" variant="flat" color="primary" onClick={handleSync}>
                Sync Now
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 w-full">
              <div className="flex justify-between items-center">
                <p className="text-xs font-semibold text-default-600">
                  {searchResults !== null ? `Search Results (${displayItems.length} Found)` : `${displayItems.length} Items Found`}
                </p>
                <Button size="sm" variant="light" color="primary" onClick={handleSync} isLoading={isSyncing} className="h-7 text-xs">
                  Refresh List
                </Button>
              </div>
              <RadioGroup
                value={selectedId || ""}
                onValueChange={setSelectedId}
                orientation="vertical"
                classNames={{
                  wrapper: "flex flex-col gap-3 max-h-[350px] overflow-y-auto overflow-x-hidden pr-1 w-full",
                }}
              >
                {displayItems.map((item) => (
                  <Radio
                    key={item.id}
                    value={item.id}
                    classNames={{
                      base: cn(
                        "flex w-full m-0 bg-content1 hover:bg-content2 items-center justify-between",
                        "flex-row-reverse cursor-pointer rounded-lg gap-4 p-3.5 border-2 border-default-200/50",
                        "data-[selected=true]:border-primary data-[selected=true]:bg-primary/5"
                      ),
                    }}
                  >
                    <div className="flex gap-3 items-center min-w-0 flex-1">
                      <div className="p-2 bg-primary/10 rounded-full text-primary shrink-0">{config.icon}</div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-bold text-foreground truncate">{item.title}</span>
                        <span className="text-xs text-default-500 line-clamp-1">{item.subtitle}</span>
                        {item.category && (
                          <span className="text-[10px] text-primary font-semibold uppercase mt-0.5">
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
        <ModalFooter className="flex justify-between items-center border-t border-default-100 pt-3">
          <Button size="sm" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            color="primary"
            onPress={handleConnect}
            isLoading={isConnecting}
            isDisabled={!selectedId || isSyncing || (type === "business" && searchPlacesMutation.isPending)}
          >
            Connect Selected
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
