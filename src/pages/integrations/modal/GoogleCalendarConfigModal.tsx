import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { FiExternalLink } from "react-icons/fi";
import {
  useConnectCalendar,
  useDisconnectCalendar,
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
  existingConfig: ICalendarIntegration;
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

  // Determine global loading state
  const isGlobalLoading = isLoading;

  // Determine submitting state
  const isSubmitting = isConnecting || isDisconnecting;

  useEffect(() => {
    if (!isOpen) {
      // Reset any local state if needed
    }
  }, [isOpen]);

  const handleConnect = () => {
    connectCalendar();
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
      size="md"
      placement="center"
    >
      <ModalContent>
        {/* Modal Header */}
        <ModalHeader className="p-4 pb-0 flex-col">
          <h2 className="leading-none font-medium text-base text-foreground">
            Google Calendar Integration
          </h2>
          <p className="text-xs text-gray-600 dark:text-foreground/60 mt-2 font-normal">
            Connect your Google Calendar to sync appointments and manage
            availability.
          </p>
        </ModalHeader>

        {/* Modal Body */}
        <ModalBody className="px-4 py-4">
          <div className="space-y-4">
            {/* Connection Status */}
            {isConnected && existingConfig && (
              <div className="p-3 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 text-xs rounded-lg border border-green-200 dark:border-green-500/30">
                <div className="space-y-2">
                  <p className="font-medium">
                    ✅ Google Calendar is connected and synchronized.
                  </p>
                  {existingConfig.calendarId && (
                    <p className="text-[11px]">
                      <span className="font-medium">Calendar ID:</span>{" "}
                      {existingConfig.calendarId}
                    </p>
                  )}
                  {existingConfig.lastSyncAt && (
                    <p className="text-[11px]">
                      <span className="font-medium">Last Sync:</span>{" "}
                      {new Date(existingConfig.lastSyncAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            {!isConnected && (
              <>
                {/* Helper Information Box */}
                <div className="text-sm text-gray-700 dark:text-foreground/80 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-200 dark:border-blue-500/30">
                  <div className="flex items-start gap-3">
                    <div>
                      <p className="font-semibold mb-1.5 text-gray-900 dark:text-foreground">
                        Setup Instructions:
                      </p>
                      <ul className="text-xs space-y-1 ml-1 text-gray-700 dark:text-foreground/70 list-disc list-inside">
                        <li>
                          Click "Connect Calendar" to authorize access to your
                          Google Calendar.
                        </li>
                        <li>
                          You'll be redirected to Google to grant permissions.
                        </li>
                        <li>
                          After authorization, your calendar will be synced
                          automatically.
                        </li>
                        <li>
                          Marketing activities will be added to your calendar.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Google Cloud Console Link */}
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
              </>
            )}

            {/* Status Messages */}
            {existingConfig?.status === "Disconnected" && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-400 text-xs rounded-lg border border-yellow-200 dark:border-yellow-500/30">
                ℹ️ Google Calendar is disconnected. Click "Connect Calendar" to
                reconnect.
              </div>
            )}
            {existingConfig?.status === "Error" && (
              <div className="p-3 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 text-xs rounded-lg border border-red-200 dark:border-red-500/30">
                ⚠️ Connection failed. Please try reconnecting your calendar.
              </div>
            )}
          </div>
        </ModalBody>

        {/* Modal Footer */}
        <ModalFooter className="flex justify-end gap-2 px-4 pb-4 pt-0">
          <Button
            size="sm"
            variant="ghost"
            color="default"
            onPress={onClose}
            className="border-small"
            isDisabled={isSubmitting}
          >
            Close
          </Button>
          {isConnected ? (
            <Button
              size="sm"
              variant="solid"
              color="danger"
              onPress={handleDisconnect}
              isLoading={isDisconnecting}
              isDisabled={isSubmitting}
            >
              Disconnect Calendar
            </Button>
          ) : (
            <Button
              size="sm"
              variant="solid"
              color="primary"
              onPress={handleConnect}
              isLoading={isConnecting}
              isDisabled={isSubmitting}
            >
              Connect Calendar
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
