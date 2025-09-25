import {
  Button,
  Card,
  CardBody,
  CardHeader
} from "@heroui/react";
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
    <Card className="rounded-xl bg-white text-gray-900 shadow-none border border-gray-200">
      <CardHeader className="flex items-center gap-3 px-5 pt-5 pb-0">
        <FiCreditCard className="h-5 w-5 text-gray-700" />
        <p className="text-base">Billing & Subscription</p>
      </CardHeader>

      <CardBody className="p-5 space-y-6">
        {/* Current Plan */}
        <div className="space-y-1 bg-green-50 border border-green-200 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm">
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
          <p className="text-xs text-gray-600">{`$99/month • Up to 10 locations • Advanced analytics`}</p>
          <p className="text-xs text-gray-600">{`Next billing date: ${paymentDetails.nextBillingDate}`}</p>
        </div>

        {/* Payment Method */}
        <div className="space-y-4">
          <h4 className="text-sm">Payment Method</h4>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <FiCreditCard className="size-6 text-gray-400" />
              <div>
                <p className="text-sm">{paymentDetails.cardNumber}</p>
                <p className="text-xs text-gray-600">
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
