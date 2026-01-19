// Notifications.tsx
import {
  Button,
  Card,
  CardBody,
  Switch,
  TimeInput,
  addToast,
} from "@heroui/react";
import { Time } from "@internationalized/date";
import React, { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiBell,
  FiCheckCircle,
  FiInfo,
  FiShield,
  FiUsers,
  FiWifi,
  FiXCircle,
  FiZap,
} from "react-icons/fi";
import {
  useNotifications,
  useUpdateNotifications,
} from "../../hooks/settings/useNotification";
import {
  UpdateNotificationPayload,
  NotificationItem,
} from "../../types/notification";
import { LoadingState } from "../../components/common/LoadingState";

type Channels = {
  push: boolean;
  email: boolean;
  sms: boolean;
  inApp: boolean;
};

type Rule = {
  id: string;
  title: string;
  description: string;
  badge?: string;
  enabled: boolean;
  channels: Channels;
  priority: "low" | "medium" | "high";
  activeHoursEnabled: boolean;
  startTime: Time | null;
  endTime: Time | null;
};

const formatTime = (t: Time | null) => {
  if (!t) return "00:00";
  const hour = String((t as any).hour ?? 0).padStart(2, "0");
  const minute = String((t as any).minute ?? 0).padStart(2, "0");
  return `${hour}:${minute}`;
};

const parseTime = (t: string): Time => {
  if (!t) return new Time(9, 0);
  const [hour, minute] = t.split(":").map(Number);
  return new Time(hour || 0, minute || 0);
};

const RULE_CONFIG: Record<
  string,
  {
    title: string;
    description: string;
    badge?: string;
    priority: "low" | "medium" | "high";
  }
> = {
  newPatientReferrals: {
    title: "New Patient Referrals",
    description: "Get notified when new patients are referred to your practice",
    badge: "high",
    priority: "medium",
  },
  urgentReferrals: {
    title: "Urgent Referrals",
    description: "High-priority referrals that need immediate attention",
    badge: "critical",
    priority: "high",
  },
  newReviews: {
    title: "New Reviews",
    description: "Get notified about new patient reviews",
    badge: "medium",
    priority: "low",
  },
};

