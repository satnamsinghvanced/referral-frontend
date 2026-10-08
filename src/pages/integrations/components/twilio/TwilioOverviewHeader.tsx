import { Card, CardBody, Button } from "@heroui/react";
import { FiPhone, FiDollarSign, FiClock, FiMic, FiCreditCard, FiPlus } from "react-icons/fi";

interface TwilioOverviewHeaderProps {
  activeNumbersCount: number;
  planName: string;
  minutesUsed: number;
  minutesLimit: number;
  messagesUsed?: number;
  messagesLimit?: number;
  recordedCallsCount?: number;
  onOpenManagePlans: () => void;
  onOpenPurchaseNumber: () => void;
}

export default function TwilioOverviewHeader({
  activeNumbersCount,
  planName,
  minutesUsed,
  minutesLimit,
  recordedCallsCount = 0,
  onOpenManagePlans,
  onOpenPurchaseNumber,
}: TwilioOverviewHeaderProps) {
  const displayActiveNumbers = activeNumbersCount > 0 ? activeNumbersCount : 0;
  const displayPlanName = planName && planName !== "No Active Plan" ? planName : "No Active Plan";
  const minutesLeft = minutesLimit > 0 ? Math.max(0, minutesLimit - minutesUsed) : 0;
  const totalMinutes = minutesLimit > 0 ? minutesLimit : 0;
  return (
    <Card className="shadow-none border border-foreground/10 rounded-2xl bg-background p-5">
      <CardBody className="p-0 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/10 shrink-0">
              <FiPhone className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-foreground">
                Practice ROI Phone Service
              </h2>
              <p className="text-xs text-foreground-500 mt-0.5">
                Call routing, recording, and AI-powered lead capture — powered by Phone Service
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="bordered"
              onPress={onOpenManagePlans}
              startContent={<FiCreditCard className="w-4 h-4" />}
              className="bg-background border border-foreground/15 rounded-xl text-xs font-semibold h-9 px-4 hover:bg-foreground/5 shadow-none"
            >
              Manage Plan
            </Button>
            <Button
              color="primary"
              onPress={onOpenPurchaseNumber}
              startContent={<FiPlus className="w-4 h-4" />}
              className="bg-primary text-white rounded-xl text-xs font-semibold h-9 px-4 shadow-sm hover:opacity-90 transition-opacity"
            >
              Purchase Number
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-none border border-foreground/10 bg-background dark:bg-content1 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-foreground-500">Active Numbers</span>
              <FiPhone className="w-4 h-4 text-primary" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-extrabold text-foreground">{displayActiveNumbers}</span>
            </div>
          </Card>
          <Card className="shadow-none border border-foreground/10 bg-background dark:bg-content1 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-foreground-500">Current Plan</span>
              <FiDollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-extrabold text-foreground">{displayPlanName}</span>
            </div>
          </Card>
          <Card className="shadow-none border border-foreground/10 bg-background dark:bg-content1 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-foreground-500">Minutes Left</span>
              <FiClock className="w-4 h-4 text-purple-500" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-extrabold text-foreground">
                {minutesLeft}
                <span className="text-sm font-semibold text-foreground-400">/{totalMinutes}</span>
              </span>
            </div>
          </Card>
          <Card className="shadow-none border border-foreground/10 bg-background dark:bg-content1 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-foreground-500">Recorded Calls</span>
              <FiMic className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-extrabold text-foreground">{recordedCallsCount}</span>
            </div>
          </Card>
        </div>
      </CardBody>
    </Card>
  );
}