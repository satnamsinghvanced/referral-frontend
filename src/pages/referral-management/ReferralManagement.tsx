import { JSX, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import { FaQrcode } from "react-icons/fa6";
import { FiEdit, FiEye, FiStar, FiTarget, FiUsers } from "react-icons/fi";
import { IoCallOutline } from "react-icons/io5";
import { LuBuilding2 } from "react-icons/lu";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import FilterPanel from "../../components/common/FilterPanel";
import Button from "../../components/ui/Button";
import {
  useCreateReferral,
  useUpdateReferral,
  useFetchReferrals,
  useFetchReferrers,
} from "../../hooks/useReferral"; // make sure these hooks use TanStack properly
import { ButtonConfig, Referrer } from "../../types/types";
import { urgencyLabels } from "../../utils/consts";
import RefererCard from "./RefererCard";
import ReferralCard from "./ReferralCard";
import ReferralManagementActions from "./ReferralManagementActions";
import RoleToggleTabs from "./RoleToggleTabs";
import { Link } from "react-router";

interface StatCardData {
  icon: JSX.Element;
  heading: string;
  value: string;
  subheading: string;
}

interface FilterType {
  search: string;
  status: string;
  urgency: string;
  location: string;
}

type ReferralType = "Referrals" | "Referrers" | "NFC & QR Tracking";

interface Referral {
  _id: string;
  name: string;
  practiceName: string;
  practiceAddress: string;
  createdAt: string;
  urgency: string;
  addedVia: string;
}

const STAT_CARD_DATA: StatCardData[] = [
  {
    icon: <LuBuilding2 className="text-[17px] mt-1 text-sky-500" />,
    heading: "Total Practices",
    value: "3",
    subheading: "Referring practices",
  },
  {
    icon: <FiUsers className="text-[17px] mt-1 text-green-500" />,
    heading: "Total Referrals",
    value: "247",
    subheading: "+12% from last month",
  },
  {
    icon: <FiStar className="text-[17px] mt-1 text-yellow-500" />,
    heading: "A-Level Practices",
    value: "8",
    subheading: "67% of total",
  },
  {
    icon: <FiTarget className="text-[17px] mt-1 text-green-500" />,
    heading: "Avg. Score",
    value: "78.5",
    subheading: "+5.2 improvement",
  },
];

const ReferralManagement = () => {
  const formRef = useRef<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReferralType, setSelectedReferralType] =
    useState<ReferralType>("Referrals");

  const [filters, setFilters] = useState<FilterType>({
    search: "",
    status: "",
    urgency: "",
    location: "",
  });

  // ----------------------
  // TanStack Queries & Mutations
  // ----------------------
  const { data: referralData, refetch: refetchReferrals } = useFetchReferrals({
    search: filters.search,
    page: 1,
    limit: 5,
  });

  console.log(referralData, "Dsdsad");

  const { data: referrerData, refetch: refetchReferrers } = useFetchReferrers({
    filter: "",
    page: 1,
    limit: 5,
  });

  const { mutate: createReferral } = useCreateReferral({
    onSuccess: () => refetchReferrals(),
  });

  const { mutate: updateReferral } = useUpdateReferral({
    onSuccess: () => refetchReferrals(),
  });

  // ----------------------
  // Handlers
  // ----------------------
  const handleReferralTypeChange = (key: string) => {
    setSelectedReferralType(key as ReferralType);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleExportQR = () => alert("Generate QR Code");

  // Referral Actions integrated with mutations
  const referralActions = [
    {
      label: "Edit",
      function: (id: string, updatedData: Partial<Referral>) => {
        updateReferral({ id, payload: updatedData });
      },
      icon: <FiEdit className="w-4 h-4" />,
    },
    {
      label: "Call",
      function: (phone: string) => {
        alert(`Calling referral at ${phone}`);
        // You can replace alert with actual call logic if needed
      },
      icon: <IoCallOutline className="w-4 h-4" />,
    },
    {
      label: "View",
      function: (id: string) => {
        alert(`Viewing referral ${id}`);
        // You can replace alert with modal opening or navigation
      },
      icon: <FiEye className="w-4 h-4" />,
    },
  ];

  const refererButtonList = [
    {
      label: "QR Code",
      onClick: (id: string) => alert(`QR clicked for id: ${id}`),
      icon: <FaQrcode />,
      variant: "bordered",
      color: "default",
      className: "border-small",
    },
    {
      label: "Location",
      onClick: (id: string) => alert(`Location clicked for id: ${id}`),
      icon: <CiLocationOn className="font-bold" />,
      variant: "bordered",
      color: "default",
      className: "border-small",
    },
  ];

  const headingData: {
    heading: string;
    subHeading: string;
    buttons: ButtonConfig[];
  } = {
    heading: "Referral Management",
    subHeading:
      "Track doctor and patient referrals for your orthodontic practice",
    buttons: [
      {
        label: "Generate QR Code",
        onClick: handleExportQR,
        icon: <FaQrcode />,
        variant: "bordered",
        color: "default",
        className: "border-small",
      },
      {
        label: "Add Referrer",
        onClick: handleOpenModal,
        icon: <AiOutlinePlus fontSize={15} />,
        variant: "solid",
        color: "primary",
        className: "",
      },
    ],
  };

  // ----------------------
  // Render
  // ----------------------
  return (
    <>
      <ComponentContainer headingData={headingData}>
        <div className="flex flex-col gap-5">
          <RoleToggleTabs
            selected={selectedReferralType}
            onSelectionChange={handleReferralTypeChange}
          />

          {selectedReferralType === "Referrals" && (
            <>
              <div className="grid grid-cols md:grid-cols-3 xl:grid-cols-4 gap-4">
                {STAT_CARD_DATA.map((data, index) => (
                  <MiniStatsCard key={index} cardData={data} />
                ))}
              </div>
              <FilterPanel onFilterChange={setFilters} />
              <div className="flex flex-col gap-4 border border-primary/10 rounded-xl p-4 bg-background/90">
                <div className="font-medium text-sm">Recent Referrals</div>
                {referralData?.data && referralData.data.length > 0 ? (
                  referralData.data
                    .splice(0, 5)
                    .map((referral: Referral) => (
                      <ReferralCard
                        key={referral._id}
                        referral={referral}
                        urgencyLabels={urgencyLabels}
                        actions={referralActions}
                      />
                    ))
                ) : (
                  <p className="bg-background text-sm text-center text-foreground/50">
                    No data to display
                  </p>
                )}
              </div>
            </>
          )}

          {selectedReferralType === "Referrers" && (
            <div className="flex flex-col gap-4 border border-primary/10 rounded-xl p-4 bg-background/70 w-full">
              <div className="font-medium text-sm mb-3">
                Referrer Management
              </div>
              {referrerData && referrerData.length > 0 ? (
                referrerData.map((referrer: any) => (
                  <RefererCard
                    key={referrer._id || referrer.id}
                    referrer={referrer}
                    buttons={refererButtonList}
                  />
                ))
              ) : (
                <p className="bg-background text-sm text-center text-foreground/50">
                  No data to display
                </p>
              )}
            </div>
          )}

          {selectedReferralType === "NFC & QR Tracking" && (
            <div className="w-full min-h-80 h-full flex gap-2">
              <div className="border w-full border-primary/20 p-4 rounded-xl bg-background flex flex-col justify-between">
                <div>
                  <h6 className="text-sm flex items-center gap-2">
                    <FaQrcode className="text-primary" /> QR & NFC Code
                    Generator
                  </h6>
                  <p className="text-xs mt-1 font-light">
                    Generate personalized QR codes and NFC tags for General
                    Practice
                  </p>
                </div>
                <div className="flex flex-col gap-3 items-center justify-center text-sm">
                  <p>Generate a personalized QR code for this referrer</p>
                  <Button className="w-1/2">Generate QR Code</Button>
                </div>
              </div>
              <div className="border w-full border-primary/20 p-4 rounded-xl bg-background">
                <h6 className="text-sm">Tracking Analytics</h6>
                <div className="flex flex-col gap-3 mt-4 rounded-md">
                  {[
                    {
                      label: "Total Scans Today",
                      value: 23,
                      bg: "bg-green-200",
                    },
                    { label: "Active QR Codes", value: 67, bg: "bg-pink-200" },
                    { label: "NFC Taps", value: 18, bg: "bg-blue-200" },
                    {
                      label: "Conversion Rate",
                      value: "78%",
                      bg: "bg-indigo-200",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-xs p-4 rounded-lg bg-blue-50"
                    >
                      <div>{item.label}</div>
                      <div>
                        <span className={`px-1.5 py-0.5 rounded-sm ${item.bg}`}>
                          {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </ComponentContainer>

      <ReferralManagementActions
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editedData={null}
      />
    </>
  );
};

export default ReferralManagement;
