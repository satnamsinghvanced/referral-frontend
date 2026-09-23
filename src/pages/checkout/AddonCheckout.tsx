import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Checkbox,
  Chip,
  addToast,
} from "@heroui/react";
import {
  FiCreditCard,
  FiLock,
  FiCheck,
  FiTag,
  FiX,
  FiArrowLeft,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { SignupHeader } from "../auth/signup/SignupHeader";
import { useBilling } from "../../hooks/settings/useBilling";
import {
  AddonData,
  fetchAddonById,
  fetchAddons,
  purchaseAddon,
} from "../../services/addonService";
import { validateDiscount } from "../../services/settings/billing";
import { WorkspaceLoader } from "../../components/common/LoadingState";

interface AppliedCoupon {
  code: string;
  title?: string;
  description?: string;
  value: number;
  type: "percent" | "fixed";
}

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

export const AddonCheckout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const addonId = searchParams.get("addonId") || searchParams.get("addon_id") || searchParams.get("id") || "";

  useEffect(() => {
    const fromWp = searchParams.get("from_wp") === "true" || searchParams.get("wp") === "true" || searchParams.get("reauth") === "true";
    if (fromWp && addonId) {
      dispatch(logout());
      queryClient.clear();
      navigate(`/signin?addonId=${addonId}`, { replace: true });
    }
  }, [searchParams, addonId, dispatch, navigate, queryClient]);

  const { data: billingData, isLoading: isLoadingBilling } = useBilling();
  const [addon, setAddon] = useState<AddonData | null>(null);
  const [loadingAddon, setLoadingAddon] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Payment form state
  const hasSavedCard = Boolean(billingData?.cardNumber);
  const [activeTab, setActiveTab] = useState<"saved" | "card">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [country, setCountry] = useState("India");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    if (hasSavedCard) {
      setActiveTab("saved");
    } else {
      setActiveTab("card");
    }
  }, [hasSavedCard]);

  useEffect(() => {
    if (!addonId) {
      setLoadError("No Add-on specified. Please select an add-on to purchase.");
      setLoadingAddon(false);
      return;
    }

    const loadAddonData = async () => {
      try {
        setLoadingAddon(true);
        setLoadError(null);
        try {
          const res = await fetchAddonById(addonId);
          const data = res?.data || res;
          if (data && (data._id || data.id)) {
            setAddon(data);
            return;
          }
        } catch (singleErr) {
          // fallback to list fetch
        }

        const allRes = await fetchAddons();
        const list = allRes?.data || allRes;
        if (Array.isArray(list)) {
          const found = list.find(
            (item: any) =>
              item._id === addonId ||
              item.id === addonId ||
              item.title?.toLowerCase().replace(/\s+/g, "-") === addonId.toLowerCase()
          );
          if (found) {
            setAddon(found);
            return;
          }
        }
        setLoadError("The selected add-on could not be found.");
      } catch (err: any) {
        console.error("Failed to load add-on:", err);
        setLoadError(err.response?.data?.message || "Failed to load add-on details");
      } finally {
        setLoadingAddon(false);
      }
    };

    loadAddonData();
  }, [addonId]);

  const handleCardNumberChange = (val: string) => {
    const clean = val.replace(/\D/g, "").substring(0, 16);
    const formatted = clean.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    setCardNumber(formatted);
    if (paymentErrors.cardNumber) {
      setPaymentErrors((prev) => ({ ...prev, cardNumber: "" }));
    }
  };

  const handleExpiryChange = (val: string) => {
    const clean = val.replace(/\D/g, "").substring(0, 4);
    let formatted = clean;
    if (clean.length > 2) {
      formatted = `${clean.substring(0, 2)}/${clean.substring(2)}`;
    }
    setExpiry(formatted);
    if (paymentErrors.expiry) {
      setPaymentErrors((prev) => ({ ...prev, expiry: "" }));
    }
  };

  const handleCvcChange = (val: string) => {
    const clean = val.replace(/\D/g, "").substring(0, 4);
    setCvc(clean);
    if (paymentErrors.cvc) {
      setPaymentErrors((prev) => ({ ...prev, cvc: "" }));
    }
  };

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }
    try {
      setIsApplyingCoupon(true);
      setCouponError("");
      const res: any = await validateDiscount(code);
      const data = res?.data || res;
      if (data && data.code) {
        setAppliedCoupon({
          code: data.code,
          title: data.title,
          description: data.description,
          value: Number(data.value),
          type: data.type,
        });
        const discountText = data.type === "percent" ? `${data.value}% OFF` : `$${data.value} discount`;
        addToast({
          title: "Coupon Applied!",
          description: `${discountText} has been applied to your add-on purchase.`,
          color: "success",
        });
      } else {
        setCouponError("This coupon code is invalid or has expired.");
      }
    } catch (err: any) {
      console.error("Coupon validation error:", err);
      const msg = err.response?.data?.message || err.message || "This coupon code is invalid or has expired.";
      setCouponError(msg);
      addToast({
        title: "Invalid Coupon",
        description: msg,
        color: "danger",
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    addToast({
      title: "Coupon Removed",
      description: "Discount coupon has been removed.",
      color: "default",
    });
  };

  const validatePayment = () => {
    const errs: Record<string, string> = {};
    if (!agreeToTerms) {
      errs.terms = "You must agree to the Terms of Service & Privacy Policy";
    }

    if (activeTab === "card" || !hasSavedCard) {
      const cleanCard = cardNumber.replace(/\s/g, "");
      if (!cleanCard) {
        errs.cardNumber = "Card number is required";
      } else if (cleanCard.length !== 16) {
        errs.cardNumber = "Card number must be 16 digits";
      } else if (!luhnCheck(cleanCard)) {
        errs.cardNumber = "Invalid card number (failed checksum)";
      }
      if (!expiry || !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiry)) {
        errs.expiry = "Invalid date (MM/YY)";
      }
      if (!cvc || cvc.length < 3) {
        errs.cvc = "CVC must be 3-4 digits";
      }
    }

    setPaymentErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePurchase = async () => {
    if (!addon) return;
    if (!validatePayment()) return;

    try {
      setIsProcessing(true);
      const isUsingSaved = hasSavedCard && activeTab === "saved";
      const cleanCard = cardNumber.replace(/\s/g, "");
      const targetAddonId = addon._id || addon.id || addonId;

      await purchaseAddon({
        addonId: targetAddonId,
        useSavedCard: isUsingSaved,
        cardNumber: !isUsingSaved ? cleanCard : undefined,
        expire: !isUsingSaved ? expiry : undefined,
        cvc: !isUsingSaved ? cvc : undefined,
      });

      setIsSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["billing"] });
      queryClient.invalidateQueries({ queryKey: ["userAddons"] });

      addToast({
        title: "Add-on Activated!",
        description: `Successfully activated ${addon.title}`,
        color: "success",
      });
    } catch (err: any) {
      console.error("Purchase error:", err);
      const msg = err.response?.data?.message || err.message || "Failed to process payment";
      addToast({
        title: "Payment Failed",
        description: msg,
        color: "danger",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loadingAddon || isLoadingBilling) {
    return <WorkspaceLoader message="PREPARING CHECKOUT..." minHeight="min-h-[500px]" />;
  }

  if (loadError || !addon) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center text-2xl mb-4">
          <FiAlertCircle />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Add-on Not Found</h2>
        <p className="text-sm text-foreground/60 max-w-md mb-6">{loadError || "Unable to find the requested add-on."}</p>
        <Button
          color="primary"
          variant="solid"
          onPress={() => navigate("/settings/billing")}
          startContent={<FiArrowLeft />}
          className="font-bold bg-sky-500 hover:bg-sky-600 text-white"
        >
          Return to Billing
        </Button>
      </div>
    );
  }

  const basePrice = Number(addon.price) || 0;
  const isMonthly = addon.billingType === "monthly";
  const isAnnually = addon.billingType === "annually";
  const isRecurring = isMonthly || isAnnually;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      discountAmount = (basePrice * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === "fixed") {
      discountAmount = Math.min(basePrice, appliedCoupon.value);
    }
  }
  const finalPrice = Math.max(0, basePrice - discountAmount);

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#070C18] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center py-10 px-4">
        <div className="max-w-md w-full flex flex-col items-center text-center p-8 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center text-4xl mb-5 shadow-lg shadow-emerald-500/20">
            <FiCheckCircle />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Payment Successful!</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
            You have successfully activated <strong>{addon.title}</strong> for{" "}
            <strong className="text-[#20a9f8]">${finalPrice.toFixed(finalPrice % 1 !== 0 ? 2 : 0)}</strong>
            {isMonthly ? "/month (Autopay)" : isAnnually ? "/year (Autopay)" : " (One-time)"}.
          </p>

          <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 w-full mb-6 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Selected Add-on:</span>
              <span className="font-bold text-slate-900 dark:text-white">{addon.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Billing Cycle:</span>
              <span className="font-bold text-slate-900 dark:text-white capitalize">
                {addon.billingType ? addon.billingType.replace("_", " ") : "One-Time"}
              </span>
            </div>
            {isRecurring && (
              <div className="flex justify-between">
                <span className="text-slate-500">Autopay Status:</span>
                <span className="font-bold text-emerald-500 flex items-center gap-1">
                  <FiCheck className="text-xs" /> Enabled
                </span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 font-bold text-sm">
              <span>Total Paid Today:</span>
              <span className="text-[#20a9f8]">${finalPrice.toFixed(finalPrice % 1 !== 0 ? 2 : 0)}</span>
            </div>
          </div>

          <div className="flex flex-col w-full gap-2.5">
            <Button
              color="primary"
              size="lg"
              onPress={() => navigate("/settings/billing")}
              className="w-full font-bold bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow-md shadow-sky-500/20"
            >
              View in Billing & Subscription
            </Button>
            <Button
              variant="bordered"
              size="lg"
              onPress={() => navigate("/")}
              className="w-full font-bold border-slate-300 dark:border-slate-700 rounded-xl"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070C18] text-slate-900 dark:text-slate-100 flex flex-col items-center py-8 px-4 sm:px-6">
      {/* Add-on Header */}
      <SignupHeader
        currentStep={3}
        hideStepper={true}
        showThemeToggle={true}
        showBackButton={false}
        title={
          <>
            Complete Add-on <span className="text-[#20a9f8] dark:text-sky-400">Purchase</span>
          </>
        }
        subtitle="Complete your payment details to instantly activate this add-on."
      />

      <div className="w-full max-w-5xl mb-4 flex items-center justify-start">
        <button
          type="button"
          onClick={() => navigate("/settings/billing")}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-sky-500 dark:hover:text-sky-400 transition-colors bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl shadow-sm cursor-pointer"
        >
          <FiArrowLeft className="w-4 h-4 text-sky-500" />
          <span>Back to Billing</span>
        </button>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Payment Information */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card className="shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] rounded-2xl p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
              <FiCreditCard className="w-5 h-5 text-sky-500" />
              Payment Information
            </h2>

            {/* Saved Card Selection if available */}
            {hasSavedCard && (
              <div className="grid grid-cols-2 gap-4 mb-5 select-none">
                <div
                  onClick={() => setActiveTab("saved")}
                  className={`flex items-center gap-2.5 p-3.5 border rounded-xl cursor-pointer transition-all duration-200 ${activeTab === "saved"
                      ? "border-sky-500 bg-sky-50/10 dark:bg-sky-950/20 text-sky-500 font-bold shadow-sm"
                      : "border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                >
                  <FiCreditCard className={`w-4 h-4 ${activeTab === "saved" ? "text-sky-500" : "text-slate-400"}`} />
                  <span className="text-xs font-bold">Saved Card</span>
                </div>
                <div
                  onClick={() => setActiveTab("card")}
                  className={`flex items-center gap-2.5 p-3.5 border rounded-xl cursor-pointer transition-all duration-200 ${activeTab === "card"
                      ? "border-sky-500 bg-sky-50/10 dark:bg-sky-950/20 text-sky-500 font-bold shadow-sm"
                      : "border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                >
                  <FiCreditCard className={`w-4 h-4 ${activeTab === "card" ? "text-sky-500" : "text-slate-400"}`} />
                  <span className="text-xs font-bold">New Card</span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {hasSavedCard && activeTab === "saved" ? (
                <div className="border border-sky-500/50 bg-sky-50/20 dark:bg-sky-950/20 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiCreditCard className="w-5 h-5 text-sky-500" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Card ending in {billingData?.cardNumber?.slice(-4) || "••••"}
                      </span>
                      {billingData?.expire && (
                        <span className="text-xs text-slate-500">Expires {billingData.expire}</span>
                      )}
                    </div>
                  </div>
                  <Chip size="sm" className="bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 border-none text-[10px] font-bold">
                    Default
                  </Chip>
                </div>
              ) : (
                <>
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
                        inputWrapper:
                          "border border-slate-300 dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-900/50 data-[hover=true]:bg-[#f8fafc] group-data-[hover=true]:bg-[#f8fafc] hover:bg-[#f8fafc] h-11 rounded-xl group-data-[hover=true]:border-slate-400 hover:border-slate-400 group-data-[focus=true]:border-[#20a9f8] focus-within:border-[#20a9f8] transition-colors",
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
                          inputWrapper:
                            "border border-slate-300 dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-900/50 data-[hover=true]:bg-[#f8fafc] group-data-[hover=true]:bg-[#f8fafc] hover:bg-[#f8fafc] h-11 rounded-xl group-data-[hover=true]:border-slate-400 hover:border-slate-400 group-data-[focus=true]:border-[#20a9f8] focus-within:border-[#20a9f8] transition-colors",
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
                          inputWrapper:
                            "border border-slate-300 dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-900/50 data-[hover=true]:bg-[#f8fafc] group-data-[hover=true]:bg-[#f8fafc] hover:bg-[#f8fafc] h-11 rounded-xl group-data-[hover=true]:border-slate-400 hover:border-slate-400 group-data-[focus=true]:border-[#20a9f8] focus-within:border-[#20a9f8] transition-colors",
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
                        trigger:
                          "border border-slate-300 dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-900/50 data-[hover=true]:bg-[#f8fafc] group-data-[hover=true]:bg-[#f8fafc] hover:bg-[#f8fafc] h-11 min-h-11 rounded-xl group-data-[hover=true]:border-slate-400 hover:border-slate-400 group-data-[focus=true]:border-[#20a9f8] transition-colors",
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
                </>
              )}

              {/* Promo / Coupon Code */}
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
                        placeholder="ENTER COUPON CODE"
                        value={couponCode}
                        onValueChange={(val) => {
                          setCouponCode(val.toUpperCase());
                          if (couponError) setCouponError("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleApplyCoupon();
                          }
                        }}
                        variant="bordered"
                        isInvalid={!!couponError}
                        classNames={{
                          inputWrapper:
                            "border border-slate-300 dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-900/50 data-[hover=true]:bg-[#f8fafc] group-data-[hover=true]:bg-[#f8fafc] hover:bg-[#f8fafc] h-11 min-h-11 rounded-xl group-data-[hover=true]:border-slate-400 hover:border-slate-400 group-data-[focus=true]:border-[#20a9f8] focus-within:border-[#20a9f8] transition-colors",
                          input: "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-semibold uppercase tracking-wider text-xs",
                        }}
                        className="flex-1"
                      />
                      <Button
                        color="primary"
                        onPress={() => handleApplyCoupon()}
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
                      </div>
                    </div>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={handleRemoveCoupon}
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

          {/* Secure Payment Card */}
          <Card className="shadow-none border border-sky-200 dark:border-sky-500/20 bg-sky-50/50 dark:bg-sky-950/10 rounded-2xl p-4">
            <CardBody className="p-0 flex flex-row gap-3.5 items-start">
              <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 shrink-0">
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

        {/* Right Column: Order Summary */}
        <div className="flex flex-col gap-6">
          <Card className="shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] rounded-2xl p-6">
            <h2 className="text-lg font-bold border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">Order Summary</h2>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-500">Selected Plan</span>
                <span className="font-bold text-slate-900 dark:text-white">{addon.title}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-500">Billing Cycle</span>
                <span className="capitalize">{isMonthly ? "Monthly" : isAnnually ? "Annually" : "One-Time"}</span>
              </div>

              <div className="flex justify-between items-center text-sm font-semibold border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-slate-500">Plan Rate</span>
                <div className="flex items-center gap-1.5">
                  {appliedCoupon && (
                    <span className="text-xs text-slate-400 line-through font-normal">
                      ${basePrice}
                    </span>
                  )}
                  <span>
                    ${finalPrice.toFixed(finalPrice % 1 !== 0 ? 2 : 0)} / {isMonthly ? "month" : isAnnually ? "year" : "one-time"}
                  </span>
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
                    {isRecurring
                      ? `Autopay renewal: $${finalPrice.toFixed(finalPrice % 1 !== 0 ? 2 : 0)} / ${isAnnually ? "year" : "month"}`
                      : "One-time purchase, no recurring fees"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    ${finalPrice.toFixed(finalPrice % 1 !== 0 ? 2 : 0)}
                  </span>
                </div>
              </div>

              {/* Green Highlight Notice */}
              <div className="border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-xl p-4 mt-2 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                  <FiCheck className="w-4 h-4" />
                  <span>Instant Add-on Activation</span>
                </div>
                <p className="text-[11px] text-emerald-700/90 dark:text-emerald-400/90 leading-relaxed font-medium">
                  {isRecurring
                    ? `Your add-on features will be activated immediately upon confirmation. Autopay renews every ${isAnnually ? "year" : "month"}. Cancel anytime.`
                    : "Your add-on features will be activated immediately upon confirmation with no recurring renewal fees."}
                </p>
              </div>

              <div className="pt-2">
                <Checkbox
                  isSelected={agreeToTerms}
                  onValueChange={(val) => {
                    setAgreeToTerms(val);
                    if (val && paymentErrors.terms) {
                      setPaymentErrors((prev) => ({ ...prev, terms: "" }));
                    }
                  }}
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
                onPress={handlePurchase}
                isLoading={isProcessing}
                className="w-full font-bold h-11 rounded-xl mt-4 text-sm bg-sky-500 hover:bg-sky-600 text-white cursor-pointer"
              >
                {isProcessing
                  ? "Processing Payment..."
                  : isRecurring
                    ? `Subscribe & Activate • $${finalPrice.toFixed(finalPrice % 1 !== 0 ? 2 : 0)}${isMonthly ? "/mo" : "/yr"}`
                    : `Pay $${finalPrice.toFixed(finalPrice % 1 !== 0 ? 2 : 0)} & Activate Add-on`}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddonCheckout;
