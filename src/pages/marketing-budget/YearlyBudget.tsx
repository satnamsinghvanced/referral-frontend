import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Button,
  Progress,
} from "@heroui/react";

import {
  EnvelopeIcon,
  ShareIcon,
  CalendarIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface BudgetItem {
  id: number;
  title: string;
  category: string;
  description: string;
  dateRange: string;
  budget: number;
  spent: number;
  roi: number;
  status: "completed" | "active";
  priority: "low" | "high";
  icon: React.FC<any>;
  iconBgColor: string;
  iconColor: string;
}

const initialBudgetItems: BudgetItem[] = [
  {
    id: 1,
    title: "Email Platform",
    category: "Email Marketing",
    description: "Annual subscription for email marketing platform",
    dateRange: "Jan 1, 2024 → Dec 31, 2024",
    budget: 1200,
    spent: 400,
    roi: 180,
    status: "completed",
    priority: "low",
    icon: EnvelopeIcon,
    iconBgColor: "rgba(245, 158, 11, 0.125)",
    iconColor: "rgb(245, 158, 11)",
  },
  {
    id: 2,
    title: "Content Creation",
    category: "Social Media Marketing",
    description: "Created for testing",
    dateRange: "Nov 27, 2025 → Dec 30, 2025",
    budget: 12000,
    spent: 1200,
    roi: 120,
    status: "active",
    priority: "high",
    icon: ShareIcon,
    iconBgColor: "rgba(139, 92, 246, 0.125)",
    iconColor: "rgb(139, 92, 246)",
  },
];

const BudgetItemCard: React.FC<{ item: BudgetItem }> = ({ item }) => {
  const utilization = (item.spent / item.budget) * 100;
  const Icon = item.icon;

  return (
    <Card
      shadow="sm"
      className="border border-gray-200 rounded-lg p-4 shadow-sm"
    >
      <CardHeader className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: item.iconBgColor }}
          >
            <Icon className="h-5 w-5" style={{ color: item.iconColor }} />
          </div>

          <div>
            <h3 className="font-medium text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.category}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Chip
            size="sm"
            variant="flat"
            color={item.status === "completed" ? "primary" : "success"}
          >
            {item.status}
          </Chip>
          <Chip
            size="sm"
            variant="flat"
            color={item.priority === "high" ? "danger" : "success"}
          >
            {item.priority}
          </Chip>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-gray-500 hover:bg-gray-100"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            color="danger"
            className="hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <p className="text-sm text-gray-600">{item.description}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarIcon className="h-4 w-4" />
          <span>{item.dateRange}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-2">
          <div>
            <p className="text-gray-500">Budget</p>
            <p className="font-medium text-gray-900">
              ${item.budget.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Spent</p>
            <p className="font-medium text-gray-900">
              ${item.spent.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Remaining</p>
            <p className="font-medium text-gray-900">
              ${(item.budget - item.spent).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500">ROI</p>
            <p className="font-medium text-yellow-600">{item.roi}%</p>
          </div>
        </div>
        <div className="pt-1 space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-gray-500">Budget utilization</span>
            <span className="text-gray-900">{utilization.toFixed(1)}%</span>
          </div>

          <Progress
            value={utilization}
            color="primary"
            className="h-2"
            radius="full"
          />
        </div>
      </CardBody>
    </Card>
  );
};

const YearlyBudgetItems: React.FC = () => {
  return (
    <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200 p-6 shadow-lg">
      <div className="pb-4">
        <h4 className="text-xl font-semibold leading-none text-gray-900">
          Yearly Budget Items
        </h4>
      </div>

      <div className="space-y-6">
        {initialBudgetItems.map((item) => (
          <BudgetItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default YearlyBudgetItems;
