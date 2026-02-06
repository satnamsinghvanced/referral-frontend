import { Button } from "@heroui/react";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import {
  LuActivity,
  LuClock,
  LuDownload,
  LuFileText,
  LuShare,
} from "react-icons/lu";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import ReportStatusChip from "../../components/chips/ReportStatusChip";
import ComponentContainer from "../../components/common/ComponentContainer";
import EmptyState from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";
import Pagination from "../../components/common/Pagination";
import { CATEGORIES } from "../../consts/reports";
import { useReports } from "../../hooks/useReports";
import { Report } from "../../types/reports";
import GenerateNewReport from "./GenerateNewReport";
import SampleReports from "./SampleReports";

const Reports = () => {
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useReports(currentPage, limit);

  const reports = data?.reports || [];
  const stats = data?.stats;
  const pagination = data?.pagination;

  const STAT_CARD_DATA = [
    {
      icon: <LuFileText className="text-blue-500" />,
      heading: "Reports Generated",
      value: stats?.reportsGenerated.total.toString() || "0",
      subheading: (
        <span className="text-green-600">
          +{stats?.reportsGenerated.growth || 0} this month
        </span>
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
                            <span className="text-gray-500 dark:text-foreground/40">
                              {`${report.format.toUpperCase()}${
                                report.fileSize ? ` • ${report.fileSize}` : ""
                              }`}
                            </span>
                          </div>
                        </div>
                      </div>
                      {report.status === "ready" && (
                        <div className="flex gap-2">
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
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {pagination && pagination.totalPages > 1 && (
                  <div className="pt-4">
                    <Pagination
                      identifier="reports"
                      currentPage={currentPage}
                      totalPages={pagination.totalPages}
                      totalItems={pagination.totalData}
                      handlePageChange={setCurrentPage}
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
