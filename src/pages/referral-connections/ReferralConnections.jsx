import { useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { FaStethoscope } from "react-icons/fa6";
import { FiStar, FiTarget, FiUsers } from "react-icons/fi";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { IoMdCheckboxOutline } from "react-icons/io";
import { LuBuilding2, LuPlus, LuTelescope } from "react-icons/lu";
import { PiBaby, PiDownloadSimpleLight } from "react-icons/pi";
import MediumStatsCard from "../../components/cards/MediumStatsCard";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import AddModal from "../../components/common/AddModal";
import ComponentContainer from "../../components/common/ComponentContainer";
import FilterPanel from "../../components/common/FilterPanel";
import ReferralConnectionsConfig from "../../components/formConfigs/ReferralConnectionsConfig";
import { categoryOptions, practiceOptions, short } from "../../Utils/filters";
import ReferralConnectionCard from "./ConnectionCard";
import ReferralConnectionsVisitScheduling from "./VisitScheduling";


const ReferralConnections = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleCardClick = (heading) => {
    console.log(`${heading} clicked`);
  };

  const statCardData = [
    {
      heading: "Total Doctors",
      stat: 3,
      bgColor: "bg-sky-50",
      textColor: "text-sky-800",
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
    // {
    //   label: "Switch",
    //   onClick: handleSwitchClick,
    //   icon: <CiLocationOn />,
    //   props: {
    //     variant: "primary",
    //   },
    // },
    // {
    //   label: "Discover Practice",
    //   onClick: handleDiscoverClick,
    //   icon: <LuTelescope />,
    //   props: {
    //     variant: "primary",
    //   },
    // },
    // {
    //   label: "Import Data",
    //   onClick: handleExport,
    //   icon: <PiDownloadSimpleLight />,
    //   props: {
    //     variant: "secondary",
    //   },
    // },
    {
      label: "Add Practice",
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
    // {
    //   icon: <HiMiniArrowTrendingUp className="text-[17px] mt-1 text-purple-500" />,
    //   heading: 'This Month',
    //   value: '12',
    //   subheading: 'Referrals'
    // },
    // {
    //   icon: <FiStar className="text-[17px] mt-1 text-yellow-500" />,
    //   heading: 'Avg Score',
    //   value: '76',
    //   subheading: 'Relationship'
    // },
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 justify-between">
            {StatCardData.map((data, index) => (
              <MiniStatsCard key={index} cardData={data} />
            ))}
          </div>
          <div className="bg-background border-text/10 dark:border-text/30 border rounded-md">
            <div className="ml-2 p-3">
              <h3 className="flex gap-2 text-sm"> <FaStethoscope className="text-[17px] mt-1 text-sky-500" /> Doctor Referrers Integration (3)</h3>
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
          <ReferralConnectionsVisitScheduling />

          <FilterPanel filters={filters} isFilterable={true} filterFor={'static filter'} />

          <ReferralConnectionCard />

        </div>
      </ComponentContainer>


      <AddModal
        isOpen={isModalOpen}
        heading={
          <div className=" flex gap-2 items-center">
            <LuBuilding2 className="text-sky-600" />
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
