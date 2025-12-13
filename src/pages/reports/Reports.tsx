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
import { ReportItem } from "../../types/reports";
import GenerateNewReport from "./GenerateNewReport";
import SampleReports from "./SampleReports";

const Reports = () => {
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState({
    id: "report-001",
    name: "Generate New Report",
  });

  const STAT_CARD_DATA = [
    {
      icon: <LuFileText className="text-blue-500" />,
      heading: "Reports Generated",
      value: "45",
      subheading: <span className="text-green-600">+8 this month</span>,
      subValueClass: "text-green-600",
    },
    {
      icon: <LuActivity className="text-green-500" />,
      heading: "Data Sources",
      value: "12",
      subheading: <span className="text-gray-600">Connected</span>,
    },
    {
      icon: <LuClock className="text-purple-500" />,
      heading: "Scheduled Reports",
      value: "8",
      subheading: <span className="text-blue-500">Auto-generated</span>,
    },
    {
      icon: <LuDownload className="text-orange-500" />,
      heading: "Export Formats",
      value: "4",
      subheading: (
        <span className="text-gray-600">PDF, Excel, CSV, Dashboard</span>
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
          setReportData({
            id: "report-001",
            name: "Generate New Report",
          });
          setIsNewReportModalOpen(true);
        },
        icon: <AiOutlinePlus fontSize={15} />,
        variant: "solid" as const,
        color: "primary" as const,
      },
    ],
  };

  const MOCK_REPORTS: ReportItem[] = [
    {
      id: 1,
      title: " 2024 Marketing ROI Analysis",
      description:
        "Comprehensive analysis of marketing return on investment for Q1",
      status: "ready",
      fileType: "PDF",
      fileSize: "3.2 MB",
      onClickDownload: () => console.log("Download Q1 ROI"),
      onClickShare: () => console.log("Share Q1 ROI"),
    },
    {
      id: 2,
      title: "January Referral Performance Report",
      description: "Monthly referral summary with doctor performance metrics",
      status: "ready",
      fileType: "Excel",
      fileSize: "2.8 MB",
      onClickDownload: () => console.log("Download Jan Referral"),
      onClickShare: () => console.log("Share Jan Referral"),
    },
    {
      id: 3,
      title: "Social Media Engagement Report",
      description: "Social media engagement and reach analysis",
      status: "processing",
      fileType: "PDF",
      fileSize: "",
      onClickDownload: () => console.log("Download Social Media (disabled)"),
      onClickShare: () => console.log("Share Social Media"),
    },
    {
      id: 4,
      title: "Communication Analytics Dashboard",
      description: "Call volume and conversion tracking analysis",
      status: "ready",
      fileType: "CSV",
      fileSize: "1.9 MB",
      onClickDownload: () => console.log("Download Analytics Dashboard"),
      onClickShare: () => console.log("Share Analytics Dashboard"),
    },
    {
      id: 5,
      title: "Review Sentiment Analysis",
      description: "Customer review sentiment and rating trends",
      status: "ready",
      fileType: "PDF",
      fileSize: "1.5 MB",
      onClickDownload: () => console.log("Download Review Sentiment"),
      onClickShare: () => console.log("Share Review Sentiment"),
    },
  ];

  return (
    <>
      <ComponentContainer headingData={HEADING_DATA}>
        <div className="flex flex-col gap-5">
          <div className="space-y-5">
            <SampleReports />
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              {STAT_CARD_DATA.map((data, i) => (
                <MiniStatsCard key={i} cardData={data} />
              ))}
            </div>
          </div>
          <div className="bg-background flex flex-col rounded-xl border border-primary/15 p-4">
            <div className="pb-4">
              <h4 className="text-sm font-medium">Recent Reports</h4>
            </div>
            <div className="space-y-3">
              {MOCK_REPORTS.map((report: ReportItem) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between border border-foreground/10 p-4 bg-background rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <LuFileText className="size-5 text-gray-500" />
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">{report.title}</h4>
                      <p className="text-xs text-gray-600">
                        {report.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-xs">
                        <ReportStatusChip status={report.status} />
                        <span className="text-gray-500">
                          {`${report.fileType}${
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
                        onPress={report.onClickDownload}
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
                        onPress={report.onClickShare}
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
          </div>
        </div>
      </ComponentContainer>
      <GenerateNewReport
        isOpen={isNewReportModalOpen}
        onClose={() => setIsNewReportModalOpen(false)}
        practice={reportData}
      />
    </>
  );
};

export default Reports;
