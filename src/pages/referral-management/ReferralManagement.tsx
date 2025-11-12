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
import {
  useFetchReferrals,
  useFetchReferrers,
  useFetchTrackings,
  useGetReferralById,
  useGetReferrerById,
} from "../../hooks/useReferral";
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
import { useInitiateCall } from "../../hooks/useTwilio";

type ReferralType = "Referrals" | "Referrers" | "NFC & QR Tracking";

// ----------------------
// Component
// ----------------------
const ReferralManagement = () => {
  const { user } = useTypedSelector((state) => state.auth);

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
    limit: 5,
  });

  // ----------------------
  // Queries
  // ----------------------
  const { data: referralData, refetch: referralRefetch } =
    useFetchReferrals(currentFilters);

  const { data: referrerData } = useFetchReferrers(referrerParams);

  const referrers = referrerData?.data;

  // console.log(referrerData, "GHDSAFAHSHGSASHDHJASGDHASHDGHASDHSA");

  const { data: singleReferralData, refetch: singleReferralRefetch } =
    useGetReferralById(referralEditId);
  const { data: singleReferrerData, refetch } =
    useGetReferrerById(referrerEditId);

  const { mutate: initiateCall, isPending } = useInitiateCall(
    user?.userId || ""
  );

  useEffect(() => {
    if (referrerEditId) {
      refetch();
    }
  }, [referrerEditId]);

  useEffect(() => {
    if (referralEditId) {
      singleReferralRefetch();
    }
  }, [referralEditId]);

  const { data: trackings } = useFetchTrackings(user?.userId);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTotalReferrals(referralData?.total as number));
  }, [referralData]);

  useEffect(() => {
    referralRefetch();
  }, [currentFilters, referralRefetch]);

  const handleClearFilters = () => {
    setCurrentFilters({
      page: 1,
      limit: 10,
      search: "",
      filter: "",
      source: "",
    });
  };

  const handleBackToOverview = () => {
    setIsFilterViewActive(false);
    handleClearFilters();
  };

  const handleViewAllAndFilter = () => {
    setIsFilterViewActive(true);
  };

  // ----------------------
  // Derived Data
  // ----------------------
  const STAT_CARD_DATA = useMemo<StatCard[]>(
    () => [
      {
        icon: <LuBuilding2 className="text-[17px] mt-1 text-sky-500" />,
        heading: "Total Referrals",
        value: referralData?.stats?.totalReferrals as number,
        subheading: "Click to view all referrals",
        onClick: handleViewAllAndFilter,
      },
      {
        icon: <FiUsers className="text-[17px] mt-1 text-green-500" />,
        heading: "NFC Referrals",
        value: referralData?.stats?.nfcReferralTotal as number,
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
        value: referralData?.stats?.qrReferralTotal as number,
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
        value: referralData?.stats?.totalValue as number,
        subheading: "Click to view value details",
        onClick: handleViewAllAndFilter,
      },
    ],
    [referralData]
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

  // ----------------------
  // Handlers
  // ----------------------
  const handleReferralTypeChange = (key: string) =>
    setSelectedReferralType(key as ReferralType);

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

  const handleFilterChange = (key: string, value: string) => {
    // Inside handleFilterChange:
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

    // Trigger the download
    downloadJson(exportData, "referrals");
  };

  const handleOverviewSearchChange = (value: string) => {
    // Only updates the input value, not the main API query for the overview
    setOverviewSearchKeyword(value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      // if (!isFilterViewActive) {
      setCurrentFilters((prev) => ({
        ...prev,
        search: overviewSearchKeyword,
        page: 1,
      }));
      // }
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [overviewSearchKeyword, isFilterViewActive]);

  // ----------------------
  // Subcomponents
  // ----------------------
  const NoData = ({ text = "No data to display" }: { text?: string }) => (
    <p className="bg-background text-xs text-center text-gray-600">{text}</p>
  );

  const STATUS_BREAKDOWN = [
    {
      label: "Contacted",
      status: "contacted",
      count: referralData?.statusStats?.contacted,
    },
    {
      label: "Appointed",
      status: "appointed",
      count: referralData?.statusStats?.appointed,
    },
    {
      label: "In Process",
      status: "inProcess",
      count: referralData?.statusStats?.inProcess,
    },
    {
      label: "Started Treatment",
      status: "started",
      count: referralData?.statusStats?.started,
    },
    {
      label: "Declined Treatment",
      status: "declined",
      count: referralData?.statusStats?.declined,
    },
  ];

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
                  onViewReferral={(id: any) => {
                    setReferralEditId(id);
                    setIsReferralStatusModalViewMode(true);
                    setIsReferralStatusModalOpen(true);
                  }}
                  onEditReferral={handleEditReferral}
                  onViewReferralPage={(id: any) =>
                    console.log("External Link:", id)
                  }
                  referrals={referralData?.data as Referral[]}
                  totalReferrals={referralData?.total as number}
                  totalPages={referralData?.totalPages as number}
                  currentFilters={currentFilters}
                  setCurrentFilters={setCurrentFilters}
                  filterStats={referralData?.filterStats as FilterStats}
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
                      <div className="grid grid-cols-3 gap-3">
                        {STATUS_BREAKDOWN.map((statusItem) => {
                          return (
                            <div
                              key={statusItem.status}
                              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-2.5 rounded-lg cursor-pointer"
                              onClick={() => {
                                setIsFilterViewActive(true);
                                setCurrentFilters((prev: any) => ({
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
                          );
                        })}
                      </div>
                    </CardBody>
                  </Card>

                  <div className="px-4 border-primary/15 border rounded-xl bg-background">
                    {/* <h5>Filters</h5> */}
                    <div className="flex flex-wrap items-center gap-2 w-full rounded-md py-4">
                      <Input
                        size="sm"
                        variant="flat"
                        placeholder="Search..."
                        value={overviewSearchKeyword} // Controlled by the overview-specific state
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
                    {referralData?.data?.length ? (
                      referralData.data.slice(0, 5).map((ref: any) => (
                        <ReferralCard
                          key={ref._id}
                          referral={ref}
                          actions={(referral: any) => [
                            {
                              label: "",
                              onClick: (id) => {
                                initiateCall({
                                  referredBy: referral._id,
                                  to: referral.phone,
                                });
                              },
                              icon: <LuPhone className="w-4 h-4" />,
                              // link: `tel:${referral.phone}`,
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
                      <NoData />
                    )}
                    {referralData && referralData?.total > 5 && (
                      <div className="text-center mt-2">
                        <Button
                          size="sm"
                          radius="sm"
                          variant="ghost"
                          className="border-primary/15 border-small"
                          onPress={handleViewAllAndFilter}
                        >
                          View all {referralData?.total} referrals
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
              {referrers?.length ? (
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
                <NoData />
              )}
              {referrerData?.totalPages && referrerData.totalPages > 1 ? (
                <Pagination
                  showControls
                  size="sm"
                  radius="sm"
                  initialPage={1}
                  page={referrerParams.page as number}
                  onChange={(page) => {
                    setReferrerParams((prev: any) => ({ ...prev, page }));
                  }}
                  total={referrerData?.totalPages as number}
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
            <TrackingPanel trackings={trackings} />
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
        // @ts-ignore
        referral={singleReferralData}
        isViewMode={isReferralStatusModalViewMode}
        setReferralEditId={setReferralEditId}
      />
    </>
  );
};

export default ReferralManagement;
