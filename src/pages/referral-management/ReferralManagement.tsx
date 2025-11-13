import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Pagination,
} from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiEdit, FiEye, FiStar, FiTarget, FiUsers } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { LuBuilding2, LuFilter, LuPhone, LuQrCode } from "react-icons/lu";
import { useDispatch } from "react-redux";
import MiniStatsCard, { StatCard } from "../../components/cards/MiniStatsCard";
import ReferralStatusChip from "../../components/chips/ReferralStatusChip";
import ComponentContainer from "../../components/common/ComponentContainer";
import { LoadingState } from "../../components/common/LoadingState";
import {
  useFetchReferrals,
  useFetchReferrers,
  useFetchTrackings,
  useGetReferralById,
  useGetReferrerById,
} from "../../hooks/useReferral";
import { useInitiateCall } from "../../hooks/useTwilio";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { setTotalReferrals } from "../../store/statsSlice";
import { Referrer } from "../../types/partner";
import { FilterStats, Referral } from "../../types/referral";
import { downloadJson } from "../../utils/jsonDownloader";
import AllReferralsView from "./AllReferralsView";
import ReferralCard from "./ReferralCard";
import ReferralManagementActions from "./ReferralManagementActions";
import ReferralStatusModal from "./ReferralStatusModal";
import ReferrerCard from "./ReferrerCard";
import RoleToggleTabs from "./RoleToggleTabs";
import TrackingPanel from "./TrackingPanel";
import EmptyState from "../../components/common/EmptyState";

type ReferralType = "Referrals" | "Referrers" | "NFC & QR Tracking";

