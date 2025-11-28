import { useState } from "react";
import { LuFileText, LuActivity, LuClock, LuDownload } from "react-icons/lu";
import { AiOutlinePlus } from "react-icons/ai";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import SampleReports from "./SampleReports";
import RecentReportsList from "./RecentReport";
import GenerateNewReport from "./GenerateNewReport";

const Reports = () => {
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState({
    id: "report-001",
    name: "Generate New Report",
  });
  const STAT_CARD_DATA = [
    {
      icon: <LuFileText className="text-[20px] mt-1 text-blue-500" />,
      heading: "Reports Generated",
      value: "45",
      subheading: <span className="text-green-600">+8 this month</span>,
      subValueClass: "text-green-600",
    },
    {
      icon: <LuActivity className="text-[20px] mt-1 text-green-500" />,
      heading: "Data Sources",
      value: "12",
      subheading: <span className="text-gray-600">Connected</span>,
    },
    {
      icon: <LuClock className="text-[20px] mt-1 text-purple-500" />,
      heading: "Scheduled Reports",
      value: "8",
      subheading: <span className="text-blue-500">Auto-generated</span>,
    },
    {
      icon: <LuDownload className="text-[20px] mt-1 text-orange-500" />,
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
          <div className="border border-gray-200 bg-white rounded-[12px] p-[21px]">
            <RecentReportsList />
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
