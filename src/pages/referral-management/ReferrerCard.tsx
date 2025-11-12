import React from "react";
import { FiEye } from "react-icons/fi";
import { Button } from "@heroui/react";
import { Chip } from "@heroui/react";
import { LuUsers } from "react-icons/lu";
import { Link } from "react-router";
import { FaRegStar } from "react-icons/fa";
import { Referrer } from "../../types/partner";

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
  // console.log(referrer);

  const lat = referrer?.practice?.address?.coordinates?.lat;
  const long = referrer?.practice?.address?.coordinates?.long;

  const handleVisit = () => {
    if (typeof lat === "number" && typeof long === "number") {
      const url = `https://www.google.com/maps?q=${lat},${long}`;
      window.open(url, "_blank");
    }
  };

  const handleOpenQR = () => {
    if (referrer.qrCode) {
      const qrUrl =
        typeof referrer.qrCode === "string"
          ? referrer.qrCode
          : URL.createObjectURL(referrer.qrCode);
      window.open(qrUrl, "_blank");
    }
  };
  return (
    <div className="flex justify-between items-center border border-foreground/10 rounded-xl p-4 bg-background">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <div
          className={`text-[22px] min-w-10 aspect-square h-full p-0.5 rounded-lg flex justify-center items-center ${
            referrer?.type === "doctor"
              ? "bg-blue-100 text-blue-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {referrer?.type === "doctor" ? <LuUsers /> : <FaRegStar />}
        </div>
        <div className="flex flex-col gap-0.5 w-full">
          <p className="text-sm font-medium">{referrer.name}</p>
          <p className="text-xs text-gray-600">
            {referrer?.type === "doctor"
              ? referrer?.practice?.name
              : "Patient Referrer"}
          </p>

          <div className="flex items-center gap-3.5 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <span>{referrer.referrals.length} total</span>
              <span className="p-0.5 bg-foreground/50 rounded-full aspect-square h-fit w-fit"></span>
              <span>
                {referrer.thisMonthReferralCount &&
                  referrer.thisMonthReferralCount}
                <span> this month</span>
              </span>
            </div>

            {referrer.qrCode ? (
              <Chip
                color="primary"
                size="sm"
                variant="flat"
                radius="sm"
                className="capitalize text-[11px] h-5"
              >
                QR
              </Chip>
            ) : null}
          </div>
        </div>
      </div>

      {/* Right Section (Buttons) */}
      <div className="flex justify-end items-center gap-2 ml-3">
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
                  btn.onClick(referrer._id);
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
            buttonElement
          );
        })}

        {/* Default Eye Button */}
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={() => onView?.(referrer._id)}
          className=" hover:!bg-orange-200 hover:text-orange-500 transition-colors " 
        >
          <FiEye className="size-4 " />
        </Button>
      </div>
    </div>
  );
};

export default ReferrerCard;
