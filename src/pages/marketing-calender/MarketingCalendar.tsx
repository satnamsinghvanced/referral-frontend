import { Button, Input, Pagination, Select, SelectItem } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiClock, FiGlobe, FiSearch, FiShare2 } from "react-icons/fi";
import { LuCalendar, LuUserPlus, LuUsers } from "react-icons/lu";
import { MdOutlineRemoveRedEye, MdTrendingUp } from "react-icons/md";
import { RiMegaphoneLine } from "react-icons/ri";
import { TbWaveSawTool } from "react-icons/tb";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import ActivityStatusChip from "../../components/chips/ActivityStatusChip";
import ComponentContainer from "../../components/common/ComponentContainer";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import EmptyState from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";
import { ACTIVITY_TYPES } from "../../consts/marketing";
import { useDebouncedValue } from "../../hooks/common/useDebouncedValue";
import {
  useDeleteActivity,
  useMarketingActivities,
} from "../../hooks/useMarketing";
import { formatDateToReadable } from "../../utils/formatDateToReadable";
import { ActivityCard } from "./ActivityCard";
import CustomCalendar from "./CustomCalender";
import ActivityActionsModal from "./modal/ActivityActionsModal";
import { ActivityDetailModal } from "./modal/ActivityDetailModal";
import { Link } from "react-router-dom";
import { useFetchGoogleCalendarIntegration } from "../../hooks/integrations/useGoogleCalendar";

