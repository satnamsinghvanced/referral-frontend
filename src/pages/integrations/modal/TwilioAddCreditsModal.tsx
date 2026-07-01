import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { FiPhone, FiCreditCard, FiCheck } from "react-icons/fi";

interface TwilioAddCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  currentMinutes: number;
  minutesUsed: number;
  planExpiresAt: string | null | undefined;
  onAddCredits: (amount: number, minutes: number) => void;
}

interface Plan {
  id: string;
  name: string;
  desc: string;
  price: number;
  minutes: number;
  segments: number;
  callRate: string;
  smsRate: string;
  pkgName: string;
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    desc: "Best for solo or low-volume practices",
    price: 50,
    minutes: 500,
    segments: 1000,
    callRate: "0.02",
    smsRate: "0.025",
    pkgName: "500",
  },
  {
    id: "growth",
    name: "Growth",
    desc: "Most popular",
    price: 75,
    minutes: 1000,
    segments: 2500,
    callRate: "0.015",
    smsRate: "0.02",
    pkgName: "1000",
    popular: true,
  },
  {
    id: "scale",
    name: "Scale",
    desc: "For high call volume or multi-location",
    price: 100,
    minutes: 2500,
    segments: 5000,
    callRate: "0.01",
    smsRate: "0.015",
    pkgName: "2500",
  },
];

