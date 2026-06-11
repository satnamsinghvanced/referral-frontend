import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Card, CardBody, Input, Select, SelectItem, addToast, Checkbox, Chip } from "@heroui/react";
import { FiCreditCard, FiLock, FiCheck, FiArrowLeft } from "react-icons/fi";
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

interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

const luhnCheck = (num: string) => {
  let sum = 0;
  let shouldDouble = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
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

  const baseCost = typeParam === "twilio_credits" ? amountParam + packageCost : activePlan.price;

  // Form states
  const [activeTab, setActiveTab] = useState<"saved" | "card">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [country, setCountry] = useState("India");
  const [savePaymentDetails, setSavePaymentDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Discount code states
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; value: number; type: "percent" | "fixed" } | null>(null);

  // Terms and conditions consent
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Saved cards states
  const [savedCards, setSavedCards] = useState<SavedCard[]>(() => {
    try {
      const saved = localStorage.getItem("practice_roi_saved_cards");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [selectedSavedCard, setSelectedSavedCard] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("practice_roi_saved_cards");
      const list = saved ? JSON.parse(saved) : [];
      const defaultCard = list.find((c: any) => c.isDefault);
      return defaultCard ? defaultCard.id : (list.length > 0 ? list[0].id : "");
    } catch (e) {
      return "";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("practice_roi_saved_cards", JSON.stringify(savedCards));
    } catch (e) {
      console.error("Failed to save cards", e);
    }
  }, [savedCards]);

  // Form errors & touched states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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

  // Card details validation helper
  const validateField = (name: string, value: string, currentBrand?: string | null) => {
    let error = "";
    if (name === "cardNumber") {
      const clean = value.replace(/\s/g, "");
      if (!clean) {
        error = "Card number is required";
      } else if (clean.length < 13 || clean.length > 16) {
        error = "Invalid card number (must be 13-16 digits)";
      } else if (!luhnCheck(clean)) {
        error = "Invalid card number (failed checksum)";
      }
    } else if (name === "expiry") {
      if (!value) {
        error = "Expiration date is required";
      } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value)) {
        error = "Invalid date format (MM/YY)";
      } else {
        const [mStr, yStr]: any = value.split("/");
        const month = parseInt(mStr, 10);
        const year = parseInt(`20${yStr}`, 10);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // 1-indexed

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
          error = "Card has expired";
        }
      }
    } else if (name === "cvc") {
      if (!value) {
        error = "Security code is required";
      } else {
        const expectedLength = 3;
        if (value.length !== expectedLength) {
          error = `Security code must be ${expectedLength} digits`;
        }
      }
    }
    return error;
  };

  // Card number input formatter (adds spaces every 4 digits)
  const handleCardNumberChange = (val: string) => {
    const clean = val.replace(/\D/g, "").substring(0, 16);
    const formatted = clean.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    setCardNumber(formatted);

    if (touched.cardNumber || errors.cardNumber) {
      const err = validateField("cardNumber", formatted, getCardBrand(formatted));
      setErrors((prev) => ({ ...prev, cardNumber: err }));
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

    if (touched.expiry || errors.expiry) {
      const err = validateField("expiry", formatted, cardBrand);
      setErrors((prev) => ({ ...prev, expiry: err }));
    }
  };

  // CVC input change handler
  const handleCvcChange = (val: string) => {
    const clean = val.replace(/\D/g, "").substring(0, 3);
    setCvc(clean);

    if (touched.cvc || errors.cvc) {
      const err = validateField("cvc", clean, cardBrand);
      setErrors((prev) => ({ ...prev, cvc: err }));
    }
  };

  const handleBlur = (field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, value, cardBrand);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!agreeToTerms) {
      newErrors.agree = "You must agree to the Terms of Service and Privacy Policy";
    }
    if (activeTab === "card") {
      const brand = getCardBrand(cardNumber);
      const cardErr = validateField("cardNumber", cardNumber, brand);
      const expiryErr = validateField("expiry", expiry, brand);
      const cvcErr = validateField("cvc", cvc, brand);
      if (cardErr) newErrors.cardNumber = cardErr;
      if (expiryErr) newErrors.expiry = expiryErr;
      if (cvcErr) newErrors.cvc = cvcErr;
      setTouched({ cardNumber: true, expiry: true, cvc: true });
    } else {
      if (savedCards.length === 0) {
        newErrors.savedCard = "No saved cards available. Please use the Card tab.";
      } else if (!selectedSavedCard) {
        newErrors.savedCard = "Please select a saved card.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.type === "percent") {
      discountAmount = baseCost * (appliedDiscount.value / 100);
    } else if (appliedDiscount.type === "fixed") {
      discountAmount = Math.min(baseCost, appliedDiscount.value);
    }
  }

  const totalCost = Math.max(0, baseCost - discountAmount);
  const isFormValid = () => {
    if (!agreeToTerms) return false;
    if (activeTab === "card") {
      const brand = getCardBrand(cardNumber);
      const cardErr = validateField("cardNumber", cardNumber, brand);
      const expiryErr = validateField("expiry", expiry, brand);
      const cvcErr = validateField("cvc", cvc, brand);
      if (cardErr || expiryErr || cvcErr) return false;
    } else {
      if (savedCards.length === 0 || !selectedSavedCard) return false;
    }
    return true;
  };

  const isPayDisabled = !isFormValid();
  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    if (!code) return;
    if (code === "PROMO50") {
      setAppliedDiscount({ code: "PROMO50", value: 50, type: "percent" });
      addToast({ title: "Discount Applied", description: "50% off has been applied to your order!", color: "success" });
    } else if (code === "DISCOUNT10") {
      setAppliedDiscount({ code: "DISCOUNT10", value: 10, type: "fixed" });
      addToast({ title: "Discount Applied", description: "$10.00 discount has been applied to your order!", color: "success" });
    } else if (code === "FREE") {
      setAppliedDiscount({ code: "FREE", value: 100, type: "percent" });
      addToast({ title: "Discount Applied", description: "100% off has been applied to your order!", color: "success" });
    } else {
      addToast({ title: "Invalid Code", description: "This discount code is invalid or has expired.", color: "warning" });
    }
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!agreeToTerms) {
      newErrors.agree = "You must agree to the Terms of Service and Privacy Policy";
    }
    if (activeTab === "card") {
      const brand = getCardBrand(cardNumber);
      const cardErr = validateField("cardNumber", cardNumber, brand);
      const expiryErr = validateField("expiry", expiry, brand);
      const cvcErr = validateField("cvc", cvc, brand);
      if (cardErr) newErrors.cardNumber = cardErr;
      if (expiryErr) newErrors.expiry = expiryErr;
      if (cvcErr) newErrors.cvc = cvcErr;
    } else {
      if (savedCards.length === 0) {
        newErrors.savedCard = "No saved cards available. Please use the Card tab.";
      } else if (!selectedSavedCard) {
        newErrors.savedCard = "Please select a saved card.";
      }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      addToast({
        title: "Validation Error",
        description: Object.values(newErrors)[0],
        color: "danger",
      });
      return;
    }
    try {
      setIsSubmitting(true);
      const isSaved = activeTab === "saved";
      const cardToUse = isSaved
        ? savedCards.find((c) => c.id === selectedSavedCard)
        : null;
      const finalCardNumber = isSaved && cardToUse ? `424242424242${cardToUse.last4}` : cardNumber.replace(/\s/g, "");
      const finalExpiry = isSaved && cardToUse ? cardToUse.expiry : expiry;
      const finalCvc = isSaved ? "123" : cvc;
      if (typeParam === "twilio_credits") {
        await axios.post("/twilio-checkout/mock-credits-payment", {
          amount: totalCost,
          packageName: packageParam,
          cardNumber: finalCardNumber,
          expire: finalExpiry,
          cvc: finalCvc,
        });
        if (!isSaved && savePaymentDetails) {
          const last4Digits = finalCardNumber.slice(-4);
          const brandName = cardBrand || "visa";
          const exists = savedCards.some(
            (c) => c.last4 === last4Digits && c.expiry === expiry && c.brand === brandName
          );
          if (!exists) {
            const newSavedCard: SavedCard = {
              id: Math.random().toString(),
              brand: brandName,
              last4: last4Digits,
              expiry: expiry,
              isDefault: savedCards.length === 0,
            };
            const updatedCards = [...savedCards, newSavedCard];
            localStorage.setItem("practice_roi_saved_cards", JSON.stringify(updatedCards));
            setSavedCards(updatedCards);
          }
        }
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
          cardNumber: finalCardNumber,
          expire: finalExpiry,
          cvc: finalCvc,
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
      <div className="h-10 mb-4 flex items-center justify-center">
        <Logo style={{ height: "40px" }} />
      </div>
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
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card className="shadow-none border border-foreground/10 bg-background rounded-2xl p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b border-foreground/5 pb-3.5 mb-5">
              <FiCreditCard className="w-5 h-5 text-blue-500" />
              Payment Information
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-5 select-none">
              <div
                onClick={() => setActiveTab("saved")}
                className={`flex items-center gap-2.5 p-3.5 border rounded-xl cursor-pointer transition-all duration-200 ${activeTab === "saved"
                  ? "border-primary bg-primary-50/10 dark:bg-primary-950/10 text-primary font-bold shadow-sm"
                  : "border-foreground/10 text-foreground-500 hover:bg-foreground/5"
                  }`}
              >
                <FiCreditCard className={`w-4 h-4 ${activeTab === "saved" ? "text-primary" : "text-foreground-400"}`} />
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Saved</span>
                </div>
              </div>
              <div
                onClick={() => setActiveTab("card")}
                className={`flex items-center gap-2.5 p-3.5 border rounded-xl cursor-pointer transition-all duration-200 ${activeTab === "card"
                  ? "border-primary bg-primary-50/10 dark:bg-primary-950/10 text-primary font-bold shadow-sm"
                  : "border-foreground/10 text-foreground-500 hover:bg-foreground/5"
                  }`}
              >
                <FiCreditCard className={`w-4 h-4 ${activeTab === "card" ? "text-primary" : "text-foreground-400"}`} />
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Card</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {activeTab === "saved" ? (
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-semibold text-default-600">Select a Saved Card</label>
                  {savedCards.length === 0 ? (
                    <div className="border border-dashed border-foreground/15 rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-center">
                      <FiCreditCard className="w-8 h-8 text-foreground-300" />
                      <p className="text-xs text-foreground-500 font-medium">No saved cards found.</p>
                      <p className="text-[10px] text-foreground-400">Please pay using a card and check the "Save payment details" option to save a card for future use.</p>
                    </div>
                  ) : (
                    savedCards.map((card) => (
                      <div
                        key={card.id}
                        onClick={() => setSelectedSavedCard(card.id)}
                        className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${selectedSavedCard === card.id
                          ? "border-primary bg-primary-50/10 dark:bg-primary-950/5"
                          : "border-foreground/10 hover:bg-foreground/5"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <FiCreditCard className="w-5 h-5 text-primary" />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-foreground uppercase">
                              {card.brand} ending in {card.last4}
                            </span>
                            <span className="text-xs text-foreground-500">Expires {card.expiry}</span>
                          </div>
                        </div>
                        {card.isDefault && (
                          <Chip size="sm" className="bg-primary-100 dark:bg-primary-950/35 text-primary border-none text-[10px] font-bold">
                            Default
                          </Chip>
                        )}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-1.5 relative">
                    <label className="text-xs font-semibold text-default-600">Card number</label>
                    <Input
                      type="text"
                      autoComplete="off"
                      placeholder="1234 1234 1234 1234"
                      value={cardNumber}
                      onValueChange={handleCardNumberChange}
                      onBlur={() => handleBlur("cardNumber", cardNumber)}
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-default-600">Expiration date</label>
                      <Input
                        type="text"
                        autoComplete="off"
                        placeholder="MM / YY"
                        value={expiry}
                        onValueChange={handleExpiryChange}
                        onBlur={() => handleBlur("expiry", expiry)}
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
                        autoComplete="off"
                        placeholder="CVC"
                        value={cvc}
                        onValueChange={handleCvcChange}
                        onBlur={() => handleBlur("cvc", cvc)}
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
                  <div className="mt-1 flex items-center gap-2">
                    <Checkbox
                      isSelected={savePaymentDetails}
                      onValueChange={setSavePaymentDetails}
                      classNames={{
                        label: "text-xs font-semibold text-default-600",
                      }}
                    >
                      Save payment details for future purchases
                    </Checkbox>
                  </div>
                </>
              )}
              <p className="text-[11px] text-default-500 leading-relaxed mt-1">
                By providing your card information, you allow Orthodontic Revolution to charge your card for future payments in accordance with their terms.
              </p>
            </div>
          </Card>
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
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-default-600">Discount Code <span className="font-normal text-default-400">(optional)</span></label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter discount code"
                value={discountCode}
                onValueChange={setDiscountCode}
                classNames={{
                  inputWrapper: "border border-foreground/10 rounded-xl bg-background h-10 px-3",
                  input: "text-sm",
                }}
                className="flex-1"
              />
              <Button
                color="primary"
                onPress={handleApplyDiscount}
                className="bg-primary text-white font-semibold rounded-xl h-10 px-5 text-sm"
              >
                Apply
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-1">
            <Checkbox
              isSelected={agreeToTerms}
              onValueChange={(val) => {
                setAgreeToTerms(val);
                if (val && errors.agree) {
                  setErrors((prev) => ({ ...prev, agree: "" }));
                }
              }}
              isInvalid={!!errors.agree}
              classNames={{
                label: "text-xs font-semibold text-default-600",
              }}
            >
              I agree to the <a href="#" onClick={(e) => e.preventDefault()} className="text-primary underline">Terms of Service</a> and <a href="#" onClick={(e) => e.preventDefault()} className="text-primary underline">Privacy Policy</a>
            </Checkbox>
            {errors.agree && <span className="text-[10px] text-danger font-medium pl-6">{errors.agree}</span>}
          </div>
        </div>
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
              {appliedDiscount && (
                <div className="flex justify-between items-center text-sm font-bold text-emerald-600 dark:text-emerald-500">
                  <span>Discount ({appliedDiscount.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-base font-extrabold pt-2">
                <span>Total</span>
                <span>${totalCost.toFixed(2)}</span>
              </div>
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
              <Button
                color={isPayDisabled ? "default" : "primary"}
                onPress={handleSubmit}
                isLoading={isSubmitting}
                isDisabled={isPayDisabled}
                className={`w-full font-bold h-11 rounded-xl mt-4 text-sm ${isPayDisabled
                  ? "bg-foreground/10 text-foreground-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                {typeParam === "twilio_credits" ? `Pay $${totalCost.toFixed(2)}` : "Complete Sign Up"}
              </Button>
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
      <div className="w-full max-w-5xl flex justify-end mt-6">
        <Button
          variant="bordered"
          onPress={handleCancel}
          startContent={<FiArrowLeft className="w-4 h-4" />}
          className="border border-foreground/10 bg-background text-foreground rounded-xl text-sm font-semibold h-10 px-5"
        >
          Back
        </Button>
      </div>
    </div>
  );
}
