// Notifications.tsx
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Tab,
  Tabs,
  Switch,
  TimeInput,
  Select,
  SelectItem,
} from "@heroui/react";
import { Time } from "@internationalized/date";
import {
  FiCheckCircle,
  FiBell,
  FiUsers,
  FiZap,
  FiSmartphone,
  FiMail,
  FiMessageCircle,
  FiClock,
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

const TAB_ITEMS = [
  { id: "notification-rules", label: "Notification Rules" },
  { id: "channels", label: "Channels" },
  { id: "schedule", label: "Schedule" },
];

const formatTime = (t: Time | null) => {
  if (!t) return null;
  const hour = String((t as any).hour ?? 0).padStart(2, "0");
  const minute = String((t as any).minute ?? 0).padStart(2, "0");
  return `${hour}:${minute}`;
};

const Notifications: React.FC = () => {
  const [globalEnabled, setGlobalEnabled] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(0);

  const [rules, setRules] = useState<Rule[]>([
    {
      id: "new-patient-referrals",
      title: "New Patient Referrals",
      description:
        "Get notified when new patients are referred to your practice",
      badge: "high",
      enabled: true,
      channels: { push: true, email: true, sms: false, inApp: true },
      priority: "medium",
      activeHoursEnabled: true,
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
    console.log("Prepared payload for backend:", payload);
    // axios.post('/api/notifications/settings', payload)...
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

  console.log(globalEnabled, "fdhsjkf");

  return (
    <div className="mx-10">
      <div className="mb-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg">Notification Settings</h1>
            <p className="text-xs text-gray-600 mt-1">
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

        <p>{counter}</p>
        {/* Tabs */}
        <Tabs
          aria-label="Notification tabs"
          radius="full"
          items={TAB_ITEMS}
          classNames={{
            base: "w-full",
            tabList: "w-full bg-primary-50",
            tab: "text-xs font-medium",
            panel: "py-0",
          }}
          key={`globalEnabled__${globalEnabled}`}
          // destroyInactiveTabPanel={false}
        >
          {(item) => (
            <Tab
              key={`globalEnabled__${globalEnabled}__${item.id}`}
              title={item.label}
            >
              {/* Notification Rules */}
              <p>{counter}</p>

              {item.id === "notification-rules" && (
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
                          <p className="text-xs text-gray-600 mt-1.5">
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

                  {rules.map((rule) => {
                    console.log(rule.enabled);
                    return (
                      <Card
                        key={`${rule.id}__${rule.enabled}`}
                        className={`shadow-none ${
                          !globalEnabled && rule.enabled
                            ? "opacity-50 pointer-events-none"
                            : ""
                        }`}
                      >
                        <CardBody className="p-4 space-y-5">
                          <div className="space-y-5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                  <FiUsers className="h-4 w-4" />
                                </div>
                                <div>
                                  <h4 className="leading-none flex items-center gap-2 text-sm">
                                    {rule.title}
                                    <p>{counter}</p>
                                    {rule.badge && (
                                      <span
                                        className={`inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 ${
                                          rule.badge === "critical"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-orange-100 text-orange-800"
                                        }`}
                                      >
                                        {rule.badge}
                                      </span>
                                    )}
                                  </h4>
                                  <p className="text-xs text-gray-600 mt-1.5">
                                    {rule.description}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  className="border bg-background text-foreground font-semibold gap-2"
                                  onClick={() => {
                                    console.log("Test rule:", rule.id);
                                  }}
                                  disabled={!globalEnabled || !rule.enabled}
                                >
                                  <FiZap className="h-4 w-4" />
                                  Test
                                </Button>

                                <Switch
                                  size="sm"
                                  // isSelected={rule.enabled}
                                  onValueChange={(isSelected: boolean) => {
                                    setCounter((prev) => prev + 1)
                                    if (!isSelected) {
                                      updateRule(rule.id, {
                                        enabled: false,
                                        channels: {
                                          push: false,
                                          email: false,
                                          sms: false,
                                          inApp: false,
                                        },
                                      });
                                    } else {
                                      updateRule(rule.id, { enabled: true });
                                    }
                                  }}
                                  isDisabled={!globalEnabled}
                                  aria-label={rule.title}
                                />
                              </div>
                            </div>

                            <div className="space-y-5">
                              <div>
                                <label className="flex items-center gap-2 select-none text-xs font-medium">
                                  Notification Channels
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                  {(
                                    Object.keys(
                                      rule.channels
                                    ) as (keyof Channels)[]
                                  ).map((ch) => (
                                    <div
                                      className="flex items-center space-x-2"
                                      key={ch}
                                    >
                                      <Switch
                                        size="sm"
                                        isSelected={rule.channels[ch]}
                                        onValueChange={(isSelected) =>
                                          updateChannel(rule.id, ch, isSelected)
                                        }
                                        isDisabled={
                                          !globalEnabled || !rule.enabled
                                        }
                                        aria-label="Notification Channels"
                                      />
                                      <label className="capitalize text-xs font-medium">
                                        {ch === "inApp" ? "In-App" : ch}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className="flex items-center gap-2 select-none text-xs font-medium">
                                  Priority Threshold
                                </label>
                                <div className="mt-2">
                                  <Select
                                    size="sm"
                                    selectedKeys={[rule.priority]}
                                    onSelectionChange={(keys) =>
                                      updateRule(rule.id, {
                                        priority: Array.from(
                                          keys
                                        )[0] as Rule["priority"],
                                      })
                                    }
                                    className="w-full"
                                    classNames={{ trigger: "cursor-pointer" }}
                                    isDisabled={!globalEnabled || !rule.enabled}
                                    aria-label="Priority Threshold"
                                  >
                                    <SelectItem key="low">Low</SelectItem>
                                    <SelectItem key="medium">Medium</SelectItem>
                                    <SelectItem key="high">High</SelectItem>
                                  </Select>
                                </div>
                              </div>

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
                                      isDisabled={
                                        !globalEnabled || !rule.enabled
                                      }
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
                                              inputWrapper: "min-h-9 h-9",
                                              input: "font-medium",
                                            }}
                                            isDisabled={
                                              !globalEnabled || !rule.enabled
                                            }
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
                                              handleTimeChange(
                                                rule.id,
                                                "endTime",
                                                val
                                              )
                                            }
                                            radius="sm"
                                            classNames={{
                                              inputWrapper: "min-h-9 h-9",
                                              input: "font-medium",
                                            }}
                                            isDisabled={
                                              !globalEnabled || !rule.enabled
                                            }
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
                </div>
              )}

              {/* Channels tab */}
              {item.id === "channels" && (
                <div className="space-y-4">
                  <Card className="shadow-none">
                    <CardBody>
                      <div className="p-2">
                        <h4 className="leading-none flex items-center gap-2 text-sm">
                          <FiSmartphone className="h-5 w-5" />
                          Push Notifications
                        </h4>

                        <div className="mt-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="flex items-center gap-2 text-xs font-medium">
                                Browser Push Notifications
                              </label>
                              <p className="text-xs text-gray-600 mt-0.5">
                                Receive notifications in your browser
                              </p>
                            </div>
                            <Switch
                              size="sm"
                              isSelected={true} /* optional disabling logic */
                              aria-label="Browser Push Notifications"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <label className="flex items-center gap-2 text-xs font-medium">
                                Mobile Push Notifications
                              </label>
                              <p className="text-xs text-gray-600 mt-0.5">
                                Receive notifications on your mobile device
                              </p>
                            </div>
                            <Switch
                              size="sm"
                              isSelected={true}
                              aria-label="Mobile Push Notifications"
                            />
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <Card className="shadow-none">
                    <CardBody>
                      <div className="p-2">
                        <h4 className="leading-none flex items-center gap-2 text-sm">
                          <FiMail className="h-5 w-5" />
                          Email Notifications
                        </h4>

                        <div className="mt-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="flex items-center gap-2 text-xs font-medium">
                                Instant Email Alerts
                              </label>
                              <p className="text-xs text-gray-600 mt-0.5">
                                Get immediate emails for critical notifications
                              </p>
                            </div>
                            <Switch
                              size="sm"
                              isSelected={true}
                              aria-label="Instant Email Alerts"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <label className="flex items-center gap-2 text-xs font-medium">
                                Daily Summary Email
                              </label>
                              <p className="text-xs text-gray-600 mt-0.5">
                                Receive a daily digest of all notifications
                              </p>
                            </div>
                            <Switch
                              size="sm"
                              isSelected={false}
                              aria-label="Daily Summary Email"
                            />
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <Card className="shadow-none">
                    <CardBody>
                      <div className="p-2">
                        <h4 className="leading-none flex items-center gap-2 text-sm">
                          <FiMessageCircle className="h-5 w-5" />
                          SMS Notifications
                        </h4>

                        <div className="mt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="flex items-center gap-2 text-xs font-medium">
                                Critical Alerts Only
                              </label>
                              <p className="text-xs text-gray-600 mt-0.5">
                                Only send SMS for urgent notifications
                              </p>
                            </div>
                            <Switch
                              size="sm"
                              isSelected={true}
                              aria-label="Critical Alerts Only"
                            />
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              )}

              {/* Schedule tab */}
              {item.id === "schedule" && (
                <Card className="shadow-none">
                  <CardBody>
                    <div className="p-2">
                      <h4 className="leading-none flex items-center gap-2 text-sm">
                        <FiClock className="h-5 w-5" />
                        Quiet Hours
                      </h4>

                      <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="flex items-center gap-2 text-xs font-medium">
                              Enable Quiet Hours
                            </label>
                            <p className="text-xs text-gray-600 mt-0.5">
                              Mute non-critical notifications during specific
                              hours
                            </p>
                          </div>
                          <Switch
                            size="sm"
                            isSelected={true}
                            aria-label="Enable Quiet Hours"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="flex items-center gap-2 text-xs font-medium">
                              Start Time
                            </label>
                            <div className="mt-2">
                              <TimeInput
                                value={new Time(22, 0)}
                                onChange={() => {}}
                                radius="sm"
                                classNames={{
                                  inputWrapper: "min-h-9 h-9",
                                  input: "font-medium",
                                }}
                                aria-label="Quiet Hours Start Time"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="flex items-center gap-2 text-xs font-medium">
                              End Time
                            </label>
                            <div className="mt-2">
                              <TimeInput
                                value={new Time(8, 0)}
                                onChange={() => {}}
                                radius="sm"
                                classNames={{
                                  inputWrapper: "min-h-9 h-9",
                                  input: "font-medium",
                                }}
                                aria-label="Quiet Hours End Time"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}
            </Tab>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Notifications;
