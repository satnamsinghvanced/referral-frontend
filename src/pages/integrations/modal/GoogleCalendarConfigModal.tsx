import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  cn,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { LuCalendar } from "react-icons/lu";
import {
  useConnectCalendar,
  useDisconnectCalendar,
  useSelectCalendarForSync,
  useUserCalendars,
} from "../../../hooks/integrations/useGoogleCalendar";
import { ICalendarIntegration } from "../../../types/integrations/googleCalendar";

export default function GoogleCalendarConfigModal({
  userId,
  isOpen,
  onClose,
  existingConfig,
  isLoading,
  isError,
}: {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  existingConfig: ICalendarIntegration | undefined;
  isLoading: boolean;
  isError: boolean;
}) {
  // Connect (Generate Auth URL) Mutation
  const { mutate: connectCalendar, isPending: isConnecting } =
    useConnectCalendar();

  // Disconnect Mutation
  const { mutate: disconnectCalendar, isPending: isDisconnecting } =
    useDisconnectCalendar();

  // Determine if we are in connected mode
  const isConnected = existingConfig?.status === "Connected";

  const shouldLoadCalendars = Boolean(isOpen && isConnected);
  const {
    data: calendarsData,
    isFetching: isCalendarsLoading,
    refetch: refetchCalendars,
  } = useUserCalendars(shouldLoadCalendars);
  const { mutate: selectCalendar, isPending: isSelectingCalendar } =
    useSelectCalendarForSync();

  const calendars = calendarsData?.calendars || [];
  const selectedCalendarIdFromServer = calendarsData?.selectedCalendarId || null;
  const primaryCalendarId = useMemo(
    () => calendars.find((c) => c.isPrimary)?.id ?? null,
    [calendars],
  );

  const [selectedCalendarIds, setSelectedCalendarIds] = useState<string[]>([]);

  // Determine global loading state
  const isGlobalLoading = isLoading;

  // Determine submitting state
  const isSubmitting =
    isConnecting || isDisconnecting || isSelectingCalendar;

  useEffect(() => {
    if (!isOpen) {
      setSelectedCalendarIds([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isConnected) return;
    const initial =
      selectedCalendarIdFromServer ||
      existingConfig?.calendarId ||
      primaryCalendarId;
    if (initial) {
      setSelectedCalendarIds(initial.split(",").filter(Boolean));
    } else {
      setSelectedCalendarIds([]);
    }
  }, [
    isOpen,
    isConnected,
    selectedCalendarIdFromServer,
    existingConfig?.calendarId,
    primaryCalendarId,
  ]);

  const handleConnect = () => {
    connectCalendar();
  };

  const handleSaveCalendarSelection = () => {
    if (selectedCalendarIds.length === 0) return;
    selectCalendar(
      {
        calendarId: selectedCalendarIds,
      },
      {
        onSuccess: async () => {
          await refetchCalendars();
          addToast({
            title: "Success",
            description: "Calendar selected for sync.",
            color: "success",
          });
        },
      },
    );
  };

  const handleDisconnect = () => {
    if (existingConfig?._id) {
      disconnectCalendar(existingConfig._id, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  // Handle loading state
  if (isGlobalLoading) {
    return (
      <Modal
        isOpen={isOpen}
        onOpenChange={onClose}
        size="md"
        classNames={{ base: `max-sm:!m-3 !m-0`, closeButton: "cursor-pointer" }}
        placement="center"
      >
        <ModalContent className="py-10">
          <div className="flex flex-col items-center justify-center space-y-3">
            <Spinner size="md" />
            <p className="text-gray-600 dark:text-foreground/60">
              Loading configuration...
            </p>
          </div>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      size="lg"
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Select Calendar</h2>
          <p className="text-sm font-normal text-default-500">
            Choose the calendar you want to sync (Primary is recommended).
          </p>
        </ModalHeader>

        <ModalBody>
          {!isConnected ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-700 dark:text-foreground/80 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-200 dark:border-blue-500/30">
                <p className="font-semibold mb-1.5 text-gray-900 dark:text-foreground">
                  Setup Instructions:
                </p>
                <ul className="text-xs space-y-1 ml-1 text-gray-700 dark:text-foreground/70 list-disc list-inside">
                  <li>
                    Click "Connect Calendar" to authorize access to your Google
                    Calendar.
                  </li>
                  <li>You'll be redirected to Google to grant permissions.</li>
                  <li>After authorization, your calendars will appear here.</li>
                </ul>
              </div>

              <div className="text-xs text-gray-600 dark:text-foreground/60 bg-gray-50 dark:bg-default-100/20 p-3 rounded-lg border border-gray-200 dark:border-default-200">
                <p className="mb-2">
                  <span className="font-medium">Note:</span> This integration
                  requires Google Calendar API to be enabled in your Google
                  Cloud Console.
                </p>
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
                >
                  Open Google Cloud Console
                  <FiExternalLink className="h-3 w-3" />
                </a>
              </div>

              {existingConfig?.status === "Error" && (
                <div className="p-3 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 text-xs rounded-lg border border-red-200 dark:border-red-500/30">
                  ⚠️ Connection failed. Please try reconnecting your calendar.
                </div>
              )}
            </div>
          ) : isCalendarsLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Spinner size="lg" />
              <p className="text-sm text-default-500">Fetching your calendars...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-10">
              <p className="text-danger">Failed to load calendars. Please try again.</p>
              <Button
                size="sm"
                variant="flat"
                color="primary"
                className="mt-4"
                onPress={() => refetchCalendars()}
              >
                Retry
              </Button>
            </div>
          ) : calendars.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-default-500">No calendars found in your Google account.</p>
              <Button
                size="sm"
                variant="flat"
                color="primary"
                className="mt-4"
                onPress={() => refetchCalendars()}
              >
                Refresh List
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">{calendars.length} Items Found</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="light"
                    color="primary"
                    onPress={() => refetchCalendars()}
                    isLoading={isCalendarsLoading}
                  >
                    Refresh List
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {calendars
                  .slice()
                  .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
                  .map((c) => {
                    const isSelected = selectedCalendarIds.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedCalendarIds([c.id]);
                        }}
                        className={cn(
                          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                          "max-w-full cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent transition-all",
                          isSelected ? "border-primary" : "border-default-200"
                        )}
                      >
                        <div className="flex gap-3 items-center">
                          <div className="p-2 bg-primary/10 rounded-full text-primary">
                            <LuCalendar className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">
                              {c.name} {c.isPrimary ? "(Primary)" : ""}
                            </span>
                            {c.accessRole && (
                              <span className="text-[10px] text-primary font-medium uppercase mt-1">
                                {c.accessRole}
                              </span>
                            )}
                          </div>
                        </div>
                        <div
                          className={cn(
                            "flex items-center justify-center w-5 h-5 rounded-full border-2",
                            isSelected
                              ? "border-primary text-primary"
                              : "border-default-400"
                          )}
                        >
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={isSubmitting}>
            Cancel
          </Button>
          {!isConnected ? (
            <Button
              color="primary"
              onPress={handleConnect}
              isLoading={isConnecting}
              isDisabled={isSubmitting}
            >
              Connect Calendar
            </Button>
          ) : (
            <>
              <Button
                color="primary"
                onPress={handleSaveCalendarSelection}
                isLoading={isSelectingCalendar}
                isDisabled={
                  isSubmitting ||
                  selectedCalendarIds.length === 0
                }
              >
                Connect Selected
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
