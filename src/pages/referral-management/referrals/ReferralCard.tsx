import { Button } from "@heroui/react";
import { useMemo } from "react";
import { Link } from "react-router";
import ReferralStatusChip from "../../../components/chips/ReferralStatusChip";
import {
  REFERRER_TYPE_LABELS,
  TREATMENT_OPTIONS,
} from "../../../consts/referral";
import { Referral } from "../../../types/referral";
import { formatDateToReadable } from "../../../utils/formatDateToReadable";
import { FiTrash2 } from "react-icons/fi";
import { useLocationContext } from "../../../providers/LocationContext";

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
  onDelete?: (id: string) => void;
}

const ReferralCard = ({ referral, actions = () => [], onDelete }: ReferralCardProps) => {
  const { locations } = useLocationContext();

  const assignedPracticeName = useMemo(() => {
    if (typeof referral?.locationId === "object" && referral?.locationId?.name) {
      return referral.locationId.name;
    }
    if (referral?.location?.name) {
      return referral.location.name;
    }
    const rawLocId =
      referral?.locationId?._id ||
      (typeof referral?.locationId === "string" ? referral?.locationId : null);
    if (rawLocId && locations?.length) {
      const found = locations.find((l) => l._id === rawLocId);
      if (found?.name) return found.name;
    }
    return null;
  }, [locations, referral?.locationId, referral?.location]);

  const infoItems = useMemo(() => {
    const items: React.ReactNode[] = [];

    if (referral.treatment) {
      const treatmentLabel =
        TREATMENT_OPTIONS.find(
          (treatmentOption: any) => treatmentOption.key === referral.treatment
        )?.label || referral.treatment;
      items.push(<span key="treatment">{treatmentLabel}</span>);
    }

    if (referral.createdAt) {
      items.push(
        <span key="date">{formatDateToReadable(referral.createdAt)}</span>
      );
    }

    if (referral?.addedVia) {
      items.push(<span key="source">via {referral.addedVia}</span>);
    }

    if (referral?.appointmentTime) {
      items.push(<span key="time">{referral.appointmentTime}</span>);
    }

    items.push(
      <span key="practice">
        {assignedPracticeName || "Not Assigned"}
      </span>
    );

    return items;
  }, [referral, assignedPracticeName]);

  return (
    <div className="md:flex md:justify-between border border-foreground/10 rounded-lg p-3.5 bg-background dark:bg-content1 max-md:space-y-2">
      <div className="font-medium text-sm w-full h-full capitalize flex flex-col gap-1 dark:text-white">
        <p>{referral.name}</p>
        {(referral?.referredBy?.name || referral?.referredBy?.practiceName) && (
          <div className="flex gap-2 items-center text-xs font-light dark:text-foreground/60 flex-wrap">
            <p className="flex gap-1 items-center">
              {referral?.referredBy?.name}
            </p>
            {(referral?.referredBy?.practiceName ||
              referral?.referredBy?.type) && (
                <>
                  <p className="p-0.5 bg-foreground/50 dark:bg-default-400 rounded-full aspect-square h-fit w-fit"></p>
                  <p>
                    {referral?.referredBy?.practiceName &&
                      referral?.referredBy?.practiceName !== "Unknown"
                      ? referral?.referredBy?.practiceName
                      : REFERRER_TYPE_LABELS[referral?.referredBy?.type] ||
                      referral?.referredBy?.type ||
                      ""}
                  </p>
                </>
              )}
          </div>
        )}
        <div className="flex gap-2 items-center text-xs font-light mt-0.5 dark:text-foreground/60 flex-wrap">
          {infoItems.map((item, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              {idx > 0 && (
                <p className="p-0.5 bg-foreground/50 dark:bg-default-400 rounded-full aspect-square h-fit w-fit"></p>
              )}
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center text-center md:justify-end h-full w-full gap-1 md:gap-3 text-sm self-center">
        <div
          className="self-center cursor-pointer"
          onClick={() => actions(referral)[1]?.onClick(referral._id)}
        >
          <ReferralStatusChip status={referral.status} />
        </div>
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
          {onDelete && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              className="text-danger rounded-lg min-w-8 w-8 h-8 flex items-center justify-center p-0"
              onPress={() => onDelete(referral._id)}
            >
              <FiTrash2 className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralCard;
