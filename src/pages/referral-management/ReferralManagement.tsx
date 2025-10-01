import { addToast, Card } from "@heroui/react";
import { JSX, useRef, useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { FaQrcode } from "react-icons/fa6";
import { FiEdit, FiEye, FiStar, FiTarget, FiUsers } from "react-icons/fi";
import { IoCallOutline } from "react-icons/io5";
import { LuBuilding2, LuPlus } from "react-icons/lu";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import AddModal from "../../components/common/AddModal";
import ComponentContainer from "../../components/common/ComponentContainer";
import FilterPanel from "../../components/common/FilterPanel";
import ReferralManagementConfig from "../../components/formConfigs/ReferralManagementConfig";
import { useCreatePatient, usefetchReferralQuery, usefetchReferrerQuery, usePatientsQuery, useUpdatePatient } from "../../hooks/usePatients";
import { urgencyLabels } from "../../utils/consts";
import RefererCard from "./RefererCard";
import ReferralCard from "./ReferralCard";
import RoleToggleTabs from "./RoleToggleTabs";
import Button from "../../components/ui/Button";

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

const ReferralManagement = () => {
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
  } = usefetchReferralQuery({
    // role: "",
    search: filters.search,
    // status: filters.status,
    // urgency: filters.urgency,
    // locations: [filters.location],
    page: 1,
    limit: 5,
  });

  const {
    data: referrerData,
  } = usefetchReferrerQuery({
    // role: "",
    filter: '',
    // filter: 'doctor',
    // status: filters.status,
    // urgency: filters.urgency,
    // locations: [filters.location],
    page: 1,
    limit: 5,
  });

  console.log("referral  Data : ", referralData);
  console.log("referrer Data: ", referrerData);

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
      const Allvalues = formRef.current.values;
      console.log('all val : ', Allvalues)
      const role = formRef.current.values.role;
      let patientData
      if (role === 'doctor') {
        patientData = {
          email: Allvalues.email,
          name: Allvalues.fullName,
          number: Allvalues.patientPhone,
          notes: Allvalues.notes,
          practiceName: Allvalues.referringPracticeName,
          practiceType: Allvalues.referringSpecialty,
          practiceAddress: Allvalues.practiceAddress,
        }
      } else {
        patientData = {
          email: Allvalues.email,
          name: Allvalues.fullName,
          number: Allvalues.patientPhone,
          notes: Allvalues.notes
        }
      }
      console.log('patientData: ', patientData)

      createPatient(
        { patientData, type: Allvalues.role },
        {
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
          onError: (error) => {
            const errorMessage =
              (error.response?.data as { error?: string })?.error ||
              error.message ||
              "Failed to Add Patient";

            addToast({
              title: "Error",
              description: errorMessage,
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
      buttonType: 'secondary'

    },
    {
      label: "Add Referrer",
      onClick: handleOpen,
      icon: <LuPlus />,
      buttonType: 'primary'
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

  const editReferral = (id: string, updatedData: string) => {
    console.log(`Editing referral with ID: ${id}`, updatedData);
  };

  const callReferral = (id: string) => {
    console.log(`Deleting referral with ID: ${id}`);
  };

  const viewReferral = (id: string, updatedStatus: string) => {
    console.log(`Updating referral with ID: ${id} to status: ${updatedStatus}`);
  };

  const referralActions = [
    {
      label: 'editReferral',
      function: editReferral,
      icon: <FiEdit className='w-4 h-4' />
    },
    {
      label: 'callReferral',
      function: callReferral,
      icon: <IoCallOutline className='w-4 h-4' />
    },
    {
      label: 'viewReferral',
      function: viewReferral,
      icon: <FiEye className='w-4 h-4' />
    }
  ]

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
                      {(referralData?.docs && referralData?.docs.length > 0) ?
                        referralData?.docs?.map((referral: any) => (
                          <ReferralCard
                            key={referral.id}
                            referral={referral}
                            urgencyLabels={urgencyLabels}
                            actions={referralActions}
                          />
                        ))
                        : (
                          <p className="bg-background text-sm text-center text-foreground/50">
                            No data to display
                          </p>
                        )
                      }
                    </div>
                  </div>
                ) : selectedReferralType === "Referrers" ? (
                  <div className="flex flex-col gap-4 border border-primary/10  rounded-xl p-4  bg-background /70 w-full">
                    <div className="font-medium text-sm mb-3">
                      Referrer Management
                    </div>
                    {(referrerData?.data && referrerData?.data.length > 0) ?
                      referrerData?.data.map((referrer) => (
                        <RefererCard
                          key={referrer.id}
                          referrer={referrer}
                          buttons={refererButtonList}
                        />
                      ))
                      : (
                        <p className="bg-background text-sm text-center text-foreground/50">
                          No data to display
                        </p>
                      )
                    }
                  </div>
                ) : selectedReferralType === "NFC & QR Tracking" ? (
                  <div className="w-full min-h-80 h-full flex gap-2">
                    <div className="border w-full border-primary/20 p-4 rounded-xl bg-background flex flex-col justify-between">
                      <div>
                        <h6 className="text-sm flex  items-center gap-2"><FaQrcode className="text-primary" /> QR & NFC Code Generato</h6>
                        <p className="text-xs mt-1 font-light">Generate personalized QR codes and NFC tags for General Practice</p>
                      </div>

                      <div className="flex flex-col gap-3 items-center justify-center text-sm">
                        <p>Generate a personalized QR code for this referrer</p>
                        <Button buttonType="primary" className={'w-1/2'}>
                          Generate QR Code
                        </Button>
                      </div>
                    </div>
                    <div className="border w-full border-primary/20 p-4 rounded-xl bg-background">
                      <h6 className="text-sm">Tracking Analytics</h6>
                      <div className="flex flex-col gap-3 mt-4  rounded-md ">
                        <div className="flex justify-between text-xs p-4 rounded-lg bg-blue-50">
                          <div>Total Scans Today</div>
                          <div><span className="px-1.5 py-0.5 bg-green-200 rounded-sm">23</span></div>
                        </div>
                        <div className="flex justify-between text-xs p-4 rounded-lg bg-blue-50">
                          <div>Active QR Codes</div>
                          <div><span className="px-1.5 py-0.5 bg-pink-200 rounded-sm">67</span></div>
                        </div>
                        <div className="flex justify-between text-xs p-4 rounded-lg bg-blue-50">
                          <div>NFC Taps</div>
                          <div><span className="px-1.5 py-0.5 bg-blue-200 rounded-sm">18 </span></div>
                        </div>
                        <div className="flex justify-between text-xs p-4 rounded-lg bg-blue-50">
                          <div>Conversion Rate</div>
                          <div><span className="px-1.5 py-0.5 bg-indigo-200 rounded-sm">78%</span></div>
                        </div>
                      </div>
                    </div>
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
