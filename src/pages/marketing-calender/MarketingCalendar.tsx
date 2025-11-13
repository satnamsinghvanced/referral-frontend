import {
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Select,
  SelectItem,
} from "@heroui/react";
import { useCallback, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import {
  FiGlobe,
  FiSearch,
  FiShare2,
  FiLoader,
  FiFilter,
  FiActivity,
} from "react-icons/fi";
import { LuCalendar, LuTarget, LuTrophy, LuUserPlus } from "react-icons/lu";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiMegaphoneLine } from "react-icons/ri";
import { TbWaveSawTool } from "react-icons/tb";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import CustomCalendar from "../../components/ui/CustomCalender";
import { ACTIVITY_TYPES } from "../../consts/marketing";
import { useActivityTypes } from "../../hooks/useCommon";
import {
  useActivityDetail,
  useDeleteActivity,
  useMarketingActivities,
} from "../../hooks/useMarketing";
import ActivityActionsModal from "./ActivityActionsModal";
import { ActivityCard } from "./ActivityCard";
import { ActivityDetailModal } from "./ActivityDetailModal";
import ActivityStatusChip from "../../components/chips/ActivityStatusChip";
import { formatDateToMMDDYYYY } from "../../utils/formatDateToMMDDYYYY";
import EmptyState from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";

