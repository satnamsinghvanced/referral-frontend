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

  // Assign colors based on platforms if possible, or default
  const getCategoryColor = (cat: string) => {
    const lower = cat.toLowerCase();
    // if (lower.includes("google")) return "#DB4437";
    // if (lower.includes("meta") || lower.includes("facebook")) return "#4267B2";
    // if (lower.includes("tiktok")) return "#000000";
    return "#3b82f6"; // Default blue
  };

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
      className="flex items-center justify-between border border-foreground/10 p-4 bg-background rounded-lg"
    >
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start p-0 gap-2">
        <div className="flex items-center gap-2.5">
          <span
            className={`size-4 rounded-sm`}
            style={{
              backgroundColor: getCategoryColor(
                isSynced ? getPlatformName(item.type) : categoryTitle
              ),
            }}
          ></span>

          <div className="space-y-0.5">
            <h4 className="text-sm font-medium">
              {isSynced ? getPlatformName(item.type) : subCategoryTitle}
            </h4>
            <p className="text-xs text-gray-500">
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
            </>
          )}
        </div>
      </CardHeader>

      <CardBody className="space-y-3 p-0 pt-4">
        {item.description && (
          <p className="text-xs text-gray-600">{item.description}</p>
        )}

        {!isSynced && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
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
            <p className="text-gray-500">Budget</p>
            <p className="font-medium">${budgetAmount.toLocaleString()}</p>
          </div>

          <div className="text-xs space-y-0.5">
            <p className="text-gray-500">Spent</p>
            <p className="font-medium">${spentAmount.toLocaleString()}</p>
          </div>

          <div className="text-xs space-y-0.5">
            <p className="text-gray-500">Remaining</p>
            <p className="font-medium">
              ${(budgetAmount - spentAmount).toLocaleString()}
            </p>
          </div>

          <div className="text-xs space-y-0.5">
            <p className="text-gray-500">ROI</p>
            <p className="font-medium text-yellow-600">
              {Number(item.roi).toFixed(2)}%
            </p>
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
