import { Button, Pagination, Select, SelectItem } from "@heroui/react";
import { useCallback, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { LuCalendar } from "react-icons/lu";
import { MdOutlineCalendarToday } from "react-icons/md";
import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";
import EmptyState from "../../../components/common/EmptyState";
import { LoadingState } from "../../../components/common/LoadingState";
import {
  useDeleteSchedulePlan,
  useFetchPartners,
  useGetSchedulePlans,
} from "../../../hooks/usePartner";
import { GetSchedulePlansQuery } from "../../../types/partner";
import CompactPlanCard from "./CompactPlanCard";
import { VisitHistoryModal } from "./history-modal/VisitHistoryModal";
import PlanCard from "./PlanCard";
import { ScheduleVisitsModal } from "./schedule-visit-modal/ScheduleVisitsModal";
import ScheduleVisitStatusModal from "./ScheduleVisitStatusModal";
import ViewScheduledVisitModal from "./ViewScheduledVisitModal";

// const StatsGrid = ({ stats }: any) => {
//   const statData = [
//     {
//       label: "Total Plans",
//       value: stats.totalPlans,
//       bg: "bg-blue-50",
//       text: "text-blue-600",
//     },
//     {
//       label: "Draft",
//       value: stats.draftCount,
//       bg: "bg-gray-50",
//       text: "text-gray-600",
//     },
//     {
//       label: "Active",
//       value: stats.activeCount,
//       bg: "bg-green-50",
//       text: "text-green-600",
//     },
//     {
//       label: "Completed",
//       value: stats.completedCount,
//       bg: "bg-emerald-50",
//       text: "text-emerald-600",
//     },
//     {
//       label: "Total Practices",
//       value: stats.totalPractices,
//       bg: "bg-orange-50",
//       text: "text-orange-600",
//     },
//     {
//       label: "Total Visits",
//       value: stats.totalVisits,
//       bg: "bg-purple-50",
//       text: "text-purple-600",
//     },
//     {
//       label: "Total Hours",
//       value: Number(stats?.totalHours ?? 0).toFixed(2),
//       bg: "bg-indigo-50",
//       text: "text-indigo-600",
//     },
//     {
//       label: "Total Miles",
//       value: stats.totalMiles,
//       bg: "bg-pink-50",
//       text: "text-pink-600",
//     },
//   ];

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-sm">
//       {statData.map((stat) => (
//         <div
//           key={stat.label}
//           className={`text-center p-3 ${stat.bg} rounded flex flex-col items-center justify-center`}
//         >
//           <div className={`font-semibold ${stat.text}`}>{stat.value}</div>
//           <div className="text-xs text-gray-600">{stat.label}</div>
//         </div>
//       ))}
//     </div>
//   );
// };

export default function ScheduleVisits({
  isHistoryModalOpen,
  setIsHistoryModalOpen,
}: any) {
  const [isScheduleVisitModalOpen, setIsScheduleVisitModalOpen] =
    useState(false);
  const [isScheduleVisitStatusModalOpen, setIsScheduleVisitStatusModalOpen] =
    useState(false);
  const [isViewScheduleVisitModalOpen, setIsViewScheduleVisitModalOpen] =
    useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteVisitId, setDeleteVisitId] = useState("");
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [viewPlan, setViewPlan] = useState<any>();
  const [editPlan, setEditPlan] = useState<any>();

  const [filters, setFilters] = useState<GetSchedulePlansQuery>({
    page: 1,
    limit: 9,
    status: "all",
    order: "desc",
    sortBy: "month",
  });

  const { data: practicesData } = useFetchPartners();

  const practices = practicesData?.data || [];

  const { data, isLoading } = useGetSchedulePlans(filters);

  const schedulePlans = data?.data || [];
  const dashboardStats = data?.dashboardStats;
  const pagination = data?.pagination;

  const { mutate: deleteSchedulePlan, isPending } = useDeleteSchedulePlan();

  const handleFilterChange = useCallback(
    (key: keyof GetSchedulePlansQuery, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleOrderToggle = () => {
    handleFilterChange("order", filters.order === "desc" ? "asc" : "desc");
  };

  const PlanListContent = () => {
    if (isLoading) {
      return (
        <div className="col-span-full p-5 border border-primary/15 rounded-xl bg-background">
          <LoadingState />
        </div>
      );
    }

    if (schedulePlans.length === 0) {
      return (
        <div className="col-span-full p-5 border border-primary/15 rounded-xl bg-background">
          <EmptyState title="No schedule plans found based on current filters." />
        </div>
      );
    }

    return schedulePlans.map((plan: any) =>
      isCompactMode ? (
        <CompactPlanCard
          key={plan._id}
          plan={plan}
          onView={(p: any) => {
            setIsViewScheduleVisitModalOpen(true);
            setViewPlan(p);
          }}
          onEdit={(p: any) => {
            setIsScheduleVisitModalOpen(true);
            setEditPlan(p);
          }}
          onDelete={(planId: string) => {
            setIsDeleteModalOpen(true);
            setDeleteVisitId(planId);
          }}
          onStatusClick={(p: any) => {
            setIsScheduleVisitStatusModalOpen(true);
            setEditPlan(p);
          }}
        />
      ) : (
        <PlanCard
          key={plan._id}
          plan={plan}
          onView={(p: any) => {
            setIsViewScheduleVisitModalOpen(true);
            setViewPlan(p);
          }}
          onEdit={(p: any) => {
            setIsScheduleVisitModalOpen(true);
            setEditPlan(p);
          }}
          onDelete={(planId: string) => {
            setIsDeleteModalOpen(true);
            setDeleteVisitId(planId);
          }}
          onStatusClick={(p: any) => {
            setIsScheduleVisitStatusModalOpen(true);
            setEditPlan(p);
          }}
        />
      )
    );
  };

  return (
    <>
      <div className="bg-background flex flex-col gap-4 border border-primary/15 rounded-xl p-4">
        <div className="md:flex md:items-center md:justify-between max-md:space-y-3.5 max-md:mt-2">
          <div className="space-y-1">
            <h3 className="text-sm">Schedule Referrer Visits</h3>
            <p className="text-xs text-gray-600">
              Plan your visits to multiple referrers with route optimization
            </p>
          </div>
          <Button
            size="sm"
            variant="solid"
            color="primary"
            startContent={<MdOutlineCalendarToday />}
            onPress={() => {
              setIsScheduleVisitModalOpen(true);
              setEditPlan(null);
            }}
          >
            Schedule Visit
          </Button>
        </div>

        {/* {dashboardStats?.totalPlans > 0 && ( */}
        <div className="space-y-4 md:space-y-5">
          {/* <Card
          data-slot="card"
          className="rounded-xl border border-primary/15 shadow-none"
        >
          <CardHeader data-slot="card-header" className="px-5 pt-5 pb-5">
            <div className="flex items-center justify-between w-full">
              <div className="space-y-2">
                <h4
                  data-slot="card-title"
                  className="leading-none text-sm font-medium"
                >
                  All Visit Plans
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  Manage and track your practice visit schedules
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onPress={() => setIsCompactMode(!isCompactMode)}
                  className="border-small min-w-auto border-primary/15 size-8 p-0"
                  title={isCompactMode ? "Show Grid View" : "Show Compact View"}
                >
                  <LuCalendar className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardBody data-slot="card-content" className="px-5 pt-0 pb-5">
            {isLoading && <LoadingState />}
            {dashboardStats && <StatsGrid stats={dashboardStats} />}
          </CardBody>
        </Card> */}

          <div className="md:flex md:items-center md:justify-between max-md:space-y-3">
            <div className="md:flex md:items-center md:gap-3 grid grid-cols-6 gap-2">
              <Select
                aria-label="Filter Plans"
                placeholder="All Plans"
                size="sm"
                radius="sm"
                selectedKeys={[filters.status] as string[]}
                disabledKeys={[filters.status] as string[]}
                onSelectionChange={(keys) =>
                  handleFilterChange("status", Array.from(keys)[0] as string)
                }
                className="min-w-[160px] col-span-full"
              >
                <SelectItem key="all">All Plans</SelectItem>
                <SelectItem key="active">Active</SelectItem>
                <SelectItem key="inProgress">In Progress</SelectItem>
                <SelectItem key="draft">Draft</SelectItem>
              </Select>
              <Select
                aria-label="Filter by Month"
                placeholder="Month"
                size="sm"
                radius="sm"
                selectedKeys={[filters.sortBy] as string[]}
                disabledKeys={[filters.sortBy] as string[]}
                onSelectionChange={(keys) => {
                  handleFilterChange("sortBy", Array.from(keys)[0] as string);
                }}
                className="md:min-w-[160px] col-span-3"
              >
                <SelectItem key="month">Month</SelectItem>
                <SelectItem key="name">Name</SelectItem>
                <SelectItem key="createdDate">Created Date</SelectItem>
                <SelectItem key="updatedDate">Updated Date</SelectItem>
              </Select>
              <Button
                size="sm"
                variant="ghost"
                onPress={handleOrderToggle}
                className="border-small md:min-w-[90px] col-span-2"
              >
                {filters.order === "desc" ? "Descending" : "Ascending"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onPress={() => setIsCompactMode(!isCompactMode)}
                className="border-small size-8 min-w-8 p-0 max-md:w-full"
                title={isCompactMode ? "Show Grid View" : "Show List View"}
                startContent={
                  isCompactMode ? (
                    <LuCalendar className="size-3.5" />
                  ) : (
                    <FiFileText className="size-3.5" />
                  )
                }
                isIconOnly
              />
            </div>
            <div className="text-xs text-gray-600">
              Showing {schedulePlans.length} of {pagination?.totalData} plans
            </div>
          </div>

          <div>
            <div
              className={`${
                !isCompactMode
                  ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                  : "space-y-3"
              }`}
            >
              <PlanListContent />
            </div>
            {pagination && pagination.totalPages > 1 ? (
              <Pagination
                showControls
                size="sm"
                radius="sm"
                initialPage={1}
                page={filters.page as number}
                onChange={(page) => {
                  setFilters((prev) => ({ ...prev, page }));
                }}
                total={pagination?.totalPages as number}
                classNames={{
                  base: "flex justify-center py-3 mt-2",
                  wrapper: "gap-1.5",
                  item: "bg-background cursor-pointer",
                  prev: "bg-background cursor-pointer",
                  next: "bg-background cursor-pointer",
                }}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      <ScheduleVisitsModal
        isOpen={isScheduleVisitModalOpen}
        onClose={() => setIsScheduleVisitModalOpen(false)}
        practices={practices}
        editedData={editPlan}
      />

      <ScheduleVisitStatusModal
        isOpen={isScheduleVisitStatusModalOpen}
        onClose={() => setIsScheduleVisitStatusModalOpen(false)}
        visit={editPlan}
        setVisitEdit={setEditPlan}
      />

      {viewPlan && (
        <ViewScheduledVisitModal
          isOpen={isViewScheduleVisitModalOpen}
          onClose={() => setIsViewScheduleVisitModalOpen(false)}
          plan={viewPlan}
        />
      )}

      <VisitHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onItemView={(p: any) => {
          setIsViewScheduleVisitModalOpen(true);
          setViewPlan(p);
        }}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          deleteSchedulePlan(deleteVisitId, {
            onSuccess() {
              setDeleteVisitId("");
              setIsDeleteModalOpen(false);
            },
          });
        }}
        isLoading={isPending}
      />
    </>
  );
}