const ReferralManagement = () => {
  const { user } = useTypedSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReferralStatusModalOpen, setIsReferralStatusModalOpen] =
    useState(false);
  const [isReferralStatusModalViewMode, setIsReferralStatusModalViewMode] =
    useState(false);
  const [selectedReferralType, setSelectedReferralType] =
    useState<ReferralType>("Referrals");
  const [isFilterViewActive, setIsFilterViewActive] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    filter: "",
    source: "",
  });
  const [overviewSearchKeyword, setOverviewSearchKeyword] = useState("");
  const [referralEditId, setReferralEditId] = useState<string>("");
  const [referrerEditId, setReferrerEditId] = useState("");

  const [referrerParams, setReferrerParams] = useState({
    filter: "",
    page: 1,
    limit: 10,
  });

  // ----------------------
  // Queries
  // ----------------------
  const {
    data: referralData,
    refetch: referralRefetch,
    isLoading: isLoadingReferrals,
    isFetching: isFetchingReferrals,
  } = useFetchReferrals(currentFilters);

  const { data: referrerData, isLoading: isLoadingReferrers } =
    useFetchReferrers(referrerParams);
  const referrers = referrerData?.data;

  const { data: singleReferralData, refetch: singleReferralRefetch } =
    useGetReferralById(referralEditId);
  const { data: singleReferrerData, refetch: singleReferrerRefetch } =
    useGetReferrerById(referrerEditId);

  const { data: trackings, isLoading: isLoadingTrackings } = useFetchTrackings(
    user?.userId
  );

  const { mutate: initiateCall } = useInitiateCall(user?.userId || "");

  // ----------------------
  // Effects
  // ----------------------
  useEffect(() => {
    if (referrerEditId) {
      singleReferrerRefetch();
    }
  }, [referrerEditId, singleReferrerRefetch]);

  useEffect(() => {
    if (referralEditId) {
      singleReferralRefetch();
    }
  }, [referralEditId, singleReferralRefetch]);

  // Update total referrals in Redux store
  useEffect(() => {
    if (referralData?.total !== undefined) {
      dispatch(setTotalReferrals(referralData.total));
    }
  }, [referralData, dispatch]);

  // Debounced search for overview
  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentFilters((prev) => ({
        ...prev,
        search: overviewSearchKeyword,
        page: 1,
      }));
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [overviewSearchKeyword]);

  // ----------------------
  // Handlers
  // ----------------------
  const handleClearFilters = useCallback(() => {
    setCurrentFilters({
      page: 1,
      limit: 10,
      search: "",
      filter: "",
      source: "",
    });
  }, []);

  const handleBackToOverview = useCallback(() => {
    setIsFilterViewActive(false);
    handleClearFilters();
  }, [handleClearFilters]);

  const handleViewAllAndFilter = useCallback(() => {
    setIsFilterViewActive(true);
  }, []);

  const handleReferralTypeChange = (key: string) =>
    setSelectedReferralType(key as ReferralType);

  const handleFilterChange = (key: string, value: string) => {
    const apiValue = value.toLowerCase().includes("all") ? "" : value;

    setCurrentFilters((prev) => ({
      ...prev,
      [key]: apiValue,
      page: 1, // Reset page
    }));
  };

  const handleEditReferral = (id: string) => {
    setIsReferralStatusModalViewMode(false);
    setReferralEditId(id);
    setIsReferralStatusModalOpen(true);
  };

  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      reportTitle: "Referrals",
      records: referralData?.data,
    };

    downloadJson(exportData, "referrals");
  };

  const handleOverviewSearchChange = (value: string) => {
    // Only updates the input value, the search effect handles the API call
    setOverviewSearchKeyword(value);
  };

  // ----------------------
  // Derived Data (useMemo)
  // ----------------------
  const STAT_CARD_DATA = useMemo<StatCard[]>(
    () => [
      {
        icon: <LuBuilding2 className="text-[17px] mt-1 text-sky-500" />,
        heading: "Total Referrals",
        value: referralData?.stats?.totalReferrals ?? 0,
        subheading: "Click to view all referrals",
        onClick: handleViewAllAndFilter,
      },
      {
        icon: <FiUsers className="text-[17px] mt-1 text-green-500" />,
        heading: "NFC Referrals",
        value: referralData?.stats?.nfcReferralTotal ?? 0,
        subheading: "Click to view NFC referrals",
        onClick: () => {
          setCurrentFilters((prev) => ({
            ...prev,
            source: "NFC",
          }));
          handleViewAllAndFilter();
        },
      },
      {
        icon: <FiStar className="text-[17px] mt-1 text-yellow-500" />,
        heading: "QR Code Referrals",
        value: referralData?.stats?.qrReferralTotal ?? 0,
        subheading: "Click to view QR referrals",
        onClick: () => {
          setCurrentFilters((prev) => ({
            ...prev,
            source: "QR",
          }));
          handleViewAllAndFilter();
        },
      },
      {
        icon: <FiTarget className="text-[17px] mt-1 text-green-500" />,
        heading: "Total Value",
        value: referralData?.stats?.totalValue ?? 0,
        subheading: "Click to view value details",
        onClick: handleViewAllAndFilter,
      },
    ],
    [referralData, handleViewAllAndFilter]
  );

  const headingData = useMemo(
    () => ({
      heading: "Referral Management",
      subHeading:
        "Track doctor and patient referrals for your orthodontic practice",
      buttons: [
        {
          label: "Generate QR Code",
          onClick: () => setSelectedReferralType("NFC & QR Tracking"),
          icon: <LuQrCode fontSize={15} />,
          variant: "bordered",
          color: "default",
          className:
            "border-small hover:bg-orange-200 hover:text-orange-500 transition-colors",
        },
        {
          label: "Add Referrer",
          onClick: () => {
            setIsModalOpen(true);
            setReferrerEditId("");
          },
          icon: <AiOutlinePlus fontSize={15} />,
          variant: "solid",
          color: "primary",
        },
      ],
    }),
    []
  );

  const refererButtonList = useCallback(
    (referrer: Referrer) => [
      {
        label: "QR Code",
        icon: <LuQrCode />,
        variant: "bordered",
        color: "default",
        className:
          "border-small hover:bg-orange-200  hover:text-orange-500 transition-colors",
        link: referrer?.qrCode,
        linkInNewTab: true,
      },
      {
        label: "Visit",
        icon: <GrLocation className="font-bold" />,
        variant: "bordered",
        color: "default",
        className:
          "border-small hover:bg-orange-200 hover:text-orange-500 transition-colors",
        linkInNewTab: true,
      },
    ],
    []
  );

  const STATUS_BREAKDOWN = useMemo(
    () => [
      {
        label: "Contacted",
        status: "contacted",
        count: referralData?.statusStats?.contacted ?? 0,
      },
      {
        label: "Appointed",
        status: "appointed",
        count: referralData?.statusStats?.appointed ?? 0,
      },
      {
        label: "In Process",
        status: "inProcess",
        count: referralData?.statusStats?.inProcess ?? 0,
      },
      {
        label: "Started Treatment",
        status: "started",
        count: referralData?.statusStats?.started ?? 0,
      },
      {
        label: "Declined Treatment",
        status: "declined",
        count: referralData?.statusStats?.declined ?? 0,
      },
    ],
    [referralData?.statusStats]
  );

  // ----------------------
  // Render
  // ----------------------
  return (
    <>
      <ComponentContainer headingData={headingData as any}>
        <div className="flex flex-col gap-5">
          <RoleToggleTabs
            selected={selectedReferralType}
            onSelectionChange={handleReferralTypeChange}
          />

          {/* --- REFERRALS TAB --- */}
          {selectedReferralType === "Referrals" && (
            <>
              {isFilterViewActive ? (
                // RENDER THE NEW FILTERED VIEW
                <AllReferralsView
                  onBackToOverview={handleBackToOverview}
                  onExport={handleExport}
                  onSearchChange={handleOverviewSearchChange}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  onViewReferral={(id: string) => {
                    setReferralEditId(id);
                    setIsReferralStatusModalViewMode(true);
                    setIsReferralStatusModalOpen(true);
                  }}
                  onEditReferral={handleEditReferral}
                  onViewReferralPage={(id: string) =>
                    console.log("External Link:", id)
                  }
                  referrals={referralData?.data as Referral[]}
                  totalReferrals={referralData?.total ?? 0}
                  totalPages={referralData?.totalPages ?? 1}
                  currentFilters={currentFilters}
                  setCurrentFilters={setCurrentFilters}
                  filterStats={referralData?.filterStats as FilterStats}
                  isLoading={isLoadingReferrals || isFetchingReferrals}
                />
              ) : (
                // RENDER THE ORIGINAL OVERVIEW DASHBOARD
                <div className="space-y-5">
                  <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {STAT_CARD_DATA.map((data, i) => (
                      <MiniStatsCard key={i} cardData={data} />
                    ))}
                  </div>

                  <Card className="shadow-none border border-primary/15">
                    <CardHeader className="p-4 pb-0">
                      <p className="font-medium text-sm">Status Breakdown</p>
                    </CardHeader>
                    <CardBody className="p-4">
                      {isLoadingReferrals || isFetchingReferrals ? (
                        <LoadingState />
                      ) : (
                        <div className="grid grid-cols-3 gap-3">
                          {STATUS_BREAKDOWN.map((statusItem) => (
                            <div
                              key={statusItem.status}
                              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-2.5 rounded-lg cursor-pointer"
                              onClick={() => {
                                setIsFilterViewActive(true);
                                setCurrentFilters((prev) => ({
                                  ...prev,
                                  filter: statusItem.status,
                                  source: "",
                                }));
                              }}
                            >
                              <ReferralStatusChip status={statusItem.status} />
                              <span className="text-sm">
                                {statusItem.count}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardBody>
                  </Card>

                  <div className="px-4 border-primary/15 border rounded-xl bg-background">
                    <div className="flex flex-wrap items-center gap-2 w-full rounded-md py-4">
                      <Input
                        size="sm"
                        variant="flat"
                        placeholder="Search..."
                        value={overviewSearchKeyword}
                        onValueChange={handleOverviewSearchChange}
                        className="text-xs flex-1 min-w-fit"
                      />

                      <Button
                        size="sm"
                        variant="bordered"
                        className="text-xs ml-auto min-w-[100px] border-small border-primary/15 hover:bg-orange-200 hover:text-orange-500 transition-colors"
                        onPress={handleViewAllAndFilter}
                      >
                        <LuFilter />
                        View All & Filter
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 border border-primary/15 rounded-xl p-4 bg-background/90">
                    <p className="font-medium text-sm">Recent Referrals</p>
                    {isLoadingReferrals || isFetchingReferrals ? (
                      <LoadingState />
                    ) : referralData?.data?.length ? (
                      referralData.data.slice(0, 5).map((ref: Referral) => (
                        <ReferralCard
                          key={ref._id}
                          referral={ref}
                          actions={(referral: Referral) => [
                            {
                              label: "",
                              onClick: () => {},
                              icon: <LuPhone className="w-4 h-4" />,
                              link: `tel:${referral.phone}`,
                              hideButton: referral.phone ? false : true,
                            },
                            {
                              label: "",
                              onClick: (id) => {
                                setReferralEditId(id);
                                setIsReferralStatusModalViewMode(true);
                                setIsReferralStatusModalOpen(true);
                              },
                              icon: <FiEye className="w-4 h-4" />,
                            },
                            {
                              label: "",
                              icon: <FiEdit className="w-4 h-4" />,
                              onClick: handleEditReferral,
                            },
                          ]}
                        />
                      ))
                    ) : (
                      <EmptyState />
                    )}
                    {referralData && referralData.total > 5 && (
                      <div className="text-center">
                        <Button
                          size="sm"
                          radius="sm"
                          variant="ghost"
                          className="border-primary/15 border-small"
                          onPress={handleViewAllAndFilter}
                        >
                          View all {referralData.total} referrals
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* --- REFERRERS TAB --- */}
          {selectedReferralType === "Referrers" && (
            <div className="flex flex-col gap-4 border border-primary/15 rounded-xl p-4 bg-background/70 w-full">
              <p className="font-medium text-sm">Referrer Management</p>
              {isLoadingReferrers ? (
                <LoadingState />
              ) : referrers?.length ? (
                referrers.map((referrer: Referrer) => (
                  <ReferrerCard
                    key={referrer._id}
                    referrer={referrer}
                    buttons={refererButtonList as any}
                    onView={(id) => {
                      setReferrerEditId(id);
                      setIsModalOpen(true);
                    }}
                  />
                ))
              ) : (
                <EmptyState />
              )}
              {referrerData?.totalPages && referrerData.totalPages > 1 ? (
                <Pagination
                  showControls
                  size="sm"
                  radius="sm"
                  initialPage={1}
                  page={referrerParams.page}
                  onChange={(page) => {
                    setReferrerParams((prev) => ({ ...prev, page }));
                  }}
                  total={referrerData.totalPages}
                  classNames={{
                    base: "flex justify-end py-3",
                    wrapper: "gap-1.5",
                    item: "cursor-pointer",
                    prev: "cursor-pointer",
                    next: "cursor-pointer",
                  }}
                />
              ) : (
                ""
              )}
            </div>
          )}

          {/* --- NFC & QR TRACKING TAB --- */}
          {selectedReferralType === "NFC & QR Tracking" && (
            <>
              {isLoadingTrackings ? (
                <LoadingState />
              ) : (
                <TrackingPanel trackings={trackings} />
              )}
            </>
          )}
        </div>

        <ReferralManagementActions
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          editedData={singleReferrerData || null}
          setReferrerEditId={setReferrerEditId}
        />
      </ComponentContainer>
      <ReferralStatusModal
        isOpen={isReferralStatusModalOpen}
        onClose={() => setIsReferralStatusModalOpen(false)}
        // @ts-ignore - Assuming type mismatch is handled by external types
        referral={singleReferralData}
        isViewMode={isReferralStatusModalViewMode}
        setReferralEditId={setReferralEditId}
      />
    </>
  );
};

export default ReferralManagement;
