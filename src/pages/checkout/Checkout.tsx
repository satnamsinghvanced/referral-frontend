import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Card, CardBody, Input, Select, SelectItem, addToast } from "@heroui/react";
import { FiCreditCard, FiLock, FiCheck } from "react-icons/fi";
import Logo from "../../components/ui/Logo";
import axios from "../../services/axios";

interface PlanDetails {
  id: string;
  name: string;
  price: number;
  highlight: string;
}

const PLAN_PRESETS: Record<string, PlanDetails> = {
  starter: { id: "starter", name: "Starter", price: 199, highlight: "Basic referral tracking" },
  professional: { id: "professional", name: "Professional", price: 399, highlight: "Advanced analytics" },
  enterprise: { id: "enterprise", name: "Enterprise", price: 799, highlight: "API & Custom access" },
};

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const planParam = (searchParams.get("plan") || "professional").toLowerCase();
  const activePlan = (PLAN_PRESETS[planParam] || PLAN_PRESETS.professional) as PlanDetails;

  const typeParam = searchParams.get("type");
  const amountParam = parseFloat(searchParams.get("amount") || "0");
  const packageParam = searchParams.get("package") || "none";

  const packageCost =
    packageParam === "500"
      ? 15
      : packageParam === "1000"
        ? 25
        : packageParam === "2500"
          ? 50
          : 0;

  const totalCost = typeParam === "twilio_credits" ? amountParam + packageCost : activePlan.price;

  // Form states
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [country, setCountry] = useState("India");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Detect card brand based on starting digit
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\D/g, "");
    if (clean.startsWith("4")) return "visa";
    if (clean.startsWith("5")) return "mastercard";
    if (clean.startsWith("3")) return "amex";
    if (clean.startsWith("6")) return "discover";
    return null;
  };

  const cardBrand = getCardBrand(cardNumber);

  // Card number input formatter (adds spaces every 4 digits)
  const handleCardNumberChange = (val: string) => {
    const clean = val.replace(/\D/g, "").substring(0, 16);
    const formatted = clean.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    setCardNumber(formatted);
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: "" }));
    }
  };

  // Expiry date input formatter (adds slash: MM/YY)
  const handleExpiryChange = (val: string) => {
    const clean = val.replace(/\D/g, "").substring(0, 4);
    let formatted = clean;
    if (clean.length > 2) {
      formatted = `${clean.substring(0, 2)}/${clean.substring(2)}`;
    }
    setExpiry(formatted);
    if (errors.expiry) {
      setErrors((prev) => ({ ...prev, expiry: "" }));
    }
  };

  // CVC input change handler
  const handleCvcChange = (val: string) => {
    const clean = val.replace(/\D/g, "").substring(0, 4);
    setCvc(clean);
    if (errors.cvc) {
      setErrors((prev) => ({ ...prev, cvc: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const cleanCard = cardNumber.replace(/\s/g, "");

    if (cleanCard.length < 13 || cleanCard.length > 16) {
      newErrors.cardNumber = "Invalid card number (must be 13-16 digits)";
    }
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry)) {
      newErrors.expiry = "Invalid date (MM/YY)";
    }
    if (cvc.length < 3 || cvc.length > 4) {
      newErrors.cvc = "Invalid CVC (3-4 digits)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      if (typeParam === "twilio_credits") {
        await axios.post("/twilio-checkout/mock-credits-payment", {
          amount: amountParam,
          packageName: packageParam,
          cardNumber,
          expire: expiry,
          cvc,
        });

        addToast({
          title: "Credits Added",
          description: `Successfully added $${amountParam} credits to your Twilio account!`,
          color: "success",
        });

        queryClient.invalidateQueries({ queryKey: ["twilio"] });

        if (window.opener) {
          window.opener.postMessage({ type: "STRIPE_SUCCESS" }, "*");
          window.close();
        } else {
          navigate("/settings/billing");
        }
      } else {
        await axios.post("/twilio-checkout/subscribe-plan", {
          planId: activePlan.id,
          cardNumber,
          expire: expiry,
          cvc,
        });

        addToast({
          title: "Subscription Activated",
          description: `Successfully signed up for the ${activePlan.name} Plan!`,
          color: "success",
        });

        queryClient.invalidateQueries({ queryKey: ["billing"] });

        navigate("/settings/billing");
      }
    } catch (err: any) {
      console.error(err);
      addToast({
        title: "Checkout Failed",
        description: err.response?.data?.message || err.message || "Failed to complete checkout",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (typeParam === "twilio_credits" && window.opener) {
      window.opener.postMessage({ type: "STRIPE_CANCEL" }, "*");
      window.close();
    } else {
      navigate("/settings/billing");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 dark:bg-default-50 text-foreground py-10 px-4">
      {/* logo */}
      <div className="h-10 mb-4 flex items-center justify-center">
        <Logo style={{ height: "40px" }} />
      </div>

      {/* header title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center tracking-tight">
        {typeParam === "twilio_credits" ? (
          <>Add <span className="text-blue-600">Twilio Credits</span></>
        ) : (
          <>Start Your <span className="text-blue-600">14-Day Free Trial</span></>
        )}
      </h1>
      <p className="text-sm text-default-500 mt-2 text-center">
        {typeParam === "twilio_credits"
          ? "Complete your payment details to add credits and minutes immediately."
          : "Choose your plan and get started in minutes. Cancel anytime."}
      </p>

      {/* stepper progress indicator (only show for plans) */}
      {typeParam !== "twilio_credits" && (
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 mb-10 select-none flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-semibold">
              ✓
            </div>
            <span className="text-xs font-semibold text-default-500">Choose Plan</span>
          </div>
          <div className="w-8 sm:w-12 h-[2px] bg-emerald-500" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-semibold">
              ✓
            </div>
            <span className="text-xs font-semibold text-default-500">Your Details</span>
          </div>
          <div className="w-8 sm:w-12 h-[2px] bg-blue-600" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
              3
            </div>
            <span className="text-xs font-bold text-foreground">Payment</span>
          </div>
        </div>
      )}

      {/* main content columns */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        {/* left columns (2/3 width) - payment forms */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card className="shadow-none border border-foreground/10 bg-background rounded-2xl p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b border-foreground/5 pb-3.5 mb-5">
              <FiCreditCard className="w-5 h-5 text-blue-500" />
              Payment Information
            </h2>

            <div className="flex flex-col gap-4">
              {/* Card number */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-xs font-semibold text-default-600">Card number</label>
                <Input
                  type="text"
                  placeholder="1234 1234 1234 1234"
                  value={cardNumber}
                  onValueChange={handleCardNumberChange}
                  isInvalid={!!errors.cardNumber}
                  errorMessage={errors.cardNumber}
                  startContent={<FiCreditCard className="w-4 h-4 text-default-400 mr-1" />}
                  endContent={
                    <div className="flex items-center gap-1 opacity-70">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border border-foreground/20 uppercase ${cardBrand === "visa" ? "bg-blue-600 text-white border-blue-600" : "bg-transparent text-default-400"}`}>Visa</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border border-foreground/20 uppercase ${cardBrand === "mastercard" ? "bg-amber-600 text-white border-amber-600" : "bg-transparent text-default-400"}`}>MC</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border border-foreground/20 uppercase ${cardBrand === "amex" ? "bg-cyan-600 text-white border-cyan-600" : "bg-transparent text-default-400"}`}>Amex</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border border-foreground/20 uppercase ${cardBrand === "discover" ? "bg-orange-600 text-white border-orange-600" : "bg-transparent text-default-400"}`}>Disc</span>
                    </div>
                  }
                  classNames={{
                    inputWrapper: "border border-foreground/10 rounded-xl bg-transparent h-11",
                    input: "text-sm font-medium",
                  }}
                />
              </div>

              {/* Exp and CVC row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-default-600">Expiration date</label>
                  <Input
                    type="text"
                    placeholder="MM / YY"
                    value={expiry}
                    onValueChange={handleExpiryChange}
                    isInvalid={!!errors.expiry}
                    errorMessage={errors.expiry}
                    classNames={{
                      inputWrapper: "border border-foreground/10 rounded-xl bg-transparent h-11",
                      input: "text-sm font-medium",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-default-600">Security code</label>
                  <Input
                    type="text"
                    placeholder="CVC"
                    value={cvc}
                    onValueChange={handleCvcChange}
                    isInvalid={!!errors.cvc}
                    errorMessage={errors.cvc}
                    endContent={<span className="text-[10px] text-default-400 border border-foreground/20 px-1 rounded">123</span>}
                    classNames={{
                      inputWrapper: "border border-foreground/10 rounded-xl bg-transparent h-11",
                      input: "text-sm font-medium",
                    }}
                  />
                </div>
              </div>

              {/* Country dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-default-600">Country</label>
                <Select
                  selectedKeys={[country]}
                  onSelectionChange={(keys) => {
                    const val = Array.from(keys)[0] as string;
                    setCountry(val);
                  }}
                  variant="bordered"
                  aria-label="Select Country"
                  classNames={{
                    trigger: "border border-foreground/10 rounded-xl bg-transparent h-11 min-h-11",
                    value: "text-sm font-medium text-foreground",
                  }}
                >
                  <SelectItem key="India" textValue="India">India</SelectItem>
                  <SelectItem key="United States" textValue="United States">United States</SelectItem>
                  <SelectItem key="Canada" textValue="Canada">Canada</SelectItem>
                  <SelectItem key="United Kingdom" textValue="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem key="Australia" textValue="Australia">Australia</SelectItem>
                </Select>
              </div>

              {/* Consent text */}
              <p className="text-[11px] text-default-500 leading-relaxed mt-1">
                By providing your card information, you allow Orthodontic Revolution to charge your card for future payments in accordance with their terms.
              </p>
            </div>
          </Card>

          {/* Secure details card */}
          <Card className="shadow-none border border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/10 rounded-2xl p-4">
            <CardBody className="p-0 flex flex-row gap-3.5 items-start">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                <FiLock className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-400">Secure Payment</h4>
                <p className="text-xs text-blue-700/80 dark:text-blue-400/80 leading-relaxed">
                  Your payment information is encrypted and secure. We never store your full credit card details.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* right column (1/3 width) - order summary */}
        <div className="flex flex-col gap-6">
          <Card className="shadow-none border border-foreground/10 bg-background rounded-2xl p-6">
            <h2 className="text-lg font-bold border-b border-foreground/5 pb-3.5 mb-5">Order Summary</h2>

            <div className="flex flex-col gap-4">
              {typeParam === "twilio_credits" ? (
                <>
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-default-500">Credits</span>
                    <span>${amountParam.toFixed(2)}</span>
                  </div>
                  {packageParam !== "none" && (
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-default-500">{packageParam} Min Package</span>
                      <span>${packageCost.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm font-semibold border-b border-foreground/5 pb-4">
                    <span className="text-default-500">Billing Type</span>
                    <span>One-time + Monthly Package</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-default-500">Plan</span>
                    <span>{activePlan.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold border-b border-foreground/5 pb-4">
                    <span className="text-default-500">Billing</span>
                    <span>Monthly</span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center text-base font-extrabold pt-2">
                <span>Total</span>
                <span>${totalCost.toFixed(2)}</span>
              </div>

              {/* Free Trial block / credit instant message */}
              {typeParam === "twilio_credits" ? (
                <div className="border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-xl p-4 mt-2 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                    <FiCheck className="w-4 h-4" />
                    <span>Instant Credit Top-up</span>
                  </div>
                  <p className="text-[11px] text-emerald-700/90 dark:text-emerald-400/90 leading-relaxed font-medium">
                    Credits and package minutes will be added to your account instantly.
                  </p>
                </div>
              ) : (
                <div className="border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-xl p-4 mt-2 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                    <FiCheck className="w-4 h-4" />
                    <span>14-Day Free Trial</span>
                  </div>
                  <p className="text-[11px] text-emerald-700/90 dark:text-emerald-400/90 leading-relaxed font-medium">
                    You won't be charged until your trial ends. Cancel anytime before then at no cost.
                  </p>
                </div>
              )}

              {/* Confidence badges */}
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-default-600">
                  <FiCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{typeParam === "twilio_credits" ? "Instant activation" : "Cancel anytime"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-default-600">
                  <FiCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Secure transactions</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-default-600">
                  <FiCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>HIPAA compliant</span>
                </div>
              </div>

              {/* Complete sign up / payment button */}
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={isSubmitting}
                className="w-full bg-blue-600 text-white font-bold h-11 rounded-xl mt-4 text-sm"
              >
                {typeParam === "twilio_credits" ? `Pay $${totalCost.toFixed(2)}` : "Complete Sign Up"}
              </Button>

              {/* Cancel button */}
              <Button
                variant="light"
                onPress={handleCancel}
                className="w-full text-default-500 font-semibold h-11 rounded-xl text-sm"
              >
                Cancel Checkout
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
