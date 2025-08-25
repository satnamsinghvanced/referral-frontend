import { CiCalendar, CiHospital1, CiLocationOn, CiStethoscope, CiUser } from "react-icons/ci";
import { PiBaby, PiDownloadSimpleLight } from "react-icons/pi";
import { FaStethoscope } from "react-icons/fa6";
import { LuBuilding2, LuPlus } from "react-icons/lu";
import MediumStatsCard from "../components/cards/MediumStatsCard";
import RoleToggleTabs from "../components/common/RoleToggleTabs"; // Changed from ToggleButton to RoleToggleTabs
import FilterPanel from "../components/common/FilterPanel";
import ReferralCard from "../components/cards/ReferralCard";
import { useState } from "react";
import ComponentHeader from "../components/common/ComponentHeader";
import AddModal from "../components/common/AddModal";
import ReferralManagementConfig from "../components/formConfigs/ReferralManagementConfig";
import { usePatientsQuery } from "../queries/patient/useUsersQuery";
import ComponentContainer from "../components/common/ComponentContainer";
import { LuTelescope } from "react-icons/lu";
import StatsCard from "../components/cards/MiniStatsCard";
import { FiStar, FiTarget, FiUsers } from "react-icons/fi";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { IoMdCheckboxOutline } from "react-icons/io";
import MiniStatsCard from "../components/cards/MiniStatsCard";
import { categoryOptions, locationOptions, practiceOptions, short, statusOptions, urgencyOptions } from "../Utils/filters";
import ReferralConnectionCard from "../components/cards/ReferralConnectionCard";
import ReferralConnectionsConfig from "../components/formConfigs/ReferralConnectionsConfig";


const ReferralConnections = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleCardClick = (heading) => {
    console.log(`${heading} clicked`);
  };

  const statCardData = [
    {
      heading: "Total Doctors",
      stat: 3,
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
    },
    {
      heading: "A-Level",
      stat: 1,
      bgColor: "bg-green-50",
      textColor: "text-green-800",
    },
    {
      heading: "Active Referrers",
      stat: 8,
      bgColor: "bg-purple-50",
      textColor: "text-purple-800",
    },
    {
      heading: "Total Referrals",
      stat: 85,
      bgColor: "bg-gray-50",
      textColor: "text-gray-800",
    },
  ];

  const handleExport = () => {
    alert("Export item");
  };

  const handleOpen = () => {
    console.log('handleOpen')
    setIsModalOpen(true)
  };
  const handleSwitchClick = () => {
    alert('handleSwitchClick')
  };
  const handleDiscoverClick = () => {
    alert('handleDiscoverClick')
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
    console.log("handle Save Clicked ");
    handleClose()
  };

  const buttonList = [
    {
      label: "Switch",
      onClick: handleSwitchClick,
      icon: <CiLocationOn />,
      props: {
        variant: "primary",
      },
    },
    {
      label: "Discover Practice",
      onClick: handleDiscoverClick,
      icon: <LuTelescope />,
      props: {
        variant: "primary",
      },
    },
    {
      label: "Import Data",
      onClick: handleExport,
      icon: <PiDownloadSimpleLight />,
      props: {
        variant: "secondary",
      },
    },
    {
      label: "Add Office",
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

  const headingDate = {
    heading: 'Referral Connection',
    subHeading: 'Manage relationships with referring dental practices',
    buttons: buttonList
  }

  const StatCardData = [
    {
      icon: <LuBuilding2 className="text-[17px] mt-1 text-blue-500" />,
      heading: 'Total Offices',
      value: '3',
      subheading: 'Referring practices'
    },
    {
      icon: <FiUsers className="text-[17px] mt-1 text-green-500" />,
      heading: 'Total Referrals',
      value: '85',
      subheading: 'All time'
    },
    {
      icon: <HiMiniArrowTrendingUp className="text-[17px] mt-1 text-purple-500" />,
      heading: 'This Month',
      value: '12',
      subheading: 'Referrals'
    },
    {
      icon: <FiStar className="text-[17px] mt-1 text-yellow-500" />,
      heading: 'Avg Score',
      value: '76',
      subheading: 'Relationship'
    },
    {
      icon: <FiTarget className="text-[17px] mt-1 text-green-500" />,
      heading: 'A-Level',
      value: '1',
      subheading: 'Partners'
    },
    {
      icon: <IoMdCheckboxOutline className="text-[17px] mt-1 text-orange-500" />,
      heading: 'Active Tasks',
      value: '3',
      subheading: 'Pending'
    },
    {
      icon: <PiBaby className="text-[17px] mt-1 text-pink-500" />,
      heading: 'Family Leads',
      value: '0',
      subheading: 'Ortho candidates'
    }
  ];

  const filters = [
    { categoryOptions },
    { practiceOptions },
    { short }
  ]

  return (
    <>
      <ComponentContainer
        headingDate={headingDate}
      >
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-7 gap-4 justify-between">
            {StatCardData.map((data, index) => (
              <MiniStatsCard key={index} cardData={data} />
            ))}
          </div>
          <div className="bg-background border-text/10 dark:border-text/30 border rounded-md">
            <div className="ml-2 p-3">
              <h3 className="flex gap-2 "> <FaStethoscope className="text-[17px] mt-1 text-blue-500" /> Doctor Referrers Integration (3)</h3>
              <p className="text-xs mt-4">
                Offices with doctor staff are automatically synced with doctor referrer management. New practices added here will create corresponding doctor referrer entries.
              </p>
              <div className="grid grid-cols md:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
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

          <FilterPanel filters={filters} isFilterable={true} filterFor={'static filter'} />

          <ReferralConnectionCard />

        </div>
      </ComponentContainer>


      <AddModal
        isOpen={isModalOpen}
        heading={
          <div className=" flex gap-2 items-center">
            <LuBuilding2 className="text-blue-600" />
            <span>Add New Dental Practice</span>
          </div>
        }
        description="Add a new referring dental practice to your network. Fill in the practice details and contact information."
        cancelBtnData={cancelBtnData}
        addBtnData={addBtnData}
        config={<ReferralConnectionsConfig />}
      />
    </>
  );
};

export default ReferralConnections;
