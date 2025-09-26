import { addToast, Card } from "@heroui/react";
import { JSX, useRef, useState } from "react";
import { FaQrcode } from "react-icons/fa6";
import { FiEdit, FiEye, FiStar, FiTarget, FiUsers } from "react-icons/fi";
import { IoCallOutline } from "react-icons/io5";
import { LuBuilding2, LuPlus } from "react-icons/lu";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import UrgencyChip from "../../components/chips/UrgencyChip";
import AddModal from "../../components/common/AddModal";
import ComponentContainer from "../../components/common/ComponentContainer";
import FilterPanel from "../../components/common/FilterPanel";
import ReferralManagementConfig from "../../components/formConfigs/ReferralManagementConfig";
import { useCreatePatient } from "../../queries/patient/useCreateUser";
import { useUpdatePatient } from "../../queries/patient/userUpdateUser";
import { usePatientsQuery } from "../../queries/patient/useUsersQuery";
import RoleToggleTabs from "./RoleToggleTabs"; // Changed from ToggleButton to RoleToggleTabs
import ReferralCard from "./ReferralCard";
import RefererCard from "./RefererCard";
import { CiLocationOn } from "react-icons/ci";
import { urgencyLabels } from "../../utils/consts";

type StatCardData = {
  icon: JSX.Element;
  heading: string;
  value: string;
  subheading: string;
};

