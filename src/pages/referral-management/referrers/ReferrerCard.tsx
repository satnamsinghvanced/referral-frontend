import { Button } from "@heroui/react";
import React from "react";
import { FaGoogle, FaRegStar } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { LuShare2, LuTrophy, LuUsers } from "react-icons/lu";
import { RiUserCommunityLine } from "react-icons/ri";
import { Link } from "react-router";
import { Referrer } from "../../../types/partner";
import { SiGoogle } from "react-icons/si";

interface ReferrerButton {
  label: string;
  onClick: (id: string) => void;
  icon?: React.ReactNode;
  variant?: "solid" | "bordered" | "light" | "flat" | "ghost" | "shadow";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  className?: string;
  link?: string;
  linkInNewTab?: boolean;
  isHide?: boolean;
}

interface ReferrerCardProps {
  referrer: Referrer;
  buttons?: (referrer: Referrer) => ReferrerButton[];
  onView?: (id: string) => void;
}

const ReferrerCard: React.FC<ReferrerCardProps> = ({
  referrer,
  buttons = () => [],
  onView,
}) => {
  const lat = referrer?.practice?.address?.coordinates?.lat;
  const long = referrer?.practice?.address?.coordinates?.long;

  const handleVisit = () => {
    if (typeof lat === "number" && typeof long === "number") {
      const url = `https://www.google.com/maps?q=${lat},${long}`;
      window.open(url, "_blank");
    }
  };

  const config = React.useMemo(() => {
    switch (referrer.type) {
      case "doctor":
        return {
          icon: <LuUsers />,
          bgColor: "bg-blue-100",
          textColor: "text-blue-600",
          label: referrer?.practice?.name || "Doctor Referrer",
        };
      case "patient":
        return {
          icon: <FaRegStar />,
          bgColor: "bg-emerald-100",
          textColor: "text-emerald-600",
          label: "Patient Referrer",
        };
      case "communityReferrer":
        return {
          icon: <RiUserCommunityLine />,
          bgColor: "bg-orange-100",
          textColor: "text-orange-600",
          label: "Community Referrer",
        };
      case "googleReferrer":
        return {
          icon: <SiGoogle />,
          bgColor: "bg-indigo-100",
          textColor: "text-indigo-600",
          label: "Online/Google Referrer",
        };
      case "socialMediaReferrer":
        return {
          icon: <LuShare2 />,
          bgColor: "bg-purple-100",
          textColor: "text-purple-600",
          label: "Social Media Referrer",
        };
      case "eventReferrer":
        return {
          icon: <LuTrophy />,
          bgColor: "bg-amber-100",
          textColor: "text-amber-600",
          label: "Event Referrer",
        };
      default:
        return {
          icon: <LuUsers />,
          bgColor: "bg-gray-100",
          textColor: "text-gray-600",
          label: "Referrer",
        };
    }
  }, [referrer]);

  return (
    <div className="md:flex md:justify-between md:items-center border border-foreground/10 rounded-lg p-3.5 bg-background max-md:space-y-3.5">
      {/* Left Section */}
      <div className="flex items-center gap-2.5 md:gap-3">
        <div
          className={`text-lg md:text-xl min-w-8 md:min-w-10 aspect-square h-full p-0.5 rounded-lg flex justify-center items-center ${config.bgColor} ${config.textColor}`}
        >
          {config.icon}
        </div>
        <div className="flex flex-col gap-1 w-full text-left">
          <p className="text-sm font-medium">{referrer.name}</p>
          <p className="text-xs text-gray-600 line-clamp-1">{config.label}</p>

          <div className="flex items-center gap-3.5 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <span>{referrer.referrals.length} total</span>
              <span className="p-0.5 bg-gray-600/60 rounded-full aspect-square h-fit w-fit"></span>
              <span>
                {referrer.thisMonthReferralCount || 0}
                <span> this month</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section (Buttons) */}
      <div className="flex md:justify-end items-center gap-2 md:ml-3">
        {buttons(referrer).map((btn, index) => {
          const buttonElement = (
            <Button
              key={index}
              size="sm"
              variant={btn.variant ?? "bordered"}
              color={btn.color ?? "default"}
              onPress={() => {
                if (btn.label.toLowerCase().includes("visit")) {
                  handleVisit();
                } else {
                  btn.onClick && btn.onClick(referrer._id);
                }
              }}
              className={btn.className ?? "text-xs"}
            >
              {btn.icon && <span className="text-sm">{btn.icon}</span>}
              {btn.label}
            </Button>
          );

          return btn.link ? (
            <Link
              key={index}
              to={btn.link}
              target={btn.linkInNewTab ? "_blank" : "_self"}
            >
              {buttonElement}
            </Link>
          ) : (
            !btn.isHide && buttonElement
          );
        })}

        {/* Default Eye Button */}
        <Button
          isIconOnly
          size="sm"
          variant="ghost"
          onPress={() => onView?.(referrer._id)}
          className="border-none"
        >
          <FiEye className="size-4 " />
        </Button>
      </div>
    </div>
  );
};

export default ReferrerCard;
