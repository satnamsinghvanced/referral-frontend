import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Divider,
} from "@heroui/react";
import {
  FiCheckCircle,
  FiArrowRight,
  FiMail,
  FiCreditCard,
} from "react-icons/fi";
import { SignupHeader } from "./SignupHeader";
import { SignupConfirmationData } from "./types";
import { RootState } from "../../../store";

export const ThankYouPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authUser = useSelector((state: RootState) => (state.auth as any)?.user);

  const stateData = location.state as SignupConfirmationData | undefined;

  const [confirmationData] = useState<SignupConfirmationData>(() => {
    if (stateData && stateData.planName) {
      try {
        sessionStorage.setItem("practice_roi_last_signup", JSON.stringify(stateData));
      } catch (_) { }
      return stateData;
    }

    try {
      const cached = sessionStorage.getItem("practice_roi_last_signup");
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (_) { }

    return {
      planName: "Professional Plan",
      billingCycle: "monthly",
      price: 199,
      trialDays: 14,
      cardLast4: "4242",
      cardBrand: "Visa",
      orderId: `PROI-${Math.floor(100000 + Math.random() * 900000)}`,
      transactionDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      nextBillingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      user: {
        firstName: authUser?.firstName || "Doctor",
        lastName: authUser?.lastName || "",
        email: authUser?.email || "practice@example.com",
        practiceName: authUser?.practiceName || "Your Practice",
      },
    };
  });

  const handleGoToDashboard = () => {
    navigate("/");
  };

  const userName = confirmationData.user?.firstName || "there";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070C18] text-slate-900 dark:text-slate-100 flex flex-col items-center py-8 px-4 sm:px-6">
      <SignupHeader
        currentStep={3}
        showThemeToggle={true}
        hideStepper={false}
        title={
          <>
            Welcome to <span className="text-[#20a9f8] dark:text-sky-400">Practice ROI!</span>
          </>
        }
        subtitle="Your payment details were confirmed and your workspace is ready."
      />

      <div className="w-full max-w-2xl space-y-6 animate-in fade-in duration-500">
        <Card className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden">
          <CardBody className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col items-center text-center gap-3">


              <div className="space-y-1.5 flex flex-col items-center">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white text-center">
                  Congratulations, {userName}!
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <div className="w-7 h-7 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <FiCheckCircle className="w-7 h-7 text-emerald-500" />
                  </div>
                  <Chip size="sm" color="success" variant="flat" className="font-semibold text-xs">
                    Payment Confirmed
                  </Chip>
                  {confirmationData.trialDays ? (
                    <Chip size="sm" variant="bordered" className="text-xs font-medium">
                      {confirmationData.trialDays}-Day Free Trial
                    </Chip>
                  ) : null}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 text-center">
                  Your subscription to the <span className="font-semibold text-slate-900 dark:text-white">{confirmationData.planName}</span> is now active.
                </p>
              </div>
            </div>

            <Divider className="dark:bg-slate-800" />

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Selected Plan</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {confirmationData.planName} ({confirmationData.billingCycle})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Today's Total</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {confirmationData.trialDays ? "$0.00 (Free Trial)" : `$${confirmationData.price}`}
                </span>
              </div>

              {confirmationData.trialDays ? (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">First Charge</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    ${confirmationData.price} on {confirmationData.nextBillingDate}
                  </span>
                </div>
              ) : null}

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Payment Method</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FiCreditCard className="w-3.5 h-3.5 text-sky-500" />
                  {confirmationData.cardBrand || "Card"} ending in {confirmationData.cardLast4 || "••••"}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 flex items-center gap-2.5 text-xs text-sky-800 dark:text-sky-300">
              <FiMail className="w-4 h-4 shrink-0 text-sky-600 dark:text-sky-400" />
              <span>
                A confirmation details have been sent to{" "}
                <span className="font-semibold">{confirmationData.user?.email}</span>.
              </span>
            </div>
            <div className="pt-2 flex justify-center">
              <Button
                color="secondary"
                size="md"
                className="font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-md"
                onPress={handleGoToDashboard}
                endContent={<FiArrowRight className="w-4 h-4" />}
              >
                Sign In
              </Button>
            </div>
          </CardBody>
        </Card>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Need help with your account?{" "}
          <button
            type="button"
            onClick={() => navigate("/support")}
            className="text-sky-500 hover:underline font-medium"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