const MarketingCalendar = () => {
  const [currentFilters, setCurrentFilters] = useState<any>({
    page: 1,
    limit: 9,
    search: "",
    type: "all",
  });

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState("");

  const { data: activityTypes = [] } = useActivityTypes();
  const {
    data: marketingActivitiesData,
    isLoading,
    refetch: marketingActivitiesRefetch,
  } = useMarketingActivities(currentFilters);
  const { data: activityDetail, refetch: refetchActivityDetail } =
    useActivityDetail(selectedActivityId);

  const { mutate: deleteActivity, isPending: isDeletePending } =
    useDeleteActivity();

  const activities = marketingActivitiesData?.data || [];
  const pagination = marketingActivitiesData?.pagination;
  const stats = marketingActivitiesData?.stats;
  const isFiltered = currentFilters.search || currentFilters.type !== "all";

  const handleFilterChange = useCallback((key: string, value: any) => {
    setCurrentFilters((prev: any) => ({
      ...prev,
      page: 1,
      [key]: value,
    }));
  }, []);

  const handleViewActivity = useCallback((id: string) => {
    setSelectedActivityId(id);
    setIsDetailOpen(true);
  }, []);

  const handleEditActivity = useCallback(() => {
    setIsDetailOpen(false);
    refetchActivityDetail().then(() => {
      setIsModalOpen(true);
    });
  }, [refetchActivityDetail]);

  const handleDeleteActivity = () => {
    deleteActivity(selectedActivityId);
    setIsDetailOpen(false);
    setSelectedActivityId("");
    marketingActivitiesRefetch();
  };

  const HEADING_DATA = {
    heading: "Marketing Calendar",
    subHeading:
      "Centralized view of all marketing activities, social posts, campaigns, and referral activities.",
    buttons: [
      {
        label: "Add Activity",
        onClick: () => {
          setSelectedActivityId("");
          setIsModalOpen(true);
        },
        icon: <AiOutlinePlus fontSize={15} />,
        variant: "solid" as const,
        color: "primary" as const,
      },
    ],
  };

  const STAT_CARD_DATA = [
    {
      icon: <RiMegaphoneLine className="text-[17px] mt-1 text-sky-600" />,
      heading: "Active Campaigns",
      value: stats?.activeCampaigns || 0,
      subheading: "+3 this week",
    },
    {
      icon: <FiShare2 className="text-[17px] mt-1 text-blue-600" />,
      heading: "Scheduled Posts",
      value: stats?.scheduledPosts || 0,
      subheading: "Next 30 days",
    },
    {
      icon: <LuUserPlus className="text-[17px] mt-1 text-purple-600" />,
      heading: "Referral Activities",
      value: stats?.referralActivities || 0,
      subheading: "This month",
    },
    {
      icon: <LuTarget className="text-[17px] mt-1 text-emerald-600" />,
      heading: "Monthly ROI",
      value: stats?.monthlyROI || 0,
      subheading: "+12% vs last month",
    },
    {
      icon: (
        <MdOutlineRemoveRedEye className="text-[17px] mt-1 text-orange-600" />
      ),
      heading: "Total Reach",
      value: stats?.totalReach || 0,
      subheading: "This month",
    },
    {
      icon: <LuTrophy className="text-[17px] mt-1 text-green-500" />,
      heading: "Conversions",
      value: stats?.conversions || 0,
      subheading: "+24% this month",
    },
  ];

  const filteredActivities = activities.filter(
    (activity: any) =>
      !selectedDate ||
      (activity.startDate &&
        activity.startDate.split("T")[0] === selectedDate) ||
      (activity.endDate && activity.endDate.split("T")[0] === selectedDate)
  );

  const ActivityListForSelectedDate = () => {
    if (!selectedDate) {
      return <EmptyState title="Click on a date to view or add activities" />;
    }

    if (filteredActivities.length === 0) {
      return (
        <div className="flex flex-col gap-3 items-center justify-center min-h-[100px]">
          <LuCalendar className="text-4xl text-gray-300" />
          <p className="text-xs text-gray-600">No activities scheduled</p>
          <Button
            size="sm"
            radius="sm"
            variant="solid"
            color="primary"
            startContent={<AiOutlinePlus fontSize={15} />}
            onPress={() => {
              setSelectedActivityId("");
              setIsModalOpen(true);
            }}
          >
            Add Activity
          </Button>
        </div>
      );
    }

    return (
      <>
        <div className="flex flex-col gap-3 max-h-[315px] overflow-y-auto">
          {filteredActivities.map((activity: any) => {
            const activityColor = ACTIVITY_TYPES.find(
              (activityType: any) => activityType.label === activity.type.title
            )?.color;

            return (
              <div
                key={activity._id}
                className={`shadow-none bg-white !rounded-r-xl p-3 h-full flex flex-col justify-between border border-l-4 border-gray-100 cursor-pointer`}
                style={{ borderLeftColor: activityColor }}
                onClick={() => handleViewActivity(activity._id)}
              >
                <div className="flex justify-between items-start mb-2 p-0">
                  <h3 className="text-sm font-medium">{activity.title}</h3>
                  <ActivityStatusChip status={activity.status} />
                </div>

                <div className="text-sm text-gray-600 space-y-2 p-0">
                  <div className="flex items-center gap-1.5">
                    <LuCalendar fontSize={14} />
                    <p className="flex items-center space-x-1 text-xs">
                      <span>{formatDateToMMDDYYYY(activity.startDate)}</span>
                      {activity.time && (
                        <span className="text-gray-600">
                          {" "}
                          at <span className="uppercase">{activity.time}</span>
                        </span>
                      )}
                    </p>
                  </div>

                  <p className="text-xs flex items-center gap-1.5 capitalize">
                    <FiGlobe fontSize={14} /> {activity.type.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <Button
          size="sm"
          radius="sm"
          variant="solid"
          color="primary"
          startContent={<AiOutlinePlus fontSize={15} />}
          onPress={() => {
            setSelectedActivityId("");
            setIsModalOpen(true);
          }}
        >
          Add Activity
        </Button>
      </>
    );
  };

  const UpcomingActivitiesSection = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (activities.length === 0) {
      return (
        <EmptyState
          title={
            isFiltered
              ? "No activities found matching your filters."
              : "No upcoming marketing activities scheduled."
          }
          // icon={FiFilter}
        />
      );
    }

    return (
      <>
        <div className="grid grid-cols-3 gap-3">
          {activities.map((activity: any) => (
            <ActivityCard
              key={activity._id}
              activity={activity}
              onView={handleViewActivity}
            />
          ))}
        </div>

        {pagination && pagination?.totalPages > 1 && (
          <Pagination
            showControls
            size="sm"
            radius="sm"
            initialPage={1}
            page={currentFilters.page as number}
            onChange={(page) => handleFilterChange("page", page)}
            total={pagination.totalPages as number}
            classNames={{
              base: "flex justify-end py-3",
              wrapper: "gap-1.5",
              item: "cursor-pointer",
              prev: "cursor-pointer",
              next: "cursor-pointer",
            }}
          />
        )}
      </>
    );
  };

  return (
    <>
      <ComponentContainer headingData={HEADING_DATA}>
        <div className="flex flex-col gap-5">
          <div className="space-y-5">
            <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-4">
              {STAT_CARD_DATA.map((data, i) => (
                <MiniStatsCard key={i} cardData={data} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-start-1 col-end-4">
              <div className="w-full shadow-none p-5 bg-background border border-primary/15 rounded-xl">
                <CustomCalendar
                  weekendDisabled={false}
                  onDayClick={setSelectedDate}
                  activities={activities}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-background p-4 border border-primary/15 rounded-xl">
                <h4 className="text-base font-medium flex items-center gap-2">
                  <TbWaveSawTool className="text-primary text-xl" />
                  {selectedDate
                    ? `Activities for ${selectedDate}`
                    : "Selected Date"}
                </h4>
                <div className="mt-6 mb-2 space-y-3">
                  <ActivityListForSelectedDate />
                </div>
              </div>
              <div className="bg-background p-4 border border-primary/15 rounded-xl">
                <h4 className="text-base font-medium flex items-center gap-2 mb-4">
                  Activity Types
                </h4>
                <ul className="space-y-3">
                  {activityTypes?.map((activity: any) => {
                    const activityTypeData = ACTIVITY_TYPES.find(
                      (type: any) => type.label === activity.title
                    );
                    const ActivityIcon = activityTypeData?.icon;

                    return (
                      <li
                        className="text-xs flex items-center gap-2"
                        key={activity._id}
                      >
                        <span
                          className="size-[18px] rounded-full inline-flex items-center justify-center text-white"
                          style={{
                            backgroundColor: activityTypeData?.color,
                          }}
                        >
                          {/* @ts-ignore */}
                          {ActivityIcon && <ActivityIcon />}
                        </span>
                        {activity.title}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 border border-primary/15 rounded-xl p-4 bg-white shadow-none">
            <Input
              size="sm"
              variant="flat"
              placeholder="Search marketing activities..."
              value={currentFilters.search}
              onValueChange={(value: string) =>
                handleFilterChange("search", value)
              }
              className="text-xs min-w-fit"
              startContent={<FiSearch className="text-gray-400 h-4 w-4" />}
            />

            <Select
              aria-label="Activity Types"
              placeholder="All Activities"
              size="sm"
              selectedKeys={new Set([currentFilters.type])}
              onSelectionChange={(keys) =>
                handleFilterChange("type", Array.from(keys)[0] as string)
              }
              className="max-w-60"
            >
              <SelectItem key="all" className="capitalize">
                All Activities
              </SelectItem>
              {activityTypes?.map((type: any) => (
                <SelectItem key={type._id} className="capitalize">
                  {type.title}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-4 border border-primary/15 bg-background rounded-xl p-4">
            <p className="font-medium text-sm">Upcoming Marketing Activities</p>
            <UpcomingActivitiesSection />
          </div>
        </div>
      </ComponentContainer>

      <ActivityActionsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedActivityId("");
        }}
        // @ts-ignore
        defaultStartDate={selectedDate}
        initialData={selectedActivityId ? activityDetail || null : null}
        activityTypes={activityTypes}
      />

      <ActivityDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedActivityId("");
        }}
        activity={activityDetail || null}
        onEdit={handleEditActivity}
        onDelete={handleDeleteActivity}
        deleteLoading={isDeletePending}
      />
    </>
  );
};

export default MarketingCalendar;
