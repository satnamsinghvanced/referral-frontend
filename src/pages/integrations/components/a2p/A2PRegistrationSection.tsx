import { Card, CardBody, Button } from "@heroui/react";
import { FiCheckCircle } from "react-icons/fi";
import { A2PRegistrationData, PhoneNumber } from "./types";
import { getA2PBadgeDetails } from "./a2pUtils";
import A2PProgressStepper from "./A2PProgressStepper";
import A2PStatusBanner from "./A2PStatusBanner";

interface A2PRegistrationSectionProps {
  registration: A2PRegistrationData | null;
  phoneNumbers: PhoneNumber[];
  isA2PConfigLoading: boolean;
  onOpenRegistrationModal: () => void;
}

export default function A2PRegistrationSection({
  registration,
  phoneNumbers,
  isA2PConfigLoading,
  onOpenRegistrationModal,
}: A2PRegistrationSectionProps) {
  const badgeDetails = getA2PBadgeDetails(registration);

  return (
    <Card className="shadow-none border border-foreground/10 bg-background rounded-2xl p-5">
      <CardBody className="p-0 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-foreground">
              SMS Messaging Registration (A2P)
            </h3>
            {badgeDetails && (
              <span
                className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeDetails.colorClass}`}
              >
                {badgeDetails.icon}
                {badgeDetails.label}
              </span>
            )}
          </div>
          <Button
            color={!registration ? "primary" : registration?.status === "failed" ? "danger" : "primary"}
            variant={registration && registration.status !== "failed" ? "flat" : "solid"}
            size="sm"
            onPress={onOpenRegistrationModal}
            startContent={<FiCheckCircle className="w-3.5 h-3.5" />}
            className="rounded-lg text-xs font-semibold h-8 px-4 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            title={
              !phoneNumbers || phoneNumbers.length === 0
                ? "Please purchase a phone number first before registering for SMS"
                : ""
            }
          >
            {!registration
              ? "Register for SMS"
              : registration.status === "failed"
              ? "Edit & Re-submit"
              : "Edit Registration"}
          </Button>
        </div>
        <A2PProgressStepper registration={registration} />
        <A2PStatusBanner
          registration={registration}
          phoneNumbers={phoneNumbers}
          isA2PConfigLoading={isA2PConfigLoading}
        />
      </CardBody>
    </Card>
  );
}
