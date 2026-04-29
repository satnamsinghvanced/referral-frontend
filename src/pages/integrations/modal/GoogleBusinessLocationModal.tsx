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
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import {
  useBusinessLocations,
  useConnectBusinessLocation,
  useSyncBusinessProfiles,
} from "../../../hooks/integrations/useGoogleBusiness";

export default function GoogleBusinessLocationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data, isLoading, isError } = useBusinessLocations();
  const { mutateAsync: syncProfiles, isPending: isSyncing } = useSyncBusinessProfiles();
  const { mutateAsync: connectLocation, isPending: isConnecting } = useConnectBusinessLocation();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const locations = data?.locations || [];

  useEffect(() => {
    if (locations.length > 0) {
      const connected = locations.find((l: any) => l.isConnected);
      if (connected) {
        setSelectedId(connected.locationId);
      }
    }
  }, [locations]);

  const handleConnect = async () => {
    if (!selectedId) return;
    try {
      await connectLocation(selectedId);
      addToast({
        title: "Success",
        description: "Location connected successfully.",
        color: "success",
      });
      onClose();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to connect location.",
        color: "danger",
      });
    }
  };

  const handleSync = async () => {
    try {
      await syncProfiles();
      addToast({
        title: "Success",
        description: "Business profiles synced successfully.",
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
          <h2 className="text-xl font-bold">Select Business Location</h2>
          <p className="text-sm font-normal text-default-500">
            Choose the specific business profile you want to connect to your account.
          </p>
        </ModalHeader>
        <ModalBody>
          {isLoading || isSyncing ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Spinner size="lg" />
              <p className="text-sm text-default-500">Fetching your business locations...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-10">
              <p className="text-danger">Failed to load locations. Please try again.</p>
              <Button size="sm" variant="flat" color="primary" className="mt-4" onClick={handleSync}>
                Retry Sync
              </Button>
            </div>
          ) : locations.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-default-500">No locations found in your Google account.</p>
              <Button size="sm" variant="flat" color="primary" className="mt-4" onClick={handleSync}>
                Sync Profiles
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">{locations.length} Locations Found</p>
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
                {locations.map((loc: any) => (
                  <Radio
                    key={loc.locationId}
                    value={loc.locationId}
                    classNames={{
                      base: cn(
                        "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                        "flex-row-reverse max-w-full cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
                        "data-[selected=true]:border-primary"
                      ),
                    }}
                  >
                    <div className="flex gap-3 items-center">
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <HiOutlineOfficeBuilding className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{loc.name}</span>
                        <span className="text-xs text-default-400">{loc.address}</span>
                        <span className="text-[10px] text-primary font-medium uppercase mt-1">
                          {loc.primaryCategory}
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
            Connect Selected Location
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
