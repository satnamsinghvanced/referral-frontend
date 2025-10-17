import { Button, Input } from "@heroui/react";
import { JSX, useCallback, useEffect, useMemo, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaQrcode } from "react-icons/fa";
import { FiEdit, FiEye, FiStar, FiTarget, FiUsers } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { LuBuilding2, LuFilter, LuPhone, LuQrCode } from "react-icons/lu";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import {
  useFetchReferrals,
  useFetchReferrers,
  useFetchTrackings,
  useGetReferrerById,
} from "../../hooks/useReferral";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import {
  REFERRAL_MOCK_CURRENT_FILTERS,
  REFERRAL_MOCK_FILTER_STATS,
  Referrer,
} from "../../types/types";
import { urgencyLabels } from "../../utils/consts";
import AllReferralsView from "./AllReferralsView";
import ReferrerCard from "./ReferrerCard";
import ReferralCard from "./ReferralCard";
import ReferralManagementActions from "./ReferralManagementActions";
import RoleToggleTabs from "./RoleToggleTabs";
import TrackingPanel from "./TrackingPanel";
import { useDispatch } from "react-redux";
import { setTotalReferrals } from "../../store/statsSlice";

// ----------------------
// Types
// ----------------------
interface StatCardData {
  icon: JSX.Element;
  heading: string;
  value: string;
  subheading: string;
  onClick?: any;
}

type ReferralType = "Referrals" | "Referrers" | "NFC & QR Tracking";

