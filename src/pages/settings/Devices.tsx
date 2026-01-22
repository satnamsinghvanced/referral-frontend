import { Card, CardBody, CardHeader, Switch } from "@heroui/react";
import clsx from "clsx";
import dayjs from "dayjs";
import React from "react";
import { BiDevices } from "react-icons/bi";
import { FiMonitor, FiSmartphone } from "react-icons/fi";
import EmptyState from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";
import { useDevices, useToggleDevice } from "../../hooks/settings/useDevice";

const Devices: React.FC = () => {
  const { data: devices, isLoading } = useDevices();
  const { mutate: toggleDevice, isPending: isToggling } = useToggleDevice();

  const getDeviceIcon = (os?: string) => {
    const mobileKeywords = ["ios", "android", "iphone", "mobile"];
    const lowercaseOS = os?.toLowerCase() || "";
    if (mobileKeywords.some((keyword) => lowercaseOS.includes(keyword))) {
      return <FiSmartphone className="size-5" />;
    }
    return <FiMonitor className="size-5" />;
  };

  console.log(devices);

  if (isLoading) {
    return (
      <Card className="rounded-xl shadow-none border border-foreground/10 bg-background h-[200px] flex items-center justify-center">
        <LoadingState />
      </Card>
    );
  }

  return (
    <Card className="rounded-xl shadow-none border border-foreground/10 bg-background">
      <CardHeader className="flex items-center gap-2 px-4 pt-4 pb-1">
        <BiDevices className="size-5" />
        <h4 className="text-base font-medium">Connected Devices</h4>
      </CardHeader>

      <CardBody className="p-4 space-y-4">
        {devices && devices.length > 0 ? (
          devices.map((device) => (
            <div
              key={device._id}
              className="flex items-center justify-between p-4 border border-foreground/10 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-foreground/5 rounded-lg text-foreground/60 leading-none">
                  {getDeviceIcon(device.os)}
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm leading-tight mb-1.5">
                    {device.deviceName ||
                      `${device.browser} on ${device.os || "Unknown OS"}`}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {device.browser} {device.browserVersion}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Last seen:{" "}
                    {dayjs(device.lastSeen).format("M/D/YYYY, h:mm:ss A")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      "inline-flex items-center justify-center rounded-md px-2 py-1 text-[11px] font-medium w-fit whitespace-nowrap shrink-0",
                      device.isActive
                        ? "bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
                    )}
                  >
                    {device.isActive ? "Enabled" : "Disabled"}
                  </span>
                  <Switch
                    size="sm"
                    isSelected={device.isActive}
                    onValueChange={(isSelected) =>
                      toggleDevice({ id: device._id, toggle: isSelected })
                    }
                    disabled={isToggling}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState title="No connected devices found." />
        )}
      </CardBody>
    </Card>
  );
};

export default Devices;
