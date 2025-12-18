import { Button } from "@heroui/react";
import { Link } from "react-router";
import ReferralStatusChip from "../../components/chips/ReferralStatusChip";
import { Referral } from "../../types/referral";
import { TREATMENT_OPTIONS } from "../../consts/referral";
import { formatDateToReadable } from "../../utils/formatDateToReadable";

interface ReferralButton {
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
  hideButton?: boolean;
}

interface ReferralCardProps {
  referral: Referral;
  actions?: (referral: any) => ReferralButton[];
}

const ReferralCard = ({ referral, actions = () => [] }: ReferralCardProps) => {
  return (
    <div className="md:flex md:justify-between border border-foreground/10 rounded-lg p-4 bg-background max-md:space-y-2">
      <div className="font-medium text-sm w-full h-full capitalize flex flex-col gap-1">
        <p>{referral.name}</p>
        {(referral?.referredBy?.name || referral?.referredBy?.practiceName) && (
          <div className="flex gap-2 items-center text-xs font-light">
            <p className="flex gap-1 items-center">
              {referral?.referredBy?.name}
            </p>
            {referral?.referredBy?.practiceName && (
              <>
                <p className="p-0.5 bg-foreground/50 rounded-full aspect-square h-fit w-fit"></p>
                <p>{referral?.referredBy?.practiceName}</p>
              </>
            )}
          </div>
        )}
        <div className="flex gap-2 items-center text-xs font-light mt-0.5">
          {referral.treatment && (
            <p className="flex gap-1 items-center">
              {
                TREATMENT_OPTIONS.find(
                  (treatmentOption: any) =>
                    treatmentOption.key === referral.treatment
                )?.label
              }
            </p>
          )}
          {referral.treatment && referral.createdAt && (
            <p className="p-0.5 bg-foreground/50 rounded-full aspect-square h-fit w-fit"></p>
          )}
          {referral.createdAt && (
            <p>{formatDateToReadable(referral.createdAt)}</p>
          )}
          {referral?.addedVia && (
            <>
              <p className="p-0.5 bg-foreground/50 rounded-full aspect-square h-fit w-fit"></p>
              <p>via {referral?.addedVia}</p>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center text-center md:justify-end h-full w-full gap-1 md:gap-3 text-sm self-center">
        <div
          className="self-center cursor-pointer"
          onClick={() => actions(referral)[2]?.onClick(referral._id)}
        >
          <ReferralStatusChip status={referral.status} />
        </div>
        {actions && (
          <div className="flex items-center gap-1">
            {actions(referral).map((btn, index) => {
              const buttonElement = (
                <Button
                  key={index}
                  size="sm"
                  variant={btn.variant ?? "light"}
                  color={btn.color ?? "default"}
                  onPress={() => btn.onClick(referral._id)}
                  className={btn.className ?? "text-xs"}
                  startContent={btn.icon}
                  isIconOnly
                >
                  {/* {btn.icon && <span className="text-sm">{btn.icon}</span>} */}
                  {btn.label}
                </Button>
              );

              if (btn.hideButton) {
                return;
              }

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
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralCard;
