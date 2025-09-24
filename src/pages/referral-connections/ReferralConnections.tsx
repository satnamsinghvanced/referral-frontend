import { useState } from "react";
import { FaStethoscope } from "react-icons/fa6";
import { FiStar, FiTarget, FiUsers } from "react-icons/fi";
import { LuBuilding2, LuPlus } from "react-icons/lu";
import MediumStatsCard from "../../components/cards/MediumStatsCard";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import AddModal from "../../components/common/AddModal";
import ComponentContainer from "../../components/common/ComponentContainer";
import ReferralConnectionsConfig from "../../components/formConfigs/ReferralConnectionsConfig";
import ReferralConnectionCard from "./ConnectionCard";
import ReferralConnectionsVisitScheduling from "./VisitScheduling";
// import { categoryOptions, practiceOptions, short } from "../../Utils/filters";


const ReferralConnections = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleCardClick = (heading: string) => {
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
      classNames: 'bg-text text-background dark:bg-background dark:text-text',
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
      icon: <LuBuilding2 className="text-[17px] mt-1 text-text/60" />,
      heading: 'Total Practices',
      value: '12',              // updated from 3 to 12
      subheading: '+2 from last month'
    },
    {
      icon: <FiUsers className="text-[17px] mt-1 text-text/60" />,
      heading: 'Total Referrals',
      value: '247',
      subheading: '+12% from last month'
    },
    {
      icon: <FiStar className="text-[17px] mt-1 text-text/60" />,
      heading: 'A-Level Practices',
      value: '8',
      subheading: '67% of total'
    },
    {
      icon: <FiTarget className="text-[17px] mt-1 text-text/60" />,
      heading: 'Avg. Score',
      value: '78.5',
      subheading: '+5.2 improvement'
    },
  ];

  // const filters = [
  //   { categoryOptions },
  //   { practiceOptions },
  //   { short }
  // ]


  // dummyClinicsData.ts
  const dummyReferralData = [
    {
      id: '1',
      name: 'Downtown Dental',
      address: '123 Main St',
      phone: '(555) 123-4567',
      referrals: 24,
      level: 'a-level', // lowercase to match LevelChip expectations
      levelColor: 'green', // optional
      score: 85
    },
    {
      id: '2',
      name: 'Family Dentistry Plus',
      address: '456 Oak Ave',
      phone: '(555) 234-5678',
      referrals: 18,
      level: 'b-level',
      levelColor: 'yellow',
      score: 72
    }
  ];


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
          {/* <div className="bg-background border-text/10 dark:border-text/30 border rounded-md">
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
          </div> */}
          {/* <ReferralConnectionsVisitScheduling /> */}

          {/* <FilterPanel  filters={filters} isFilterable={true} filterFor={'static filter'} /> */}
          <div className="flex flex-col gap-4 border border-primary/10 dark:border-primary/20 rounded-xl p-4  bg-background dark:bg-text/80">
            <div className="font-medium text-sm mb-2">
              Recent Referrals
            </div>
            {dummyReferralData.map((referral) => (
              <ReferralConnectionCard key={referral.id} referral={referral} />
            ))}

          </div>
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
