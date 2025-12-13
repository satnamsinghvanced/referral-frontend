import { FaRegEnvelope } from "react-icons/fa";
import { FiClock, FiEdit, FiZap } from "react-icons/fi";
import { LuChartColumn, LuPause, LuPlay } from "react-icons/lu";
import CampaignStatusChip from "../../components/chips/CampaignStatusChip";
import { Dispatch, SetStateAction } from "react";

const RECENT_CAMPAIGNS = [
  {
    title: "New Referral Partner Outreach",
    subtitle: "Partnership Opportunity - Referral Retriever",
    recipients: 245,
    createdDate: "1/15/2024",
    status: "active",
    opens: "68.5%",
    clicks: "24.3%",
  },
  {
    title: "Patient Thank You Series",
    subtitle: "Thank you for choosing our practice!",
    recipients: 892,
    createdDate: "1/10/2024",
    status: "active",
    opens: "82.1%",
    clicks: "31.7%",
  },
  {
    title: "Monthly Practice Newsletter",
    subtitle: "January Updates & New Services",
    recipients: 1247,
    createdDate: "1/20/2024",
    status: "scheduled",
  },
];

interface OverviewProps {
  setIsActionModalOpen: Dispatch<SetStateAction<boolean>>;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

const Overview = ({ setIsActionModalOpen, setActiveTab }: OverviewProps) => {
  const ACTION_CARDS = [
    {
      title: "Create Email Campaign",
      description: "Send targeted emails to specific audiences",
      icon: FaRegEnvelope,
      onClick: () => setIsActionModalOpen(true),
    },
    {
      title: "Setup Automation",
      description: "Create automated email sequences",
      icon: FiZap,
      onClick: () => setActiveTab("automation"),
    },
    {
      title: "Browse Templates",
      description: "Use pre-built email templates",
      icon: LuChartColumn,
      onClick: () => setActiveTab("templates"),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 border border-primary/15 rounded-xl p-4 bg-background">
        <h4 className="font-medium text-sm">Recent Campaigns</h4>

        <div className="space-y-3">
          {RECENT_CAMPAIGNS.map((campaign) => {
            const {
              title,
              subtitle,
              recipients,
              createdDate,
              status,
              opens,
              clicks,
            } = campaign;
            const isScheduled = status === "scheduled";

            return (
              <div
                key={campaign.title}
                className="flex justify-between items-center p-3.5 border border-primary/15 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-block">
                    {status === "scheduled" ? (
                      <FiClock className="text-blue-500 text-lg" />
                    ) : status === "paused" ? (
                      <LuPause className="text-yellow-500 text-lg" />
                    ) : status === "draft" ? (
                      <FiEdit className="text-gray-500 text-lg" />
                    ) : (
                      <LuPlay className="text-green-500 text-lg" />
                    )}
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-gray-600">{subtitle}</p>
                    <div className="text-xs text-gray-500">
                      <span>{recipients} recipients</span>
                      <span className="mx-1.5">•</span>
                      <span>Created {createdDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {isScheduled ? (
                    <CampaignStatusChip status={status} />
                  ) : (
                    <div className="flex flex-col items-end gap-2 text-xs">
                      <CampaignStatusChip status={status} />
                      <div className="flex items-center gap-2">
                        <p className="text-green-600">{opens} opens</p>
                        <p className="text-blue-600">{clicks} clicks</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between gap-4">
        {ACTION_CARDS.map((card) => {
          const { title, description, icon: Icon, onClick } = card;

          let iconClasses = "";
          if (title.includes("Campaign")) {
            iconClasses = "text-blue-500";
          } else if (title.includes("Automation")) {
            iconClasses = "text-purple-500";
          } else if (title.includes("Templates")) {
            iconClasses = "text-green-500";
          }

          return (
            <div
              key={card.title}
              className="flex flex-col items-center text-center px-5 py-6 bg-white border border-primary/15 rounded-xl cursor-pointer w-full"
              onClick={onClick}
            >
              <Icon className={`size-8 ${iconClasses}`} />
              <h4 className="text-sm mt-3 mb-2">{title}</h4>
              <p className="text-xs text-gray-500 max-w-xs">{description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Overview;
