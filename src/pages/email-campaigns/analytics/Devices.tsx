import React from "react";
import { FiMonitor, FiSmartphone, FiTablet, FiBarChart2 } from "react-icons/fi";
import { Card, CardBody, CardHeader, Progress } from "@heroui/react";
import { useAnalyticsDevices } from "../../../hooks/useCampaign";
import { LoadingState } from "../../../components/common/LoadingState";

const Devices: React.FC = () => {
  const { data: deviceData, isLoading } = useAnalyticsDevices();

  const getDeviceIcon = (deviceName: string) => {
    switch (deviceName.toLowerCase()) {
      case "desktop":
        return FiMonitor;
      case "mobile":
        return FiSmartphone;
      case "tablet":
        return FiTablet;
      default:
        return FiBarChart2;
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingState />
      </div>
    );
  }

  const metrics = deviceData?.devicePerformance || [];

  return (
    <Card
      shadow="none"
      className="bg-background border border-foreground/10 p-5"
    >
      <CardHeader className="p-0 pb-5 flex items-center gap-2">
        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
        <h4 className="text-sm font-medium">Device Performance</h4>
      </CardHeader>

      <CardBody className="p-0 space-y-3">
        {metrics.map((metric) => {
          const Icon = getDeviceIcon(metric.device);

          return (
            <div
              className="bg-content1 border border-foreground/10 p-3 flex items-center gap-2 rounded-lg"
              key={metric.device}
            >
              <div className="flex items-center space-x-2.5 flex-grow">
                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg shrink-0">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>

                <div className="flex-grow space-y-0.5">
                  <h5 className="text-sm font-medium">{metric.device}</h5>
                  <p className="text-xs text-gray-500 dark:text-foreground/60 flex items-center gap-2">
                    <span className="text-green-600 dark:text-green-400">
                      {metric.opens || 0} opens
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">
                      {metric.clicks || 0} clicks
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-1 min-w-[100px]">
                <span className="font-medium text-gray-600 dark:text-foreground/50 text-xs">
                  {metric.percentage}%
                </span>
                <Progress
                  size="sm"
                  radius="sm"
                  aria-label={metric.device}
                  value={metric.percentage}
                  classNames={{ track: "h-2" }}
                />
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
};

export default Devices;
