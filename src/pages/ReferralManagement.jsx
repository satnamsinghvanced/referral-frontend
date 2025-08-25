import { CiCalendar, CiHospital1, CiStethoscope, CiUser } from "react-icons/ci";
import { PiDownloadSimpleLight } from "react-icons/pi";
import { FaStethoscope } from "react-icons/fa6";
import { LuPlus } from "react-icons/lu";
import RoleToggleTabs from "../components/common/RoleToggleTabs"; // Changed from ToggleButton to RoleToggleTabs
import FilterPanel from "../components/common/FilterPanel";
import ReferralCard from "../components/cards/ReferralCard";
import { useState } from "react";
import ComponentHeader from "../components/common/ComponentHeader";
import AddModal from "../components/common/AddModal";
import ReferralManagementConfig from "../components/formConfigs/ReferralManagementConfig";
import { usePatientsQuery } from "../queries/patient/useUsersQuery";
import { useCreatePatient } from "../queries/patient/useCreateUser";
import ComponentContainer from "../components/common/ComponentContainer";
import { useRef } from "react";
import { useUpdatePatient } from "../queries/patient/userUpdateUser";
import MediumStatsCard from "../components/cards/MediumStatsCard";
import { addToast, Button, Card } from "@heroui/react";
const ReferralManagement = () => {
  const formRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedReferralType, setSelectedReferralType] =
    useState("Doctor Referrals");

  const handleCardClick = (heading) => {
    console.log(`${heading} clicked`);
  };

  const handleReferralTypeChange = (type) => {
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
    role: selectedReferralType === "Doctor Referrals" ? "doctor" : "patient",
    search: filters.search,
    status: filters.status,
    urgency: filters.urgency,
    location: filters.location,
    page: 1,
    limit: 5,
  });
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
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
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
    alert("Export item");
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
      label: "VCF Contacts",
      onClick: handleExport,
      icon: <PiDownloadSimpleLight />,
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
        <>
          {/* <Button onPress={testClick} className="z-50 p-2 border">Test Toast</Button> */}
          <div className="bg-background border-text/10 dark:border-text/30 border rounded-md">
            <div className="ml-2 p-4 ">
              <h3 className="flex gap-2 ">
                {" "}
                <FaStethoscope className="text-[17px] mt-1 text-blue-500" />{" "}
                Doctor Referrers (3)
              </h3>
              <p className="text-xs mt-4">
                Doctor referrers are automatically added to referrer management
                when you create doctor referrals.
              </p>
              <div className="grid grid-cols md:grid-cols-3 xl:grid-cols-3 gap-4 mt-2">
                {statCardData.map((card, index) => (
                  <MediumStatsCard
                    key={index}
                    cardHeading={card.heading}
                    cardStat={card.stat}
                    // cardNewData={card.newData}
                    // cardIcon={card.icon}
                    bgColor={card.bgColor}
                    textColor={card.textColor}
                    onCardPress={() => handleCardClick(card.heading)}
                  />
                ))}
              </div>
            </div>
          </div>

          <FilterPanel onFilterChange={setFilters} />
          <RoleToggleTabs
            selected={selectedReferralType}
            onSelectionChange={handleReferralTypeChange}
          />
          <div className="flex flex-col gap-4 mt-1">

            {
              referralData?.data?.length > 0
                ?

                selectedReferralType === "Doctor Referrals"
                  ? referralData?.data?.map((referral) => (
                    <ReferralCard
                      key={referral._id}
                      {...referral}
                      onUpdateStatus={(newStatus) =>
                        handleStatusUpdate(referral._id, { status: newStatus })
                      }
                    />
                  ))

                  :

                  referralData?.data?.map((referral) => (
                    <ReferralCard
                      key={referral._id}
                      {...referral}
                      onUpdateStatus={(newStatus) =>
                        handleStatusUpdate(referral._id, { status: newStatus })
                      }
                    />
                  ))

                :
                <Card className="w-full flex items-center justify-center p-10 border border-text/10 dark:border-text/30" shadow="none">
                  <p className="text-sm text-text/80">No referrals found</p>
                </Card>
            }

          </div>
        </>
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
