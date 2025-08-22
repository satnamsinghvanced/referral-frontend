import { CiCalendar, CiHospital1, CiStethoscope, CiUser } from "react-icons/ci";
import { PiDownloadSimpleLight } from "react-icons/pi";
import { FaStethoscope } from "react-icons/fa6";
import { LuPlus } from "react-icons/lu";
import StatCard from "../components/common/StatCard";
import RoleToggleTabs from "../components/common/RoleToggleTabs"; // Changed from ToggleButton to RoleToggleTabs
import FilterPanel from "../components/common/FilterPanel";
import ReferralCard from "../components/cards/ReferralCard";
import { useState } from "react";
import ComponentHeader from "../components/common/ComponentHeader";
import AddModal from "../components/common/AddModal";
import ReferralManagementConfig from "../components/formConfigs/ReferralManagementConfig";
import { usePatientsQuery } from "../queries/patient/useUsersQuery";
const ReferralConnections = () => {
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
const { data, isLoading, isError } = usePatientsQuery({
    role: "patient",
    search: "",
    status: "",
    urgency: "",
    page: 1,
    limit: 5,
  });
console.log("data : ", data);
  const statCardData = [
    {
      heading: "A-Level Partners",
      stat: 3,
      // newData: 1,
      // icon: <CiStethoscope className="text-4xl font-black text-blue-400" />,
      bgColor: "bg-green-50",
      textColor: "text-green-800",
    },
    {
      heading: "Active Referrers",
      stat: 5,
      // newData: 2,
      // icon: <CiUser className="text-4xl font-black text-green-400" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
    },
    {
      heading: "Total Referrals",
      stat: 8,
      // newData: 3,
      // icon: <CiCalendar className="text-4xl font-black text-purple-400" />,
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
    },
  ];

  const doctorReferrals = [
    {
      uniqueId: "REF-D001",
      fullName: "John Anderson",
      status: "new",
      urgency: "high",
      email: "john.anderson@email.com",
      age: 35,
      phoneNumber: "+1 (555) 123-4567",
      referringByName: "Dr. Sarah Wilson, DDS",
      referringPracticeName: "Family Dental Center",
      referringSpecialty: "General Dentistry",
      referringPhoneNumber: "+1 (555) 987-6543",
      referringEmail: "sarah.wilson@familydental.com",
      referringFax: "+1 (555) 987-6544",
      referringWebsite: "www.familydentalcenter.com",
      practiceAddress: "123 Main Street",
      practiceAddressCity: "New York",
      practiceAddressState: "New York",
      practiceAddressZip: "10001",
      treatmentType: "Invisalign Consultation",
      insuranceProvider: "Blue Cross Blue Shield",
      preferredTime: "afternoon",
      reasonForReferral: "Complex malocclusion requiring specialist evaluation",
      notes: "Patient has severe crowding and needs comprehensive evaluation",
      dateReceived: "2024-01-15",
      role: "doctor"
    },
    {
      uniqueId: "REF-D002",
      fullName: "Emily Nguyen",
      status: "scheduled",
      urgency: "medium",
      email: "emily.nguyen@email.com",
      age: 28,
      phoneNumber: "+1 (555) 222-3333",
      referringByName: "Dr. Andrew Chen",
      referringPracticeName: "Smile Studio",
      referringSpecialty: "Cosmetic Dentistry",
      referringPhoneNumber: "+1 (555) 444-5555",
      referringEmail: "andrew.chen@smilestudio.com",
      referringFax: "+1 (555) 444-5556",
      referringWebsite: "www.smilestudio.com",
      practiceAddress: "456 Oak Avenue",
      practiceAddressCity: "Los Angeles",
      practiceAddressState: "California",
      practiceAddressZip: "90001",
      treatmentType: "Braces Follow-up",
      insuranceProvider: "Aetna",
      preferredTime: "morning",
      reasonForReferral: "Continuing treatment from previous orthodontist",
      notes: "Patient recently moved to the area, needs continuation of care",
      dateReceived: "2024-02-20",
      role: "doctor"
    }
  ];

  const patientReferrals = [
    {
      uniqueId: "REF-P001",
      fullName: "Lisa Thompson",
      status: "new",
      urgency: "low",
      email: "lisa.thompson@email.com",
      age: 42,
      phoneNumber: "+1 (555) 456-7890",
      referringByName: "Jennifer Walsh",
      relationshipName: "Friend",
      referringPhoneNumber: "+1 (555) 111-2222",
      referringEmail: "jennifer.walsh@email.com",
      treatmentType: "Invisalign",
      insuranceProvider: "Cigna",
      preferredTime: "weekend",
      reasonForReferral: "Interested in Invisalign treatment after seeing results",
      notes: "Very motivated patient, excellent oral hygiene",
      dateReceived: "2024-01-16",
      role: "patient"
    },
    {
      uniqueId: "REF-P002",
      fullName: "Michael Green",
      status: "scheduled",
      urgency: "medium",
      email: "michael.green@email.com",
      age: 19,
      phoneNumber: "+1 (555) 123-4567",
      referringByName: "Andrew Green",
      relationshipName: "Brother",
      referringPhoneNumber: "+1 (555) 333-4444",
      referringEmail: "andrew.green@email.com",
      treatmentType: "Braces",
      insuranceProvider: "UnitedHealthcare",
      preferredTime: "afterSchool",
      reasonForReferral: "Needs orthodontic evaluation for misaligned teeth",
      notes: "College student, prefers after-school appointments",
      dateReceived: "2024-02-10",
      role: "patient"
    },
    {
      uniqueId: "REF-P003",
      fullName: "Thomas Gray",
      status: "scheduled",
      urgency: "high",
      email: "thomas.gray@email.com",
      age: 38,
      phoneNumber: "+1 (555) 888-9999",
      referringByName: "Grace Gray",
      relationshipName: "Cousin",
      referringPhoneNumber: "+1 (555) 777-8888",
      referringEmail: "grace.gray@email.com",
      treatmentType: "Veneers",
      insuranceProvider: "Blue Cross",
      preferredTime: "lunchBreak",
      reasonForReferral: "Cosmetic smile enhancement for upcoming wedding",
      notes: "Urgent - wedding in 3 months, needs quick turnaround",
      dateReceived: "2024-06-15",
      role: "patient"
    }
  ];

  const handleStatusUpdate = (newStatus, referralIndex) => {
    console.log(
      `Updating status for referral ${referralIndex} to ${newStatus}`
    );
  };

  const handleExport = () => {
    alert("Export item");
  };

  const handleOpen = () => {
    console.log('handleOpen')
    setIsModalOpen(true)
  };
  const handleClose = () => {
    console.log('handleClose')
    setIsModalOpen(false)
  };

  const onCancelClick = () => {
    console.log('onCancelClick')
    handleClose()
  };

  const onSaveClick = () => {
    console.log("handleSaveClick ");
    handleClose()
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
      classNames: 'bg-text text-background',
      icon: <LuPlus />,
      props: {
        variant: "primary",
      },
    },
  ];

  const cancelBtnData = {
    function: onCancelClick,
    style: 'border-text/10 dark:border-text/30 border text-text hover:bg-background',
    text: 'cancel'
  }
  const addBtnData = {
    function: onSaveClick,
    style: 'bg-text text-background',
    text: 'add'
  }
  return (
    <>
      <div className="flex flex-col h-full ">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-background">
          <ComponentHeader
            heading="Referral Management"
            subHeading="Track doctor and patient referrals for your orthodontic practice"
            buttons={buttonList}
          />
        </div>
        <div className="flex flex-col gap-2 md:px-7 px-4 py-4 md:py-8 overflow-y-scroll" >
          <div className="bg-background border-text/10 dark:border-text/30 border rounded-md">
            <div className="ml-2 p-4 ">
              <h3 className="flex gap-2 "> <FaStethoscope className="text-[17px] mt-1 text-blue-500" /> Doctor Referrers (3)</h3>
              <p className="text-xs mt-4">
                Doctor referrers are automatically added to referrer management
                when you create doctor referrals.
              </p>
              <div className="grid grid-cols md:grid-cols-3 xl:grid-cols-3 gap-4 mt-2">
                {statCardData.map((card, index) => (
                  <StatCard
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

          <FilterPanel />
          <RoleToggleTabs
            selected={selectedReferralType}
            onSelectionChange={handleReferralTypeChange}
          />
          <div className="flex flex-col gap-4 mt-1">
            {selectedReferralType === "Doctor Referrals"
              ? doctorReferrals.map((referral) => (
                <ReferralCard
                  key={referral.uniqueId}
                  {...referral}
                  onUpdateStatus={(newStatus) => handleStatusUpdate(newStatus, referral.uniqueId)}
                />
              ))
              : patientReferrals.map((referral) => (
                <ReferralCard
                  key={referral.uniqueId}
                  {...referral}
                  onUpdateStatus={(newStatus) => handleStatusUpdate(newStatus, referral.uniqueId)}
                />
              ))}
          </div>
        </div>
      </div>

      <AddModal
        isOpen={isModalOpen}
        heading="Add New Referrer"
        description="Add a new doctor or patient referrer to your system. Complete all required fields to ensure proper referral tracking."
        cancelBtnData={cancelBtnData}
        addBtnData={addBtnData}
        config={<ReferralManagementConfig />}
      />
    </>
  );
};

export default ReferralConnections;
