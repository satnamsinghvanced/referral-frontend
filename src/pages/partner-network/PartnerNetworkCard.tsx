import { Button, Chip } from "@heroui/react";
import { FiPhone } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { LuBuilding2 } from "react-icons/lu";
import LevelChip from "../../components/chips/LevelChip";
import { Partner } from "../../types/partner";

interface PartnerNetworkCardProps {
  partner: Partner;
  actions?: {
    label: string;
    icon: React.ReactNode;
    function: Function;
    variant?: string;
    color?: string;
  }[];
}

const PartnerNetworkCard = ({ partner, actions }: PartnerNetworkCardProps) => {
  return (
    <div className="flex items-center justify-between border border-foreground/10  rounded-lg p-4 bg-background ">
      <div className="min-size-10 size-10 aspect-square bg-blue-100 text-blue-600 h-full p-0.5 mr-2 rounded-lg flex justify-center items-center">
        <LuBuilding2 className="text-[22px]" />
      </div>
      <div className="font-medium text-sm w-full h-full flex flex-col justify-center gap-1">
        <div className="flex items-center gap-2">
          <p>{partner.name}</p>
          <LevelChip level={partner.level.toLowerCase()} />
        </div>
        <div className="flex gap-3.5 items-center text-xs font-light">
          <p className="flex gap-1 items-center text-gray-600">
            <IoLocationOutline fontSize={15} />
            {partner.address.addressLine1}
            {partner.address.city && `, ${partner.address.city}`}   
          </p>
          {partner.phone && (
            <p className="flex gap-1.5 items-center text-gray-600">
              <FiPhone fontSize={14} />
              {partner?.phone}
            
            </p>
          )}
        </div>
      </div>
      <div className="flex text-center justify-end h-full w-full gap-5 text-sm">
        <div className="flex flex-col items-center text-center justify-center">
          <p className="text-sm font-semibold">{partner.totalReferrals}</p>
          <p className="text-[11px] font-thin">Total</p>
        </div>
        <div className="flex flex-col items-center text-center justify-center">
          <p className="text-sm font-semibold text-blue-500">
            {partner.monthlyReferrals}
          </p>
          <p className="text-[11px] font-thin">This Month</p>
        </div>
        <div className="flex flex-col items-center text-center justify-center">
          <p className="text-sm font-semibold text-gray-700">
            {partner.notesCount}
          </p>
          <p className="text-[11px] font-thin">Notes</p>
        </div>
        <div className="flex flex-col items-center text-center justify-center">
          <p className="text-sm font-semibold text-orange-600">
            {partner.tasksCount}
          </p>
          <p className="text-[11px] font-thin">Tasks</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center text-center justify-center">
            <Chip
              size="sm"
              radius="sm"
              className={`capitalize text-[11px] h-5 ${
                partner.status
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {partner.status ? "Active" : "Inactive"}
            </Chip>
          </div>
          <div className="flex items-center text-center justify-center gap-0.5">
            {Array.isArray(actions) &&
              actions.map((action: any) => (
                <Button
                  key={action.label}
                  size="sm"
                  isIconOnly={true}
                  onPress={() => action.function(partner._id, partner.name)}
                  variant={action.variant || "light"}
                  color={action.color || "default"}
                  className="overflow-visible"
                >
                  {action.icon}
                  {action.label === "Notes" && partner.tasksCount > 0 && (
                    <span className="size-3.5 text-[8px] bg-orange-500 text-white rounded-full absolute -top-1 -right-1 flex items-center justify-center">
                      {partner.tasksCount}
                    </span>
                  )}
                </Button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerNetworkCard;
