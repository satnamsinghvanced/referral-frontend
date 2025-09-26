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

interface Referral {
  id: string;
  name: string;
  address: string;
  phone: string;
  referrals: number;
  level: string;
  levelColor?: string;
  score: number;
}

interface StatCard {
  icon: React.ReactNode;
  heading: string;
  value: string;
  subheading: string;
}

const ReferralConnections: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const onCancelClick = () => {
    console.log("onCancelClick");
    handleClose();
  };

  const onSaveClick = () => {
    console.log("handle Save Clicked");
    handleClose();
  };

  const buttonList = [
    {
      label: "Add Practice",
      onClick: handleOpen,
      classNames: "bg-foreground text-background",
      icon: <LuPlus />,
      props: {
        variant: "solid",
      },
    },
  ];

  const cancelBtnData = {
    function: onCancelClick,
    style: "border-foreground/10 border text-foreground hover:bg-background",
    text: "cancel",
  };

  const addBtnData = {
    function: onSaveClick,
    style: "bg-foreground text-background",
    text: "add",
  };

  const headingData = {
    heading: "Referral Connection",
    subHeading: "Manage relationships with referring dental practices",
    buttons: buttonList,
  };

  const StatCardData: StatCard[] = [
    {
      icon: <LuBuilding2 className="text-[17px] mt-1 text-foreground/60" />,
      heading: "Total Practices",
      value: "12",
      subheading: "+2 from last month",
    },
    {
      icon: <FiUsers className="text-[17px] mt-1 text-foreground/60" />,
      heading: "Total Referrals",
      value: "247",
      subheading: "+12% from last month",
    },
    {
      icon: <FiStar className="text-[17px] mt-1 text-foreground/60" />,
      heading: "A-Level Practices",
      value: "8",
      subheading: "67% of total",
    },
    {
      icon: <FiTarget className="text-[17px] mt-1 text-foreground/60" />,
      heading: "Avg. Score",
      value: "78.5",
      subheading: "+5.2 improvement",
    },
  ];

  const dummyReferralData: Referral[] = [
    {
      id: "1",
      name: "Downtown Dental",
      address: "123 Main St",
      phone: "(555) 123-4567",
      referrals: 24,
      level: "a-level",
      levelColor: "green",
      score: 85,
    },
    {
      id: "2",
      name: "Family Dentistry Plus",
      address: "456 Oak Ave",
      phone: "(555) 234-5678",
      referrals: 18,
      level: "b-level",
      levelColor: "yellow",
      score: 72,
    },
  ];

  return (
    <>
      <ComponentContainer headingData={headingData}>
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 justify-between">
            {StatCardData.map((data) => (
              <MiniStatsCard key={data.heading} cardData={data} />
            ))}
          </div>

          <div className="flex flex-col gap-4 border border-primary/10 rounded-xl p-4 bg-background/80">
            <div className="font-medium text-sm mb-2">Recent Referrals</div>
            {dummyReferralData.map((referral) => (
              <ReferralConnectionCard key={referral.id} referral={referral} />
            ))}
          </div>
        </div>
      </ComponentContainer>

      <AddModal
        isOpen={isModalOpen}
        heading={
          <div className="flex gap-2 items-center">
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
