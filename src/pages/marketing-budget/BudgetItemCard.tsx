import { Button, Card, CardBody, CardHeader, Progress } from "@heroui/react";
import React from "react";
import { FiCalendar, FiEdit, FiTrash2 } from "react-icons/fi";
import BudgetStatusChip from "../../components/chips/BudgetStatusChip";
import PriorityLevelChip from "../../components/chips/PriorityLevelChip";
import { getCategoryColor } from "../../consts/budget";
import { BudgetItem } from "../../types/budget";
import { formatDateToReadable } from "../../utils/formatDateToReadable";

const BudgetItemCard: React.FC<{
  item: BudgetItem;
  onEdit: any;
  onDelete: any;
}> = ({ item, onEdit, onDelete }) => {
  const budgetAmount = item.amount || 0;
  const spentAmount = Number(item.spent) || 0;
  const utilization = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;

  const isSynced =
    item.type && ["google", "meta", "tiktok"].includes(item.type);

  const categoryTitle =
    typeof item.category === "string"
      ? item.category
      : item.category?.category || "Unknown Category";

  const subCategoryTitle =
    typeof item.subCategory === "string"
      ? item.subCategory
      : item.subCategory?.subCategory || "Unknown Subcategory";

  const getPlatformName = (type?: string) => {
    switch (type) {
      case "google":
        return "Google Ads";
      case "meta":
        return "Meta Ads";
      case "tiktok":
        return "TikTok Ads";
      default:
        return categoryTitle;
    }
  };

  return (
    <Card
      shadow="none"
      className="flex items-center justify-between border border-foreground/10 p-4 bg-content1 rounded-lg"
    >
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start p-0 gap-2">
        <div className="flex items-center gap-2.5">
          <span
            className={`size-4 rounded-sm`}
            style={{
              backgroundColor: getCategoryColor(
                isSynced ? getPlatformName(item.type) : categoryTitle,
              ),
            }}
          ></span>

          <div className="space-y-0.5">
            <h4 className="text-sm font-medium text-foreground">
              {isSynced ? getPlatformName(item.type) : subCategoryTitle}
            </h4>
            <p className="text-xs text-gray-500 dark:text-foreground/40">
              {isSynced
                ? `Synced with ${getPlatformName(item.type)}`
                : categoryTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isSynced && (
            <>
              {item.status && <BudgetStatusChip status={item.status} />}
              {item.priority && <PriorityLevelChip level={item.priority} />}

              <div className="flex items-center gap-0.5">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-gray-500 dark:text-foreground/40 hover:bg-gray-100 dark:hover:bg-default-100"
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
            </>
          )}
        </div>
      </CardHeader>

      <CardBody className="space-y-3 p-0 pt-4">
        {item.description && (
          <p className="text-xs text-gray-600 dark:text-foreground/60">
            {item.description}
          </p>
        )}

        {!isSynced && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-foreground/40">
            <FiCalendar className="size-3.5" />
            <span>
              {item.startDate ? formatDateToReadable(item.startDate) : "N/A"}
              {item.endDate
                ? ` - ${formatDateToReadable(item.endDate)}`
                : " - N/A"}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-1">
          <div className="text-xs space-y-0.5">
            <p className="text-gray-500 dark:text-foreground/40">Budget</p>
            <p className="font-medium text-foreground">
              ${budgetAmount.toLocaleString()}
            </p>
          </div>

          <div className="text-xs space-y-0.5">
            <p className="text-gray-500 dark:text-foreground/40">Spent</p>
            <p className="font-medium text-foreground">
              ${spentAmount.toLocaleString()}
            </p>
          </div>

          <div className="text-xs space-y-0.5">
            <p className="text-gray-500 dark:text-foreground/40">Remaining</p>
            <p className="font-medium text-foreground">
              ${(budgetAmount - spentAmount).toLocaleString()}
            </p>
          </div>

          <div className="text-xs space-y-0.5">
            <p className="text-gray-500 dark:text-foreground/40">ROI</p>
            <p className="font-medium text-yellow-600 dark:text-yellow-400">
              {Number(item.roi).toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="pt-1 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 dark:text-foreground/40">
              Budget utilization
            </span>
            <span className="font-medium text-foreground">
              {utilization.toFixed(1)}%
            </span>
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
