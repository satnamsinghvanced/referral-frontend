import { addToast, Card } from "@heroui/react";
import { useRef, useState } from "react";
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
import { urgencyLabels } from "../../Utils/consts";
import RoleToggleTabs from "./RoleToggleTabs"; // Changed from ToggleButton to RoleToggleTabs



const STATCARDDATA = [
  {
    icon: <LuBuilding2 className="text-[17px] mt-1 text-sky-500" />,
    heading: 'Total Practices',
    value: '3',
    subheading: 'Referring practices'
  },
  {
    icon: <FiUsers className="text-[17px] mt-1 text-green-500" />,
    heading: 'Total Referrals',
    value: '247',
    subheading: '+12% from last month'
  },

  {
    icon: <FiStar className="text-[17px] mt-1 text-yellow-500" />,
    heading: 'A-Level Practices',
    value: '8',
    subheading: '67% of total'
  },
  {
    icon: <FiTarget className="text-[17px] mt-1 text-green-500" />,
    heading: 'Avg. Score',
    value: '78.5',
    subheading: '+5.2 improvement'
  },
  // {
  //   icon: <PiBaby className="text-[17px] mt-1 text-pink-500" />,
  //   heading: 'Family Leads',
  //   value: '0',
  //   subheading: 'Ortho candidates'
  // }
];



const ReferralManagement = () => {
  const formRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedReferralType, setSelectedReferralType] =
    useState("Referrals");

  const handleCardClick = (heading) => {
    console.log(`${heading} clicked`);
  };

  const handleReferralTypeChange = (type = 'Referrals') => {
    console.log("type : ", type);
    setSelectedReferralType(type);
  };

  const {
    mutate: createPatient,
    isLoading: loader,
    isError: createError,
    error,
  } = useCreatePatient();

  const [filters, setFilters] = useState({
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
    // role: selectedReferralType === "Doctor Referrals" ? "doctor" : "patient",
    role: '',
    search: filters.search,
    status: filters.status,
    urgency: filters.urgency,
    location: filters.location,
    page: 2,
    limit: 5,
  });

  console.log('referralData: ', referralData);
  // console.log("data : ", referralData);

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

  const handleStatusUpdate = (id, values) => {
    updatePatient(
      { id, patientData: values },
      {
        onSuccess: () => {
          console.log("🎉 Patient updated successfully!");
        },
        onError: (err) => {
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
            color: 'success',
          })
          formRef.current.resetForm();
          handleClose();
        },
        onError: (err) => {
          console.error("Failed to create patient:", err);
          addToast({
            title: "Error",
            description: "Failed to create patient",
            color: 'danger',
          })
        },
      });
    } else {
      console.log("⚠️ Form not valid yet");

      // Force validation + mark touched
      await formRef.current.validateForm();
      formRef.current.setTouched(
        Object.keys(formRef.current.values).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      );
    }
  };

  const buttonList = [
    {
      label: "Generate QR Code",
      onClick: handleExport,
      icon: <FaQrcode />,
      props: {
        variant: "secondary",
      },
    },
    {
      label: "Add Referrer",
      onClick: handleOpen,
      classNames: "bg-text text-background",
      icon: <LuPlus />,
      props: {
        variant: "primary",
      },
    },
  ];

  const cancelBtnData = {
    function: onCancelClick,
    style:
      "border-text/10 dark:border-text/30 border text-text hover:bg-background",
    text: "cancel",
  };

  const addBtnData = {
    function: onSaveClick,
    style: "bg-text text-background",
    text: "add",
  };

  const headingDate = {
    heading: "Referral Management",
    subHeading:
      "Track doctor and patient referrals for your orthodontic practice",
    buttons: buttonList,
  };

  // const testClick = () => {
  //   addToast({
  //     title: "Success",
  //     description: "Patient created successfully",
  //     color: 'danger',

  //   })
  // }
  return (
    <>
      <ComponentContainer headingDate={headingDate}>
        <div className="flex flex-col gap-5">
          {/* <Button onPress={testClick} className="z-50 p-2 border">Test Toast</Button> */}

          <RoleToggleTabs
            selected={selectedReferralType}
            onSelectionChange={handleReferralTypeChange}
          />

          <div className="">
            <div className="flex flex-col gap-4 mt-1">
              {
                referralData?.data?.length > 0
                  ? selectedReferralType === "Referrals"
                    ? (
                      <div className="flex flex-col gap-4">
                        <div className="grid grid-cols md:grid-cols-3 xl:grid-cols-4 gap-4">
                          {STATCARDDATA.map((data, index) => (
                            <MiniStatsCard key={index} cardData={data} />
                          ))}
                        </div>

                        <FilterPanel onFilterChange={setFilters} />

                        <div className="flex flex-col gap-4 border border-primary/10 dark:border-primary/30 rounded-xl p-4  bg-background">
                          <div className="font-medium text-sm mb-3">
                            Recent Referrals
                          </div>
                          {referralData?.data?.map((referral) => (
                            // this card works ok as per the old design  i am creating a new card as per the new design
                            // old design 


                            // new card design
                            <>
                              {/* <ReferralCard
                                key={referral._id}
                                {...referral}
                                onUpdateStatus={(newStatus) =>
                                  handleStatusUpdate(referral._id, { status: newStatus })
                                }
                              /> */}
                              <div className="flex justify-between border border-text/10 dark:border-text/30 rounded-lg p-4  bg-background">
                                <div className="font-medium text-sm w-full h-full">
                                  {referral.fullName}
                                  <div className="flex gap-2 items-center text-xs font-light">
                                    <div className="flex gap-1 items-center">

                                      {referral.referringByName}
                                    </div>
                                    <div className="p-0.5 bg-text/50 rounded-full aspect-square h-fit w-fit"></div>
                                    <div>{referral.fullName}</div>
                                  </div>
                                  <div className="flex gap-2 items-center text-xs font-light">
                                    <div className="flex gap-1 items-center">

                                      {referral.treatmentType}
                                    </div>
                                    <div className="p-0.5 bg-text/50 rounded-full aspect-square h-fit w-fit"></div>
                                    <div>{referral.createdAt.slice(0, 10)}</div>
                                    <div className="p-0.5 bg-text/50 rounded-full aspect-square h-fit w-fit"></div>
                                    <div>via NFC/QR</div>
                                  </div>
                                </div>
                                <div className="flex text-center justify-end h-full w-full gap-4 text-sm">
                                  <span className="">
                                    {referral.urgency && (
                                      <UrgencyChip urgency={urgencyLabels[referral.urgency] || referral.urgency} />
                                    )}
                                  </span>
                                  <span className="flex items-center"><IoCallOutline className=" " /></span>
                                  <span className="flex items-center"><FiEye /></span>
                                  <span className="flex items-center"><FiEdit /></span>
                                </div>

                              </div>
                            </>
                          ))}
                        </div>
                      </div>
                    )
                    : selectedReferralType === "Referrers"
                      ? (<div className="w-full h-80 flex items-center justify-center border border-text/10 dark:border-text/30">
                        <div>Referrers</div>
                      </div>)

                      : selectedReferralType === "NFC & QR Tracking"
                        ? (<div className="w-full h-80 flex items-center justify-center border border-text/10 dark:border-text/30">
                          <div>NFC & QR Tracking</div>
                        </div>)
                        : null
                  : (
                    <Card className="w-full flex items-center justify-center p-10 border border-text/10 dark:border-text/30" shadow="none">
                      <p className="text-sm text-text/80">No referrals found</p>
                    </Card>
                  )
              }
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
