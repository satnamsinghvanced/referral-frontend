import { CiCalendar, CiHospital1, CiStethoscope, CiUser } from "react-icons/ci";
import StatCard from "../components/common/StatCard";
import RoleToggleTabs from "../components/common/RoleToggleTabs"; // Changed from ToggleButton to RoleToggleTabs
import FilterPanel from "../components/common/FilterPanel";
import ReferralCard from "../components/common/ReferralCard";
import { useState } from "react";
import ComponentHeader from "../components/common/ComponentHeader";

const ReferralConnections = () => {
  const [selectedReferralType, setSelectedReferralType] = useState("Doctor Referrals");

  const handleCardClick = (heading) => {
    console.log(`${heading} clicked`);
  };

  const handleReferralTypeChange = (type) => {
    console.log('type : ', type)
    setSelectedReferralType(type);
  };

  const statCardData = [
    {
      heading: 'Doctor Referrals',
      stat: 3,
      newData: 1,
      icon: <CiStethoscope className="text-4xl font-black text-blue-400" />,
    },
    {
      heading: 'Patient Referrals',
      stat: 5,
      newData: 2,
      icon: <CiUser className="text-4xl font-black text-green-400" />,
    },
    {
      heading: 'Total Scheduled',
      stat: 8,
      newData: 3,
      icon: <CiCalendar className="text-4xl font-black text-purple-400" />,
    },
    {
      heading: 'Location Active',
      stat: 6,
      newData: 1,
      icon: <CiHospital1 className="text-4xl font-black text-orange-400" />,
    },
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
    console.log(`Updating status for referral ${referralIndex} to ${newStatus}`);
  };
  const handleAdd = () => {
    alert("Add new item")
  }

  const handleExport = () => {
    alert("Export item")
  }
  const buttonList = [
    {
      label: "Add New Item",
      onClick: handleAdd,
      props: {
        variant: "primary"
      }
    },
    {
      label: "Export Item",
      onClick: handleExport,
      props: {
        variant: "secondary"
      }
    }
  ]
  return (
    <>
      <ComponentHeader
        heading="Item Manager"
        subHeading="Manage your items easily"
        buttons={buttonList}
      />
      <div className="flex flex-col gap-2 md:px-7 px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCardData.map((card, index) => (
            <StatCard
              key={index}
              cardHeading={card.heading}
              cardStat={card.stat}
              cardNewData={card.newData}
              cardIcon={card.icon}
              onCardPress={() => handleCardClick(card.heading)}
            />
          ))}
        </div>

        <RoleToggleTabs
          selected={selectedReferralType}
          onSelectionChange={handleReferralTypeChange}
        />

        <FilterPanel />

        {selectedReferralType === "Doctor Referrals" ? (
          doctorReferrals.map((referral, index) => (
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
              onUpdateStatus={(newStatus) => handleStatusUpdate(newStatus, index)}
              {...referral}
            />
          ))
        ) : (
          patientReferrals.map((referral, index) => (
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
              onUpdateStatus={() => alert(`Status Update Clicked for ${referral.name}`)}
              {...referral}
            />
          ))
        )}
      </div>
    </>
  );
};

export default ReferralConnections;