const MarketingCalendar = () => {
  const { data: googleCalendarConfig, isLoading: isGoogleCalendarLoading } =
    useFetchGoogleCalendarIntegration();

  const isGoogleCalendarConnected =
    googleCalendarConfig?.status === "Connected";

  const [currentFilters, setCurrentFilters] = useState<any>({
    page: 1,
    limit: 9,
    search: "",
    type: "all",
  });

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>();

  const debouncedSearch = useDebouncedValue(currentFilters.search, 500);

  useEffect(() => {
    setCurrentFilters((prev: any) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  const {
    data: marketingActivitiesData,
    isFetching: isLoading,
    refetch: marketingActivitiesRefetch,
  } = useMarketingActivities({ ...currentFilters, search: debouncedSearch });

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

  const handleViewActivity = useCallback((activity: any) => {
    setIsDetailOpen(true);
    setSelectedActivity(activity);
  }, []);

  const handleEditActivity = useCallback(() => {
    setIsDetailOpen(false);
    // refetchActivityDetail();
    setIsModalOpen(true);
  }, []);

  const handleDeleteActivity = () => {
    deleteActivity(
      // @ts-ignore
      {
        eventId: selectedActivity._id,
        googleId: selectedActivity.googleId,
      },
      {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setIsDetailOpen(false);
          setSelectedActivity(null);
          marketingActivitiesRefetch();
        },
      }
    );
  };

  const HEADING_DATA = {
    heading: "Marketing Calendar",
    subHeading:
      "Centralized view of all marketing activities, social posts, campaigns, and referral activities.",
    buttons: [
      {
        label: "Add Activity",
        onClick: () => {
          setSelectedActivity(null);
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
      icon: <RiMegaphoneLine className="text-sky-600" />,
      heading: "Active Campaigns",
      value: stats?.activeCampaigns || 0,
      subheading: (
        <p className="text-emerald-600 flex items-center gap-1.5">
          <MdTrendingUp fontSize={15} />
          Currently running
        </p>
      ),
    },
    {
      icon: <FiShare2 className="text-blue-600" />,
      heading: "Scheduled Posts",
      value: stats?.scheduledPosts || 0,
      subheading: (
        <p className="text-blue-600 flex items-center gap-1.5">
          <FiClock fontSize={15} />
          Ready to post
        </p>
      ),
    },
    {
      icon: <LuUserPlus className="text-purple-600" />,
      heading: "Referral Activities",
      value: stats?.referralActivities || 0,
      subheading: (
        <p className="text-purple-600 flex items-center gap-1.5">
          <LuCalendar fontSize={15} />
          Scheduled
        </p>
      ),
    },
    {
      icon: <MdOutlineRemoveRedEye className="text-orange-600" />,
      heading: "Total Reach",
      value: stats?.totalReach || 0,
      subheading: (
        <p className="text-orange-600 flex items-center gap-1.5">
          <LuUsers fontSize={15} />
          Combined reach
        </p>
      ),
    },
  ];

  const filteredActivities = activities.filter((activity: any) => {
    if (!selectedDate) return true;

    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);

    if (!activity.startDate) return false;

    const start = new Date(activity.startDate);
    start.setHours(0, 0, 0, 0);

    const end = activity.endDate ? new Date(activity.endDate) : new Date(start);
    end.setHours(0, 0, 0, 0);

    return (
      selected.getTime() >= start.getTime() &&
      selected.getTime() <= end.getTime()
    );
  });

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
              setSelectedActivity(null);
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
            const activityType = ACTIVITY_TYPES.find(
              (activityType: any) => activityType.value == activity.type
            )?.label;

            const activityColor = ACTIVITY_TYPES.find(
              (activityType: any) => activityType.value === activity.type
            )?.color.value;

            return (
              <div
                key={activity._id}
                className={`relative overflow-visible shadow-none bg-background !rounded-r-xl p-3 h-full flex flex-col justify-between border border-gray-100 cursor-pointer`}
                style={{ borderLeftColor: activityColor }}
                onClick={() => handleViewActivity(activity)}
              >
                <div
                  className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-[calc(100%+2px)] z-0"
                  style={{
                    background: activityColor ? activityColor : "#4285F4",
                  }}
                ></div>
                <div className="flex justify-between items-start mb-2 p-0">
                  <h3 className="text-sm font-medium">{activity.title}</h3>
                  <ActivityStatusChip status={activity.status} />
                </div>

                <div className="text-sm text-gray-600 space-y-2 p-0">
                  <div className="flex items-center gap-1.5">
                    <LuCalendar fontSize={14} />
                    <p className="flex items-center space-x-1 text-xs">
                      <span>
                        {formatDateToReadable(activity.startDate, true)}
                      </span>
                    </p>
                  </div>

                  {activityType && (
                    <p className="text-xs flex items-center gap-1.5 capitalize">
                      <FiGlobe fontSize={14} /> {activityType}
                    </p>
                  )}
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
            setSelectedActivity(null);
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
            }}
          />
        )}
      </>
    );
  };

  return (
    <>
      <ComponentContainer headingData={HEADING_DATA}>
        <div className="flex flex-col gap-4 md:gap-5">
          {!isGoogleCalendarConnected && !isGoogleCalendarLoading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-between">
              <p className="text-sm text-yellow-800">
                Google Calendar is not connected. Connect your Google Calendar
                to sync activities.
              </p>
              <Button
                as={Link}
                to="/integrations"
                size="sm"
                color="warning"
                variant="flat"
                className="bg-yellow-200 text-yellow-800"
              >
                Connect Calendar
              </Button>
            </div>
          )}
          <div className="space-y-4 md:space-y-5">
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
              {STAT_CARD_DATA.map((data, i) => (
                <MiniStatsCard key={i} cardData={data} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-start-1 col-end-4">
              <div className="w-full shadow-none bg-background border border-primary/15 rounded-xl">
                <CustomCalendar
                  weekendDisabled={false}
                  onRangeSelect={(start, end) => {
                    setSelectedDate(start.toISOString());
                    setSelectedEndDate(
                      start.getTime() !== end.getTime()
                        ? end.toISOString()
                        : null
                    );
                    setSelectedActivity(null);
                    setIsModalOpen(true);
                  }}
                  activities={activities}
                  onActivityClick={handleViewActivity}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-background p-4 border border-primary/15 rounded-xl">
                <h4 className="text-base font-medium flex items-center gap-2">
                  <TbWaveSawTool className="text-primary text-xl" />
                  {selectedDate
                    ? `Activities for ${formatDateToReadable(selectedDate)}`
                    : "Select a Date"}
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
                  {ACTIVITY_TYPES?.map((activity: any) => {
                    const ActivityIcon = activity?.icon;

                    return (
                      <li
                        className="text-xs flex items-center gap-2"
                        key={activity.label}
                      >
                        <span
                          className="size-[18px] rounded-full inline-flex items-center justify-center text-white"
                          style={{
                            backgroundColor: activity?.color?.value,
                          }}
                        >
                          {/* @ts-ignore */}
                          {ActivityIcon && <ActivityIcon />}
                        </span>
                        {activity.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 border border-primary/15 rounded-xl p-4 bg-background shadow-none">
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
              disabledKeys={new Set([currentFilters.type])}
              onSelectionChange={(keys) =>
                handleFilterChange("type", Array.from(keys)[0] as string)
              }
              className="max-w-60"
            >
              <>
                <SelectItem key="all" className="capitalize">
                  All Activities
                </SelectItem>
                {ACTIVITY_TYPES?.map((type: any) => (
                  <SelectItem key={type.value} className="capitalize">
                    {type.label}
                  </SelectItem>
                ))}
                <SelectItem key="googleCalendar" className="capitalize">
                  Google Calendar
                </SelectItem>
              </>
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
          setSelectedActivity(null);
        }}
        // @ts-ignore
        defaultStartDate={selectedDate}
        defaultEndDate={selectedEndDate}
        initialData={selectedActivity || null}
      />

      <ActivityDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedActivity(null);
        }}
        activity={selectedActivity || null}
        onEdit={handleEditActivity}
        onDelete={() => setIsDeleteModalOpen(true)}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteActivity}
        isLoading={isDeletePending}
      />
    </>
  );
};

export default MarketingCalendar;
