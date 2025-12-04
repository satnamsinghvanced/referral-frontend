import { Button, Card, CardBody, CardHeader, Progress } from "@heroui/react";
import React from "react";
import { FiCalendar, FiEdit, FiTrash2 } from "react-icons/fi";
import BudgetStatusChip from "../../components/chips/BudgetStatusChip";
import PriorityLevelChip from "../../components/chips/PriorityLevelChip";
import { BudgetItem } from "../../types/budget";
import { formatDateToReadable } from "../../utils/formatDateToReadable";

const BudgetItemCard: React.FC<{
  item: BudgetItem;
  onEdit: any;
  onDelete: any;
}> = ({ item, onEdit, onDelete }) => {
  const utilization = (item.spent / item.budget) * 100;
  // const Icon = item.icon;

  return (
    <Card
      shadow="none"
      radius="lg"
      className="flex items-center justify-between border border-foreground/10 p-4 bg-background"
    >
      <CardHeader className="flex justify-between items-start p-0">
        <div className="flex items-center gap-2.5">
          {/* <div
            className="size-9 rounded-md flex items-center justify-center"
            style={{ backgroundColor: item.iconBgColor }}
          >
            <Icon className="size-[18px]" style={{ color: item.iconColor }} />
          </div> */}
          <span
            className={`size-4 rounded-sm`}
            style={{ backgroundColor: item.marketingCategory.color }}
          ></span>

          <div className="space-y-0.5">
            <h4 className="text-sm font-medium">{item.subCategory.title}</h4>
            <p className="text-xs text-gray-500">
              {item.marketingCategory.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <BudgetStatusChip status={item.status} />
          <PriorityLevelChip level={item.priority} />

          <div className="flex items-center gap-0.5">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-gray-500 hover:bg-gray-100"
              onPress={() => onEdit(item)}
            >
              <FiEdit className="size-3.5" />
            </Button>

            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onPress={() => onDelete(item._id)}
            >
              <FiTrash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-3 p-0 pt-4">
        <p className="text-xs text-gray-600">{item.description}</p>

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <FiCalendar className="size-3.5" />
          <span>
            {formatDateToReadable(item.startDate)}
            {item.endDate ? ` - ${formatDateToReadable(item.endDate)}` : ""}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-1">
          <div className="text-xs space-y-0.5">
            <p className="text-gray-500">Budget</p>
            <p className="font-medium">${item.budget.toLocaleString()}</p>
          </div>

          <div className="text-xs space-y-0.5">
            <p className="text-gray-500">Spent</p>
            <p className="font-medium">${item.spent.toLocaleString()}</p>
          </div>

          <div className="text-xs space-y-0.5">
            <p className="text-gray-500">Remaining</p>
            <p className="font-medium">
              ${(item.budget - item.spent).toLocaleString()}
            </p>
          </div>

          <div className="text-xs space-y-0.5">
            <p className="text-gray-500">ROI</p>
            <p className="font-medium text-yellow-600">{item.roi}%</p>
          </div>
        </div>

        <div className="pt-1 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Budget utilization</span>
            <span className="font-medium">{utilization.toFixed(1)}%</span>
          </div>

          <Progress
            aria-label="Budget utilization"
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

export default BudgetItemCard;
