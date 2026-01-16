import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { FiCopy, FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { LuDownload } from "react-icons/lu";
import VisitStatusChip from "../../../components/chips/VisitStatusChip";
import { useCopySchedulePlan } from "../../../hooks/usePartner";
import { SchedulePlan } from "../../../types/partner";
import { downloadJson } from "../../../utils/jsonDownloader";
import { formatDateToReadable } from "../../../utils/formatDateToReadable";

const PlanCard: React.FC<{
  plan: SchedulePlan;
  onView: any;
  onEdit: any;
  onDelete: any;
  onStatusClick: any;
}> = ({ plan, onView, onEdit, onDelete, onStatusClick }) => {
  let progress;

  switch (plan.status) {
    case "completed":
      progress = 100;
      break;

    case "inProgress":
      progress = 50;
      break;

    default:
      progress = 0;
      break;
  }

  const fullRouteDateTime = `${plan.route.date.split("T")[0]}T${
    plan.route.startTime
  }`;

  const { mutate: copySchedulePlan } = useCopySchedulePlan();

  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      reportTitle: plan.planDetails.name,
      details: plan,
    };

    // Trigger the download
    downloadJson(exportData, plan.planDetails.name);
  };

  return (
    <Card
      data-slot="card"
      className="bg-background dark:bg-default-100/20 flex flex-col gap-1 rounded-xl border border-foreground/10 shadow-none"
    >
      <CardHeader data-slot="card-header" className="px-4 pt-4 pb-1">
        <div className="w-full">
          <div className="flex items-center justify-between mb-1 w-full gap-2">
            <h4 data-slot="card-title" className="text-sm text-foreground">
              {plan.planDetails.name}
            </h4>
            <div className="flex items-center gap-1.5">
              <span
                className="flex cursor-pointer"
                onClick={() => onStatusClick(plan)}
              >
                <VisitStatusChip status={plan.status} />
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-600 dark:text-foreground/60">
              {formatDateToReadable(fullRouteDateTime as string, true)}
            </span>
          </div>
          {/* {plan.planDetails.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {plan.planDetails.description}
            </p>
          )} */}
        </div>
      </CardHeader>

      <CardBody data-slot="card-content" className="px-4 pb-4 pt-0">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-foreground/60">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-default-200 rounded-full h-2">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 md:gap-3 text-sm">
            <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <div className="font-semibold text-blue-600 dark:text-blue-400">
                {plan.summary.totalPractices}
              </div>
              <div className="text-xs text-gray-600 dark:text-foreground/40">
                Practices
              </div>
            </div>
            <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <div className="font-semibold text-green-600 dark:text-green-400">
                {plan.summary.visitDays}
              </div>
              <div className="text-xs text-gray-600 dark:text-foreground/40">
                Visit Days
              </div>
            </div>
            <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
              <div className="font-semibold text-orange-600 dark:text-orange-400">
                {plan.summary.estimatedTime}
              </div>
              <div className="text-xs text-gray-600 dark:text-foreground/40">
                Est. Time
              </div>
            </div>
            <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <div className="font-semibold text-purple-600 dark:text-purple-400">
                {plan.summary.estimatedDistance}
              </div>
              <div className="text-xs text-gray-600 dark:text-foreground/40">
                Est. Miles
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-foreground/10">
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="light"
                title="View Details"
                isIconOnly
                onPress={() => onView(plan)}
                className="dark:text-foreground/70"
              >
                <FiEye className="size-3.5" />
              </Button>
              <Button
                size="sm"
                variant="light"
                title="Edit Plan"
                isIconOnly
                onPress={() => onEdit(plan)}
                className="dark:text-foreground/70"
              >
                <FiEdit className="size-3.5" />
              </Button>
              <Button
                size="sm"
                variant="light"
                title="Duplicate Plan"
                isIconOnly
                onPress={() => {
                  copySchedulePlan(plan._id);
                }}
                className="dark:text-foreground/70"
              >
                <FiCopy className="size-3.5" />
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="light"
                title="Export Plan"
                isIconOnly
                onPress={handleExport}
                className="dark:text-foreground/70"
              >
                <LuDownload className="size-3.5" />
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="light"
                title="Delete Plan"
                isIconOnly
                onPress={() => {
                  onDelete(plan._id);
                }}
              >
                <FiTrash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default PlanCard;
