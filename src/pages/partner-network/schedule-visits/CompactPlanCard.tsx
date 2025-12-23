import { Button, Card } from "@heroui/react";
import { FiCopy, FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { LuDownload } from "react-icons/lu";
import VisitStatusChip from "../../../components/chips/VisitStatusChip";
import { useCopySchedulePlan } from "../../../hooks/usePartner";
import { SchedulePlan } from "../../../types/partner";
import { downloadJson } from "../../../utils/jsonDownloader";

const CompactPlanCard: React.FC<{
  plan: SchedulePlan;
  onView: any;
  onEdit: any;
  onDelete: any;
  onStatusClick: any;
}> = ({ plan, onView, onEdit, onDelete, onStatusClick }) => {
  const statClass =
    "flex flex-col items-center justify-center text-center w-18";
  const statValueClass = "font-medium text-xs whitespace-nowrap";
  const statLabelClass = "text-xs text-gray-600 whitespace-nowrap";

  let completePercentage;

  switch (plan.status) {
    case "completed":
      completePercentage = 100;
      break;

    case "inProgress":
      completePercentage = 50;
      break;

    default:
      completePercentage = 0;
      break;
  }

  const monthYear = new Date(plan.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

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
    <Card className="p-4 rounded-lg border border-primary/15 bg-background shadow-none flex items-start justify-between gap-4">
      <div className="w-full">
        <div className="flex items-center gap-2 mb-1 justify-between">
          <h4 className="text-sm font-medium truncate">
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
        <p className="text-xs text-gray-600">{monthYear}</p>
        {plan.planDetails.description && (
          <p className="text-xs text-gray-600 mt-1 truncate">
            {plan.planDetails.description}
          </p>
        )}
      </div>

      <div className="flex items-start gap-4 justify-between w-full">
        <div className="flex gap-4 max-xl:gap-2 max-md:justify-between max-md:w-full max-sm:flex-wrap max-sm:justify-start max-sm:gap-4">
          <div className={statClass}>
            <div className={statValueClass}>{plan.summary.totalPractices}</div>
            <div className={statLabelClass}>Practices</div>
          </div>
          <div className={statClass}>
            <div className={statValueClass}>{plan.summary.visitDays}</div>
            <div className={statLabelClass}>Visit Days</div>
          </div>
          <div className={statClass}>
            <div className={statValueClass}>{plan.summary.estimatedTime}</div>
            <div className={statLabelClass}>Time</div>
          </div>
          <div className={statClass}>
            <div className={statValueClass}>
              {plan.summary.estimatedDistance}
            </div>
            <div className={statLabelClass}>Miles</div>
          </div>
          <div className={statClass}>
            <div className={statValueClass}>{completePercentage}%</div>
            <div className={statLabelClass}>Complete</div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="light"
            title="View Details"
            isIconOnly
            onPress={() => onView(plan)}
          >
            <FiEye className="size-3.5" />
          </Button>
          <Button
            size="sm"
            variant="light"
            title="Edit Plan"
            isIconOnly
            onPress={() => onEdit(plan)}
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
          >
            <FiCopy className="size-3.5" />
          </Button>
          <Button
            size="sm"
            variant="light"
            title="Export Plan"
            isIconOnly
            onPress={handleExport}
          >
            <LuDownload className="size-3.5" />
          </Button>
          <Button
            size="sm"
            color="danger"
            variant="light"
            title="Delete Plan"
            isIconOnly
            onPress={() => onDelete(plan._id)}
          >
            <FiTrash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CompactPlanCard;
