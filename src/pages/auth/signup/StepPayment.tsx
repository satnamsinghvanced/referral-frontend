import React from "react";
import { Button, Card, CardBody, Input, Select, SelectItem, Checkbox } from "@heroui/react";
import { FiCreditCard, FiLock, FiCheck } from "react-icons/fi";
import { StepPaymentProps } from "./types";
import { PlanData } from "../../../services/planFeature";

export const StepPayment: React.FC<StepPaymentProps> = ({
  selectedPlan,
  billingCycle,
  onBack,
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
}) => {
  const calcDisplayPrice = (plan: PlanData) => {
    if (billingCycle === "annual") {
      if (plan.annualPrice) return plan.annualPrice;
      if (plan.discountPercent && plan.discountPercent > 0) {
        return Math.round(plan.price * (1 - plan.discountPercent / 100));
      }
    }
    return plan.price;
  };

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
            <div className="flex justify-between items-center text-base font-extrabold pt-1">
              <span>Total Due Today</span>
              <span>${selectedPlan ? calcDisplayPrice(selectedPlan) : 399}</span>
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