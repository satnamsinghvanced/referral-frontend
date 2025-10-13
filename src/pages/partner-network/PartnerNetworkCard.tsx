import { FiEdit, FiPhone } from "react-icons/fi";
import { LuBuilding2 } from "react-icons/lu";
import LevelChip from "../../components/chips/LevelChip";
import { IoLocationOutline } from "react-icons/io5";
import PracticeStatusChip from "../../components/chips/PracticeStatusChip";
import { Button } from "@heroui/react";

interface ReferralCardProps {
  referral: {
    id: string;
    name: string;
    address: string;
    phone: string;
    referrals: number;
    level: string;
    levelColor?: string;
    score: number;
  };
  actions?: {
    label: string;
    icon: React.ReactNode;
    function: Function;
    variant?: string;
    color?: string;
  }[];
}

const PartnerNetworkCard = ({ referral, actions }: ReferralCardProps) => {
  return (
    <div className="flex justify-between border border-foreground/10  rounded-lg p-4 bg-background ">
      <div className="w-20 aspect-square bg-blue-100 text-blue-600 h-full p-0.5 mr-2 rounded-lg flex justify-center items-center">
        <LuBuilding2 className="text-[22px]" />
      </div>
      <div className="font-medium text-sm w-full h-full flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p>{referral.name}</p>
          <LevelChip level={referral.level.toLowerCase()} />
        </div>
        <div className="flex gap-3.5 items-center text-xs font-light">
          <p className="flex gap-1 items-center text-gray-600">
            <IoLocationOutline fontSize={15} />
            {referral.address}
          </p>
          <p className="flex gap-1.5 items-center text-gray-600">
            <FiPhone fontSize={14} />
            {referral.phone}
          </p>
        </div>
      </div>
      <div className="flex text-center justify-end h-full w-full gap-5 text-sm">
        <div className="flex flex-col items-center text-center justify-center">
          <p className="text-sm font-semibold">{referral.referrals}</p>
          <p className="text-[11px] font-thin">Total</p>
        </div>
        <div className="flex flex-col items-center text-center justify-center">
          <p className="text-sm font-semibold text-blue-500">
            {referral.referrals}
          </p>
          <p className="text-[11px] font-thin">This Month</p>
        </div>
        <div className="flex flex-col items-center text-center justify-center">
          <p className="text-sm font-semibold">{referral.score}</p>
          <p className="text-[11px] font-thin">Score</p>
        </div>
        <div className="flex flex-col items-center text-center justify-center">
          <p className="text-sm font-semibold text-gray-700">
            {referral.referrals}
          </p>
          <p className="text-[11px] font-thin">Notes</p>
        </div>
        <div className="flex flex-col items-center text-center justify-center">
          <p className="text-sm font-semibold text-orange-600">
            {referral.referrals}
          </p>
          <p className="text-[11px] font-thin">Tasks</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center text-center justify-center">
            <PracticeStatusChip status="active" />
          </div>
          <div className="flex items-center text-center justify-center gap-0.5">
            {Array.isArray(actions) &&
              actions.map((action: any) => (
                <Button
                  key={action.label}
                  size="sm"
                  isIconOnly={true}
                  onPress={() => action.function(referral.id)}
                  variant={action.variant || "light"}
                  color={action.color || "default"}
                >
                  {action.icon}
                </Button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerNetworkCard;
