import { Button, Card, CardBody } from "@heroui/react";
import { LuChartColumn, LuEye, LuStar, LuUsers } from "react-icons/lu";
import { useNavigate } from "react-router";

interface ReportCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  slug: string;
}

const REPORTS: ReportCard[] = [
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
    slug: "review",
  },
];

export default function SampleReports() {
  const navigate = useNavigate();

  return (
    <div className="p-4 rounded-xl border-1 border-foreground/10 bg-gradient-to-r from-[#eff6ff] to-[#faf5ff] dark:from-background/50 dark:to-background">
      <div className="mb-5 space-y-2.5">
        <h4 className="text-sm text-[#364153] dark:text-white flex items-center gap-2 font-regular">
          <LuEye className="size-[18px] text-blue-600" /> Sample Reports
          Available
        </h4>
        <p className="text-gray-600 dark:text-foreground/60 text-xs">
          Explore our comprehensive sample reports to see the detailed insights
          and analytics available in Referral Retriever.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {REPORTS.map((report) => (
          <Card
            key={report.title}
            shadow="none"
            className="flex flex-col gap-6 bg-content1 border border-transparent"
          >
            <CardBody className="p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <span className={`${report.color}`}>{report.icon}</span>
                <h3 className="font-medium text-sm">{report.title}</h3>
              </div>
              <p className="mb-3.5 text-gray-500 dark:text-foreground/40 text-xs">
                {report.description}
              </p>
              <Button
                size="sm"
                radius="sm"
                variant="ghost"
                color="default"
                className="border-small"
                fullWidth
                onPress={() => navigate(report.slug)}
              >
                <LuEye className="size-4" />
                View Sample
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
