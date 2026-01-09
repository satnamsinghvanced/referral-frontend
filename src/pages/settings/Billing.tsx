import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import React, { useState } from "react";
import { FiCreditCard } from "react-icons/fi";

const Billing: React.FC = () => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "**** **** **** 4242",
    expiration: "12/26",
    currentPlan: "Professional",
    nextBillingDate: "March 15, 2024",
  });

  const [isActive, setIsActive] = useState(true);

  const handleUpdatePayment = () => {
    console.log("Updating payment method...", paymentDetails);
  };

  const handleTogglePlanStatus = () => {
    setIsActive((prev) => !prev);
    console.log("Toggled plan status:", isActive ? "Inactive" : "Active");
  };

  return (
    <Card className="rounded-xl shadow-none border border-foreground/10">
      <CardHeader className="flex items-center gap-2 px-4 pt-4 pb-1">
        <FiCreditCard className="size-5" />
        <h4 className="text-base">Billing & Subscription</h4>
      </CardHeader>

      <CardBody className="p-4 space-y-5">
        {/* Current Plan */}
        <div className="space-y-1 bg-green-50 border border-green-200 dark:bg-green-200 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm dark:text-background">
              Current Plan: {paymentDetails.currentPlan}
            </p>
            <span
              className={`inline-flex items-center justify-center rounded-md px-2 py-1 text-[11px] font-medium w-fit whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-700">{`$99/month • Up to 10 locations • Advanced analytics`}</p>
          <p className="text-xs text-gray-600 dark:text-gray-700">{`Next billing date: ${paymentDetails.nextBillingDate}`}</p>
        </div>

        {/* Payment Method */}
        <div className="space-y-4">
          <h4 className="text-sm">Payment Method</h4>
          <div className="flex items-center justify-between p-4 border border-foreground/10 rounded-lg">
            <div className="flex items-center gap-3">
              <FiCreditCard className="size-6 text-gray-400" />
              <div>
                <p className="text-sm">{paymentDetails.cardNumber}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Expires {paymentDetails.expiration}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="bordered"
              onClick={handleUpdatePayment}
              className="border-small"
            >
              Update
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="bordered"
            onClick={handleTogglePlanStatus}
            className="border-small"
          >
            {isActive ? "Change Plan" : "Activate Plan"}
          </Button>
          <Button size="sm" variant="bordered" className="border-small">
            Download Invoice
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default Billing;
