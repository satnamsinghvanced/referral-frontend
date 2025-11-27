import { Card, CardBody, Button } from "@heroui/react";
import { LuChartColumn, LuUsers, LuStar, LuEye } from "react-icons/lu";
import { Link } from "react-router";

interface ReportCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  slug: string;
}

const reports: ReportCard[] = [
  {
    title: "Marketing ROI Analysis",
    description:
      "Complete breakdown of marketing performance, spend efficiency, and conversion tracking across all channels.",
    icon: <LuChartColumn />,
    color: "text-green-600",
    slug: "marketing",
  },
  {
    title: "Referral Performance",
    description:
      "Detailed analysis of doctor and patient referrals, conversion rates, and referral source effectiveness.",
    icon: <LuUsers />,
    color: "text-blue-600",
    slug: "referral",
  },
  {
    title: "Review Sentiment Analysis",
    description:
      "Comprehensive review analytics including sentiment analysis, response tracking, and reputation monitoring.",
    icon: <LuStar />,
    color: "text-yellow-600",
    slug: "reviews",
  },
];

export default function SampleReports() {
  return (
    <div className="p-6  rounded-xl border-1 border-[#bedbff] bg-gradient-to-r from-[#eff6ff] to-[#faf5ff] ">
      <h4 className="text-[14px] text-[#364153] flex items-center gap-2 font-regular mb-[28px]">
        <LuEye className="h-4 w-4 text-[#155dfc]" /> Sample Reports Available
      </h4>
      <p className="mb-6 text-[#364153] text-[14px]">
        Explore our comprehensive sample reports to see the detailed insights
        and analytics available in Referral Retriever.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reports.map((report, idx) => (
          <Card
            key={idx}
            className="flex flex-col gap-6 cursor-pointer hover:shadow-md transition-shadow"
          >
            <CardBody className="p-4 [&:last-child]:pb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={`${report.color} h-5 w-5`}>{report.icon}</span>
                <h3 className="font-medium text-[#0a0a0a] text-[14px]">
                  {report.title}
                </h3>
              </div>
              <p className="text-sm mb-3 text-[#4a5565] text-[12px]">
                {report.description}
              </p>
              <Link to={`/reports/${report.slug}`}>
                <Button className="w-full inline-flex items-center gap-2 h-8 bg-[#fff] border-1 border-[#0ea5e921] text-[12px] text-[#0a0a0a] font-medium hover:bg-[#fed7aa] hover:text-[#ea580c]">
                  <LuEye className="h-4 w-4" />
                  View Sample
                </Button>
              </Link>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
