import { Button, Card, CardBody, CardHeader, DatePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
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
  LuTarget,
  LuTrendingDown,
  LuTrendingUp,
  LuUpload,
  LuX,
} from "react-icons/lu";
import { TrendIndicator } from "../../components/common/TrendIndicator";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import EmptyState from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";
import Pagination from "../../components/common/Pagination";
import ChartTooltip from "../../components/common/ChartTooltip";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { BUDGET_DURATIONS, getCategoryColor } from "../../consts/budget";
import { useBudgetItems, useDeleteBudgetItem } from "../../hooks/useBudget";
import { BudgetItem } from "../../types/budget";
import BudgetItemCard from "./BudgetItemCard";
import BudgetActionModal from "./modal/BudgetActionModal";
import ExportBudgetModal from "./modal/ExportBudgetModal";
import ImportBudgetModal from "./modal/ImportBudgetModal";
import { usePaginationAdjustment } from "../../hooks/common/usePaginationAdjustment";

const MarketingBudget = () => {
  const { theme } = useTypedSelector((state) => state.ui);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBudgetItem, setEditBudgetItem] = useState<BudgetItem | null>(null);
  const [deleteBudgetItemId, setDeleteBudgetItemId] = useState("");
  const [currentFilters, setCurrentFilters] = useState<any>({
    period: "monthly",
    page: 1,
    limit: 10,
  });
  const [showDateRange, setShowDateRange] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

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

  usePaginationAdjustment({
    totalPages: data?.pagination?.totalPages || 0,
    currentPage: currentFilters.page,
    onPageChange: (page) =>
      setCurrentFilters((prev: any) => ({ ...prev, page })),
    isLoading,
  });

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
    totalSpent: { value: "0", percentage: "0", status: "" },
    remainingBudget: { value: "0", percentage: "0", status: "" },
    budgetUtilization: "0",
    avgROI: "0",
  };
  const totalBudget = Number(stats.totalBudget);
  const totalSpent = Number(stats.totalSpent.value);
  const remainingBudget = Number(stats.remainingBudget.value);
  const avgROI = Number(stats.avgROI);

  const STAT_CARD_DATA = [
    {
      icon: <LuTarget className="text-blue-600 dark:text-blue-400" />,
      heading: "Total Budget",
      value: isLoading ? "..." : `$${totalBudget.toLocaleString()}`,
    },
    {
      icon: <LuDollarSign className="text-green-600 dark:text-green-400" />,
      heading: "Total Spent",
      value: isLoading ? "..." : `$${totalSpent.toLocaleString()}`,
      subheading: (
        <TrendIndicator
          status={stats.totalSpent.status}
          percentage={stats.totalSpent.percentage}
          label="of budget"
          isLoading={isLoading}
        />
      ),
    },
    {
      icon: <LuCalculator className="text-yellow-600 dark:text-yellow-400" />,
      heading: "Remaining Budget",
      value: isLoading ? "..." : `$${remainingBudget.toLocaleString()}`,
      subheading: (
        <TrendIndicator
          status={stats.remainingBudget.status}
          percentage={stats.remainingBudget.percentage}
          label="remaining"
          isLoading={isLoading}
          useFormattedValue={false}
        />
      ),
    },
    {
      icon: <IoMdTrendingUp className="text-purple-600 dark:text-purple-400" />,
      heading: "Average ROI",
      value: isLoading ? "..." : `${avgROI}%`,
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
          <div className="relative p-1 h-fit gap-2 items-center flex-nowrap overflow-x-scroll scrollbar-hide flex w-full rounded-full bg-primary/15 dark:bg-background text-xs">
            {BUDGET_DURATIONS.map((duration: any) => {
              return (
                <div key={duration.value} className="relative flex-1 min-h-9">
                  <Button
                    size="sm"
                    radius="full"
                    color="default"
                    className={`relative z-1 font-medium text-sm bg-transparent h-9 text-default-500 ${
                      currentFilters.period === duration.value
                        ? "dark:text-background text-foreground"
                        : ""
                    }`}
                    onPress={() => {
                      setDateRange({ start: "", end: "" });
                      setCurrentFilters((prev: any) => ({
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
                      className="absolute top-0 left-0 w-full h-full bg-background dark:bg-primary shadow-small rounded-full -z-0"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap justify-between items-center gap-3 bg-background p-4 rounded-xl border border-foreground/10">
              <div className="flex items-center gap-2">
                <Button
                  variant={showDateRange ? "solid" : "ghost"}
                  color={showDateRange ? "primary" : "default"}
                  className={`border ${
                    !showDateRange
                      ? "bg-background dark:bg-default-50 border-gray-300 dark:border-default-200"
                      : "border-primary"
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
                  className="border-small border-gray-300 dark:border-default-200"
                  size="sm"
                  startContent={<LuUpload fontSize={15} />}
                  onPress={() => setIsImportModalOpen(true)}
                >
                  Import CSV
                </Button>
                <Button
                  variant="ghost"
                  className="border-small border-gray-300 dark:border-default-200"
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
                className="bg-background p-4 rounded-xl border border-foreground/10 flex flex-col md:flex-row gap-4 items-end"
              >
                <DatePicker
                  label="Start Date"
                  labelPlacement="outside"
                  size="sm"
                  className="md:max-w-[200px]"
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
                  className="md:max-w-[200px]"
                  value={dateRange.end ? parseDate(dateRange.end) : null}
                  minValue={dateRange.start ? parseDate(dateRange.start) : null}
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
                    className="border-small border-gray-300 dark:border-default-200"
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
                className="p-0 border border-foreground/10 bg-background"
              >
                <CardHeader className="p-5">
                  <h4 className="flex items-center gap-2 text-sm text-foreground">
                    <LuChartColumn fontSize={16} /> Spending vs Budget Trend
                  </h4>
                </CardHeader>
                <CardBody className="p-5 pt-0">
                  <div className="w-full h-[300px] md:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data?.graphs?.monthlyBudgetGraph}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        style={{ outline: "none", fontSize: "12px" }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="currentColor"
                          className="text-gray-200 dark:text-default-100"
                          opacity={0.5}
                        />
                        <XAxis
                          dataKey="month"
                          tickMargin={8}
                          stroke="currentColor"
                          className="text-gray-400 dark:text-foreground/40"
                        />
                        <YAxis
                          width={60}
                          tickMargin={8}
                          stroke="currentColor"
                          className="text-gray-400 dark:text-foreground/40"
                        />
                        <Tooltip
                          content={<ChartTooltip />}
                          cursor={{
                            fill:
                              theme === "dark"
                                ? "rgba(255, 255, 255, 0.05)"
                                : "rgba(128, 128, 128, 0.1)",
                          }}
                        />
                        <Legend
                          wrapperStyle={{
                            paddingTop: "20px",
                            textTransform: "capitalize",
                          }}
                        />
                        <Bar
                          dataKey="budget"
                          name="Budget"
                          barSize={32}
                          fill="#3b82f6"
                          isAnimationActive
                        />
                        <Bar
                          dataKey="spend"
                          name="Spend"
                          barSize={32}
                          fill="#10b981"
                          isAnimationActive
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>

              <Card
                shadow="none"
                radius="lg"
                className="p-0 border border-foreground/10 bg-background"
              >
                <CardHeader className="p-5">
                  <h4 className="flex items-center gap-2 text-sm text-foreground">
                    <FiPieChart fontSize={16} /> Budget by Category
                  </h4>
                </CardHeader>
                <CardBody className="text-xs px-3 pb-5 h-[350px] md:h-[450px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={isMobile ? "80%" : "70%"}
                        isAnimationActive
                        label={isMobile ? false : PieChartCustomLabel}
                        labelLine={!isMobile}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                      {isMobile && (
                        <Legend
                          verticalAlign="bottom"
                          align="center"
                          wrapperStyle={{
                            paddingTop: "20px",
                            fontSize: "12px",
                            textTransform: "capitalize",
                          }}
                        />
                      )}
                    </PieChart>
                  </ResponsiveContainer>
                </CardBody>
              </Card>
            </div>
          )}

          <div className="bg-background flex flex-col rounded-xl border border-foreground/10 p-4">
            <div className="pb-4">
              <h4 className="text-sm font-medium w-full truncate whitespace-nowrap text-foreground">
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
                  {pagination && pagination.totalPages > 1 && (
                    <Pagination
                      identifier="items"
                      limit={currentFilters.limit}
                      totalItems={pagination.totalData}
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      handlePageChange={(page: number) => {
                        setCurrentFilters((prev: any) => ({ ...prev, page }));
                      }}
                    />
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
        filters={{
          period: currentFilters.period,
          startDate: currentFilters.startDate,
          endDate: currentFilters.endDate,
        }}
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
