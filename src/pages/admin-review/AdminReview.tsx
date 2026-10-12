import React, { useState, useMemo } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
  Chip,
  Spinner,
  addToast,
} from "@heroui/react";
import { fetchAdminReviewData, updateAdminReviewItemStatus } from "../../services/adminReview";
import {
  FiEye,
  FiFlag,
  FiArchive,
  FiAlertTriangle,
  FiSearch,
  FiRefreshCw,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiPlay,
  FiPause,
  FiUser,
  FiClock,
  FiMessageSquare,
  FiMic,
  FiUsers,
  FiPhone,
  FiStar,
} from "react-icons/fi";
import { LuBuilding2, LuTarget } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useRolePermissions } from "../../hooks/useRolePermissions";
import { useLocationContext } from "../../providers/LocationContext";
import ComponentContainer from "../../components/common/ComponentContainer";
import MiniStatsCard, { StatCard } from "../../components/cards/MiniStatsCard";
import Pagination from "../../components/common/Pagination";
import { EVEN_PAGINATION_LIMIT } from "../../consts/consts";
import { useDebouncedValue } from "../../hooks/common/useDebouncedValue";
import {
  MODULE_TABS,
  ReviewItem,
  AdminReviewPagination,
  AdminReviewStats,
} from "../../types/adminReview";

