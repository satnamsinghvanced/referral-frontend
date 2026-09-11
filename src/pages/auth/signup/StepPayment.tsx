import React from "react";
import { Button, Card, CardBody, Input, Select, SelectItem, Checkbox } from "@heroui/react";
import { FiCreditCard, FiLock, FiCheck, FiTag, FiX } from "react-icons/fi";
import { StepPaymentProps } from "./types";
import { PlanData } from "../../../services/planFeature";

export const StepPayment: React.FC<StepPaymentProps> = ({
  selectedPlan,
  billingCycle,
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
  couponCode,
  setCouponCode,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  isApplyingCoupon,
  couponError,
  setCouponError,
}) => {
  const calcDisplayPrice = (plan: PlanData | null): number => {
    if (!plan) return 399;
    const mPrice = plan.monthlyPricing?.price ?? plan.price ?? 0;
    const aPrice = plan.annualPricing?.price ?? plan.annualPrice;
    const aDiscount = plan.annualPricing?.discountPercent ?? plan.discountPercent;

    if (billingCycle === "annual") {
      if (aPrice) return aPrice;
      if (aDiscount && aDiscount > 0 && mPrice > 0) {
        return Math.round(mPrice * (1 - aDiscount / 100));
      }
    }
    return mPrice;
  };

  const basePrice = calcDisplayPrice(selectedPlan);
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      discountAmount = (basePrice * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === "fixed") {
      discountAmount = Math.min(basePrice, appliedCoupon.value);
    }
  }
  const finalPrice = Math.max(0, basePrice - discountAmount);

  const handleCardNumberChange = (val: string) => {
    const clean = val.replace(/\D/g, "").substring(0, 16);
    const formatted = clean.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    setCardNumber(formatted);
  };
  const handleExpiryChange = (val: string) => {
    const clean = val.replace(/\D/g, "").substring(0, 4);
    let formatted = clean;
    if (clean.length > 2) {
      formatted = `${clean.substring(0, 2)}/${clean.substring(2)}`;
    }
    setExpiry(formatted);
  };
  const handleCvcChange = (val: string) => {
    const clean = val.replace(/\D/g, "").substring(0, 3);
    setCvc(clean);
  };
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
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Card number</label>
              <Input
                type="text"
                placeholder="1234 1234 1234 1234"
                variant="bordered"
                value={cardNumber}
                onValueChange={handleCardNumberChange}
                isInvalid={!!paymentErrors.cardNumber}
                startContent={<FiCreditCard className="w-4 h-4 text-slate-400 mr-1" />}
                classNames={{
                  inputWrapper: "border border-slate-300 dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-900/50 data-[hover=true]:bg-[#f8fafc] group-data-[hover=true]:bg-[#f8fafc] hover:bg-[#f8fafc] h-11 rounded-xl group-data-[hover=true]:border-slate-400 hover:border-slate-400 group-data-[focus=true]:border-[#20a9f8] focus-within:border-[#20a9f8] transition-colors",
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
                  isInvalid={!!paymentErrors.expiry}
                  classNames={{
                    inputWrapper: "border border-slate-300 dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-900/50 data-[hover=true]:bg-[#f8fafc] group-data-[hover=true]:bg-[#f8fafc] hover:bg-[#f8fafc] h-11 rounded-xl group-data-[hover=true]:border-slate-400 hover:border-slate-400 group-data-[focus=true]:border-[#20a9f8] focus-within:border-[#20a9f8] transition-colors",
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
                  placeholder="CVC"
                  variant="bordered"
                  value={cvc}
                  onValueChange={handleCvcChange}
                  isInvalid={!!paymentErrors.cvc}
                  classNames={{
                    inputWrapper: "border border-slate-300 dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-900/50 data-[hover=true]:bg-[#f8fafc] group-data-[hover=true]:bg-[#f8fafc] hover:bg-[#f8fafc] h-11 rounded-xl group-data-[hover=true]:border-slate-400 hover:border-slate-400 group-data-[focus=true]:border-[#20a9f8] focus-within:border-[#20a9f8] transition-colors",
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
            <div className="flex justify-between items-center text-sm font-semibold border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-slate-500">Billing Cycle</span>
              <span className="capitalize">{billingCycle}</span>
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
              <span>Total Due Today</span>
              <div className="flex items-center gap-2">
                {appliedCoupon && (
                  <span className="text-xs text-slate-400 line-through font-normal">
                    ${basePrice}
                  </span>
                )}
                <span className={appliedCoupon ? "text-emerald-600 dark:text-emerald-400" : ""}>
                  ${finalPrice.toFixed(finalPrice % 1 !== 0 ? 2 : 0)}
                </span>
              </div>
            </div>

            <div className="border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-xl p-4 mt-2 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                <FiCheck className="w-4 h-4" />
                <span>14-Day Free Trial</span>
              </div>
              <p className="text-[11px] text-emerald-700/90 dark:text-emerald-400/90 leading-relaxed font-medium">
                You won't be charged until your trial ends. Cancel anytime before then at no cost.
              </p>
            </div>
            <div className="pt-2">
              <Checkbox
                isSelected={agreeToTerms}
                onValueChange={setAgreeToTerms}
                classNames={{
                  label: "text-xs text-slate-600 dark:text-slate-400",
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
              Complete Sign Up
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};