// ----------------------
// Component
// ----------------------
const ReferralManagement = () => {
  const { user } = useTypedSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReferralType, setSelectedReferralType] =
    useState<ReferralType>("Referrals");
  const [isFilterViewActive, setIsFilterViewActive] = useState(false);
  const [currentFilters, setCurrentFilters] = useState(
    REFERRAL_MOCK_CURRENT_FILTERS
  );
  const [overviewSearchKeyword, setOverviewSearchKeyword] = useState("");
  const [referrerEditId, setReferrerEditId] = useState("");

  // ----------------------
  // Queries
  // ----------------------
  const { data: referralData, refetch: referralRefetch } =
    useFetchReferrals(currentFilters);

  const { data: referrerData } = useFetchReferrers({
    filter: "",
    page: 1,
    limit: 5,
  });

  const { data: singleReferrerData, refetch } =
    useGetReferrerById(referrerEditId);

  console.log(singleReferrerData);

  useEffect(() => {
    if (referrerEditId) {
      refetch();
    }
  }, [referrerEditId]);

  const { data: trackings } = useFetchTrackings(user?.userId);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTotalReferrals(referralData?.total));
  }, [referralData]);

  useEffect(() => {
    referralRefetch();
  }, [currentFilters, referralRefetch]);

  const handleClearFilters = () => {
    setCurrentFilters(REFERRAL_MOCK_CURRENT_FILTERS);
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
  const STAT_CARD_DATA = useMemo<StatCardData[]>(
    () => [
      {
        icon: <LuBuilding2 className="text-[17px] mt-1 text-sky-500" />,
        heading: "Total Referrals",
        value: referralData?.stats?.totalReferrals,
        subheading: "Click to view all referrals",
        onClick: handleViewAllAndFilter,
      },
      {
        icon: <FiUsers className="text-[17px] mt-1 text-green-500" />,
        heading: "NFC Referrals",
        value: referralData?.stats?.nfcReferralTotal,
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
        value: referralData?.stats?.qrReferralTotal,
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
        value: referralData?.stats?.totalValue,
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
          className: "border-small",
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

  const openSharingModal = useCallback(async (title: string, url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        console.error("Error sharing content:", error);
      }
    } else {
      console.log("Web Share API not supported.");
    }
  }, []);

  const refererButtonList = useCallback(
    (referrer: Referrer) => [
      {
        label: "QR Code",
        icon: <LuQrCode />,
        variant: "bordered",
        color: "default",
        className: "border-small",
        link: referrer?.qrCode,
        linkInNewTab: true,
      },
      {
        label: "Visit",
        icon: <GrLocation className="font-bold" />,
        variant: "bordered",
        color: "default",
        className: "border-small",
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
    console.log(`Editing referral: ${id}`);
    // setReferrerEditId(id);
  };

  const handleExport = () => alert("Exporting data...");

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
    <p className="bg-background text-sm text-center text-foreground/50">
      {text}
    </p>
  );

  console.log(referralData, "REFERRALS");

  // ----------------------
  // Render
  // ----------------------
  return (
    <ComponentContainer headingData={headingData}>
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
                onViewReferral={(id: any) => console.log("View:", id)}
                onEditReferral={handleEditReferral}
                onViewReferralPage={(id: any) =>
                  console.log("External Link:", id)
                }
                onCall={(phone: any) => alert(`Calling ${phone}`)}
                onEmail={(email: any) => alert(`Emailing ${email}`)}
                referrals={referralData?.data}
                totalReferrals={referralData?.total}
                currentFilters={currentFilters}
                setCurrentFilters={setCurrentFilters}
                filterStats={referralData?.filterStats}
              />
            ) : (
              // RENDER THE ORIGINAL OVERVIEW DASHBOARD
              <div className="space-y-5">
                <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {STAT_CARD_DATA.map((data, i) => (
                    <MiniStatsCard key={i} cardData={data} />
                  ))}
                </div>

                <div className=" px-4 border-primary/10  border rounded-lg bg-background ">
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
                      className="text-xs ml-auto min-w-[100px] border-small"
                      onPress={handleViewAllAndFilter}
                    >
                      <LuFilter />
                      View All & Filter
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border border-primary/10 rounded-xl p-4 bg-background/90">
                  <p className="font-medium text-sm">Recent Referrals</p>
                  {referralData?.data?.length ? (
                    referralData.data.slice(0, 5).map((ref: any) => (
                      <ReferralCard
                        key={ref._id}
                        referral={ref}
                        urgencyLabels={urgencyLabels}
                        actions={(referral: any) => [
                          {
                            label: "",
                            icon: <FiEdit className="w-4 h-4" />,
                            // FIX: Added required onClick function
                            onClick: (id) =>
                              console.log(`Editing referral ID: ${id}`),
                          },
                          {
                            label: "",
                            // FIX: Renamed 'function' to 'onClick' to match the ReferralButton interface
                            onClick: (id) =>
                              alert(`Calling mobile for referral ID: ${id}`),
                            icon: <LuPhone className="w-4 h-4" />,
                            link: `tel:${referral.mobile}`,
                          },
                          {
                            label: "",
                            // FIX: Renamed 'function' to 'onClick' to match the ReferralButton interface
                            onClick: (id) =>
                              alert(`Viewing referral ID: ${id}`),
                            icon: <FiEye className="w-4 h-4" />,
                          },
                        ]}
                      />
                    ))
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* --- REFERRERS TAB --- */}
        {selectedReferralType === "Referrers" && (
          <div className="flex flex-col gap-4 border border-primary/10 rounded-xl p-4 bg-background/70 w-full">
            <p className="font-medium text-sm">Referrer Management</p>
            {referrerData?.length ? (
              referrerData.map((referrer) => (
                <ReferrerCard
                  key={referrer._id}
                  referrer={referrer}
                  buttons={refererButtonList}
                  onView={(id) => {
                    setReferrerEditId(id);
                    setIsModalOpen(true);
                  }}
                />
              ))
            ) : (
              <NoData />
            )}
          </div>
        )}

        {/* --- NFC & QR TRACKING TAB --- */}
        {selectedReferralType === "NFC & QR Tracking" && (
          <TrackingPanel trackings={trackings} onShare={openSharingModal} />
        )}
      </div>

      <ReferralManagementActions
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editedData={singleReferrerData || null}
        setReferrerEditId={setReferrerEditId}
      />
    </ComponentContainer>
  );
};

export default ReferralManagement;