export const AdminReview: React.FC = () => {
  const { isAdmin, isLoading } = useRolePermissions();
  const { locations, getLocationColor, isLoading: isLocationsLoading } = useLocationContext();
  const user = useSelector((state: RootState) => state.auth.user);
  const isSuperAdmin = user?.role === "SuperAdmin";
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && !isAdmin && !isSuperAdmin) {
      navigate("/", { replace: true });
    }
  }, [isAdmin, isSuperAdmin, isLoading, navigate]);

  const [items, setItems] = useState<ReviewItem[]>([]);
  const [tabCounts, setTabCounts] = useState<Record<string, number>>({});
  const [apiStats, setApiStats] = useState<AdminReviewStats>({
    inReview: 0,
    flagged: 0,
    archived: 0,
    highPriority: 0,
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<AdminReviewPagination | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("All Locations");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Statuses");
  const [selectedPriority, setSelectedPriority] = useState<string>("All Priorities");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebouncedValue(searchQuery, 400);
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Dynamic location options from the Locations API
  const locationOptions = useMemo(() => {
    const list: { id: string; name: string; color?: string }[] = [
      { id: "all", name: "All Locations", color: "" },
    ];
    if (locations && locations.length > 0) {
      locations.forEach((loc, index) => {
        list.push({
          id: loc._id || loc.name,
          name: loc.name,
          color: loc.color || getLocationColor(loc._id, index),
        });
      });
    }
    return list;
  }, [locations, getLocationColor]);

  // Load live data from the backend API with filters and pagination
  const loadData = React.useCallback(async () => {
    try {
      setIsLoadingData(true);
      const selectedLocObj = locationOptions.find((l) => l.name === selectedLocation);
      const locationIdParam = selectedLocObj && selectedLocObj.id !== "all" ? selectedLocObj.id : undefined;

      const res = await fetchAdminReviewData({
        locationId: locationIdParam,
        module: selectedModule !== "all" ? selectedModule : undefined,
        status: selectedStatus !== "All Statuses" ? selectedStatus : undefined,
        priority: selectedPriority !== "All Priorities" ? selectedPriority : undefined,
        search: debouncedSearch.trim() || undefined,
        page: currentPage,
        limit: EVEN_PAGINATION_LIMIT,
      });

      if (res && res.items) {
        setItems(res.items);
        if (res.tabCounts) {
          setTabCounts(res.tabCounts);
        }
        if (res.stats) {
          setApiStats(res.stats);
        }
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch admin review data:", err);
      addToast({
        title: "Error fetching data",
        description: err?.response?.data?.message || err?.message || "Failed to load admin review queue.",
        color: "danger",
      });
    } finally {
      setIsLoadingData(false);
      setIsRefreshing(false);
    }
  }, [
    selectedLocation,
    locationOptions,
    selectedModule,
    selectedStatus,
    selectedPriority,
    debouncedSearch,
    currentPage,
  ]);

  React.useEffect(() => {
    if (!isLoading && (isAdmin || isSuperAdmin)) {
      loadData();
    }
  }, [loadData, isAdmin, isSuperAdmin, isLoading]);

  const stats = useMemo(() => {
    return apiStats;
  }, [apiStats]);

  const toggleExpand = (id: string) => {
    setExpandedCardIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleFlag = async (id: string) => {
    const targetItem = items.find((i) => i.id === id);
    if (!targetItem) return;
    const nextStatus = targetItem.status === "flagged" ? "inReview" : "flagged";

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
    );
   
    try {
      await updateAdminReviewItemStatus(id, {
        status: nextStatus,
        module: targetItem.module,
      });
      loadData();
    } catch (err: any) {
      console.error("Failed to persist flag status:", err);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: targetItem.status } : item))
      );
    
    }
  };

  const handleArchive = async (id: string) => {
    const targetItem = items.find((i) => i.id === id);
    if (!targetItem) return;
    const nextStatus = targetItem.status === "archived" ? "inReview" : "archived";

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
    );

    try {
      await updateAdminReviewItemStatus(id, {
        status: nextStatus,
        module: targetItem.module,
      });
      loadData();
    } catch (err: any) {
      console.error("Failed to persist archive status:", err);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: targetItem.status } : item))
      );
      addToast({
        title: "Update Failed",
        description: "Failed to persist archive status on the server.",
        color: "danger",
      });
    }
  };

  const handlePlayVoice = (id: string) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      addToast({
        title: "Playing Audio",
        description: "Audio playback initiated.",
        color: "primary",
      });
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData().then(() => {
      addToast({
        title: "Refreshed",
        description: "Review queue updated with latest entries.",
        color: "success",
      });
    });
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "conversations":
        return <FiMessageSquare className="size-4 text-sky-500" />;
      case "voice_notes":
        return <FiMic className="size-4 text-orange-500" />;
      case "referrals":
        return <FiUsers className="size-4 text-emerald-500" />;
      case "partners":
        return <LuBuilding2 className="size-4 text-purple-500" />;
      case "leads":
        return <LuTarget className="size-4 text-pink-500" />;
      case "reviews":
        return <FiStar className="size-4 text-amber-500" />;
      case "calls":
        return <FiPhone className="size-4 text-blue-500" />;
      default:
        return <FiMessageSquare className="size-4 text-gray-500" />;
    }
  };

  const HEADING_DATA = {
    heading: "Admin Review",
    subHeading: "Review and manage content across all locations and modules",
    buttons: [
      {
        label: "Refresh",
        onClick: handleRefresh,
        icon: <FiRefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />,
        variant: "bordered" as const,
        color: "default" as const,
        className: "border-small text-xs font-semibold",
      },
    ],
  };

  const STAT_CARD_DATA: StatCard[] = [
    {
      heading: "In Review",
      value: stats.inReview,
      icon: <FiEye className="text-sky-600 dark:text-sky-400" />,
      subheading: (
        <span className="text-xs text-sky-600 dark:text-sky-400 font-medium">
          Pending action
        </span>
      ),
      onClick: () => {
        setSelectedStatus((prev) => (prev === "inReview" ? "All Statuses" : "inReview"));
      },
    },
    {
      heading: "Flagged",
      value: stats.flagged,
      icon: <FiFlag className="text-rose-600 dark:text-rose-400" />,
      subheading: (
        <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
          Requires review
        </span>
      ),
      onClick: () => {
        setSelectedStatus((prev) => (prev === "flagged" ? "All Statuses" : "flagged"));
      },
    },
    {
      heading: "Archived",
      value: stats.archived,
      icon: <FiArchive className="text-gray-500 dark:text-gray-400" />,
      subheading: (
        <span className="text-xs text-gray-500 dark:text-foreground/50 font-normal">
          Archived records
        </span>
      ),
      onClick: () => {
        setSelectedStatus((prev) => (prev === "archived" ? "All Statuses" : "archived"));
        setCurrentPage(1);
      },
    },
    {
      heading: "High Priority",
      value: stats.highPriority,
      icon: <FiAlertTriangle className="text-amber-600 dark:text-amber-400" />,
      subheading: (
        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
          Urgent attention
        </span>
      ),
      onClick: () => {
        setSelectedPriority((prev) => (prev === "High" ? "All Priorities" : "High"));
        setCurrentPage(1);
      },
    },
  ];

  if (!isLoading && !isAdmin && !isSuperAdmin) {
    return null;
  }

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className="flex flex-col gap-4 md:gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
          {STAT_CARD_DATA.map((data, i) => (
            <MiniStatsCard key={i} cardData={data} />
          ))}
        </div>

        <div className="flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between border border-foreground/10 rounded-xl p-4 bg-background shadow-none">
          <div className="w-full xl:flex-grow">
            <Input
              isClearable
              size="sm"
              placeholder="Search by name, content, or author..."
              value={searchQuery}
              onValueChange={(val) => {
                setSearchQuery(val);
                setCurrentPage(1);
              }}
              startContent={<FiSearch className="text-gray-400 dark:text-foreground/40 h-4 w-4 shrink-0" />}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full xl:w-auto xl:min-w-[500px]">
            <Select
              aria-label="Filter by Location"
              placeholder="All Locations"
              size="sm"
              disableAnimation
              isLoading={isLocationsLoading}
              popoverProps={{ disableAnimation: true, shouldCloseOnScroll: false }}
              selectedKeys={[selectedLocation]}
              onSelectionChange={(keys) => {
                const val = (Array.from(keys)[0] as string) || "All Locations";
                setSelectedLocation(val);
                setCurrentPage(1);
              }}
            >
              {locationOptions.map((loc) => (
                <SelectItem key={loc.name} textValue={loc.name}>
                  <div className="flex items-center gap-2">
                    {loc.color && (
                      <span
                        className="size-2 rounded-full shrink-0"
                        style={{ backgroundColor: loc.color }}
                      />
                    )}
                    <span>{loc.name}</span>
                  </div>
                </SelectItem>
              ))}
            </Select>

            <Select
              aria-label="Filter by Status"
              placeholder="All Statuses"
              size="sm"
              disableAnimation
              popoverProps={{ disableAnimation: true, shouldCloseOnScroll: false }}
              selectedKeys={[selectedStatus]}
              onSelectionChange={(keys) => {
                const val = (Array.from(keys)[0] as string) || "All Statuses";
                setSelectedStatus(val);
                setCurrentPage(1);
              }}
            >
              <SelectItem key="All Statuses" textValue="All Statuses">All Statuses</SelectItem>
              <SelectItem key="inReview" textValue="In Review">In Review</SelectItem>
              <SelectItem key="flagged" textValue="Flagged">Flagged</SelectItem>
              <SelectItem key="archived" textValue="Archived">Archived</SelectItem>
            </Select>

            <Select
              aria-label="Filter by Priority"
              placeholder="All Priorities"
              size="sm"
              disableAnimation
              popoverProps={{ disableAnimation: true, shouldCloseOnScroll: false }}
              selectedKeys={[selectedPriority]}
              onSelectionChange={(keys) => {
                const val = (Array.from(keys)[0] as string) || "All Priorities";
                setSelectedPriority(val);
                setCurrentPage(1);
              }}
            >
              <SelectItem key="All Priorities" textValue="All Priorities">All Priorities</SelectItem>
              <SelectItem key="High" textValue="High Priority">High Priority</SelectItem>
              <SelectItem key="Medium" textValue="Medium Priority">Medium Priority</SelectItem>
              <SelectItem key="Low" textValue="Low Priority">Low Priority</SelectItem>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {MODULE_TABS.map((tab) => {
            const isSelected = selectedModule === tab.key;
            const count = tabCounts[tab.key] ?? 0;
            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                onClick={() => {
                  setSelectedModule(tab.key);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "bg-content1/40 dark:bg-content1/20 text-foreground/70 border-foreground/10 hover:border-foreground/25 hover:text-foreground"
                }`}
              >
                {Icon && <Icon className="size-3.5 shrink-0" />}
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? "bg-background/25 text-background"
                      : "bg-foreground/10 text-foreground/80"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 border border-foreground/10 bg-background rounded-xl p-4">
          {isLoadingData ? (
            <div className="flex flex-col items-center justify-center p-16 border border-foreground/10 rounded-xl bg-content1/20 text-center space-y-3">
              <Spinner size="lg" color="primary" />
              <p className="text-xs text-foreground/70">Loading review queue...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border border-foreground/10 rounded-xl bg-content1/20 text-center space-y-3">
              <div className="size-12 rounded-full bg-content1/50 flex items-center justify-center text-gray-400">
                <FiCheck className="size-6 text-emerald-500" />
              </div>
              <h3 className="font-bold text-sm text-foreground">No Items in This View</h3>
              <p className="text-xs text-gray-500 max-w-sm">
                All review items under this filter have been handled or no records match your search criteria.
              </p>
              <Button
                size="sm"
                variant="flat"
                onPress={() => {
                  setSelectedModule("all");
                  setSelectedLocation("All Locations");
                  setSelectedStatus("All Statuses");
                  setSelectedPriority("All Priorities");
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="text-xs font-medium"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const isExpanded = !!expandedCardIds[item.id];
                const isAudioPlaying = playingAudioId === item.id;

                return (
                  <Card
                    key={item.id}
                    shadow="none"
                    className="border border-foreground/10 rounded-xl p-4 bg-white dark:bg-content1 hover:border-foreground/20 transition-all"
                  >
                    <CardBody className="p-0 overflow-hidden space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <div className="size-7 rounded-lg bg-content1/60 border border-foreground/5 flex items-center justify-center shrink-0">
                          {getModuleIcon(item.module)}
                        </div>

                        <h4 className="font-semibold text-sm text-foreground">
                          {item.title}
                        </h4>

                        {item.priority === "High" && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                            High
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-content1/50 border border-foreground/10 text-xs text-foreground/80">
                          <span
                            className="size-2 rounded-full shrink-0"
                            style={{ backgroundColor: item.locationColor }}
                          />
                          <span className="font-medium text-[11px]">{item.location}</span>
                        </div>

                        <Chip
                          size="sm"
                          variant="flat"
                          className={`text-[11px] font-semibold capitalize ${
                            item.status === "inReview"
                              ? "bg-sky-500/10 text-sky-500 border border-sky-500/20"
                              : item.status === "flagged"
                              ? "bg-red-500/10 text-red-500 border border-red-500/20"
                              : "bg-foreground/10 text-foreground/60 border border-foreground/10"
                          }`}
                        >
                          {item.status === "inReview" ? "In Review" : item.status === "flagged" ? "Flagged" : "Archived"}
                        </Chip>
                      </div>
                    </div>

                    <p className="text-xs text-foreground/85 leading-relaxed font-sans">
                      {item.content}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/60">
                      <div className="flex items-center gap-1">
                        <FiUser className="size-3 text-foreground/40" />
                        <span className="text-foreground/80 font-medium">
                          {item.author}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <FiClock className="size-3 text-foreground/40" />
                        <span>{item.timeAgo}</span>
                      </div>

                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-content1/60 border border-foreground/5 text-[10px] font-medium text-foreground/75"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {item.voiceMeta && (
                      <div className="p-2.5 bg-content1/40 border border-foreground/5 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => handlePlayVoice(item.id)}
                            className="size-7 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors shadow-sm cursor-pointer shrink-0"
                          >
                            {isAudioPlaying ? (
                              <FiPause className="size-3.5" />
                            ) : (
                              <FiPlay className="size-3.5 ml-0.5" />
                            )}
                          </button>
                          <div>
                            <span className="text-[11px] font-semibold text-foreground block">
                              recorded via {item.voiceMeta.recordedVia} — {item.voiceMeta.duration}
                            </span>
                            <span className="text-[10px] text-foreground/50">
                              {isAudioPlaying ? "Playing audio preview..." : "Click to listen to recording"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 h-5 shrink-0 px-2">
                          {[40, 70, 30, 90, 60, 100, 50, 80, 45, 65, 35, 85].map((h, i) => (
                            <span
                              key={i}
                              className={`w-0.5 rounded-full transition-all duration-300 ${
                                isAudioPlaying
                                  ? "bg-orange-500 animate-pulse"
                                  : "bg-foreground/20"
                              }`}
                              style={{ height: isAudioPlaying ? `${h}%` : "35%" }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {isExpanded && (
                      <div className="p-3.5 bg-content1/30 border border-foreground/5 rounded-xl space-y-2.5 text-xs text-foreground/80 animate-in fade-in duration-200">
                        <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider block">
                          Extended Review Metadata
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1 text-xs">
                          {item.details?.patientName && (
                            <div>
                              <span className="text-[11px] text-foreground/50 block">Patient Name:</span>
                              <strong className="text-foreground">{item.details.patientName}</strong>
                            </div>
                          )}
                          {item.details?.phone && (
                            <div>
                              <span className="text-[11px] text-foreground/50 block">Contact Phone:</span>
                              <strong className="text-foreground">{item.details.phone}</strong>
                            </div>
                          )}
                          {item.details?.treatment && (
                            <div>
                              <span className="text-[11px] text-foreground/50 block">Procedure / Interest:</span>
                              <strong className="text-foreground">{item.details.treatment}</strong>
                            </div>
                          )}
                          {item.details?.channel && (
                            <div>
                              <span className="text-[11px] text-foreground/50 block">Source Channel:</span>
                              <strong className="text-foreground">{item.details.channel}</strong>
                            </div>
                          )}
                          {item.details?.notes && (
                            <div className="sm:col-span-2">
                              <span className="text-[11px] text-foreground/50 block">Reviewer Notes:</span>
                              <p className="text-xs text-foreground/75 italic">
                                "{item.details.notes}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-foreground/5">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="light"
                          onPress={() => handleFlag(item.id)}
                          className={`text-xs font-medium px-2.5 h-7 rounded-lg transition-colors ${
                            item.status === "flagged"
                              ? "bg-red-500/10 text-red-500 font-semibold"
                              : "text-rose-500 hover:bg-rose-500/10"
                          }`}
                          startContent={<FiFlag className="size-3.5" />}
                        >
                          {item.status === "flagged" ? "Flagged" : "Flag"}
                        </Button>

                        <Button
                          size="sm"
                          variant="light"
                          onPress={() => handleArchive(item.id)}
                          className={`text-xs font-medium px-2.5 h-7 rounded-lg transition-colors ${
                            item.status === "archived"
                              ? "bg-foreground/15 text-foreground font-semibold"
                              : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                          }`}
                          startContent={<FiArchive className="size-3.5" />}
                        >
                          {item.status === "archived" ? "Archived" : "Archive"}
                        </Button>
                      </div>

                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="flex items-center gap-1 text-xs text-sky-500 dark:text-sky-400 hover:underline cursor-pointer px-2 py-1 font-medium"
                      >
                        <span>{isExpanded ? "Less" : "Details"}</span>
                        {isExpanded ? (
                          <FiChevronUp className="size-3.5" />
                        ) : (
                          <FiChevronDown className="size-3.5" />
                        )}
                      </button>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}

        {!isLoadingData && items.length > 0 && pagination && pagination.totalPages > 1 && (
          <div className="pt-3 border-t border-foreground/10">
            <Pagination
              identifier="items"
              limit={EVEN_PAGINATION_LIMIT}
              totalItems={pagination.totalData}
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              handlePageChange={(newPage) => setCurrentPage(newPage)}
            />
          </div>
        )}
        </div>
      </div>
    </ComponentContainer>
  );
};

export default AdminReview;
