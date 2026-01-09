import React from "react";
import { FiMonitor, FiSmartphone, FiTablet, FiBarChart2 } from "react-icons/fi";
import clsx from "clsx";
import { Card, CardBody, CardHeader, Progress } from "@heroui/react";

// --- 1. TypeScript Interfaces ---
interface DeviceMetric {
  name: string;
  opens: number;
  clicks: number;
  percentage: number;
  icon: React.ElementType;
}

// --- 2. Dummy Data (Mock API Response) ---
const mockDeviceMetrics: DeviceMetric[] = [
  {
    name: "Desktop",
    opens: 1200,
    clicks: 380,
    percentage: 45,
    icon: FiMonitor,
  },
  {
    name: "Mobile",
    opens: 1100,
    clicks: 290,
    percentage: 40,
    icon: FiSmartphone,
  },
  {
    name: "Tablet",
    opens: 400,
    clicks: 85,
    percentage: 15,
    icon: FiTablet,
  },
];

const Devices: React.FC = () => {
  return (
    <Card shadow="none" className="border border-primary/15 p-5">
      <CardHeader className="p-0 pb-5 flex items-center gap-2">
        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
        <h4 className="text-sm font-medium">Device Performance</h4>
      </CardHeader>

      <CardBody className="p-0 space-y-3">
        {mockDeviceMetrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              className="bg-background border border-primary/15 p-3 flex items-center gap-2 rounded-lg"
              key={metric.name}
            >
              <div className="flex items-center space-x-2.5 flex-grow">
                <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>

                <div className="flex-grow space-y-0.5">
                  <h5 className="text-sm font-medium">{metric.name}</h5>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="text-green-600">{metric.opens} opens</span>
                    <span className="text-blue-600">
                      {metric.clicks} clicks
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-1 min-w-[100px]">
                <span className="font-medium text-gray-600 text-xs">
                  {metric.percentage}%
                </span>
                <Progress
                  size="sm"
                  radius="sm"
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
