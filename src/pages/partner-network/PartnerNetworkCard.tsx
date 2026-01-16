import { Button, Chip } from "@heroui/react";
import { FiPhone } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { LuBuilding2 } from "react-icons/lu";
import LevelChip from "../../components/chips/LevelChip";
import { Partner } from "../../types/partner";
import PracticeStatusChip from "../../components/chips/PracticeStatusChip";

interface PartnerNetworkCardProps {
  partner: Partner;
  actions?: {
    label: string;
    icon: React.ReactNode;
    function: Function;
    variant?: string;
    color?: string;
    className?: string;
  }[];
}

const PartnerNetworkCard = ({ partner, actions }: PartnerNetworkCardProps) => {
  return (
    <div className="border border-foreground/10 rounded-lg p-4 bg-content1 space-y-3.5 shadow-none">
      <div className="flex items-center gap-2.5">
        <div className="min-size-8 md:min-size-10 size-8 md:size-10 aspect-square bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-0.5 rounded-lg flex justify-center items-center">
          <LuBuilding2 className="text-lg md:text-[22px]" />
        </div>
        <div className="font-medium text-sm w-full h-full flex flex-col justify-center gap-1.5">
          <div className="flex items-center justify-between gap-2 max-sm:flex-col-reverse max-sm:gap-1.5 max-sm:items-start max-sm:mb-0.5">
            <p className="text-foreground">{partner.name}</p>
            <LevelChip level={partner.level} />
          </div>
          <div className="md:flex md:gap-3.5 md:items-center text-xs max-md:space-y-2">
            <p className="flex gap-1 items-center text-gray-600 dark:text-foreground/40">
              <GrLocation className="size-[15px] min-w-[15px] min-h-[15px]" />
              <span className="md:max-w-[200px] xl:max-w-[300px] sm:line-clamp-1 sm:whitespace-nowrap text-ellipsis">
                {partner.address.addressLine1}
                {partner.address.city && `, ${partner.address.city}`}
                {partner.address.state && `, ${partner.address.state}`}
                {partner.address.zip && `, ${partner.address.zip}`}
              </span>
            </p>
            {partner.phone && (
              <p className="flex gap-1.5 items-center text-gray-600 dark:text-foreground/40 whitespace-nowrap">
                <FiPhone fontSize={14} />
                <span>{partner?.phone}</span>
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between h-full w-full gap-5 text-sm max-md:flex-col max-md:items-start max-md:gap-3">
        <div className="flex items-center gap-3 md:gap-5">
          <div className="flex flex-col items-center text-center justify-center">
            <p className="text-sm font-semibold text-foreground">
              {partner.totalReferrals}
            </p>
            <p className="text-[11px] font-thin text-foreground/60">Total</p>
          </div>
          <div className="flex flex-col items-center text-center justify-center">
            <p className="text-sm font-semibold text-blue-500 dark:text-blue-400">
              {partner.monthlyReferrals}
            </p>
            <p className="text-[11px] font-thin text-foreground/60">
              This Month
            </p>
          </div>
          <div className="flex flex-col items-center text-center justify-center">
            <p className="text-sm font-semibold text-gray-700 dark:text-foreground/80">
              {partner.notesCount}
            </p>
            <p className="text-[11px] font-thin text-foreground/60">Notes</p>
          </div>
          <div className="flex flex-col items-center text-center justify-center">
            <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
              {partner.tasksCount}
            </p>
            <p className="text-[11px] font-thin text-foreground/60">Tasks</p>
          </div>
          <div className="flex items-center text-center justify-center">
            <PracticeStatusChip status={partner.status} />
          </div>
        </div>
        <div className="flex items-center gap-2.5">
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
                  className={`overflow-visible ${action.className}`}
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
