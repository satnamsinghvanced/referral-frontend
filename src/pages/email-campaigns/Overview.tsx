import { Dispatch, SetStateAction, useMemo } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { FiClock, FiEdit, FiEye, FiZap } from "react-icons/fi";
import {
  LuChartColumn,
  LuMail,
  LuMousePointer2,
  LuPause,
  LuPlay,
  LuTarget,
} from "react-icons/lu";
import CampaignStatusChip from "../../components/chips/CampaignStatusChip";
import { LoadingState } from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import { formatDateToReadable } from "../../utils/formatDateToReadable";
import { ICampaign } from "../../types/campaign";

interface OverviewProps {
  setIsActionModalOpen: Dispatch<SetStateAction<boolean>>;
  setActiveTab: Dispatch<SetStateAction<string>>;
  recentCampaigns: ICampaign[];
  isLoading: boolean;
}

const Overview = ({
  setIsActionModalOpen,
  setActiveTab,
  recentCampaigns,
  isLoading,
}: OverviewProps) => {
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

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-4 border border-foreground/10 rounded-xl p-4 bg-background">
        <h4 className="font-medium text-sm">Recent Campaigns</h4>

        <div className="space-y-3">
          {recentCampaigns && recentCampaigns.length > 0 ? (
            recentCampaigns.map((campaign) => {
              const {
                _id,
                name,
                subjectLine,
                status,
                createdAt,
                stats,
                audienceId,
              } = campaign;

              const isScheduled = status === "scheduled";
              const recipientsCount =
                // @ts-ignore
                audienceId?.contacts || stats?.sentCount || 0;

              return (
                <div
                  key={_id}
                  className="flex justify-between items-center p-3.5 border border-foreground/10 rounded-lg dark:bg-content1"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="inline-block">
                      {status === "scheduled" ? (
                        <FiClock className="text-blue-500 text-lg" />
                      ) : status === "paused" ? (
                        <LuPause className="text-yellow-500 text-lg" />
                      ) : status === "draft" ? (
                        <FiEdit className="text-gray-500 text-md" />
                      ) : (
                        <LuPlay className="text-green-500 text-lg" />
                      )}
                    </span>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-xs text-gray-600 dark:text-foreground/60 truncate max-w-xs">
                        {subjectLine}
                      </p>
                      <div className="text-xs text-gray-500 dark:text-foreground/50">
                        <span>{recipientsCount} recipients</span>
                        <span className="mx-1.5">•</span>
                        <span>Created {formatDateToReadable(createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {isScheduled || status === "draft" ? (
                      <CampaignStatusChip status={status} />
                    ) : (
                      <div className="flex flex-col items-end gap-2 text-xs">
                        <CampaignStatusChip status={status} />
                        <div className="flex items-center gap-2 font-medium">
                          <p className="text-green-600 dark:text-green-400">
                            {stats?.openRate || "0%"} opens
                          </p>
                          <p className="text-blue-600 dark:text-blue-400">
                            {stats?.clickRate || "0%"} clicks
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <EmptyState
              title="No recent campaigns"
              message="Your recently created or sent campaigns will appear here."
            />
          )}
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
              className="flex flex-col items-center text-center px-5 py-6 bg-background border border-foreground/10 rounded-xl cursor-pointer w-full transition-all hover:border-primary/30 hover:shadow-sm"
              onClick={onClick}
            >
              <Icon className={`size-8 ${iconClasses}`} />
              <h4 className="text-sm mt-3 mb-2 font-medium">{title}</h4>
              <p className="text-xs text-gray-500 dark:text-foreground/50 max-w-xs">
                {description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Overview;
