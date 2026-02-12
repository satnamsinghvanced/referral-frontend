import { Button, Chip, Input, Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import {
  LuActivity,
  LuClock,
  LuDownload,
  LuFileText,
  LuPause,
  LuPlay,
  LuShare,
} from "react-icons/lu";
import { TrendIndicator } from "../../components/common/TrendIndicator";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import ReportStatusChip from "../../components/chips/ReportStatusChip";
import ComponentContainer from "../../components/common/ComponentContainer";
import EmptyState from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";
import Pagination from "../../components/common/Pagination";
import { EVEN_PAGINATION_LIMIT } from "../../consts/consts";
import { CATEGORIES, FREQUENCIES } from "../../consts/reports";
import { useDebouncedValue } from "../../hooks/common/useDebouncedValue";
import { useReports, useUpdateReport } from "../../hooks/useReports";
import { Report } from "../../types/reports";
import GenerateNewReport from "./GenerateNewReport";
import SampleReports from "./SampleReports";
import { usePaginationAdjustment } from "../../hooks/common/usePaginationAdjustment";

const Reports = () => {
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    frequency: "",
    page: 1,
    limit: EVEN_PAGINATION_LIMIT,
  });

  const onFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const onSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const debouncedSearch = useDebouncedValue(filters.search, 500);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  const { data, isLoading } = useReports({
    ...filters,
    search: debouncedSearch,
  });

  const { mutate: updateReport, isPending: isUpdatingReport } =
    useUpdateReport();

  const reports = data?.reports || [];
  const stats = data?.stats;
  const pagination = data?.pagination;

  usePaginationAdjustment({
    totalPages: pagination?.totalPages || 0,
    currentPage: filters.page,
    onPageChange: (page) => handlePageChange(page),
    isLoading,
  });

  const STAT_CARD_DATA = [
    {
      icon: <LuFileText className="text-blue-500" />,
      heading: "Reports Generated",
      value: stats?.reportsGenerated.total.toString() || "0",
      subheading: (
        <TrendIndicator
          status="increment"
          valueOverride={`+${stats?.reportsGenerated.growth || 0}`}
          label="this month"
        />
      ),
      subValueClass: "text-green-600",
    },
    {
      icon: <LuActivity className="text-green-500" />,
      heading: "Data Sources",
      value: stats?.dataSources.count.toString() || "5", // This might need a real API eventually
      subheading: (
        <span className="text-gray-600 dark:text-foreground/40">Connected</span>
      ),
    },
    {
      icon: <LuClock className="text-purple-500" />,
      heading: "Scheduled Reports",
      value: stats?.scheduledReports.total.toString() || "0",
      subheading: <span className="text-blue-500">Auto-generated</span>,
    },
    {
      icon: <LuDownload className="text-orange-500" />,
      heading: "Export Formats",
      value: stats?.exportFormats.count.toString() || "3",
      subheading: (
        <span className="text-gray-600 dark:text-foreground/40">
          {stats?.exportFormats.types.join(", ") || "PDF, Excel, CSV"}
        </span>
      ),
    },
  ];

  const HEADING_DATA = {
    heading: "Marketing Reports",
    subHeading:
      "Generate comprehensive reports on all aspects of your marketing performance",
    buttons: [
      {
        label: "Generate New Report",
        onClick: () => {
          setIsNewReportModalOpen(true);
        },
        icon: <AiOutlinePlus fontSize={15} />,
        variant: "solid" as const,
        color: "primary" as const,
      },
    ],
  };

  const handleDownload = async (report: Report) => {
    if (!report.fileUrl) return;

    try {
      const response = await fetch(report.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        report.fileName || `report-${report._id}.${report.format}`,
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback to opening in new tab if blob fetch fails (e.g. CORS)
      window.open(report.fileUrl, "_blank");
    }
  };

  const handleShare = async (report: Report) => {
    if (!report.fileUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: report.name,
          text: `Check out this marketing report: ${report.name}`,
          url: report.fileUrl,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(report.fileUrl);
        alert("Report link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleToggleSchedule = (report: Report) => {
    setUpdatingId(report._id);
    updateReport(
      {
        id: report._id,
        payload: { isPaused: !report.isPaused },
      },
      {
        onSettled: () => setUpdatingId(null),
      },
    );
  };

  return (
    <>
      <ComponentContainer headingData={HEADING_DATA}>
        <div className="flex flex-col gap-4 md:gap-5">
          <div className="space-y-4 md:space-y-5">
            <SampleReports />
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
              {STAT_CARD_DATA.map((data, i) => (
                <MiniStatsCard key={i} cardData={data} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-foreground/10 rounded-xl p-4 bg-background shadow-none">
            <div className="relative flex-1">
              <Input
                placeholder="Search reports by name"
                size="sm"
                value={filters.search}
                onValueChange={onSearchChange}
                startContent={
                  <FiSearch className="text-gray-400 dark:text-foreground/40 h-4 w-4" />
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                aria-label="Categories"
                placeholder="All Categories"
                size="sm"
                selectedKeys={[filters.category]}
                disabledKeys={[filters.category]}
                onSelectionChange={(keys) =>
                  onFilterChange(
                    "category",
                    (Array.from(keys)[0] as string) || "",
                  )
                }
              >
                <>
                  <SelectItem key="" className="capitalize">
                    All Categories
                  </SelectItem>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.key} className="capitalize">
                      {category.label}
                    </SelectItem>
                  ))}
                </>
              </Select>

              <Select
                aria-label="Frequencies"
                placeholder="All Frequencies"
                size="sm"
                selectedKeys={[filters.frequency]}
                disabledKeys={[filters.frequency]}
                onSelectionChange={(keys) =>
                  onFilterChange(
                    "frequency",
                    (Array.from(keys)[0] as string) || "",
                  )
                }
              >
                <>
                  <SelectItem key="" className="capitalize">
                    All Frequencies
                  </SelectItem>
                  {FREQUENCIES.map((frequency) => (
                    <SelectItem key={frequency.key} className="capitalize">
                      {frequency.label}
                    </SelectItem>
                  ))}
                </>
              </Select>
            </div>
          </div>

          <div className="bg-background flex flex-col rounded-xl border border-foreground/10 p-4">
            <div className="pb-4">
              <h4 className="text-sm font-medium">Recent Reports</h4>
            </div>

            {isLoading ? (
              <div className="py-20 flex justify-center items-center">
                <LoadingState />
              </div>
            ) : reports.length > 0 ? (
              <>
                <div className="space-y-3">
                  {reports.map((report: Report) => (
                    <div
                      key={report._id}
                      className="md:flex md:items-center md:justify-between max-md:space-y-4 border border-foreground/10 p-4 bg-content1 rounded-lg"
                    >
                      <div className="flex items-center gap-3 max-sm:flex-col max-sm:items-start">
                        <LuFileText className="size-5 text-gray-500 dark:text-foreground/40" />
                        <div className="space-y-1.5">
                          <h4 className="font-medium text-sm">{report.name}</h4>
                          <p className="text-xs text-gray-600 dark:text-foreground/60">
                            {CATEGORIES.find((c) => c.key === report.category)
                              ?.label || "Report"}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs">
                            <ReportStatusChip status={report.status} />
                            {report.schedule && (
                              <Chip
                                size="sm"
                                radius="sm"
                                variant="flat"
                                className={`capitalize text-[11px] h-5 border ${
                                  report.isPaused
                                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                }`}
                              >
                                {report.isPaused ? "Paused" : "Scheduled"}
                              </Chip>
                            )}
                            <span className="text-gray-500 dark:text-foreground/40">
                              {`${report.format.toUpperCase()}${
                                report.fileSize ? ` • ${report.fileSize}` : ""
                              }`}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {report.schedule && (
                          <Button
                            size="sm"
                            radius="sm"
                            variant="ghost"
                            color="default"
                            onPress={() => handleToggleSchedule(report)}
                            className="border-small"
                            isLoading={
                              isUpdatingReport && updatingId === report._id
                            }
                            startContent={
                              report.isPaused ? (
                                <LuPlay className="size-3.5" />
                              ) : (
                                <LuPause className="size-3.5" />
                              )
                            }
                          >
                            {report.isPaused ? "Resume" : "Pause"}
                          </Button>
                        )}
                        {report.status === "ready" && (
                          <>
                            <Button
                              size="sm"
                              radius="sm"
                              variant="ghost"
                              color="default"
                              onPress={() => handleDownload(report)}
                              className="border-small"
                              startContent={<LuDownload className="size-3.5" />}
                            >
                              Download
                            </Button>
                            <Button
                              size="sm"
                              radius="sm"
                              variant="ghost"
                              color="default"
                              onPress={() => handleShare(report)}
                              className="border-small"
                              startContent={<LuShare className="size-3.5" />}
                            >
                              Share
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {pagination && pagination.totalPages > 1 && (
                  <div className="pt-4">
                    <Pagination
                      identifier="reports"
                      currentPage={filters.page}
                      totalPages={pagination.totalPages}
                      totalItems={pagination.totalData}
                      handlePageChange={(page) => handlePageChange(page)}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="py-10">
                <EmptyState
                  title="No reports found"
                  message="Generate your first marketing report to see it here."
                />
              </div>
            )}
          </div>
        </div>
      </ComponentContainer>
      <GenerateNewReport
        isOpen={isNewReportModalOpen}
        onClose={() => setIsNewReportModalOpen(false)}
        practice={null}
      />
    </>
  );
};

export default Reports;
