import React, { useState } from "react";
import { Button, Card, CardBody, Input, Select, SelectItem, Checkbox } from "@heroui/react";
import { FiCreditCard, FiLock, FiCheck, FiTag, FiX } from "react-icons/fi";
import { StepPaymentProps } from "./types";
import { PlanData } from "../../../services/planFeature";

export const StepPayment: React.FC<StepPaymentProps> = ({
  selectedPlan,
  billingCycle,
  isUpgrade = false,
  onSubmitSignup,
  isSubmitting,
  cardNumber,
  setCardNumber,
  expiry,
  setExpiry,
  cvc,
  setCvc,
  country,
  setCountry,
  agreeToTerms,
  setAgreeToTerms,
  paymentErrors,
  setPaymentErrors,
  couponCode,
  setCouponCode,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  isApplyingCoupon,
  couponError,
  setCouponError,
}) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const luhnCheck = (num: string) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const getCardBrand = (num: string): string => {
    const clean = num.replace(/\D/g, "");
    if (/^4/.test(clean)) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(clean)) return "Mastercard";
    if (/^3[47]/.test(clean)) return "Amex";
    if (/^(6011|65|64[4-9])/.test(clean)) return "Discover";
    return "";
  };

  const cardBrand = getCardBrand(cardNumber);

  const validateCardNumber = (val: string, isBlur = false): string => {
    const clean = val.replace(/\D/g, "");
    if (!clean) {
      return isBlur ? "Card number is required" : "";
    }
    if (clean.length > 19) {
      return "Card number cannot exceed 19 digits";
    }
    if (clean.length >= 13 && !luhnCheck(clean)) {
      return "Invalid card number (failed checksum)";
    }
    if (isBlur && clean.length < 13) {
      return "Card number must be 13-19 digits";
    }
    return "";
  };

  const validateExpiry = (val: string, isBlur = false): string => {
    if (!val) {
      return isBlur ? "Expiration date is required" : "";
    }
    const clean = val.trim();
    if (clean.includes("/")) {
      const [mStr = "", yStr = ""] = clean.split("/");
      const month = parseInt(mStr, 10);
      if (mStr.length === 2 && (month < 1 || month > 12)) {
        return "Invalid month (01-12)";
      }
      if (clean.length === 5) {
        const year = parseInt(`20${yStr}`, 10);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
          return "Card has expired";
        }
      } else if (isBlur && clean.length < 5) {
        return "Invalid date format (MM/YY)";
      }
    } else if (isBlur) {
      return "Invalid date format (MM/YY)";
    }
    return "";
  };

  const validateCvc = (val: string, isBlur = false): string => {
    const clean = val.replace(/\D/g, "");
    if (!clean) {
      return isBlur ? "Security code is required" : "";
    }
    if (isBlur && clean.length < 3) {
      return "Security code must be 3 or 4 digits";
    }
    if (clean.length > 4) {
      return "Security code cannot exceed 4 digits";
    }
    return "";
  };

  const updateFieldError = (field: string, errorMsg: string) => {
    if (setPaymentErrors) {
      setPaymentErrors((prev) => {
        if (!errorMsg) {
          if (!prev[field]) return prev;
          const next = { ...prev };
          delete next[field];
          return next;
        }
        return { ...prev, [field]: errorMsg };
      });
    }
  };

  const handleCardNumberChange = (val: string) => {
    const clean = val.replace(/\D/g, "").substring(0, 19);
    const formatted = clean.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    setCardNumber(formatted);
    const err = validateCardNumber(formatted, !!touched.cardNumber);
    updateFieldError("cardNumber", err);
  };

  const handleCardNumberBlur = () => {
    setTouched((prev) => ({ ...prev, cardNumber: true }));
    const err = validateCardNumber(cardNumber, true);
    updateFieldError("cardNumber", err);
  };

  const handleExpiryChange = (val: string) => {
    const clean = val.replace(/\D/g, "").substring(0, 4);
    let formatted = clean;
    if (clean.length > 2) {
      formatted = `${clean.substring(0, 2)}/${clean.substring(2)}`;
    }
    setExpiry(formatted);
    const err = validateExpiry(formatted, !!touched.expiry);
    updateFieldError("expiry", err);
  };

  const handleExpiryBlur = () => {
    setTouched((prev) => ({ ...prev, expiry: true }));
    const err = validateExpiry(expiry, true);
    updateFieldError("expiry", err);
  };

  const handleCvcChange = (val: string) => {
    const clean = val.replace(/\D/g, "").substring(0, 4);
    setCvc(clean);
    const err = validateCvc(clean, !!touched.cvc);
    updateFieldError("cvc", err);
  };

  const handleCvcBlur = () => {
    setTouched((prev) => ({ ...prev, cvc: true }));
    const err = validateCvc(cvc, true);
    updateFieldError("cvc", err);
  };

  const handleAgreeChange = (val: boolean) => {
    setAgreeToTerms(val);
    setTouched((prev) => ({ ...prev, terms: true }));
    if (!val) {
      updateFieldError("terms", "You must agree to the Terms of Service and Privacy Policy");
    } else {
      updateFieldError("terms", "");
    }
  };

  const calcDisplayPrice = (plan: PlanData | null): { totalCharged: number; perMonth: number } => {
    if (!plan) return { totalCharged: 0, perMonth: 0 };
    const mPrice = plan.monthlyPricing?.price ?? plan.price ?? 0;
    const aPrice = plan.annualPricing?.price ?? plan.annualPrice;
    const aDiscount = plan.annualPricing?.discountPercent ?? plan.discountPercent ?? 0;
    const aTotal = plan.annualPricing?.totalValue;

    if (billingCycle === "annual") {
      const perMonth =
        aPrice !== undefined && aPrice !== null && Number(aPrice) > 0
          ? Number(aPrice)
          : aDiscount > 0 && mPrice > 0
          ? Math.round(mPrice * (1 - aDiscount / 100))
          : mPrice;
      const totalCharged = aTotal && aTotal > 0 ? aTotal : perMonth * 12;
      return { totalCharged, perMonth };
    }
    return { totalCharged: mPrice, perMonth: mPrice };
  };

  const { totalCharged: basePrice, perMonth: monthlyEquivalent } = calcDisplayPrice(selectedPlan);
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      discountAmount = (basePrice * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === "fixed") {
      discountAmount = Math.min(basePrice, appliedCoupon.value);
    }
  }
  const finalPrice = Math.max(0, basePrice - discountAmount);

  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 14);
  const formattedTrialEndDate = trialEndDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 flex flex-col gap-6">
        <Card className="shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] rounded-2xl p-6">
          <h2 className="text-lg font-bold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
            <FiCreditCard className="w-5 h-5 text-sky-500" />
            Payment Information
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Card number</label>
                {cardBrand && (
                  <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                    {cardBrand}
                  </span>
                )}
              </div>
              <Input
                type="text"
                placeholder="1234 1234 1234 1234"
                variant="bordered"
                value={cardNumber}
                onValueChange={handleCardNumberChange}
                onBlur={handleCardNumberBlur}
                isInvalid={!!paymentErrors.cardNumber}
                startContent={<FiCreditCard className="w-4 h-4 text-slate-400 mr-1" />}
                classNames={{
                  inputWrapper: `border ${
                    paymentErrors.cardNumber
                      ? "!border-red-500 dark:!border-red-500"
                      : cardNumber
                      ? "border-[#20a9f8]"
                      : "border-slate-300 dark:border-slate-700"
                  } bg-[#f8fafc] dark:bg-slate-900/50 h-11 rounded-xl group-data-[hover=true]:border-slate-400 hover:border-slate-400 ${
                    paymentErrors.cardNumber
                      ? "group-data-[focus=true]:!border-red-500 focus-within:!border-red-500"
                      : "group-data-[focus=true]:border-[#20a9f8] focus-within:border-[#20a9f8]"
                  } transition-colors`,
                  input: "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-medium text-sm",
                }}
              />
              {paymentErrors.cardNumber && (
                <span className="text-danger text-xs mt-1 block font-medium">{paymentErrors.cardNumber}</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Expiration date</label>
                <Input
                  type="text"
                  placeholder="MM / YY"
                  variant="bordered"
                  value={expiry}
                  onValueChange={handleExpiryChange}
                  onBlur={handleExpiryBlur}
                  isInvalid={!!paymentErrors.expiry}
                  classNames={{
                    inputWrapper: `border ${
                      paymentErrors.expiry
                        ? "!border-red-500 dark:!border-red-500"
                        : expiry
                        ? "border-[#20a9f8]"
                        : "border-slate-300 dark:border-slate-700"
                    } bg-[#f8fafc] dark:bg-slate-900/50 h-11 rounded-xl group-data-[hover=true]:border-slate-400 hover:border-slate-400 ${
                      paymentErrors.expiry
                        ? "group-data-[focus=true]:!border-red-500 focus-within:!border-red-500"
                        : "group-data-[focus=true]:border-[#20a9f8] focus-within:border-[#20a9f8]"
                    } transition-colors`,
                    input: "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-medium text-sm",
                  }}
                />
                {paymentErrors.expiry && (
                  <span className="text-danger text-xs mt-1 block font-medium">{paymentErrors.expiry}</span>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Security code</label>
                <Input
                  type="text"
                  placeholder="CVC (3-4 digits)"
                  variant="bordered"
                  value={cvc}
                  onValueChange={handleCvcChange}
                  onBlur={handleCvcBlur}
                  isInvalid={!!paymentErrors.cvc}
                  classNames={{
                    inputWrapper: `border ${
                      paymentErrors.cvc
                        ? "!border-red-500 dark:!border-red-500"
                        : cvc
                        ? "border-[#20a9f8]"
                        : "border-slate-300 dark:border-slate-700"
                    } bg-[#f8fafc] dark:bg-slate-900/50 h-11 rounded-xl group-data-[hover=true]:border-slate-400 hover:border-slate-400 ${
                      paymentErrors.cvc
                        ? "group-data-[focus=true]:!border-red-500 focus-within:!border-red-500"
                        : "group-data-[focus=true]:border-[#20a9f8] focus-within:border-[#20a9f8]"
                    } transition-colors`,
                    input: "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-medium text-sm",
                  }}
                />
                {paymentErrors.cvc && (
                  <span className="text-danger text-xs mt-1 block font-medium">{paymentErrors.cvc}</span>
                )}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Country</label>
              <Select
                selectedKeys={[country]}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0] as string;
                  setCountry(val);
                }}
                variant="bordered"
                aria-label="Select Country"
                disableAnimation
                popoverProps={{
                  disableAnimation: true,
                  shouldCloseOnScroll: false,
                  classNames: {
                    content: "p-0 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-2xl rounded-xl",
                  },
                }}
                listboxProps={{
                  itemClasses: {
                    base: [
                      "rounded-lg",
                      "text-slate-700 dark:text-slate-200",
                      "transition-colors",
                      "data-[hover=true]:text-slate-900 dark:data-[hover=true]:text-white",
                      "data-[hover=true]:bg-slate-100 dark:data-[hover=true]:bg-slate-800",
                      "data-[selectable=true]:focus:bg-slate-100 dark:data-[selectable=true]:focus:bg-slate-800",
                      "data-[selected=true]:font-semibold",
                      "data-[selected=true]:text-[#02A6F6] dark:data-[selected=true]:text-[#02A6F6]",
                      "data-[selected=true]:bg-sky-50 dark:data-[selected=true]:bg-sky-950/40",
                    ],
                  },
                }}
                classNames={{
                  trigger: "border border-slate-300 dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-900/50 data-[hover=true]:bg-[#f8fafc] group-data-[hover=true]:bg-[#f8fafc] hover:bg-[#f8fafc] h-11 min-h-11 rounded-xl group-data-[hover=true]:border-slate-400 hover:border-slate-400 group-data-[focus=true]:border-[#20a9f8] transition-colors",
                  value: "text-slate-900 dark:text-slate-100 font-medium text-sm",
                }}
              >
                <SelectItem key="India" textValue="India">India</SelectItem>
                <SelectItem key="United States" textValue="United States">United States</SelectItem>
                <SelectItem key="Canada" textValue="Canada">Canada</SelectItem>
                <SelectItem key="United Kingdom" textValue="United Kingdom">United Kingdom</SelectItem>
                <SelectItem key="Australia" textValue="Australia">Australia</SelectItem>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5 border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FiTag className="w-3.5 h-3.5 text-sky-500" />
                  Promo / Coupon Code
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Optional</span>
              </label>

              {!appliedCoupon ? (
                <div className="flex flex-col gap-1.5">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onValueChange={(val) => {
                        setCouponCode(val.toUpperCase());
                        if (couponError) setCouponError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          onApplyCoupon();
                        }
                      }}
                      variant="bordered"
                      isInvalid={!!couponError}
                      classNames={{
                        inputWrapper: "border border-slate-300 dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-900/50 data-[hover=true]:bg-[#f8fafc] group-data-[hover=true]:bg-[#f8fafc] hover:bg-[#f8fafc] h-11 min-h-11 rounded-xl group-data-[hover=true]:border-slate-400 hover:border-slate-400 group-data-[focus=true]:border-[#20a9f8] focus-within:border-[#20a9f8] transition-colors",
                        input: "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-semibold uppercase tracking-wider text-xs",
                      }}
                      className="flex-1"
                    />
                    <Button
                      color="primary"
                      onPress={() => onApplyCoupon()}
                      isLoading={isApplyingCoupon}
                      isDisabled={!couponCode.trim() || isApplyingCoupon}
                      className="bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl h-11 px-5 text-xs shrink-0"
                    >
                      Apply
                    </Button>
                  </div>
                  {couponError && (
                    <span className="text-danger text-xs font-medium leading-tight mt-0.5">{couponError}</span>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/60 dark:bg-emerald-950/20">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                      <FiCheck className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-emerald-800 dark:text-emerald-300 tracking-wider">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-[10px] font-semibold bg-emerald-200/70 dark:bg-emerald-800/50 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full">
                          {appliedCoupon.type === "percent" ? `${appliedCoupon.value}% OFF` : `$${appliedCoupon.value} OFF`}
                        </span>
                      </div>
                      {appliedCoupon.title && (
                        <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 truncate">
                          {appliedCoupon.title}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={onRemoveCoupon}
                    aria-label="Remove Coupon"
                    className="text-slate-400 hover:text-danger hover:bg-danger-50 dark:hover:bg-danger-950/30 rounded-lg min-w-8 w-8 h-8"
                  >
                    <FiX className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
        <Card className="shadow-none border border-sky-200 dark:border-sky-500/20 bg-sky-50/50 dark:bg-sky-950/10 rounded-2xl p-4">
          <CardBody className="p-0 flex flex-row gap-3.5 items-start">
            <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 flex-shrink-0">
              <FiLock className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h4 className="text-sm font-bold text-sky-900 dark:text-sky-400">Secure Payment</h4>
              <p className="text-xs text-sky-700/80 dark:text-sky-400/80 leading-relaxed">
                Your payment information is encrypted and secure. We never store your full credit card details.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="flex flex-col gap-6">
        <Card className="shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] rounded-2xl p-6">
          <h2 className="text-lg font-bold border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">Order Summary</h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-slate-500">Selected Plan</span>
              <span>{selectedPlan?.name || "Professional"}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-slate-500">Billing Cycle</span>
              <span className="capitalize">{billingCycle}</span>
            </div>

            <div className="flex justify-between items-center text-sm font-semibold border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-slate-500">Plan Rate</span>
              <div className="flex items-center gap-1.5">
                {appliedCoupon && (
                  <span className="text-xs text-slate-400 line-through font-normal">
                    ${basePrice}
                  </span>
                )}
                <span>${finalPrice.toFixed(finalPrice % 1 !== 0 ? 2 : 0)} / {billingCycle === "annual" ? "year" : "month"}</span>
              </div>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between items-center text-sm font-bold text-emerald-600 dark:text-emerald-400">
                <span className="flex items-center gap-1">
                  Discount ({appliedCoupon.code})
                </span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-base font-extrabold pt-1">
              <div>
                <span className="block text-slate-900 dark:text-white">Total Due Today</span>
                <span className="text-[11px] text-slate-400 font-normal block">
                  {isUpgrade
                    ? `Immediate activation (${billingCycle === "annual" ? "Billed annually" : "Billed monthly"})`
                    : `First charge on ${formattedTrialEndDate}, $${finalPrice.toFixed(finalPrice % 1 !== 0 ? 2 : 0)}`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {isUpgrade ? `$${finalPrice.toFixed(finalPrice % 1 !== 0 ? 2 : 0)}` : "$0.00"}
                </span>
              </div>
            </div>

            {isUpgrade ? (
              <div className="border border-sky-200 dark:border-sky-900/40 bg-sky-50/50 dark:bg-sky-950/20 rounded-xl p-4 mt-2 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400 font-bold text-xs">
                  <FiCheck className="w-4 h-4" />
                  <span>Instant Plan Activation</span>
                </div>
                <p className="text-[11px] text-sky-700/90 dark:text-sky-400/90 leading-relaxed font-medium">
                  Your new plan features will be activated immediately upon confirmation.
                </p>
              </div>
            ) : (
              <div className="border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-xl p-4 mt-2 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                  <FiCheck className="w-4 h-4" />
                  <span>14-Day Free Trial (Ends {formattedTrialEndDate})</span>
                </div>
                <p className="text-[11px] text-emerald-700/90 dark:text-emerald-400/90 leading-relaxed font-medium">
                  You won't be charged until your trial ends on <strong>{formattedTrialEndDate}</strong>. Cancel anytime before then at no cost.
                </p>
              </div>
            )}
            <div className="pt-2">
              <Checkbox
                isSelected={agreeToTerms}
                onValueChange={handleAgreeChange}
                isInvalid={!!paymentErrors.terms}
                classNames={{
                  label: `text-xs ${paymentErrors.terms ? "text-danger" : "text-slate-600 dark:text-slate-400"}`,
                }}
              >
                I agree to the Terms of Service and Privacy Policy
              </Checkbox>
              {paymentErrors.terms && (
                <span className="text-danger text-xs mt-1 block font-medium">{paymentErrors.terms}</span>
              )}
            </div>
            <Button
              color="primary"
              onPress={onSubmitSignup}
              isLoading={isSubmitting}
              className="w-full font-bold h-11 rounded-xl mt-4 text-sm bg-sky-500 hover:bg-sky-600 text-white"
            >
              {isSubmitting ? "Processing..." : (isUpgrade ? "Confirm & Upgrade Plan" : "Complete Sign Up")}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};