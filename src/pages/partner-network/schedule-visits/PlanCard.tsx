import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { FiCopy, FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { LuDownload } from "react-icons/lu";
import VisitStatusChip from "../../../components/chips/VisitStatusChip";
import { useCopySchedulePlan } from "../../../hooks/usePartner";
import { SchedulePlan } from "../../../types/partner";
import { downloadJson } from "../../../utils/jsonDownloader";

const PlanCard: React.FC<{
  plan: SchedulePlan;
  onView: any;
  onEdit: any;
  onDelete: any;
}> = ({ plan, onView, onEdit, onDelete }) => {
  const progress = plan.status === "completed" ? 100 : 0; // Assuming progress calculation is pending or based on completion data not explicitly shown
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
    <Card
      data-slot="card"
      className="bg-background flex flex-col gap-1 rounded-xl border border-primary/15 shadow-none"
    >
      <CardHeader data-slot="card-header" className="px-5 pt-5 pb-3">
        <div className="w-full">
          <div className="flex items-center justify-between mb-2 w-full gap-2">
            <h4 data-slot="card-title" className="text-sm">
              {plan.planDetails.name}
            </h4>
            <div className="flex items-center gap-1.5">
              <VisitStatusChip status={plan.status} />
              {plan.isDraft && (
                <Chip
                  size="sm"
                  radius="sm"
                  className="capitalize text-[11px] h-5 bg-red-100 text-red-800"
                  variant="flat"
                  color="danger"
                >
                  Draft
                </Chip>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2 ">
            <span className="text-xs text-gray-600">{monthYear}</span>
          </div>
          {plan.planDetails.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {plan.planDetails.description}
            </p>
          )}
        </div>
      </CardHeader>

      <CardBody data-slot="card-content" className="px-5 pb-5 pt-0">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="font-semibold text-blue-600">
                {plan.summary.totalPractices}
              </div>
              <div className="text-xs text-gray-600">Practices</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-semibold text-green-600">
                {plan.summary.visitDays}
              </div>
              <div className="text-xs text-gray-600">Visit Days</div>
            </div>
            <div className="text-center p-2 bg-orange-50 rounded">
              <div className="font-semibold text-orange-600">
                {plan.summary.estimatedTime}
              </div>
              <div className="text-xs text-gray-600">Est. Time</div>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded">
              <div className="font-semibold text-purple-600">
                {plan.summary.estimatedDistance}
              </div>
              <div className="text-xs text-gray-600">Est. Miles</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-primary/15">
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
              <Button size="sm" variant="light" title="Edit Plan" isIconOnly onPress={() => onEdit(plan)}>
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
            </div>
            <div className="flex items-center gap-1">
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
