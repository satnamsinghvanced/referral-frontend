import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Pagination,
  Tab,
  Tabs,
} from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiEdit, FiEye, FiUsers, FiWifi } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { IoSearch } from "react-icons/io5";
import { LuFilter, LuNfc, LuQrCode } from "react-icons/lu";
import { MdTrendingUp } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import MiniStatsCard, { StatCard } from "../../components/cards/MiniStatsCard";
import ReferralStatusChip from "../../components/chips/ReferralStatusChip";
import ComponentContainer from "../../components/common/ComponentContainer";
import EmptyState from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";
import { useDebouncedValue } from "../../hooks/common/useDebouncedValue";
import {
  useCreateReferral,
  useFetchReferrals,
  useFetchReferrers,
  useGetReferralById,
  useGetReferrerById,
} from "../../hooks/useReferral";
import { Referrer } from "../../types/partner";
import { FilterStats, Referral } from "../../types/referral";
import { formatNumberWithCommas } from "../../utils/formatNumberWithCommas";
import { downloadJson } from "../../utils/jsonDownloader";
import AllReferralsView from "./referrals/AllReferralsView";
import BulkImportModal from "./referrals/BulkImportModal";
import ReferralCard from "./referrals/ReferralCard";
import ReferralStatusModal from "./referrals/ReferralStatusModal";
import TrackReferralBar from "./referrals/TrackReferralBar";
import TrackReferralModal from "./referrals/TrackReferralModal";
import ReferrerActionsModal from "./referrer-actions/ReferrerActionsModal";
import NfcTagModal from "./referrers/NfcTagModal";
import QrCodeDownloadModal from "./referrers/QrCodeDownloadModal";
import ReferrerCard from "./referrers/ReferrerCard";
import TrackingPanel from "./TrackingPanel";
import { usePaginationAdjustment } from "../../hooks/common/usePaginationAdjustment";

type ReferralType = "Referrals" | "Referrers" | "NFC & QR Tracking";

const REFERRAL_INITIAL_FILTERS = {
  page: 1,
  limit: 10,
  search: "",
  filter: "",
  source: "",
};

const ReferralManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReferralStatusModalOpen, setIsReferralStatusModalOpen] =
    useState(false);
  const [isReferralStatusModalViewMode, setIsReferralStatusModalViewMode] =
    useState(false);
  const [selectedReferralType, setSelectedReferralType] =
    useState<ReferralType>("Referrals");
  const [isFilterViewActive, setIsFilterViewActive] = useState(false);
  const [currentFilters, setCurrentFilters] = useState(
    REFERRAL_INITIAL_FILTERS,
  );
  const [referralEditId, setReferralEditId] = useState<string>("");
  const [referrerEditId, setReferrerEditId] = useState("");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrModalData, setQrModalData] = useState<Referrer | null>(null);
  const [nfcModalData, setNfcModalData] = useState<Referrer | null>(null);
  const [isNfcModalOpen, setIsNfcModalOpen] = useState(false);
  const [isTrackReferralModalOpen, setIsTrackReferralModalOpen] =
    useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [referrerParams, setReferrerParams] = useState({
    filter: "",
    page: 1,
    limit: 10,
    search: "",
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const referralIdParam = searchParams.get("referralId");
  const referrerIdParam = searchParams.get("referrerId");
  const tabParam = searchParams.get("tab");
  const actionParam = searchParams.get("action");

  useEffect(() => {
    if (tabParam) {
      setSelectedReferralType(tabParam as ReferralType);
    }
    if (referralIdParam) {
      setReferralEditId(referralIdParam);
      setIsReferralStatusModalViewMode(true);
      setIsReferralStatusModalOpen(true);
    }
    if (referrerIdParam) {
      setReferrerEditId(referrerIdParam);
      setIsModalOpen(true);
    }
    if (actionParam === "track") {
      setIsTrackReferralModalOpen(true);
    }
  }, [referralIdParam, referrerIdParam, tabParam, actionParam]);

  const debouncedSearch = useDebouncedValue(currentFilters.search, 500);
  const debouncedReferrerSearch = useDebouncedValue(referrerParams.search, 500);

  const createReferralMutation = useCreateReferral();

  useEffect(() => {
    setCurrentFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  const {
    data: referralData,
    isLoading: isLoadingReferrals,
    isFetching: isFetchingReferrals,
  } = useFetchReferrals({ ...currentFilters, search: debouncedSearch });

  const { data: referrerData, isLoading: isLoadingReferrers } =
    useFetchReferrers({ ...referrerParams, search: debouncedReferrerSearch });
  const referrers = referrerData?.data;

  // Pagination adjustments
  usePaginationAdjustment({
    totalPages: referralData?.totalPages || 0,
    currentPage: currentFilters.page,
    onPageChange: (page) => setCurrentFilters((prev) => ({ ...prev, page })),
    isLoading: isLoadingReferrals || isFetchingReferrals,
  });

  usePaginationAdjustment({
    totalPages: referrerData?.totalPages || 0,
    currentPage: referrerParams.page,
    onPageChange: (page) => setReferrerParams((prev) => ({ ...prev, page })),
    isLoading: isLoadingReferrers,
  });

  const { data: singleReferralData } = useGetReferralById(referralEditId);
  const { data: singleReferrerData } = useGetReferrerById(referrerEditId);

  const handleClearFilters = useCallback(() => {
    setCurrentFilters(REFERRAL_INITIAL_FILTERS);
  }, []);

  const handleBackToOverview = useCallback(() => {
    setIsFilterViewActive(false);
    handleClearFilters();
  }, [handleClearFilters]);

  const handleViewAllAndFilter = useCallback(() => {
    setIsFilterViewActive(true);
  }, []);

  const handleReferralTypeChange = (key: string | number) =>
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

  // ----------------------
  // Derived Data (useMemo)
  // ----------------------
  const STAT_CARD_DATA = useMemo<StatCard[]>(
    () => [
      {
        icon: <FiUsers className="text-sky-500" />,
        heading: "Total Referrals",
        value: referralData?.stats?.totalReferrals ?? 0,
        subheading: "Click to view all referrals",
        onClick: handleViewAllAndFilter,
      },
      {
        icon: <FiWifi className="text-purple-500" />,
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
        icon: <LuQrCode className="text-yellow-500" />,
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
        icon: <MdTrendingUp className="text-green-500" />,
        heading: "Total Value",
        value: `$${formatNumberWithCommas(
          referralData?.stats?.totalValue as number,
        )}`,
        subheading: "Click to view value details",
        onClick: handleViewAllAndFilter,
      },
    ],
    [referralData, handleViewAllAndFilter],
  );

  const HEADING_DATA = useMemo(
    () => ({
      heading: "Referral Management",
      subHeading:
        "Track doctor and patient referrals for your orthodontic practice",
      buttons: [
        {
          label: "Generate QR Code",
          onClick: () => setSelectedReferralType("NFC & QR Tracking"),
          icon: <LuQrCode fontSize={15} />,
          variant: "ghost",
          color: "default",
          className: "border-small tour-step-generate-qr-btn",
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
          className: "tour-step-add-referrer-btn",
        },
      ],
    }),
    [],
  );

  const REFERRER_CARD_BUTTONS = useCallback(
    (referrer: Referrer) => [
      {
        label: "QR Code",
        icon: <LuQrCode />,
        variant: "ghost",
        color: "default",
        className: "border-small",
        onClick: () => {
          setQrModalData(referrer);
          setIsQrModalOpen(true);
        },
      },
      {
        label: "NFC Tap",
        icon: <LuNfc />,
        variant: "ghost",
        color: "default",
        className: "border-small",
        onClick: () => {
          setNfcModalData(referrer);
          setIsNfcModalOpen(true);
        },
      },
      {
        label: "Visit",
        icon: <GrLocation className="font-bold" />,
        variant: "ghost",
        color: "default",
        linkInNewTab: true,
        className: "border-small",
        isHide: referrer.type !== "doctor",
      },
    ],
    [],
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
    [referralData?.statusStats],
  );

  // ----------------------
  // Render
  // ----------------------
  return (
    <>
      <ComponentContainer headingData={HEADING_DATA as any}>
        <div className="flex flex-col gap-4 md:gap-5">
          <div className="">
            <Tabs
              selectedKey={selectedReferralType}
              onSelectionChange={handleReferralTypeChange}
              aria-label="Select Role"
              variant="light"
              radius="full"
              classNames={{
                base: "bg-primary/15 dark:bg-background rounded-full p-1 w-full",
                tabList: "flex w-full rounded-full p-0 gap-0",
                tab: "flex-1 h-9 text-sm font-medium transition-all",
                cursor: "rounded-full bg-white dark:bg-primary",
                tabContent:
                  "dark:group-data-[selected=true]:text-primary-foreground text-default-500 dark:text-foreground/60 transition-colors",
              }}
              className="w-full"
            >
              {[
                { title: "Referrals", className: "tour-step-referrals-tab" },
                { title: "Referrers", className: "tour-step-referrers-tab" },
                {
                  title: "NFC & QR Tracking",
                  className: "tour-step-nfc-tab",
                },
              ].map((role) => (
                <Tab
                  key={role.title}
                  title={role.title}
                  className={role.className}
                />
              ))}
            </Tabs>
          </div>

          {/* --- REFERRALS TAB --- */}
          {selectedReferralType === "Referrals" && (
            <>
              {isFilterViewActive ? (
                // RENDER THE NEW FILTERED VIEW
                <AllReferralsView
                  onBackToOverview={handleBackToOverview}
                  onExport={handleExport}
                  onSearchChange={(value) =>
                    setCurrentFilters((prev) => ({ ...prev, search: value }))
                  }
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  onViewReferral={(id: string) => {
                    setReferralEditId(id);
                    setIsReferralStatusModalViewMode(true);
                    setIsReferralStatusModalOpen(true);
                  }}
                  onEditReferral={handleEditReferral}
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
                <div className="space-y-4 md:space-y-5">
                  <TrackReferralBar
                    onTrackReferral={() => setIsTrackReferralModalOpen(true)}
                    onImport={() => setIsImportModalOpen(true)}
                  />

                  <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
                    {STAT_CARD_DATA.map((data, i) => (
                      <MiniStatsCard key={i} cardData={data} />
                    ))}
                  </div>

                  <Card className="shadow-none border border-foreground/10 bg-background">
                    <CardHeader className="p-4 pb-0">
                      <p className="font-medium text-sm">Status Breakdown</p>
                    </CardHeader>
                    <CardBody className="p-4">
                      {isLoadingReferrals || isFetchingReferrals ? (
                        <LoadingState />
                      ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                          {STATUS_BREAKDOWN.map((statusItem) => (
                            <div
                              key={statusItem.status}
                              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 dark:bg-content1 dark:hover:bg-white/[0.05] p-2.5 rounded-lg cursor-pointer"
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
                              <span className="text-sm dark:text-foreground">
                                {statusItem.count}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardBody>
                  </Card>

                  <div className="px-4 border-foreground/10 border rounded-xl bg-background">
                    <div className="flex flex-wrap items-center gap-3 w-full rounded-md py-4 max-sm:items-stretch">
                      <Input
                        size="sm"
                        variant="flat"
                        placeholder="Search by name, practice, email, or phone..."
                        value={currentFilters.search}
                        onValueChange={(value) =>
                          setCurrentFilters((prev) => ({
                            ...prev,
                            search: value,
                          }))
                        }
                        className="text-xs flex-1 min-w-fit"
                      />

                      <Button
                        size="sm"
                        variant="ghost"
                        onPress={handleViewAllAndFilter}
                        className="border-small max-sm:w-full"
                      >
                        <LuFilter className="size-3.5" />
                        View All & Filter
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 border border-foreground/10 rounded-xl p-4 bg-background">
                    <p className="font-medium text-sm">Recent Referrals</p>
                    {isLoadingReferrals || isFetchingReferrals ? (
                      <LoadingState />
                    ) : referralData?.data?.length ? (
                      <div className="space-y-3">
                        {referralData.data.slice(0, 5).map((ref: Referral) => (
                          <ReferralCard
                            key={ref._id}
                            referral={ref}
                            actions={(referral: Referral) => [
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
                        ))}
                      </div>
                    ) : (
                      <EmptyState title="No referrals found with current filters. Try adjusting your search or filters." />
                    )}
                    {referralData && referralData.total > 5 && (
                      <div className="text-center">
                        <Button
                          size="sm"
                          radius="sm"
                          variant="ghost"
                          className="border-small"
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
            <div className="flex flex-col gap-4 border border-foreground/10 rounded-xl p-4 bg-background w-full">
              <div className="flex flex-col gap-4">
                <p className="font-medium text-sm">Referrer Management</p>
                <div className="flex-1">
                  <Input
                    size="sm"
                    variant="flat"
                    placeholder="Search referrers by name, practice, email, phone or type..."
                    value={referrerParams.search}
                    onValueChange={(value) =>
                      setReferrerParams((prev) => ({
                        ...prev,
                        search: value,
                        page: 1,
                      }))
                    }
                    className="text-xs"
                    startContent={
                      <IoSearch
                        size={18}
                        className="text-gray-400 dark:text-foreground/40"
                      />
                    }
                  />
                </div>
              </div>
              {isLoadingReferrers ? (
                <LoadingState />
              ) : referrers?.length ? (
                <div className="space-y-3">
                  {referrers.map((referrer: Referrer) => (
                    <ReferrerCard
                      key={referrer._id}
                      referrer={referrer}
                      buttons={REFERRER_CARD_BUTTONS as any}
                      onView={(id) => {
                        setReferrerEditId(id);
                        setIsModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState title="No referrers found with current filters. Try adjusting your search or filters." />
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
                  }}
                />
              ) : (
                ""
              )}
            </div>
          )}

          {/* --- NFC & QR TRACKING TAB --- */}
          {selectedReferralType === "NFC & QR Tracking" && <TrackingPanel />}
        </div>

        <ReferrerActionsModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          editedData={singleReferrerData || null}
          setReferrerEditId={setReferrerEditId}
          setSelectedTab={setSelectedReferralType}
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
      {qrModalData && (
        <QrCodeDownloadModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          referrer={qrModalData}
        />
      )}
      {nfcModalData && (
        <NfcTagModal
          isOpen={isNfcModalOpen}
          onClose={() => setIsNfcModalOpen(false)}
          referrer={nfcModalData}
        />
      )}
      <TrackReferralModal
        isOpen={isTrackReferralModalOpen}
        onClose={() => setIsTrackReferralModalOpen(false)}
        referrers={referrers || []}
        onCreateNewReferrer={() => {
          setIsTrackReferralModalOpen(false);
          setIsModalOpen(true);
        }}
      />
      <BulkImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </>
  );
};

export default ReferralManagement;
