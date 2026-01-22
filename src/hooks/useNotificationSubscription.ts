import { addToast } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import {
  useNotifications,
  useUpdateNotifications,
} from "./settings/useNotification";
import { urlBase64ToUint8Array, getBrowserId } from "../utils/notifications";
import {
  UpdateNotificationPayload,
  NotificationItem,
} from "../types/notification";

export const useNotificationSubscription = () => {
  const { data: settings, refetch } = useNotifications();
  const updateMutation = useUpdateNotifications();
  const [permissionStatus, setPermissionStatus] = useState<
    NotificationPermission | "unknown"
  >("unknown");

  useEffect(() => {
    if ("Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const subscribeToPush = useCallback(async () => {
    try {
      if (!("serviceWorker" in navigator)) return null;
      if (!settings?.vapidPublicKey) {
        console.error("No VAPID public key found");
        return null;
      }

      let registration = await navigator.serviceWorker.getRegistration(
        "/referral-retrieve/",
      );
      if (!registration) {
        registration = await navigator.serviceWorker.register(
          "/referral-retrieve/sw.js",
          {
            scope: "/referral-retrieve/",
          },
        );
      }

      await navigator.serviceWorker.ready;

      if (!registration.active) {
        await new Promise<void>((resolve) => {
          const worker = registration.installing || registration.waiting;
          if (worker) {
            worker.addEventListener("statechange", (e: any) => {
              if (e.target.state === "activated") resolve();
            });
          } else {
            resolve();
          }
        });
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(settings.vapidPublicKey),
      });

      return JSON.parse(JSON.stringify(subscription));
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error);
      return null;
    }
  }, [settings?.vapidPublicKey]);

  const requestPermission = useCallback(
    async (
      currentRules?: Omit<NotificationItem, "_id">[],
      currentGlobalEnabled?: boolean,
    ) => {
      if (!("Notification" in window)) {
        addToast({
          title: "Not Supported",
          description: "This browser does not support desktop notifications.",
          color: "danger",
        });
        return;
      }

      try {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);

        if (permission === "granted" && settings?._id) {
          const browserSubscription = await subscribeToPush();
          if (browserSubscription) {
            // Use provided rules/globalEnabled or fall back to fetched settings
            const notifications =
              currentRules ||
              settings.notifications.map((n) => ({
                label: n.label,
                enabled: n.enabled,
                push: n.push,
                email: n.email,
                sms: n.sms,
                inApp: n.inApp,
                activeHours: n.activeHours,
              }));

            const globalEnabled =
              currentGlobalEnabled !== undefined
                ? currentGlobalEnabled
                : settings.globalEnabled;

            const payload: UpdateNotificationPayload = {
              globalEnabled,
              notifications,
              browser: {
                browserId: getBrowserId(),
                endpoint: browserSubscription.endpoint,
                p256dh: browserSubscription.keys?.p256dh,
                auth: browserSubscription.keys?.auth,
              },
            };

            updateMutation.mutate(
              { id: settings._id, payload },
              {
                onSuccess: () => {
                  refetch();
                },
              },
            );
          }
        }
        return permission;
      } catch (error) {
        console.error("Error requesting notification permission:", error);
        return "default" as NotificationPermission;
      }
    },
    [settings, subscribeToPush, updateMutation, refetch],
  );

  return {
    permissionStatus,
    requestPermission,
    subscribeToPush,
    settings,
    isUpdating: updateMutation.isPending,
  };
};
