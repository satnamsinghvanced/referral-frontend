// Notifications.tsx
import { Button, Card, CardBody, Switch, TimeInput } from "@heroui/react";
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
  if (!t) return null;
  const hour = String((t as any).hour ?? 0).padStart(2, "0");
  const minute = String((t as any).minute ?? 0).padStart(2, "0");
  return `${hour}:${minute}`;
};

const Notifications: React.FC = () => {
  const [globalEnabled, setGlobalEnabled] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(0);
  const [permissionStatus, setPermissionStatus] = useState<
    NotificationPermission | "unknown"
  >("unknown");

  useEffect(() => {
    // Check initial permission
    if ("Notification" in window) {
      const status = Notification.permission;
      setPermissionStatus(status);
      if (status === "denied") {
        // User requested not to disable push notifications automatically
      }
    }

    // Monitor permission changes if supported
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "notifications" })
        .then((permissionStatus) => {
          permissionStatus.onchange = () => {
            setPermissionStatus(Notification.permission);
          };
        });
    }
  }, []);

  const [rules, setRules] = useState<Rule[]>([
    {
      id: "new-patient-referrals",
      title: "New Patient Referrals",
      description:
        "Get notified when new patients are referred to your practice",
      badge: "high",
      enabled: true,
      channels: { push: true, email: true, sms: true, inApp: true },
      priority: "medium",
      activeHoursEnabled: false,
      startTime: new Time(8, 0),
      endTime: new Time(18, 0),
    },
    {
      id: "urgent-referrals",
      title: "Urgent Referrals",
      description: "High-priority referrals that need immediate attention",
      badge: "critical",
      enabled: true,
      channels: { push: true, email: true, sms: true, inApp: true },
      priority: "high",
      activeHoursEnabled: false,
      startTime: new Time(8, 0),
      endTime: new Time(18, 0),
    },
    {
      id: "new-reviews",
      title: "New Reviews",
      description: "Get notified about new patient reviews",
      badge: "medium",
      enabled: true,
      channels: { push: true, email: true, sms: true, inApp: true },
      priority: "low",
      activeHoursEnabled: false,
      startTime: new Time(9, 0),
      endTime: new Time(17, 0),
    },
    // {
    //   id: "missed-calls",
    //   title: "Missed Calls",
    //   description: "Alert when potential patients call but don't reach anyone",
    //   badge: "high",
    //   enabled: true,
    //   channels: { push: true, email: true, sms: true, inApp: true },
    //   priority: "medium",
    //   activeHoursEnabled: false,
    //   startTime: new Time(9, 0),
    //   endTime: new Time(17, 0),
    // },
  ]);

  const updateRule = (id: string, patch: Partial<Rule>) =>
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const updateChannel = (id: string, channel: keyof Channels, value: boolean) =>
    setRules((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, channels: { ...r.channels, [channel]: value } }
          : r
      )
    );

  const handleChannelChange = async (
    id: string,
    channel: keyof Channels,
    value: boolean
  ) => {
    if (channel === "push" && value === true) {
      if ("Notification" in window && Notification.permission !== "granted") {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
      }
    }
    updateChannel(id, channel, value);
  };

  const handleTimeChange = (
    id: string,
    which: "startTime" | "endTime",
    val: any
  ) => {
    updateRule(id, { [which]: val } as Partial<Rule>);
  };

  const handleSave = () => {
    const payload = {
      globalEnabled,
      rules: rules.map((r) => ({
        id: r.id,
        enabled: r.enabled,
        channels: r.channels,
        priority: r.priority,
        activeHoursEnabled: r.activeHoursEnabled,
        startTime: formatTime(r.startTime),
        endTime: formatTime(r.endTime),
      })),
    };
  };

  // When global is turned off, disable all rules & channels
  useEffect(() => {
    if (!globalEnabled) {
      setRules((prev) =>
        prev.map((r) => ({
          ...r,
          enabled: false,
          channels: { push: false, email: false, sms: false, inApp: false },
        }))
      );
    }
  }, [globalEnabled]);

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
          <Card className="shadow-none">
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
                    setCounter(counter + 1);
                    setGlobalEnabled(value);
                  }}
                  aria-label="Global Notification"
                />
              </div>
            </CardBody>
          </Card>

          {/* Browser Permission Status */}
          <Card className="shadow-none">
            <CardBody className="p-4">
              <div className="flex flex-col gap-4">
                {/* Visual Header */}
                <div className="flex items-center justify-between">
                  <h4 className="leading-none flex items-center gap-2 text-sm">
                    <FiBell className="h-5 w-5" />
                    Browser Permission Status
                  </h4>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 bg-gray-50 text-[10px] font-medium text-gray-600">
                    <FiWifi className="size-3" />
                    <span>Connected</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
                  <div className="flex items-center gap-3">
                    {permissionStatus === "denied" ? (
                      <div className="size-8 rounded-full border border-red-200 bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                        <FiXCircle className="size-5" />
                      </div>
                    ) : permissionStatus === "granted" ? (
                      <div className="size-8 rounded-full border border-green-200 bg-green-50 flex items-center justify-center text-green-500 shrink-0">
                        <FiCheckCircle className="size-5" />
                      </div>
                    ) : (
                      <div className="size-8 rounded-full border border-orange-200 bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                        <FiAlertCircle className="size-5" />
                      </div>
                    )}

                    <div>
                      <p className="font-medium text-sm">Browser Permission</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Current status:{" "}
                        <span
                          className={`font-medium ${
                            permissionStatus === "denied"
                              ? "text-red-500"
                              : permissionStatus === "granted"
                              ? "text-green-500"
                              : "text-orange-500"
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
                    <div className="flex items-center gap-3 p-3 bg-cyan-50/50 border border-cyan-100 rounded-lg text-xs text-gray-600 w-full md:max-w-md">
                      <div className="size-auto shrink-0 text-cyan-600">
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
                className={`shadow-none ${
                  !globalEnabled && rule.enabled
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
              >
                <CardBody className="p-4 space-y-4 md:space-y-5">
                  <div className="space-y-4 md:space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-foreground/10 /15 rounded-lg">
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
                                        val
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
          <Card className="shadow-none">
            <CardBody className="p-4">
              <div className="space-y-4">
                <h4 className="leading-none flex items-center gap-2 text-sm">
                  <FiShield className="h-5 w-5" />
                  Security & Privacy
                </h4>

                <div className="p-3 bg-cyan-50/50 border border-cyan-100 rounded-lg">
                  <div className="flex gap-2">
                    <div className="shrink-0 text-cyan-600 mt-0.5">
                      <FiInfo className="size-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-gray-700">
                        Privacy Note:
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
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
                    <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4 marker:text-gray-400">
                      <li>Device registration tokens</li>
                      <li>Notification preferences</li>
                      <li>Delivery status</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-2">
                      What we don't collect:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4 marker:text-gray-400">
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