const STATCARDDATA: StatCardData[] = [
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

type FilterType = {
  search: string;
  status: string;
  urgency: string;
  location: string;
};

type ReferralType = "Referrals" | "Referrers" | "NFC & QR Tracking";

type Referral = {
  id: string;
  fullName: string;
  referringByName?: string;
  treatmentType?: string;
  createdAt?: string;
  urgency?: keyof typeof urgencyLabels;
};

type Referer = {
  id: string;
  fullName: string;
  practice: string;
  referredBy: string;
  totalReferrals: number;
  referralsThisMonth: number;
};

const ReferralManagement: React.FC = () => {
  const formRef = useRef<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedReferralType, setSelectedReferralType] =
    useState<ReferralType>("Referrals");

  const handleCardClick = (heading: string) => {
    console.log(`${heading} clicked`);
  };

  const handleReferralTypeChange = (type: ReferralType = "Referrals") => {
    console.log("type : ", type);
    setSelectedReferralType(type);
  };

  const { mutate: createPatient } = useCreatePatient();

  const [filters, setFilters] = useState<FilterType>({
    search: "",
    status: "",
    urgency: "",
    location: "",
  });

  const {
    data: referralData,
    isLoading,
    isError,
  } = usePatientsQuery({
    role: "",
    search: filters.search,
    status: filters.status,
    urgency: filters.urgency,
    locations: [filters.location],
    page: 2,
    limit: 5,
  });

  console.log("referralData: ", referralData);

  const { mutate: updatePatient } = useUpdatePatient();

  const statCardData = [
    {
      heading: "A-Level Partners",
      stat: 3,
      bgColor: "bg-green-50",
      textColor: "text-green-800",
    },
    {
      heading: "Active Referrers",
      stat: 5,
      bgColor: "bg-sky-50",
      textColor: "text-sky-800",
    },
    {
      heading: "Total Referrals",
      stat: 8,
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
    },
  ];

  const handleStatusUpdate = (id: string, values: any) => {
    updatePatient(
      { id, patientData: values },
      {
        onSuccess: () => {
          console.log("🎉 Patient updated successfully!");
        },
        onError: (err: unknown) => {
          console.error("⚠️ Failed to update patient:", err);
        },
      }
    );
  };

  const handleExport = () => {
    alert("Generate QR Code");
  };

  const handleOpen = () => {
    console.log("handleOpen");
    setIsModalOpen(true);
  };

  const handleClose = () => {
    console.log("handleClose");
    setIsModalOpen(false);
  };

  const onCancelClick = () => {
    console.log("onCancelClick");
    handleClose();
  };

  const onSaveClick = async () => {
    if (formRef.current?.isValid && formRef.current?.dirty) {
      const values = formRef.current.values;

      createPatient(values, {
        onSuccess: () => {
          console.log("Patient created successfully!");
          addToast({
            title: "Success",
            description: "Patient created successfully",
            color: "success",
          });
          formRef.current.resetForm();
          handleClose();
        },
        onError: (err: unknown) => {
          console.error("Failed to create patient:", err);
          addToast({
            title: "Error",
            description: "Failed to create patient",
            color: "danger",
          });
        },
      });
    } else {
      console.log("⚠️ Form not valid yet");

      // Force validation + mark touched
      await formRef?.current.validateForm();
      formRef?.current.setTouched(
        Object.keys(formRef?.current?.values).reduce(
          (acc: any, key: string) => {
            acc[key] = true;
            return acc;
          },
          {}
        )
      );
    }
  };

  const buttonList = [
    {
      label: "Generate QR Code",
      onClick: handleExport,
      icon: <FaQrcode />,
      props: {
        variant: "secondary" as const,
      },
    },
    {
      label: "Add Referrer",
      onClick: handleOpen,
      classNames: "bg-foreground text-background  ",
      icon: <LuPlus />,
      props: {
        variant: "primary" as const,
      },
    },
  ];

  const qrForReferrer = (id: string) => {
    alert(`QR clicked for id: ${id}`);
  };
  const locationForReferrer = (id: string) => {
    alert(`QR clicked for id: ${id}`);
  };

  const refererButtonList = [
    {
      label: "QR Code",
      onClick: qrForReferrer,
      classNames: "",
      icon: <FaQrcode />,
      props: {
        variant: "bordered",
      },
    },
    {
      label: "Location",
      onClick: locationForReferrer,
      classNames: "",
      icon: <CiLocationOn className="font-bold" />,
      props: {
        variant: "bordered",
      },
    },
  ];

  const cancelBtnData = {
    function: onCancelClick,
    style: "border-foreground/10  border text-foreground hover:bg-background",
    text: "cancel",
  };

  const addBtnData = {
    function: onSaveClick,
    style: "bg-foreground text-background",
    text: "add",
  };

  const headingData = {
    heading: "Referral Management",
    subHeading:
      "Track doctor and patient referrals for your orthodontic practice",
    buttons: buttonList,
  };

  return (
    <>
      <ComponentContainer headingData={headingData}>
        <div className="flex flex-col gap-5">
          <RoleToggleTabs
            selected={selectedReferralType}
            onSelectionChange={handleReferralTypeChange}
          />

          <div className="">
            <div className="flex flex-col gap-4 mt-1">
              {1 ? (
                selectedReferralType === "Referrals" ? (
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {STATCARDDATA.map((data, index) => (
                        <MiniStatsCard key={index} cardData={data} />
                      ))}
                    </div>

                    <FilterPanel onFilterChange={setFilters} />

                    <div className="flex flex-col gap-4 border border-primary/10  rounded-xl p-4  bg-background /90">
                      <div className="font-medium text-sm mb-3">
                        Recent Referrals
                      </div>
                      {[
                        {
                          id: "1",
                          fullName: "John Doe",
                          referringByName: "Dr. Smith",
                          treatmentType: "Dental Checkup",
                          createdAt: "2025-09-20T12:30:00Z",
                          urgency: "high",
                        },
                        {
                          id: "2",
                          fullName: "Jane Smith",
                          referringByName: "Dr. White",
                          treatmentType: "Eye Examination",
                          createdAt: "2025-09-18T10:15:00Z",
                          urgency: "medium",
                        },
                        {
                          id: "3",
                          fullName: "Michael Brown",
                          referringByName: "Dr. Green",
                          treatmentType: "Physical Therapy",
                          createdAt: "2025-09-22T09:00:00Z",
                          urgency: "low",
                        },
                        {
                          id: "4",
                          fullName: "Emily Johnson",
                          referringByName: "Dr. Blue",
                          treatmentType: "General Consultation",
                          createdAt: "2025-09-19T14:45:00Z",
                          urgency: "high",
                        },
                        {
                          id: "5",
                          fullName: "David Williams",
                          referringByName: "Dr. Black",
                          treatmentType: "Blood Pressure Monitoring",
                          createdAt: "2025-09-21T16:30:00Z",
                          urgency: "medium",
                        },
                      ].map((referral) => (
                        <ReferralCard
                          key={referral.id}
                          referral={referral}
                          urgencyLabels={urgencyLabels}
                        />
                      ))}
                    </div>
                  </div>
                ) : selectedReferralType === "Referrers" ? (
                  <div className="flex flex-col gap-4 border border-primary/10  rounded-xl p-4  bg-background /70 w-full">
                    <div className="font-medium text-sm mb-3">
                      Referrer Management
                    </div>
                    {[
                      {
                        id: "1",
                        fullName: "Dr. John Doe",
                        practice: "Johnson Family Dentistry",
                        referringByName: "doctor",
                        totalReferrals: 50,
                        referralsThisMonth: 12,
                      },
                      {
                        id: "2",
                        fullName: "Jane Smith",
                        practice: "Brown Dental Care",
                        referringByName: "doctor",
                        totalReferrals: 10,
                        referralsThisMonth: 8,
                      },
                      {
                        id: "3",
                        fullName: "Michael Brown",
                        practice: "Patient Referrer",
                        referringByName: "petient",
                        totalReferrals: 25,
                        referralsThisMonth: 18,
                      },
                    ].map((referral) => (
                      <RefererCard
                        key={referral.id}
                        referral={referral}
                        buttons={refererButtonList}
                      />
                    ))}
                  </div>
                ) : selectedReferralType === "NFC & QR Tracking" ? (
                  <div className="w-full h-80 flex gap-2">
                    <div className="border w-full border-primary/10 "></div>
                    <div className="border w-full border-primary/10 "></div>
                  </div>
                ) : null
              ) : (
                <Card
                  className="w-full flex items-center justify-center p-10 border border-foreground/10 "
                  shadow="none"
                >
                  <p className="text-sm text-foreground/80">
                    No referrals found
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </ComponentContainer>

      <AddModal
        isOpen={isModalOpen}
        heading="Add New Referrer"
        description="Add a new doctor or patient referrer to your system. Complete all required fields to ensure proper referral tracking."
        cancelBtnData={cancelBtnData}
        addBtnData={{ ...addBtnData, function: onSaveClick }}
        config={<ReferralManagementConfig ref={formRef} />}
      />
    </>
  );
};

export default ReferralManagement;
