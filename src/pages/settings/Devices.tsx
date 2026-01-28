import { Card, CardBody, CardHeader, Switch } from "@heroui/react";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { useState } from "react";
import { BiDevices } from "react-icons/bi";
import { FiMonitor, FiSmartphone } from "react-icons/fi";
import EmptyState from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";
import Pagination from "../../components/common/Pagination";
import { EVEN_PAGINATION_LIMIT } from "../../consts/consts";
import { useDevices, useToggleDevice } from "../../hooks/settings/useDevice";
import { Device } from "../../types/device";

const Devices: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = EVEN_PAGINATION_LIMIT;

  const { data: devices, isLoading } = useDevices({ page, limit });
  const { mutate: toggleDevice, isPending: isToggling } = useToggleDevice();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getDeviceIcon = (deviceType?: string) => {
    if (deviceType === "mobile" || deviceType === "tablet") {
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

      <CardBody className="p-4 space-y-3">
        {devices?.data && devices.data.length > 0 ? (
          devices.data.map((device: Device) => (
            <div
              key={device._id}
              className={`md:flex md:items-center md:justify-between p-3 md:p-3.5 border border-foreground/10 rounded-xl max-md:space-y-3.5 ${device.isCurrentDevice ? "order-first" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-foreground/5 rounded-lg text-foreground/60 leading-none">
                  {getDeviceIcon(device.deviceType)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="font-medium text-sm leading-tight">
                      {device.deviceName ||
                        `${device.browser} on ${device.os || "Unknown OS"}`}
                    </p>
                    {device.isCurrentDevice && (
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-1.5 py-1 rounded text-[11px] font-medium leading-none">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {device.browser} {device.browserVersion} • {device.os}
                  </p>
                  <p className="text-xs text-gray-400">
                    Last seen:{" "}
                    {dayjs(device.lastSeen).format("M/D/YYYY, h:mm:ss A")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 max-md:gap-3">
                <div className="flex items-center gap-2 max-md:w-full max-md:justify-between">
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

        {devices && devices.totalPages > 1 && (
          <div className="pt-2">
            <Pagination
              identifier="devices"
              limit={limit}
              totalItems={devices.totalData}
              currentPage={page}
              totalPages={devices.totalPages}
              handlePageChange={handlePageChange}
            />
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default Devices;