// Helper to convert VAPID key
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const Notifications: React.FC = () => {
  const [globalEnabled, setGlobalEnabled] = useState<boolean>(true);
  const [permissionStatus, setPermissionStatus] = useState<
    NotificationPermission | "unknown"
  >("unknown");

  const { data: settings, isLoading, refetch } = useNotifications();
  const updateMutation = useUpdateNotifications();

  // Initialize rules with default config
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    if ("Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const subscribeToPush = async () => {
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

      // Wait for the service worker to be ready
      await navigator.serviceWorker.ready;

      // Ensure the registration is active
      if (!registration.active) {
        // Wait for it to become active if it's installing/waiting
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
  };

  useEffect(() => {
    if (settings) {
      setGlobalEnabled(settings.globalEnabled);

      const newRules: Rule[] = Object.entries(RULE_CONFIG).map(
        ([key, config]) => {
          const backendRule = settings.notifications.find(
            (n) => n.label === key,
          );

          // Default values if not found in backend response
          const defaultEnabled = true;
          const defaultChannels = {
            push: true,
            email: true,
            sms: true,
            inApp: true,
          };
          const defaultActiveHours = {
            enabled: false,
            startTime: "09:00",
            endTime: "17:00",
          };

          return {
            id: key,
            ...config,
            enabled: backendRule ? backendRule.enabled : defaultEnabled,
            channels: backendRule
              ? {
                  push: backendRule.push,
                  email: backendRule.email,
                  sms: backendRule.sms,
                  inApp: backendRule.inApp,
                }
              : defaultChannels,
            activeHoursEnabled: backendRule
              ? backendRule.activeHours.enabled
              : defaultActiveHours.enabled,
            startTime: parseTime(
              backendRule
                ? backendRule.activeHours.startTime
                : defaultActiveHours.startTime,
            ),
            endTime: parseTime(
              backendRule
                ? backendRule.activeHours.endTime
                : defaultActiveHours.endTime,
            ),
          };
        },
      );

      setRules(newRules);
    }
  }, [settings]);

  const updateRule = (id: string, patch: Partial<Rule>) =>
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const updateChannel = (id: string, channel: keyof Channels, value: boolean) =>
    setRules((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, channels: { ...r.channels, [channel]: value } }
          : r,
      ),
    );

  const handleChannelChange = async (
    id: string,
    channel: keyof Channels,
    value: boolean,
  ) => {
    if (channel === "push" && value === true) {
      if ("Notification" in window && Notification.permission !== "granted") {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
        if (permission !== "granted") {
          addToast({
            title: "Permission Denied",
            description:
              "Please allow notifications in your browser settings to enable push notifications.",
            color: "danger",
          });
          return;
        }
      }
    }
    updateChannel(id, channel, value);
  };

  const handleTimeChange = (
    id: string,
    which: "startTime" | "endTime",
    val: any,
  ) => {
    updateRule(id, { [which]: val } as Partial<Rule>);
  };

  const handleSave = async () => {
    if (!settings?._id) return;

    let browserSubscription = null;
    const isPushEnabled = rules.some((r) => r.channels.push);

    if (isPushEnabled && Notification.permission === "granted") {
      browserSubscription = await subscribeToPush();
    }

    const payload: UpdateNotificationPayload = {
      globalEnabled,
      notifications: rules.map((r) => ({
        label: r.id,
        enabled: r.enabled,
        push: r.channels.push,
        email: r.channels.email,
        sms: r.channels.sms,
        inApp: r.channels.inApp,
        activeHours: {
          enabled: r.activeHoursEnabled,
          startTime: formatTime(r.startTime),
          endTime: formatTime(r.endTime),
        },
      })),
      ...(browserSubscription && {
        browser: {
          endpoint: browserSubscription.endpoint,
          p256dh: browserSubscription.keys?.p256dh,
          auth: browserSubscription.keys?.auth,
          status: "Connected",
        },
      }),
    };

    updateMutation.mutate(
      { id: settings._id, payload },
      {
        onSuccess: () => {
          addToast({
            title: "Settings Saved",
            description: "Your notification preferences have been updated.",
            color: "success",
          });
          refetch();
        },
      },
    );
  };

  // When global is turned off, disable all rules & channels
  // When global setting changes
  useEffect(() => {
    if (!globalEnabled) {
      // Turn everything OFF
      setRules((prev) =>
        prev.map((r) => ({
          ...r,
          enabled: false,
          channels: { push: false, email: false, sms: false, inApp: false },
        })),
      );
    } else {
      // Turn everything ON
      setRules((prev) =>
        prev.map((r) => ({
          ...r,
          enabled: true,
          channels: { push: true, email: true, sms: true, inApp: true },
        })),
      );
    }
  }, [globalEnabled]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="">
      <div className="mb-6 space-y-4 md:space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base">Notification Settings</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Customize how and when you receive notifications
            </p>
          </div>
          <div>
            <Button
              size="sm"
              className="bg-primary-500 text-background flex items-center gap-2"
              onClick={handleSave}
              isLoading={updateMutation.isPending}
            >
              <FiCheckCircle fontSize={16} />
              Save Settings
            </Button>
          </div>
        </div>

        {/* <p>{counter}</p> */}
        {/* Tabs */}
        {/* Tabs removed, direct content */}
        <div className="space-y-4">
          {/* Global */}
          <Card className="shadow-none bg-background">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="leading-none flex items-center gap-2 text-sm">
                    <FiBell className="h-5 w-5" />
                    Global Notification Settings
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5">
                    Turn off to disable all notifications system-wide
                  </p>
                </div>

                <Switch
                  size="sm"
                  isSelected={globalEnabled}
                  onValueChange={(value) => {
                    setGlobalEnabled(value);
                  }}
                  aria-label="Global Notification"
                />
              </div>
            </CardBody>
          </Card>

          {/* Browser Permission Status */}
          <Card className="shadow-none bg-background">
            <CardBody className="p-4">
              <div className="flex flex-col gap-4">
                {/* Visual Header */}
                <div className="flex items-center justify-between">
                  <h4 className="leading-none flex items-center gap-2 text-sm">
                    <FiBell className="h-5 w-5" />
                    Browser Permission Status
                  </h4>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-foreground/10 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[10px] font-medium text-gray-600 dark:text-gray-300">
                    <FiWifi className="size-3" />
                    <span>Connected</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
                  <div className="flex items-center gap-3">
                    {permissionStatus === "denied" ? (
                      <div className="size-8 rounded-full border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 dark:text-red-400 shrink-0">
                        <FiXCircle className="size-5" />
                      </div>
                    ) : permissionStatus === "granted" ? (
                      <div className="size-8 rounded-full border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500 dark:text-green-400 shrink-0">
                        <FiCheckCircle className="size-5" />
                      </div>
                    ) : (
                      <div className="size-8 rounded-full border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 dark:text-orange-400 shrink-0">
                        <FiAlertCircle className="size-5" />
                      </div>
                    )}

                    <div>
                      <p className="font-medium text-sm">Browser Permission</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Current status:{" "}
                        <span
                          className={`font-medium ${
                            permissionStatus === "denied"
                              ? "text-red-500 dark:text-red-400"
                              : permissionStatus === "granted"
                                ? "text-green-500 dark:text-green-400"
                                : "text-orange-500 dark:text-orange-400"
                          }`}
                        >
                          {permissionStatus === "granted"
                            ? "Allowed"
                            : permissionStatus === "denied"
                              ? "Denied"
                              : "Default"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {permissionStatus !== "granted" && (
                    <div className="flex items-center gap-3 p-3 bg-cyan-50/50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-800 rounded-lg text-xs text-gray-600 dark:text-gray-400 w-full md:max-w-md">
                      <div className="size-auto shrink-0 text-cyan-600 dark:text-cyan-400">
                        <FiInfo className="size-4" />
                      </div>
                      <p className="leading-relaxed">
                        {permissionStatus === "denied"
                          ? "Notifications are blocked. Click the lock icon in your address bar to enable them."
                          : "Notifications are not yet enabled. We will ask for permission when you enable a rule."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          {rules.map((rule) => {
            return (
              <Card
                key={`${rule.id}__${rule.enabled}`}
                className={`shadow-none bg-background ${
                  !globalEnabled && rule.enabled
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
              >
                <CardBody className="p-4 space-y-4 md:space-y-5">
                  <div className="space-y-4 md:space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-foreground/10 dark:bg-foreground/20 rounded-lg">
                          <FiUsers className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="leading-none flex items-center gap-2 text-sm">
                            {rule.title}
                            {/* <p>{counter}</p> */}
                            {/* {rule.badge && (
                              <span
                                className={`inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 ${
                                  rule.badge === "critical"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-orange-100 text-orange-800"
                                }`}
                              >
                                {rule.badge}
                              </span>
                            )} */}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5">
                            {rule.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* <Button
                          size="sm"
                          className="border bg-background  text-foreground font-semibold gap-2"
                          onPress={() => {}}
                          disabled={!globalEnabled || !rule.enabled}
                        >
                          <FiZap className="h-4 w-4" />
                          Test
                        </Button> */}

                        <Switch
                          size="sm"
                          isSelected={rule.enabled}
                          onValueChange={(isSelected: boolean) => {
                            if (isSelected) {
                              updateRule(rule.id, {
                                enabled: true,
                                channels: {
                                  push: true,
                                  email: true,
                                  sms: true,
                                  inApp: true,
                                },
                              });
                            } else {
                              updateRule(rule.id, {
                                enabled: false,
                                channels: {
                                  push: false,
                                  email: false,
                                  sms: false,
                                  inApp: false,
                                },
                              });
                            }
                          }}
                          isDisabled={!globalEnabled}
                          aria-label={rule.title}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 md:space-y-5">
                      <div>
                        <label className="flex items-center gap-2 select-none text-xs font-medium">
                          Notification Channels
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                          {(
                            Object.keys(rule.channels) as (keyof Channels)[]
                          ).map((ch) => (
                            <div
                              className="flex items-center space-x-2"
                              key={ch}
                            >
                              <Switch
                                size="sm"
                                isSelected={rule.channels[ch]}
                                onValueChange={(isSelected) =>
                                  handleChannelChange(rule.id, ch, isSelected)
                                }
                                isDisabled={!globalEnabled || !rule.enabled}
                                aria-label="Notification Channels"
                              />
                              <label className="capitalize text-xs font-medium">
                                {ch === "inApp" ? "In-App" : ch}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Priority Threshold Removed */}

                      <div>
                        <label className="flex items-center gap-2 select-none text-xs font-medium">
                          Active Hours
                        </label>
                        <div className="mt-2 space-y-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              size="sm"
                              isSelected={rule.activeHoursEnabled}
                              onValueChange={(isSelected) =>
                                updateRule(rule.id, {
                                  activeHoursEnabled: isSelected,
                                })
                              }
                              isDisabled={!globalEnabled || !rule.enabled}
                              aria-label="Active Hours"
                            />
                            <label className="text-xs font-medium">
                              Limit to specific hours
                            </label>
                          </div>

                          {rule.activeHoursEnabled && (
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              <div>
                                <label className="flex items-center gap-2 text-xs font-medium">
                                  Start Time
                                </label>
                                <div className="mt-1">
                                  <TimeInput
                                    value={rule.startTime}
                                    onChange={(val: any) =>
                                      handleTimeChange(
                                        rule.id,
                                        "startTime",
                                        val,
                                      )
                                    }
                                    radius="sm"
                                    classNames={{
                                      inputWrapper: "min-h-8 h-8",
                                      input: "font-medium",
                                    }}
                                    isDisabled={!globalEnabled || !rule.enabled}
                                    aria-label="Start Time"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="flex items-center gap-2 text-xs font-medium">
                                  End Time
                                </label>
                                <div className="mt-1">
                                  <TimeInput
                                    value={rule.endTime}
                                    onChange={(val: any) =>
                                      handleTimeChange(rule.id, "endTime", val)
                                    }
                                    radius="sm"
                                    classNames={{
                                      inputWrapper: "min-h-8 h-8",
                                      input: "font-medium",
                                    }}
                                    isDisabled={!globalEnabled || !rule.enabled}
                                    aria-label="End Time"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}

          {/* Security & Privacy */}
          <Card className="shadow-none bg-background">
            <CardBody className="p-4">
              <div className="space-y-4">
                <h4 className="leading-none flex items-center gap-2 text-sm">
                  <FiShield className="h-5 w-5" />
                  Security & Privacy
                </h4>

                <div className="p-3 bg-cyan-50/50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-800 rounded-lg">
                  <div className="flex gap-2">
                    <div className="shrink-0 text-cyan-600 dark:text-cyan-400 mt-0.5">
                      <FiInfo className="size-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Privacy Note:
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        Push notifications are sent directly from our secure
                        servers to your browser. We never store personal
                        information in notification payloads and all
                        communications are encrypted.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold mb-2">
                      What we collect:
                    </p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5 list-disc pl-4 marker:text-gray-400">
                      <li>Device registration tokens</li>
                      <li>Notification preferences</li>
                      <li>Delivery status</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-2">
                      What we don't collect:
                    </p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5 list-disc pl-4 marker:text-gray-400">
                      <li>Personal browsing data</li>
                      <li>Device location</li>
                      <li>Third-party app data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
