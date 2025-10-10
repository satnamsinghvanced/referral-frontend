import React from "react";
import { FiEye } from "react-icons/fi";
import { Button } from "@heroui/react";
import { Referrer } from "../../types/types";

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
        <h3 className="font-semibold text-sm text-foreground">{referrer.fullName}</h3>
        <p className="text-xs text-foreground/70">{referrer.practice}</p>

        <div className="flex gap-4 mt-2 text-xs text-foreground/70">
          <span>{referrer.totalReferrals} total</span>
          <span>{referrer.referralsThisMonth} this month</span>
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
