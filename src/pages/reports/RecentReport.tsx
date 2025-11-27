import { Card, CardBody } from "@heroui/react";
import clsx from "clsx";
import {
  LuFileText,
  LuCheck,
  LuDownload,
  LuShare,
  LuClock,
} from "react-icons/lu";

export interface ReportItem {
  id: number;
  title: string;
  description: string;
  status: "Ready" | "Processing";
  fileType: "PDF" | "Excel" | "CSV";
  fileSize: string;
  onClickDownload: () => void;
  onClickShare: () => void;
}

export interface RecentReportsListProps {
  reports?: ReportItem[];
}

const MOCK_REPORTS: ReportItem[] = [
  {
    id: 1,
    title: " 2024 Marketing ROI Analysis",
    description:
      "Comprehensive analysis of marketing return on investment for Q1",
    status: "Ready",
    fileType: "PDF",
    fileSize: "3.2 MB",
    onClickDownload: () => console.log("Download Q1 ROI"),
    onClickShare: () => console.log("Share Q1 ROI"),
  },
  {
    id: 2,
    title: "January Referral Performance Report",
    description: "Monthly referral summary with doctor performance metrics",
    status: "Ready",
    fileType: "Excel",
    fileSize: "2.8 MB",
    onClickDownload: () => console.log("Download Jan Referral"),
    onClickShare: () => console.log("Share Jan Referral"),
  },
  {
    id: 3,
    title: "Social Media Engagement Report",
    description: "Social media engagement and reach analysis",
    status: "Processing",
    fileType: "PDF",
    fileSize: "-",
    onClickDownload: () => console.log("Download Social Media (disabled)"),
    onClickShare: () => console.log("Share Social Media"),
  },
  {
    id: 4,
    title: "Communication Analytics Dashboard",
    description: "Call volume and conversion tracking analysis",
    status: "Ready",
    fileType: "CSV",
    fileSize: "1.9 MB",
    onClickDownload: () => console.log("Download Analytics Dashboard"),
    onClickShare: () => console.log("Share Analytics Dashboard"),
  },
  {
    id: 5,
    title: "Review Sentiment Analysis",
    description: "Customer review sentiment and rating trends",
    status: "Ready",
    fileType: "PDF",
    fileSize: "1.5 MB",
    onClickDownload: () => console.log("Download Review Sentiment"),
    onClickShare: () => console.log("Share Review Sentiment"),
  },
];

interface ReportBadgeProps {
  status: "Ready" | "Processing";
}

const ReportBadge: React.FC<ReportBadgeProps> = ({ status }) => {
  const isReady = status === "Ready";
  const bgColor = isReady ? "bg-green-100" : "bg-yellow-100";
  const textColor = isReady ? "text-green-800" : "text-yellow-800";
  const Icon = isReady ? LuCheck : LuClock;

  return (
    <span
      data-slot="badge"
      className={clsx(
        "inline-flex items-center justify-center rounded-md  px-2 py-0.5 text-[10px] font-medium w-fit whitespace-nowrap shrink-0 gap-1 overflow-hidden transition-[color,box-shadow]",
        bgColor,
        textColor
      )}
    >
      <Icon className="h-3 w-3 mr-1" aria-hidden="true" />
      {status}
    </span>
  );
};

const RecentReportsList = ({
  reports = MOCK_REPORTS,
}: RecentReportsListProps) => {
  return (
    <Card
      shadow="none"
      className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl p-2 "
    >
      <div
        data-slot="card-header"
        className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5  "
      >
        <h4 data-slot="card-title" className="leading-none text-[14px]">
          Recent Reports
        </h4>
      </div>
      <CardBody className="[&:last-child]">
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4   border border-gray-200  rounded-lg"
            >
              <div className="flex items-center gap-3">
                <LuFileText
                  className="h-5 w-5 text-gray-500"
                  aria-hidden="true"
                />
                <div>
                  <h4 className="font-medium text-[14px]">{report.title}</h4>
                  <p className="text-[12px] text-gray-600">
                    {report.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1 !text-[10px] ">
                    <ReportBadge status={report.status} />
                    <span className="!text-[10px] text-gray-500">
                      {report.fileType} •{report.fileSize}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  data-slot="button"
                  onClick={report.onClickDownload}
                  disabled={report.status === "Processing"}
                  className={clsx(
                    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md gap-1.5 px-3  border border-gray-200 bg-background text-foreground hover:bg-[#fed7aa] hover:text-[#ea580c]"
                  )}
                >
                  <LuDownload className="h-4 w-4 mr-2" aria-hidden="true" />
                  Download
                </button>
                <button
                  data-slot="button"
                  onClick={report.onClickShare}
                  className={clsx(
                    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all h-8 rounded-md gap-1.5 px-3 border border-gray-200 bg-background text-foreground hover:bg-[#fed7aa] hover:text-[#ea580c]"
                  )}
                >
                  <LuShare className="h-4 w-4 mr-2" aria-hidden="true" />
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default RecentReportsList;
