import { Card, CardBody, Button } from "@heroui/react";
import { FiPhone, FiDollarSign, FiClock, FiMessageSquare, FiCreditCard, FiPlus } from "react-icons/fi";

interface TwilioOverviewHeaderProps {
  activeNumbersCount: number;
  planName: string;
  minutesUsed: number;
  minutesLimit: number;
  onOpenManagePlans: () => void;
  onOpenPurchaseNumber: () => void;
}

export default function TwilioOverviewHeader({
  activeNumbersCount,
  planName,
  minutesUsed,
  minutesLimit,
  onOpenManagePlans,
  onOpenPurchaseNumber,
}: TwilioOverviewHeaderProps) {
  return (
    <Card className="shadow-none border border-foreground/10 rounded-2xl bg-background p-5">
      <CardBody className="p-0 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10">
              <FiPhone className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-foreground">
                  Practice ROI Phone Service
                </h2>
              </div>
              <p className="text-xs text-foreground-500 mt-0.5">
                Manage phone numbers, call tracking, and SMS communication through Practice ROI
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Button
              variant="bordered"
              onPress={onOpenManagePlans}
              startContent={<FiCreditCard className="w-4 h-4" />}
              className="border border-foreground/10 rounded-xl text-sm font-semibold h-10 px-4 hover:bg-foreground/5"
            >
              Manage plans
            </Button>
            <Button
              color="primary"
              onPress={onOpenPurchaseNumber}
              startContent={<FiPlus className="w-4 h-4" />}
              className="bg-primary text-white rounded-xl text-sm font-semibold h-10 px-4"
            >
              Purchase Number
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-none border border-foreground/10 bg-foreground/5 dark:bg-default-50/50 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-foreground-500">Active Numbers</span>
              <FiPhone className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-extrabold text-foreground">{activeNumbersCount}</span>
            </div>
          </Card>
          <Card className="shadow-none border border-foreground/10 bg-foreground/5 dark:bg-default-50/50 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-foreground-500">Current Plan</span>
              <FiDollarSign className="w-4 h-4 text-green-500" />
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-extrabold text-foreground">{planName}</span>
            </div>
          </Card>
          <Card className="shadow-none border border-foreground/10 bg-foreground/5 dark:bg-default-50/50 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-foreground-500">Monthly Minutes</span>
              <FiClock className="w-4 h-4 text-purple-500" />
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-extrabold text-foreground">
                {minutesUsed}
                <span className="text-sm font-normal text-foreground-500">/{minutesLimit}</span>
              </span>
            </div>
          </Card>
          <Card className="shadow-none border border-foreground/10 bg-foreground/5 dark:bg-default-50/50 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-foreground-500">Features</span>
              <FiMessageSquare className="w-4 h-4 text-red-500" />
            </div>
            <div className="mt-2.5">
              <span className="text-sm font-bold text-foreground">Voice • SMS • MMS</span>
            </div>
          </Card>
        </div>
      </CardBody>
    </Card>
  );
}
