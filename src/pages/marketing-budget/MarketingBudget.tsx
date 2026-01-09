import { Button, Card, CardBody, CardHeader, Pagination } from "@heroui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiPieChart } from "react-icons/fi";
import { IoMdTrendingUp } from "react-icons/io";
import {
  LuCalculator,
  LuChartColumn,
  LuDollarSign,
  LuTarget,
} from "react-icons/lu";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import EmptyState from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";
import { BUDGET_DURATIONS } from "../../consts/budget";
import { useBudgetItems, useDeleteBudgetItem } from "../../hooks/useBudget";
import { BudgetItem } from "../../types/budget";
import BudgetItemCard from "./BudgetItemCard";
import BudgetActionModal from "./modal/BudgetActionModal";

const MarketingBudget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBudgetItem, setEditBudgetItem] = useState<BudgetItem | null>(null);
  const [deleteBudgetItemId, setDeleteBudgetItemId] = useState("");
  const [currentFilters, setCurrentFilters] = useState({
    period: "monthly",
    page: 1,
    limit: 5,
  });

  const { data, isLoading } = useBudgetItems(currentFilters);
  const deleteMutation = useDeleteBudgetItem(currentFilters);

  const handleOpenCreateModal = () => {
    setEditBudgetItem(null); // Clear any editing data
    setIsModalOpen(true);
  };

  const budgetItemEditHandler = (budget: BudgetItem) => {
    setEditBudgetItem(budget);
    setIsModalOpen(true);
  };

  const PieChartCustomLabel = (props: any) => {
    const { value, name } = props;
    if (value === 0) {
      return null;
    }
    return `${name}: $${value}`;
  };
  const renderCustomLabelAdaptive = (props: any) => {
    const { cx, cy, outerRadius, midAngle, name, value } = props;

    if (value === 0) return null;

    const lineLength = 20;
    const textShift = 105;
    const bottomTextShift = 30;

    let startX = cx;
    let startY: number;
    let endX: number;
    let endY: number;
    let textY: number;

    if (midAngle <= 180) {
      startY = cy - outerRadius;
      startX = cx - 10;
      endX = startX - lineLength;
      endY = startY - lineLength;
      textY = endY - 5;
    } else {
      startY = cy + outerRadius;
      startX = cx + 20;
      endX = startX - lineLength + 50;
      endY = startY + lineLength;
      textY = endY + 8;
    }

    return (
      <g>
        {/* Diagonal line */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#9ca3af"
          strokeWidth={1}
        />

        {/* Text */}
        <text
          x={
            midAngle > 180
              ? endX - textShift + bottomTextShift
              : endX - textShift
          }
          y={textY}
          textAnchor="start"
          dominantBaseline="middle"
          fontSize={11}
          fill="#374151"
        >
          {name}: ${value}
        </text>
      </g>
    );
  };

  const pagination = data?.pagination;

  const stats = data?.stats || {
    totalBudget: 0,
    totalSpent: 0,
    remainingBudget: 0,
    averageROI: 0,
  };
  const percentageSpent = stats.totalBudget
    ? ((stats.totalSpent / stats.totalBudget) * 100).toFixed(1)
    : 0;
  const percentageRemaining = (100 - Number(percentageSpent)).toFixed(1);

  const STAT_CARD_DATA = [
    {
      icon: <LuTarget className="text-blue-600" />,
      heading: "Total Budget",
      value: isLoading ? "..." : `$${stats.totalBudget.toLocaleString()}`,
    },
    {
      icon: <LuDollarSign className="text-green-600" />,
      heading: "Total Spent",
      value: isLoading ? "..." : `$${stats.totalSpent.toLocaleString()}`,
      // subheading: <p>{percentageSpent}% of budget</p>,
    },
    {
      icon: <LuCalculator className="text-yellow-600" />,
      heading: "Remaining Budget",
      value: isLoading ? "..." : `$${stats.remainingBudget.toLocaleString()}`,
      // subheading: <p>{percentageRemaining}% remaining</p>,
    },
    {
      icon: <IoMdTrendingUp className="text-purple-600" />,
      heading: "Average ROI",
      value: isLoading ? "..." : `${stats.averageROI.toLocaleString()}%`, // ROI needs calculation logic
    },
  ];

  const HEADING_DATA = {
    heading: "Marketing Budget",
    subHeading: "Manage and track your marketing spend across all channels.",
    buttons: [
      {
        label: "Add Budget Item",
        onClick: handleOpenCreateModal,
        icon: <AiOutlinePlus fontSize={15} />,
        variant: "solid" as const,
        color: "primary" as const,
      },
    ],
  };

  return (
    <>
      <ComponentContainer headingData={HEADING_DATA}>
        <div className="flex flex-col gap-4 md:gap-5">
          <div className="relative p-1 h-fit gap-2 items-center flex-nowrap overflow-x-scroll scrollbar-hide flex w-full rounded-full bg-primary/10 text-xs">
            {BUDGET_DURATIONS.map((duration: any) => {
              return (
                <div key={duration.value} className="relative flex-1">
                  <Button
                    size="sm"
                    radius="full"
                    color="default"
                    className="relative z-1 font-medium text-sm bg-transparent"
                    onPress={() =>
                      setCurrentFilters((prev) => ({
                        ...prev,
                        period: duration.value,
                      }))
                    }
                    fullWidth
                    disableRipple
                  >
                    {duration.label}
                  </Button>
                  {currentFilters.period === duration.value ? (
                    <motion.div
                      layoutId="underline"
                      transition={{ duration: 0.3 }}
                      className="absolute top-0 left-0 w-full h-full bg-background shadow-small rounded-full -z-0"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="space-y-4 md:space-y-5">
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
              {STAT_CARD_DATA.map((data, i) => (
                <MiniStatsCard key={i} cardData={data} />
              ))}
            </div>
          </div>
          {data && data?.budgetItems.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Card
                shadow="none"
                radius="lg"
                className="p-0 border border-primary/15"
              >
                <CardHeader className="p-5">
                  <h4 className="flex  items-center gap-2 text-sm">
                    <LuChartColumn /> Spending vs Budget Trend
                  </h4>
                </CardHeader>
                <CardBody className="p-5 pt-0">
                  <div className="my-1 -ml-3">
                    <BarChart
                      style={{
                        width: "100%",
                        maxHeight: "400px",
                        aspectRatio: 1.618,
                        outline: "none",
                        overflow: "hidden",
                        fontSize: "14px",
                      }}
                      responsive
                      data={data?.monthlyStats}
                      margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tickMargin={8} />
                      <YAxis width={60} tickMargin={8} />
                      <Tooltip isAnimationActive />
                      <Legend
                        wrapperStyle={{
                          bottom: "-2px",
                          textTransform: "capitalize",
                        }}
                      />
                      <Bar
                        dataKey="budget"
                        barSize={40}
                        fill="#3b82f6"
                        isAnimationActive
                      />
                      <Bar
                        dataKey="spent"
                        barSize={40}
                        fill="#10b981"
                        isAnimationActive
                      />
                    </BarChart>
                  </div>
                </CardBody>
              </Card>

              <Card
                shadow="none"
                radius="lg"
                className="p-0 border border-primary/15"
              >
                <CardHeader className="p-5">
                  <h4 className="flex items-center gap-2 text-sm">
                    <FiPieChart /> Budget by Category
                  </h4>
                </CardHeader>
                <CardBody className="text-xs px-3 pb-0 items-center">
                  <PieChart
                    style={{
                      width: "100%",
                      height: "100%",
                      maxHeight: "400px",
                      padding: "40px",
                    }}
                    responsive
                  >
                    <Pie
                      data={data?.budgetByCategoryGraph}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius="100%"
                      isAnimationActive
                      label={PieChartCustomLabel}
                      className="w-1/2"
                    />
                    <Tooltip />
                  </PieChart>
                </CardBody>
              </Card>
            </div>
          )}

          <div className="bg-background flex flex-col rounded-xl border border-primary/15 p-4">
            <div className="pb-4">
              <h4 className="text-sm font-medium w-full truncate whitespace-nowrap">
                <span className="capitalize">{currentFilters.period}</span>{" "}
                Budget Items {isLoading && "(Loading Items...)"}
              </h4>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <LoadingState />
              ) : !data || data?.budgetItems?.length <= 0 ? (
                <EmptyState title="No budget items found for the selected period. Try adjusting your search or filters." />
              ) : (
                <>
                  <div className="space-y-3">
                    {data?.budgetItems.map((item: BudgetItem) => (
                      <BudgetItemCard
                        key={item._id}
                        item={item}
                        onEdit={budgetItemEditHandler}
                        onDelete={() => setDeleteBudgetItemId(item._id)}
                      />
                    ))}
                  </div>
                  {pagination?.totalPages && pagination.totalPages > 1 ? (
                    <Pagination
                      showControls
                      size="sm"
                      radius="sm"
                      initialPage={1}
                      page={currentFilters.page as number}
                      onChange={(page) => {
                        setCurrentFilters((prev: any) => ({ ...prev, page }));
                      }}
                      total={pagination?.totalPages as number}
                      classNames={{
                        base: "flex justify-end py-3",
                        wrapper: "gap-1.5",
                      }}
                    />
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </ComponentContainer>

      <BudgetActionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditBudgetItem(null);
        }}
        editedData={editBudgetItem} // Pass data for editing
        setCurrentFilters={setCurrentFilters}
      />

      <DeleteConfirmationModal
        isOpen={!!deleteBudgetItemId}
        onClose={() => setDeleteBudgetItemId("")}
        onConfirm={() => {
          deleteMutation.mutate(deleteBudgetItemId, {
            onSuccess: () => {
              setDeleteBudgetItemId("");
            },
          });
        }}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
};

export default MarketingBudget;
