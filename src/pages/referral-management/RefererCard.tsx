import React from "react";
import { FiEye } from "react-icons/fi";
import { Button } from "@heroui/react";
import { Referrer } from "../../types/types";
import { Chip } from "@heroui/react";

interface RefererButton {
  label: string;
  onClick: (id: string) => void;
  icon?: React.ReactNode;
  variant?: "solid" | "bordered" | "light" | "flat" | "ghost" | "shadow";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  className?: string;
}

interface RefererCardProps {
  referrer: Referrer;
  buttons?: RefererButton[];
  onView?: (id: string) => void;
}

const RefererCard: React.FC<RefererCardProps> = ({ referrer, buttons = [], onView }) => {
  return (
    <div className="flex justify-between items-start border border-foreground/10 rounded-xl p-4 bg-background hover:bg-foreground/5 transition-colors">
      {/* Left Section */}
      <div className="flex flex-col gap-1 w-full">
        <h3 className="font-semibold text-sm text-foreground">{referrer.name}</h3>
        <p className="text-xs text-foreground/70">{referrer.practiceName}</p>

        <div className="flex gap-4 mt-2 text-xs text-foreground/70">
          <span>{referrer.referrals.length} </span>
         <span>{referrer.referrals?.referrerThisMonth?.length ? referrer.referrals?.referrerThisMonth?.length : 0} thisMonth </span>
   
  {referrer.qrCode ? (
    <Chip color="primary" size="sm" variant="flat">
     QR
    </Chip>
  ) : null}

           
        </div>
      </div>

      {/* Right Section (Buttons) */}
      <div className="flex flex-wrap justify-end items-center gap-2 ml-3">
        {buttons.map((btn, index) => (
          <Button
            key={index}
            size="sm"
            variant={btn.variant ?? "bordered"}
            color={btn.color ?? "default"}
            onPress={() => btn.onClick(referrer._id)}
            className={btn.className ?? "text-xs"}
          >
            {btn.icon && <span className="mr-1 text-sm">{btn.icon}</span>}
            {btn.label}
          </Button>
        ))}

        {/* Default Eye Button */}
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={() => onView?.(referrer._id)}
          className="hover:bg-secondary-100"
        >
          <FiEye className="text-foreground/80" />
        </Button>
      </div>
    </div>
  );
};

export default RefererCard;
