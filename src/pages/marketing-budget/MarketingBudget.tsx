import {
  Button,
  Card,
  CardBody,
  CardHeader,
  DatePicker,
  Pagination,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiPieChart } from "react-icons/fi";
import { IoMdTrendingUp } from "react-icons/io";
import {
  LuCalculator,
  LuCalendar,
  LuChartColumn,
  LuCheck,
  LuDollarSign,
  LuDownload,
  LuRefreshCw,
  LuTarget,
  LuUpload,
  LuX,
} from "react-icons/lu";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
import ExportBudgetModal from "./modal/ExportBudgetModal";
import ImportBudgetModal from "./modal/ImportBudgetModal";

const MarketingBudget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBudgetItem, setEditBudgetItem] = useState<BudgetItem | null>(null);
  const [deleteBudgetItemId, setDeleteBudgetItemId] = useState("");
  const [currentFilters, setCurrentFilters] = useState({
    period: "monthly",
    page: 1,
    limit: 5,
  });
  const [showDateRange, setShowDateRange] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleApplyDateRange = () => {
    setCurrentFilters((prev: any) => ({
      ...prev,
      period: "custom",
      startDate: dateRange.start,
      endDate: dateRange.end,
      page: 1,
    }));
    // setShowDateRange(false);
  };

  const handleClearDateRange = () => {
    setDateRange({ start: "", end: "" });
    setCurrentFilters((prev: any) => ({
      ...prev,
      period: "monthly", // Revert to default
      startDate: undefined,
      endDate: undefined,
    }));
  };

  const { data, isLoading } = useBudgetItems(currentFilters);
  const deleteMutation = useDeleteBudgetItem(currentFilters);

  const syncedProviders = useMemo(() => {
    if (!data?.budgets) return [];
    const types = new Set<string>();
    data.budgets.forEach((b: BudgetItem) => {
      if (b.type && ["google", "meta", "tiktok"].includes(b.type)) {
        types.add(b.type);
      }
    });
    return Array.from(types);
  }, [data]);

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
    return `${name}: $${value.toLocaleString()}`;
  };

  // Assign colors based on platforms if possible, or default
  const getCategoryColor = (cat: string) => {
    // const lower = cat.toLowerCase();
    // if (lower.includes("google")) return "#DB4437";
    // if (lower.includes("meta") || lower.includes("facebook")) return "#4267B2";
    // if (lower.includes("tiktok")) return "#000000";
    return "#3b82f6"; // Default blue
  };

  const pagination = data?.pagination;

  // Transform pie chart data to ensure numbers
  const pieData = useMemo(() => {
    if (!data?.graphs?.budgetByCategory) return [];
    return data.graphs.budgetByCategory
      .map((item) => ({
        name: item.name,
        value: Number(item.amount) || 0,
        color: getCategoryColor(item.name || ""),
      }))
      .filter((item) => item.value > 0);
  }, [data?.graphs?.budgetByCategory]);

  const stats = data?.stats || {
    totalBudget: "0",
    totalSpent: "0",
    remainingBudget: "0",
    budgetUtilization: "0",
    avgROI: "0",
  };

  const totalBudget = Number(stats.totalBudget);
  const totalSpent = Number(stats.totalSpent);
  const remainingBudget = Number(stats.remainingBudget);
  const avgROI = Number(stats.avgROI);

  const STAT_CARD_DATA = [
    {
      icon: <LuTarget className="text-blue-600" />,
      heading: "Total Budget",
      value: isLoading ? "..." : `$${totalBudget.toLocaleString()}`,
    },
    {
      icon: <LuDollarSign className="text-green-600" />,
      heading: "Total Spent",
      value: isLoading ? "..." : `$${totalSpent.toLocaleString()}`,
    },
    {
      icon: <LuCalculator className="text-yellow-600" />,
      heading: "Remaining Budget",
      value: isLoading ? "..." : `$${remainingBudget.toLocaleString()}`,
    },
    {
      icon: <IoMdTrendingUp className="text-purple-600" />,
      heading: "Average ROI",
      value: isLoading ? "..." : `${avgROI.toFixed(2)}%`,
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
                    onPress={() => {
                      setDateRange({ start: "", end: "" });
                      setCurrentFilters((prev) => ({
                        ...prev,
                        period: duration.value,
                        startDate: undefined,
                        endDate: undefined,
                      }));
                    }}
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

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap justify-between items-center gap-3 bg-background p-4 rounded-xl border border-primary/15">
              <div className="flex items-center gap-2">
                <Button
                  variant={showDateRange ? "solid" : "ghost"}
                  color={showDateRange ? "primary" : "default"}
                  className={`border ${
                    !showDateRange ? "bg-background" : "border-primary"
                  }`}
                  size="sm"
                  startContent={<LuCalendar fontSize={15} />}
                  onPress={() => setShowDateRange(!showDateRange)}
                >
                  Date Range
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="border-small"
                  size="sm"
                  startContent={<LuUpload fontSize={15} />}
                  onPress={() => setIsImportModalOpen(true)}
                >
                  Import CSV
                </Button>
                <Button
                  variant="ghost"
                  className="border-small"
                  size="sm"
                  startContent={<LuDownload fontSize={15} />}
                  onPress={() => setIsExportModalOpen(true)}
                >
                  Export
                </Button>
              </div>
            </div>

            {showDateRange && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background p-4 rounded-xl border border-primary/15 flex flex-col md:flex-row gap-4 items-end"
              >
                <DatePicker
                  label="Start Date"
                  labelPlacement="outside"
                  size="sm"
                  className="max-w-[200px]"
                  value={dateRange.start ? parseDate(dateRange.start) : null}
                  onChange={(date) =>
                    setDateRange((prev) => ({
                      ...prev,
                      start: date ? date.toString() : "",
                    }))
                  }
                />
                <DatePicker
                  label="End Date"
                  labelPlacement="outside"
                  size="sm"
                  className="max-w-[200px]"
                  value={dateRange.end ? parseDate(dateRange.end) : null}
                  onChange={(date) =>
                    setDateRange((prev) => ({
                      ...prev,
                      end: date ? date.toString() : "",
                    }))
                  }
                />
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    color="default"
                    size="sm"
                    onPress={handleClearDateRange}
                    startContent={<LuX fontSize={15} />}
                    className="border-small"
                  >
                    Clear
                  </Button>
                  <Button
                    variant="solid"
                    color="primary"
                    size="sm"
                    onPress={handleApplyDateRange}
                    startContent={<LuCheck fontSize={15} />}
                  >
                    Apply
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
          <div className="space-y-4 md:space-y-5">
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
              {STAT_CARD_DATA.map((data, i) => (
                <MiniStatsCard key={i} cardData={data} />
              ))}
            </div>
          </div>
          {data && data?.budgets.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Card
                shadow="none"
                radius="lg"
                className="p-0 border border-primary/15"
              >
                <CardHeader className="p-5">
                  <h4 className="flex  items-center gap-2 text-sm">
                    <LuChartColumn fontSize={16} /> Spending vs Budget Trend
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
                      data={data?.graphs?.monthlyBudgetGraph}
                      margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tickMargin={8} />
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
                        name="Budget"
                        barSize={40}
                        fill="#3b82f6"
                        isAnimationActive
                      />
                      <Bar
                        dataKey="spend"
                        name="Spend"
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
                    <FiPieChart fontSize={16} /> Budget by Category
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
                      data={pieData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius="100%"
                      isAnimationActive
                      label={PieChartCustomLabel}
                      className="w-1/2"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
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
                Budget Items
              </h4>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <LoadingState />
              ) : !data || data?.budgets?.length <= 0 ? (
                <EmptyState title="No budget items found for the selected period. Try adjusting your search or filters." />
              ) : (
                <>
                  <div className="space-y-3">
                    {data?.budgets.map((item: BudgetItem) => (
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
        syncedProviders={syncedProviders}
      />

      <ExportBudgetModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <ImportBudgetModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
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
