import React from "react";
import { Card, CardHeader, CardBody, Button, Chip } from "@heroui/react";
import {
  FiRefreshCw,
  FiPlay,
  FiClock,
  FiDownload,
  FiSettings,
} from "react-icons/fi";

interface TestItem {
  id: number;
  title: string;
  status: "pending" | "passed" | "failed";
}

const testItems: TestItem[] = [
  { id: 1, title: "Create New Notification", status: "pending" },
  { id: 2, title: "Filter Notifications by Category", status: "pending" },
  { id: 3, title: "Mark Notifications as Read", status: "pending" },
  { id: 4, title: "Delete Notification", status: "pending" },
];

const IntegrationTests: React.FC = () => {
  const handleRunAll = () => {
    // later connect with API using axios/tanstack query
    console.log("Run all tests...");
  };

  const handleReset = () => {
    console.log("Reset tests...");
  };

  return (
    <div className="mx-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base">Integration Test Center</h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Test and validate system integrations and functionality
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="bordered"
            startContent={<FiRefreshCw className="w-4 h-4" />}
            onPress={handleReset}
            size="sm"
            className="border-small"
          >
            Reset Tests
          </Button>
          <Button
            color="primary"
            startContent={<FiPlay className="w-4 h-4" />}
            onPress={handleRunAll}
            size="sm"
          >
            Run All Tests
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card shadow="none" className="border border-foreground/10">
          <CardBody className="text-center py-5">
            <div className="text-2xl font-semibold text-gray-600">11</div>
            <div className="text-xs text-gray-600">Total Tests</div>
          </CardBody>
        </Card>
        <Card shadow="none" className="border border-foreground/10">
          <CardBody className="text-center py-5">
            <div className="text-2xl font-semibold text-green-600">0</div>
            <div className="text-xs text-gray-600">Passed Tests</div>
          </CardBody>
        </Card>
        <Card shadow="none" className="border border-foreground/10">
          <CardBody className="text-center py-5">
            <div className="text-2xl font-semibold text-red-600">0</div>
            <div className="text-xs text-gray-600">Failed Tests</div>
          </CardBody>
        </Card>
        <Card shadow="none" className="border border-foreground/10">
          <CardBody className="text-center py-5">
            <div className="text-2xl font-semibold text-blue-600">0</div>
            <div className="text-xs text-gray-600">Running Tests</div>
          </CardBody>
        </Card>
      </div>

      {/* Notification System Tests */}
      <Card shadow="none" className="border border-foreground/10">
        <CardHeader className="flex justify-between items-center p-4">
          <div>
            <h4 className="leading-none flex items-center gap-2 text-sm">
              Notification System Tests
              <Chip
                size="sm"
                color="default"
                variant="flat"
                className="capitalize"
              >
                idle
              </Chip>
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5">
              Test notification delivery, filtering, and management
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              0/4 passed
            </span>
            <Button
              size="sm"
              color="primary"
              isIconOnly
              startContent={<FiPlay className="w-4 h-4" />}
            />
          </div>
        </CardHeader>
        <CardBody className="space-y-2 p-4">
          {testItems.map((test) => (
            <div
              key={test.id}
              className="flex items-center justify-between p-2.5 border border-foreground/10 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FiClock className="text-gray-400 w-4 h-4" />
                <div className="font-medium text-xs">{test.title}</div>
              </div>
              <Chip
                size="sm"
                variant="flat"
                className="capitalize text-[11px] text-foreground"
              >
                {test.status}
              </Chip>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Test Actions */}
      <Card shadow="none" className="border border-foreground/10">
        <CardHeader className="p-4">
          <h4 className="leading-none flex items-center gap-2 text-sm">
            Test Actions
          </h4>
        </CardHeader>
        <CardBody className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="bordered"
              startContent={<FiDownload className="w-4 h-4" />}
              className="justify-start border-small"
              size="sm"
            >
              Export Test Results
            </Button>
            <Button
              variant="bordered"
              startContent={<FiSettings className="w-4 h-4" />}
              className="justify-start border-small"
              size="sm"
            >
              Configure Test Settings
            </Button>
            <Button
              variant="bordered"
              startContent={<FiRefreshCw className="w-4 h-4" />}
              className="justify-start border-small"
              size="sm"
            >
              Schedule Automated Tests
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default IntegrationTests;
