import { Button, Card, CardBody, CardHeader } from "@heroui/react";
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
import { BUDGET_DURATIONS } from "../../consts/budget";
import { BudgetItem } from "../../types/budget";
import BudgetActionModal from "./BudgetActionModal";
import BudgetItemCard from "./BudgetItemCard";
import {
  useBudgetCategories,
  useBudgetItems,
  useDeleteBudgetItem,
  useUpdateBudgetItem,
} from "../../hooks/useBudget";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";

const MarketingBudget = () => {
  const [selectedDuration, setSelectedDuration] = useState("monthly"); // Set default to 'yearly' to match API example
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBudgetItem, setEditBudgetItem] = useState<BudgetItem | null>(null);
  const [deleteBudgetItemId, setDeleteBudgetItemId] = useState("");

  const listQueryParams = {
    period: selectedDuration,
    page: 1, // Default to first page for simplicity
    limit: 10, // Default to 10 items per page
  };

  const { data, isLoading, isError } = useBudgetItems(listQueryParams);
  const deleteMutation = useDeleteBudgetItem(listQueryParams);

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

  const stats = data?.stats || {
    totalBudget: 0,
    totalSpent: 0,
    remainingBudget: 0,
    roi: 0,
  };
  const percentageSpent = stats.totalBudget
    ? ((stats.totalSpent / stats.totalBudget) * 100).toFixed(1)
    : 0;
  const percentageRemaining = (100 - Number(percentageSpent)).toFixed(1);

  const STAT_CARD_DATA = [
    {
      icon: <LuTarget className="text-[17px] mt-1 text-blue-600" />,
      heading: "Total Budget",
      value: isLoading ? "..." : `$${stats.totalBudget.toLocaleString()}`,
    },
    {
      icon: <LuDollarSign className="text-[17px] mt-1 text-green-600" />,
      heading: "Total Spent",
      value: isLoading ? "..." : `$${stats.totalSpent.toLocaleString()}`,
      // subheading: <p>{percentageSpent}% of budget</p>,
    },
    {
      icon: <LuCalculator className="text-[17px] mt-1 text-yellow-600" />,
      heading: "Remaining Budget",
      value: isLoading ? "..." : `$${stats.remainingBudget.toLocaleString()}`,
      // subheading: <p>{percentageRemaining}% remaining</p>,
    },
    {
      icon: <IoMdTrendingUp className="text-[17px] mt-1 text-purple-600" />,
      heading: "Average ROI",
      value: isLoading ? "..." : `${stats.roi.toLocaleString()}%`, // ROI needs calculation logic
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
        <div className="flex flex-col gap-5">
          <div className="relative p-1 h-fit gap-2 items-center flex-nowrap overflow-x-scroll scrollbar-hide flex w-full rounded-full bg-primary/10 text-xs">
            {BUDGET_DURATIONS.map((duration: any) => {
              return (
                <div key={duration.value} className="relative flex-1">
                  <Button
                    size="sm"
                    radius="full"
                    color="default"
                    className="relative z-1 font-medium text-sm bg-transparent"
                    onPress={() => setSelectedDuration(duration.value)}
                    fullWidth
                    disableRipple
                  >
                    {duration.label}
                  </Button>
                  {selectedDuration === duration.value ? (
                    <motion.div
                      layoutId="underline"
                      transition={{ duration: 0.3 }}
                      className="absolute top-0 left-0 w-full h-full bg-white shadow-small rounded-full -z-0"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              {STAT_CARD_DATA.map((data, i) => (
                <MiniStatsCard key={i} cardData={data} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card
              shadow="none"
              radius="lg"
              className="p-0 border border-primary/15"
            >
              <CardHeader className="p-5">
                <h4 className="flex items-center gap-2 text-sm">
                  <LuChartColumn /> Spending vs Budget Trend
                </h4>
              </CardHeader>
              <CardBody className="p-5 pt-0">
                <div className="my-1">
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
                      barSize={30}
                      fill="#3b82f6"
                      isAnimationActive
                    />
                    <Bar
                      dataKey="spent"
                      barSize={30}
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
                    padding: "40px"
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

          <div className="bg-background flex flex-col rounded-xl border border-primary/15 p-4">
            <div className="pb-4">
              <h4 className="text-sm font-medium">
                <span className="capitalize">{selectedDuration}</span> Budget
                Items {isLoading && "(Loading Items...)"}
              </h4>
            </div>

            <div className="space-y-4">
              {data?.budgetItems.length ? (
                data.budgetItems.map((item: BudgetItem) => (
                  <BudgetItemCard
                    key={item._id}
                    item={item}
                    onEdit={budgetItemEditHandler}
                    onDelete={() => setDeleteBudgetItemId(item._id)}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 py-4 text-sm">
                  No budget items found for the selected period.
                </p>
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
