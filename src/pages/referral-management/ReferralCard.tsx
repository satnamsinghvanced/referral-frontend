import { Button } from "@heroui/react";
import UrgencyChip from "../../components/chips/UrgencyChip";
import { Link } from "react-router";

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
}

interface ReferralCardProps {
  referral: {
    _id: string;
    name: string;
    practiceName: string;
    practiceAddress: string;
    createdAt: string;
    urgency: string;
    addedVia: string;
    referredBy: any;
    treatment: string;
    mobile: number;
  };
  actions?: (referral: any) => ReferralButton[];
  urgencyLabels: Record<string, string>;
}

const ReferralCard = ({
  referral,
  urgencyLabels,
  actions = () => [],
}: ReferralCardProps) => {
  return (
    <div className="flex justify-between border border-foreground/10  rounded-lg p-4 bg-background ">
      <div className="font-medium text-sm w-full h-full capitalize flex flex-col gap-0.5">
        <p>{referral.name}</p>
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
        <div className="flex gap-2 items-center text-xs font-light">
          <p className="flex gap-1 items-center">{referral.treatment}</p>
          <p className="p-0.5 bg-foreground/50 rounded-full aspect-square h-fit w-fit"></p>
          <p>{referral.createdAt?.slice(0, 10)}</p>
          <p className="p-0.5 bg-foreground/50 rounded-full aspect-square h-fit w-fit"></p>
          <p>via {referral?.addedVia}</p>
        </div>
      </div>
      <div className="flex items-center text-center justify-end h-full w-full gap-3 text-sm self-center">
        <div className="capitalize self-center">
          {referral.urgency ? (
            <UrgencyChip
              urgency={urgencyLabels[referral.urgency] || referral.urgency}
            />
          ) : (
            <UrgencyChip urgency={urgencyLabels["new"] || "new"} />
          )}
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
                  onPress={() => btn.onClick}
                  className={btn.className ?? "text-xs"}
                  startContent={btn.icon}
                  isIconOnly
                >
                  {/* {btn.icon && <span className="text-sm">{btn.icon}</span>} */}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralCard;
