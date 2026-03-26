import { Button, Card, CardBody, CardHeader, Spinner } from "@heroui/react";
import React from "react";
import { FiCreditCard } from "react-icons/fi";
import { useBilling } from "../../hooks/settings/useBilling";
import { formatDateToReadable } from "../../utils/formatDateToReadable";
import { LoadingState } from "../../components/common/LoadingState";

const Billing: React.FC = () => {
  const { data: billingData, isLoading, error } = useBilling();

  const handleNavigateToROI = () => {
    window.open("https://dev.practiceroi.com/", "_blank", "noreferrer");
  };

  const handleUpdatePayment = () => {
    handleNavigateToROI();
  };

  const handleTogglePlanStatus = () => {
    handleNavigateToROI();
  };

  if (isLoading) {
    return (
      <Card className="rounded-xl shadow-none border border-foreground/10 bg-background h-[356px] flex items-center justify-center">
        <LoadingState />
      </Card>
    );
  }

  if (!billingData) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-500/30 rounded-lg p-3 flex items-center justify-between flex-wrap gap-3 mb-6">
        <p className="text-sm text-yellow-800 dark:text-yellow-400">
          You don't have any active plan. Please buy a plan to continue.
        </p>
        <Button
          // as={Link}
          // to="/integrations"
          size="sm"
          color="warning"
          variant="flat"
          onPress={handleNavigateToROI}
          className="bg-yellow-200 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
        >
          Buy Plan
        </Button>
      </div>
    );
  }

  const isActive = billingData.status === "active";

  return (
    <Card className="rounded-xl shadow-none border border-foreground/10 bg-background">
      <CardHeader className="flex items-center gap-2 px-4 pt-4 pb-1">
        <FiCreditCard className="size-5" />
        <h4 className="text-base">Billing & Subscription</h4>
      </CardHeader>

      <CardBody className="p-4 space-y-5">
        <div
          className={`space-y-1 p-3 rounded-lg border ${isActive
            ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
            }`}
        >
          <div className="flex items-center justify-between mb-2">
            <p
              className={`text-sm ${isActive ? "dark:text-green-400" : "dark:text-red-400"}`}
            >
              Current Plan: {billingData.name}
            </p>
            <span
              className={`inline-flex items-center justify-center rounded-md px-2 py-1 text-[11px] font-medium w-fit whitespace-nowrap shrink-0 ${isActive
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            ${billingData.price}/{billingData.billingCycle}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Next billing date:{" "}
            {formatDateToReadable(billingData.nextBillingDate)}
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm">Payment Method</h4>
          <div className="flex items-center justify-between p-4 border border-foreground/10 rounded-lg">
            <div className="flex items-center gap-3">
              <FiCreditCard className="size-6 text-gray-400" />
              <div>
                <p className="text-sm">
                  **** **** **** {billingData.cardNumber.slice(-4)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Expires {billingData.expire}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="bordered"
              onPress={handleUpdatePayment}
              className="border-small"
            >
              Update
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="bordered"
            onPress={handleTogglePlanStatus}
            className="border-small"
          >
            {isActive ? "Change Plan" : "Activate Plan"}
          </Button>
          <Button
            size="sm"
            variant="bordered"
            className="border-small"
            onPress={handleNavigateToROI}
          >
            Download Invoice
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default Billing;
