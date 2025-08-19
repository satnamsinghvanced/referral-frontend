import { CiCalendar, CiHospital1, CiStethoscope, CiUser } from "react-icons/ci";
import { PiDownloadSimpleLight } from "react-icons/pi";
import { FaStethoscope } from "react-icons/fa6";
import { LuPlus } from "react-icons/lu";
import StatCard from "../components/common/StatCard";
import RoleToggleTabs from "../components/common/RoleToggleTabs"; // Changed from ToggleButton to RoleToggleTabs
import FilterPanel from "../components/common/FilterPanel";
import ReferralCard from "../components/common/ReferralCard";
import { useState } from "react";
import ComponentHeader from "../components/common/ComponentHeader";

const ReferralConnections = () => {
  const [selectedReferralType, setSelectedReferralType] =
    useState("Doctor Referrals");

  const handleCardClick = (heading) => {
    console.log(`${heading} clicked`);
  };

  const handleReferralTypeChange = (type) => {
    console.log("type : ", type);
    setSelectedReferralType(type);
  };

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
    // {
    //   heading: "Location Active",
    //   stat: 6,
    //   newData: 1,
    //   icon: <CiHospital1 className="text-4xl font-black text-orange-400" />,
    // },
  ];

  const doctorReferrals = [
    {
      name: "John Anderson",
      status: "New",
      urgency: "high",
      referringDoctor: "Dr. Sarah Wilson, DDS",
      practice: "Family Dental Center",
      treatment: "Invisalign Consultation",
      reason: "Complex malocclusion requiring specialist evaluation",
      phone: "+1 (555) 123-4567",
      dateReceived: "2024-01-15",
      insurance: "Blue Cross Blue Shield",
    },
    {
      name: "Emily Nguyen",
      status: "Scheduled",
      urgency: "medium",
      referringDoctor: "Dr. Andrew Chen",
      practice: "Smile Studio",
      treatment: "Braces Follow-up",
      reason: "Continuing treatment from previous orthodontist",
      phone: "+1 (555) 222-3333",
      dateReceived: "2024-02-20",
      insurance: "Aetna",
    },
  ];

  const patientReferrals = [
    {
      name: "Lisa Thompson",
      status: "New",
      urgency: "low",
      referringPatient: "Jennifer Walsh",
      relationship: "Friend",
      treatment: "Invisalign",
      reason: "Interested in Invisalign treatment",
      phone: "+1 (555) 456-7890",
      dateReceived: "2024-01-16",
      insurance: "Cigna",
    },
    {
      name: "Michael Green",
      status: "Scheduled",
      urgency: "medium",
      referringPatient: "Andrew Green",
      relationship: "Brother",
      treatment: "Braces",
      reason: "Needs orthodontic evaluation",
      phone: "+1 (555) 123-4567",
      dateReceived: "2024-02-10",
      insurance: "UnitedHealthcare",
    },
    {
      name: "Thomas Gray",
      status: "Scheduled",
      urgency: "high",
      referringPatient: "Grace Gray",
      relationship: "Cousin",
      treatment: "Veneers",
      reason: "Cosmetic smile enhancement",
      phone: "+1 (555) 888-9999",
      dateReceived: "2024-06-15",
      insurance: "Blue Cross",
    },
  ];

  const handleStatusUpdate = (newStatus, referralIndex) => {
    console.log(
      `Updating status for referral ${referralIndex} to ${newStatus}`
    );
  };
  const handleAdd = () => {
    alert("Add new item");
  };

  const handleExport = () => {
    alert("Export item");
  };
  const buttonList = [
    {
      label: "VCF Contacts",
      onClick: handleExport,
      bgColor: "bg-white",
      textColor: "text-black",
      icon: <PiDownloadSimpleLight />,
      props: {
        variant: "secondary",
      },
    },
    {
      label: "Add Referrer",
      onClick: handleAdd,
      bgColor: "bg-black",
      textColor: "text-white",
      icon: <LuPlus />,
      props: {
        variant: "primary",
      },
    },
  ];
  return (
    <>
   <div className="flex flex-col h-screen">
  {/* Sticky Header */}
  <div className="sticky top-0 z-50 bg-white shadow-sm ">
    <ComponentHeader
      heading="Referral Management"
      subHeading="Track doctor and patient referrals for your orthodontic practice"
      buttons={buttonList}
    />
  </div>
      <div className="flex flex-col gap-2 md:px-7 px-4 py-4 md:py-8 overflow-y-scroll" >
        <div className="bg-white h-[200px] border border-gray-200 rounded-xl">
          <div className="ml-2 p-4  " >
            <h3 className="flex gap-2 "> <FaStethoscope className="text-[17px] mt-1 text-blue-500"/> Doctor Referrers (3)</h3>
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
        {selectedReferralType === "Doctor Referrals"
          ? doctorReferrals.map((referral, index) => (
              <ReferralCard
                key={index}
                name={referral.name}
                status={referral.status}
                urgency={referral.urgency}
                referringDoctor={referral.referringDoctor}
                practice={referral.practice}
                treatment={referral.treatment}
                reason={referral.reason}
                phone={referral.phone}
                dateReceived={referral.dateReceived}
                insurance={referral.insurance}
                onUpdateStatus={(newStatus) =>
                  handleStatusUpdate(newStatus, index)
                }
                {...referral}
              />
            ))
          : patientReferrals.map((referral, index) => (
              <ReferralCard
                key={index}
                name={referral.name}
                status={referral.status}
                urgency={referral.urgency}
                referringPatient={referral.referringPatient}
                relationship={referral.relationship}
                treatment={referral.treatment}
                reason={referral.reason}
                phone={referral.phone}
                dateReceived={referral.dateReceived}
                insurance={referral.insurance}
                onUpdateStatus={() =>
                  alert(`Status Update Clicked for ${referral.name}`)
                }
                {...referral}
              />
            ))}
      </div>
      </div>
    </>
  );
};

export default ReferralConnections;
