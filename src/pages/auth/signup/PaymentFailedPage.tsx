import React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Divider,
} from "@heroui/react";
import {
  FiAlertTriangle,
  FiRefreshCw,
  FiCreditCard,
  FiArrowLeft,
  FiMail,
  FiCheck,
} from "react-icons/fi";
import Logo from "../../../components/ui/Logo";
import AuthThemeToggle from "../../../components/common/AuthThemeToggle";
import { PaymentFailedState } from "./types";

export const PaymentFailedPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const stateData = location.state as PaymentFailedState | undefined;

  const rawError =
    stateData?.errorMessage ||
    searchParams.get("error") ||
    searchParams.get("message") ||
    searchParams.get("reason") ||
    "We were unable to process your payment card. Please verify your details or use a different payment method.";

  const lowerErr = rawError.toLowerCase();

  // Categorize error for guidance
  let errorTitle = "Payment Authorization Failed";
  let guidanceText = "The payment processor could not authorize the card details provided.";

  if (lowerErr.includes("insufficient") || lowerErr.includes("funds")) {
    errorTitle = "Insufficient Funds";
    guidanceText = "Your card account has insufficient funds to complete the authorization.";
  } else if (lowerErr.includes("decline") || lowerErr.includes("do_not_honor") || lowerErr.includes("blocked")) {
    errorTitle = "Card Declined";
    guidanceText = "Your bank or credit card company declined the transaction. Please check with your bank or try another card.";
  } else if (lowerErr.includes("expire") || lowerErr.includes("expiry")) {
    errorTitle = "Card Expired";
    guidanceText = "The expiration date provided has passed or is incorrect.";
  } else if (lowerErr.includes("cvc") || lowerErr.includes("cvv") || lowerErr.includes("security code")) {
    errorTitle = "Incorrect Security Code";
    guidanceText = "The 3-digit security code (CVC) on the back of your card was incorrect.";
  }

  const planName = stateData?.planName || searchParams.get("plan") || "Professional Plan";
  const userEmail = stateData?.userEmail || searchParams.get("email") || "";

  const handleRetryPayment = () => {
    navigate("/signup", {
      state: {
        step: 3,
        formData: stateData?.retryFormValues,
        planId: stateData?.planId,
      },
    });
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent(`Payment Assistance - ${planName}`);
    const body = encodeURIComponent(
      `Hello Support Team,\n\nI encountered a payment issue during signup.\n\nError: ${rawError}\nPlan: ${planName}\nEmail: ${userEmail}\n\nPlease help me complete my registration.`
    );
    window.location.href = `mailto:Support@practiceROI.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070C18] text-slate-900 dark:text-slate-100 flex flex-col items-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-2xl flex flex-col items-center relative mb-6">
        <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50">
          <AuthThemeToggle />
        </div>
        <div className="h-10 mb-3 flex items-center justify-center">
          <Logo style={{ height: "40px" }} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center">
          Payment Unsuccessful
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium text-center">
          Don't worry — your details are saved and no charge was processed.
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-6 animate-in fade-in duration-500">
        <Card className="bg-white dark:bg-[#0F172A] border border-rose-200 dark:border-rose-950/60 shadow-xl rounded-2xl overflow-hidden">
          <CardBody className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              

              <div className="flex-1 space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  We couldn't process your payment
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {guidanceText}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <div className="w-7 h-7 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                <FiAlertTriangle className="w-5 h-5 text-rose-500" />
              </div>
                  <Chip size="sm" color="danger" variant="flat" className="font-semibold text-xs">
                    
                    {errorTitle}
                  </Chip>
                  {stateData?.cardLast4 && (
                    <Chip size="sm" variant="bordered" className="text-xs font-mono">
                      Card ending in {stateData.cardLast4}
                    </Chip>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message Box */}
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300 font-mono">
              "{rawError}"
            </div>

            <Divider className="dark:bg-slate-800" />

            {/* Quick Suggestions */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Quick things to check:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Verify card number, MM/YY & CVC</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Ensure online transactions are enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Try a different credit or debit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Contact your bank for authorization</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Button
                color="primary"
                size="lg"
                className="w-full sm:flex-1 font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-md"
                onPress={handleRetryPayment}
                startContent={<FiRefreshCw className="w-4 h-4" />}
              >
                Try Payment Again
              </Button>

              <Button
                variant="flat"
                size="lg"
                className="w-full sm:w-auto font-semibold text-slate-700 dark:text-slate-300"
                onPress={handleContactSupport}
                startContent={<FiMail className="w-4 h-4" />}
              >
                Contact Support
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
          <button
            type="button"
            onClick={() => navigate("/signin")}
            className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors flex items-center gap-1.5"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            Return to Sign In
          </button>

          <button
            type="button"
            onClick={() => navigate("/support")}
            className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
          >
            Support Center
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
