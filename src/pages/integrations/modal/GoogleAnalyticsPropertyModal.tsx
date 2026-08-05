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
import { useState, useEffect } from "react";
import { SiGoogleanalytics } from "react-icons/si";
import {
  useAnalyticsProperties,
  useConnectAnalyticsProperty,
  useSyncAnalyticsProperties,
} from "../../../hooks/integrations/useGoogleAnalytics";

export default function GoogleAnalyticsPropertyModal({ isOpen, onClose }: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data, isLoading, isError } = useAnalyticsProperties();
  const { mutateAsync: syncProperties, isPending: isSyncing } = useSyncAnalyticsProperties();
  const { mutateAsync: connectProperty, isPending: isConnecting } = useConnectAnalyticsProperty();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const properties = data?.properties || [];
  useEffect(() => {
    if (properties.length > 0) {
      const connected = properties.find((p: any) => p.isConnected);
      if (connected) {
        setSelectedId(connected.propertyId);
      }
    }
  }, [properties]);
  const handleConnect = async () => {
    if (!selectedId) return;
    try {
      await connectProperty(selectedId);
      addToast({
        title: "Success",
        description: "Property connected successfully.",
        color: "success",
      });
      onClose();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to connect property.",
        color: "danger",
      });
    }
  };

  const handleSync = async () => {
    try {
      await syncProperties();
      addToast({
        title: "Success",
        description: "Analytics properties synced successfully.",
        color: "success",
      });
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to sync properties.",
        color: "danger",
      });
    }
  };

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
          <h2 className="text-xl font-bold">Select Analytics Property</h2>
          <p className="text-sm font-normal text-default-500">
            Choose the GA4 property you want to use for your analytics dashboard.
          </p>
        </ModalHeader>
        <ModalBody>
          {isLoading || isSyncing ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Spinner size="lg" />
              <p className="text-sm text-default-500">Fetching your analytics properties...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-10">
              <p className="text-danger">Failed to load properties. Please try again.</p>
              <Button size="sm" variant="flat" color="primary" className="mt-4" onClick={handleSync}>
                Retry Sync
              </Button>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-default-500">No GA4 properties found in your Google account.</p>
              <Button size="sm" variant="flat" color="primary" className="mt-4" onClick={handleSync}>
                Sync Properties
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">{properties.length} Properties Found</p>
                <Button size="sm" variant="light" color="primary" onClick={handleSync} isLoading={isSyncing}>
                  Refresh List
                </Button>
              </div>
              <RadioGroup
                value={selectedId || ""}
                onValueChange={setSelectedId}
                orientation="vertical"
                classNames={{
                  wrapper: "flex flex-col gap-3 max-h-[360px] overflow-y-auto overflow-x-hidden pr-1 w-full min-w-full",
                }}
              >
                {properties.map((prop: any) => (
                  <Radio
                    key={prop.propertyId}
                    value={prop.propertyId}
                    classNames={{
                      base: cn(
                        "flex w-full min-w-full m-0 bg-content1 hover:bg-content2 items-center justify-between",
                        "flex-row-reverse cursor-pointer rounded-lg gap-4 p-3.5 border-2 border-default-200/50",
                        "data-[selected=true]:border-primary data-[selected=true]:bg-primary/5"
                      ),
                      label: "w-full min-w-0 flex-1",
                    }}
                  >
                    <div className="flex gap-3 items-center min-w-0 flex-1 w-full">
                      <div className="p-2 bg-primary/10 rounded-full text-primary shrink-0">
                        <SiGoogleanalytics className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-bold text-foreground truncate">{prop.displayName}</span>
                        <span className="text-xs text-default-500 truncate">ID: {prop.propertyId}</span>
                        <span className="text-[10px] text-primary font-semibold uppercase mt-0.5">
                          Account ID: {prop.accountId}
                        </span>
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
            Connect Selected Property
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