export default function TwilioAddCreditsModal({
  isOpen,
  onClose,
  currentMinutes,
  minutesUsed,
  planExpiresAt,
}: TwilioAddCreditsModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("starter");
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (currentMinutes >= 2500) {
        setSelectedPlanId("scale");
      } else if (currentMinutes >= 1000) {
        setSelectedPlanId("growth");
      } else {
        setSelectedPlanId("starter");
      }
      setIsConnecting(false);
    }
  }, [isOpen, currentMinutes]);

  const activePlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[0]!;

  const handleConfirmPlan = () => {
    setIsConnecting(true);
    const url = `${window.location.origin}/checkout?type=twilio_credits&amount=${activePlan.price}&walletAmount=${activePlan.price}&package=${activePlan.pkgName}&auto_topup=true`;
    window.open(url, "_blank");
    onClose();
  };

  const hasActivePlan = currentMinutes > 0;
  const currentPlan = PLANS.find(p => p.minutes === currentMinutes);

  const formatDate = (dateStr: string | null | undefined) => {
    let date = dateStr;
    if (!date && hasActivePlan) {
      const fallback = new Date();
      fallback.setDate(fallback.getDate() + 30);
      date = fallback.toISOString();
    }
    if (!date) return "N/A";
    try {
      const d = new Date(date);
      return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    } catch (e) {
      return date;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="lg"
      classNames={{
        base: "max-sm:!m-3 !m-0 bg-background border border-foreground/10 text-foreground rounded-2xl max-h-[95vh] overflow-y-auto",
        closeButton: "cursor-pointer text-foreground/50 hover:text-foreground",
      }}
      placement="center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 p-5 pb-2">
          <h2 className="text-lg font-bold text-foreground">Manage Your Monthly Plan</h2>
          <p className="text-xs text-foreground-500 font-normal leading-relaxed">
            Pick the plan that fits your call and text volume. Each plan includes a set amount of calls and texts every month. If you go over, the extra usage bills automatically at the rates shown below.
          </p>
        </ModalHeader>

        <ModalBody className="p-5 pt-2 flex flex-col gap-5">
          {/* Active Plan Status Header Card */}
          <div className="bg-default-50/50 dark:bg-default-100/5 border border-foreground/10 rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-foreground-500 mb-2">
              <FiPhone className="w-5 h-5" />
            </div>
            {hasActivePlan ? (
              <>
                <p className="text-xs sm:text-sm font-bold text-foreground">
                  Current Plan: {currentPlan?.name || "Active Plan"}
                </p>
                <p className="text-[11px] sm:text-xs text-foreground-500 mt-0.5">
                  Next billing date: {formatDate(planExpiresAt)}
                </p>
                <p className="text-[11px] sm:text-xs text-foreground-500 font-medium mt-1">
                  This month: {minutesUsed} of {currentMinutes.toLocaleString()} call minutes used
                </p>
              </>
            ) : (
              <>
                <p className="text-xs sm:text-sm font-bold text-foreground leading-none">No active plan yet</p>
                <p className="text-[11px] sm:text-xs text-foreground-500 mt-1.5 leading-none">
                  Choose a plan below to activate call tracking and texting.
                </p>
              </>
            )}
          </div>

          {/* Plan Options Selector */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-bold text-foreground">Choose Your Plan</label>
            <div className="flex flex-col gap-2.5">
              {PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`relative flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${isSelected
                      ? "border-primary bg-primary/5 text-foreground ring-2 ring-primary/30 shadow-md shadow-primary/5 font-semibold"
                      : "border-foreground/10 bg-default-50/20 hover:bg-default-50 text-foreground"
                      }`}
                  >
                    {plan.popular && (
                      <span className="absolute top-2.5 right-3 px-2 py-0.5 bg-primary text-white text-[8px] rounded-full tracking-wider uppercase">
                        Most Popular
                      </span>
                    )}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-foreground">{plan.name}</span>
                      <span className="text-xs font-normal text-foreground-500">{plan.desc}</span>
                    </div>
                    <div className="flex items-baseline gap-0.5 text-right pr-1">
                      <span className="text-base font-extrabold text-foreground">${plan.price}</span>
                      <span className="text-[10px] text-foreground-500">/mo</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* What's Included Card Section */}
          <div className="bg-primary-50/30 dark:bg-primary-950/5 border border-primary-100/50 dark:border-primary-900/10 rounded-xl p-4 flex flex-col gap-2">
            <h4 className="text-xs font-bold text-foreground">
              What's Included
            </h4>
            <div className="flex flex-col gap-1.5 mt-0.5">
              <div className="flex items-center gap-2 text-xs text-foreground-700">
                <FiCheck className="w-4 h-4 text-primary" />
                <span>{activePlan.minutes.toLocaleString()} outbound call minutes</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground-700">
                <FiCheck className="w-4 h-4 text-primary" />
                <span>
                  {activePlan.segments.toLocaleString()} text segments{" "}
                  <span
                    className="text-primary hover:underline cursor-pointer font-medium ml-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToast({
                        title: "What is a segment?",
                        description: "A segment is 160 characters. Longer texts use more than one.",
                        color: "primary",
                      });
                    }}
                  >
                    (what's a segment?)
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* If You Go Over Warnings container */}
          <div className="bg-amber-50/50 dark:bg-amber-950/15 border border-amber-200/60 dark:border-amber-900/30 rounded-xl p-4 flex flex-col gap-2.5">
            <div className="flex flex-col gap-0.5">
              <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 [word-spacing:1px]">
                If You Go Over
              </h4>
              <p className="text-[10px] text-amber-700/90 dark:text-amber-400/95 leading-relaxed font-normal">
                Used more than your plan includes? Extra usage bills automatically at these rates, deducted from your balance as you use it.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3.5 mt-1">
              <div className="bg-background border border-amber-200/50 dark:border-amber-900/20 p-2.5 rounded-lg flex flex-col">
                <span className="text-[9px] text-foreground-500 font-medium">Outbound Calls</span>
                <span className="text-xs font-extrabold text-foreground mt-0.5">${activePlan.callRate} <span className="text-[9px] font-normal text-foreground-500">/ min</span></span>
              </div>
              <div className="bg-background border border-amber-200/50 dark:border-amber-900/20 p-2.5 rounded-lg flex flex-col">
                <span className="text-[9px] text-foreground-500 font-medium">Text Messages</span>
                <span className="text-xs font-extrabold text-foreground mt-0.5">${activePlan.smsRate} <span className="text-[9px] font-normal text-foreground-500">/ segment</span></span>
              </div>
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="flex flex-col gap-2 border-t border-foreground/5 pt-4">
            <div className="flex justify-between items-center text-xs text-foreground-500 font-semibold">
              <span>Monthly Plan ({activePlan.name})</span>
              <span className="text-foreground font-bold">${activePlan.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-foreground-500 font-semibold">
              <span>Overage charges</span>
              <span>Billed as you use it</span>
            </div>
            <div className="flex justify-between items-center w-full mt-1.5 border-t border-dashed border-foreground/10 pt-3">
              <span className="text-sm font-bold text-foreground">Total to Pay Today</span>
              <span className="text-base font-extrabold text-primary">${activePlan.price.toFixed(2)}</span>
            </div>
            <p className="text-[9px] text-foreground-500 text-center mt-1">
              Billed monthly. Cancel or change plans at any time.
            </p>
          </div>
        </ModalBody>
        <ModalFooter className="p-5 pt-0 flex gap-3 justify-end">
          <Button
            variant="light"
            onPress={onClose}
            className="rounded-lg text-xs font-semibold h-9 px-4 text-foreground-500 hover:bg-foreground/5"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleConfirmPlan}
            isLoading={isConnecting}
            startContent={<FiCreditCard className="w-3.5 h-3.5" />}
            className="bg-primary text-white rounded-lg text-xs font-semibold h-9 px-5"
          >
            Confirm Plan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
