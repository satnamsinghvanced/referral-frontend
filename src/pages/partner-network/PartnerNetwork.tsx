import { useState } from "react";
import { FiEdit, FiEye, FiStar, FiTarget, FiUsers } from "react-icons/fi";
import { LuBuilding2, LuPlus } from "react-icons/lu";
import { TbCheckbox } from "react-icons/tb";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import ActionModal from "../../components/common/ActionModal";
import ComponentContainer from "../../components/common/ComponentContainer";
import PartnerNetworkConfig from "../../components/formConfigs/PartnerNetworkConfig";
import { AiOutlinePlus } from "react-icons/ai";
import PartnerNetworkCard from "./PartnerNetworkCard";
import { IoDocumentOutline } from "react-icons/io5";
import { Button } from "@heroui/react";
import { MdOutlineCalendarToday } from "react-icons/md";

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

const PartnerNetwork = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const handleSave = () => {
    console.log("Save clicked");
    handleClose();
  };

  const buttonList = [
    {
      label: "Bulk Select",
      onClick: () => alert("Bulk Select Clicked"),
      icon: <TbCheckbox fontSize={16} />,
      variant: "bordered",
      color: "default",
      className: "border-small",
    },
    {
      label: "Add Practice",
      onClick: handleOpen,
      icon: <AiOutlinePlus fontSize={15} />,
      variant: "solid",
      color: "primary",
    },
  ];

  const headingData = {
    heading: "Partner Network",
    subHeading: "Manage relationships with referring practices",
    buttons: buttonList,
    filters: [
      {
        label: "Practice Type",
        options: [
          { label: "All Practices", value: "all" },
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
        ],
        selectedValue: "all",
        onChange: (v: any) => console.log("Filter changed:", v),
      },
    ],
    sortOptions: [
      { label: "Name", value: "name" },
      { label: "Date Added", value: "date" },
    ],
    selectedSortOption: "name",
    onSortChange: (v: any) => console.log("Sort changed:", v),
    sortOrder: "asc",
    onSortOrderChange: (order: any) => console.log("Order:", order),
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

  const partnerNetworkActions = [
    {
      label: "Document",
      function: (id: string, updatedData: Partial<Referral>) => {
        alert(`Working on it }`);
        // updateReferral({ id, payload: updatedData });
      },
      icon: <IoDocumentOutline className="size-3.5" />,
      variant: "light",
      color: "secondary",
    },
    {
      label: "View",
      function: (id: string) => {
        alert(`Viewing referral ${id}`);
        // You can replace alert with modal opening or navigation
      },
      icon: <FiEye className="size-3.5" />,
      variant: "light",
      color: "primary",
    },
    {
      label: "Edit",
      function: (id: string) => {
        alert(`Calling referral at ${id}`);
        // You can replace alert with actual call logic if needed
      },
      icon: <FiEdit className="size-3.5" />,
      variant: "light",
      color: "success",
    },
  ];

  return (
    <>
      <ComponentContainer headingData={headingData}>
        <div className="flex flex-col gap-5">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 justify-between">
            {StatCardData.map((data) => (
              <MiniStatsCard key={data.heading} cardData={data} />
            ))}
          </div>

          {/* Referral List */}
          <div className="flex flex-col gap-4 border border-primary/10 rounded-xl p-4 bg-background/80">
            <div className="font-medium text-sm">Partner Practices</div>
            {dummyReferralData.map((referral: any) => (
              <PartnerNetworkCard
                key={referral.id}
                referral={referral}
                actions={partnerNetworkActions}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base">Schedule Referrer Visits</h3>
              <p className="text-xs text-gray-600">
                Plan monthly visits to multiple referrers with route
                optimization
              </p>
            </div>
            <Button
              size="sm"
              variant="solid"
              color="primary"
              startContent={<MdOutlineCalendarToday />}
            >
              Create Monthly Plan
            </Button>
          </div>
        </div>
      </ComponentContainer>

      {/* Add / Bulk Modal */}
      <ActionModal
        isOpen={isModalOpen}
        onClose={handleClose}
        heading={
          <div className="flex gap-2 items-center">
            <LuBuilding2 className="text-sky-600" />
            <span>Add New Dental Practice</span>
          </div>
        }
        description="Add a new referring dental practice to your network. Fill in the practice details and contact information."
        buttons={[
          {
            text: "Cancel",
            onPress: handleClose,
            variant: "bordered",
            color: "default",
            className: "border border-foreground/10",
          },
          {
            text: "Save",
            onPress: handleSave,
            color: "primary",
            variant: "solid",
            icon: <AiOutlinePlus fontSize={15} />,
          },
        ]}
      >
        <PartnerNetworkConfig />
      </ActionModal>
    </>
  );
};

export default PartnerNetwork;
