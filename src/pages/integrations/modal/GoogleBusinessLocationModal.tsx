import { addToast, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, RadioGroup, Radio, cn } from "@heroui/react";
import { useState, useEffect } from "react";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import { useBusinessLocations, useConnectBusinessLocation, useSyncBusinessProfiles, useSearchGooglePlaces } from "../../../hooks/integrations/useGoogleBusiness";

export default function GoogleBusinessLocationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { data, isLoading, isError } = useBusinessLocations();
  const { mutateAsync: syncProfiles, isPending: isSyncing } = useSyncBusinessProfiles();
  const { mutateAsync: connectLocation, isPending: isConnecting } = useConnectBusinessLocation();
  const { mutateAsync: searchPlaces, isPending: isSearching } = useSearchGooglePlaces();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[] | null>(null);

  const locations = searchResults !== null ? searchResults : (data?.locations || []);

  useEffect(() => {
    if (data?.locations && data.locations.length > 0 && searchResults === null) {
      const connected = data.locations.find((l: any) => l.isConnected);
      if (connected) {
        setSelectedId(connected.locationId);
      }
    }
  }, [data?.locations, searchResults]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      const res = await searchPlaces(searchQuery.trim());
      const foundLocations = res?.locations || [];
      setSearchResults(foundLocations);
      if (foundLocations.length > 0) {
        setSelectedId(foundLocations[0].locationId);
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
      await connectLocation(selectedId);
      addToast({
        title: "Success",
        description: "Business location connected successfully.",
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
      setSearchResults(null);
      setSearchQuery("");
      await syncProfiles();
      addToast({
        title: "Success",
        description: "Business profiles refreshed successfully.",
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
            Search and choose the exact business profile you want to connect to your account.
          </p>
        </ModalHeader>
        <ModalBody className="py-4 space-y-4">
          {/* Search Form */}
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
              isLoading={isSearching}
              isDisabled={!searchQuery.trim() || isSearching}
            >
              Search
            </Button>
          </form>

          {isLoading || isSyncing || isSearching ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Spinner size="lg" />
              <p className="text-sm text-default-500">
                {isSearching ? "Searching Google Places..." : "Fetching business locations..."}
              </p>
            </div>
          ) : isError ? (
            <div className="text-center py-8">
              <p className="text-danger text-sm">Failed to load locations. Please try again.</p>
              <Button size="sm" variant="flat" color="primary" className="mt-3" onClick={handleSync}>
                Retry Sync
              </Button>
            </div>
          ) : locations.length === 0 ? (
            <div className="text-center py-8 bg-default-50 rounded-lg border border-dashed border-default-200">
              <p className="text-sm text-default-600 font-medium mb-1">
                {searchResults !== null ? "No matching locations found for your search." : "Enter your business location above to search."}
              </p>
              <p className="text-xs text-default-400 max-w-xs mx-auto">
                Type your exact practice name, city, or address in the search box above to find and connect your location.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <p className="text-xs font-semibold text-default-600">
                  {searchResults !== null ? `Search Results (${locations.length} Found)` : `${locations.length} Location(s) Available`}
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
                  wrapper: "flex flex-col gap-3 max-h-[360px] overflow-y-auto overflow-x-hidden pr-1 w-full min-w-full",
                }}
              >
                {locations.map((loc: any) => (
                  <Radio
                    key={loc.locationId}
                    value={loc.locationId}
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
                        <HiOutlineOfficeBuilding className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-bold text-foreground truncate">{loc.name}</span>
                        <span className="text-xs text-default-500 line-clamp-1">{loc.address || "Google Places Location"}</span>
                        <span className="text-[10px] text-primary font-semibold uppercase mt-0.5">
                          {loc.primaryCategory || "Places Profile"}
                        </span>
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
            isDisabled={!selectedId || isSyncing || isSearching}
          >
            Connect Selected
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
