import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Spinner, addToast } from "@heroui/react";
import { fetchPlansAndFeatures, PlanData } from "../../../services/planFeature";
import { registerUser, checkEmailAvailability } from "../../../services/auth";
import { validateDiscount, upgradePlan } from "../../../services/settings/billing";
import { setCredentials } from "../../../store/authSlice";
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX } from "../../../consts/consts";
import { SignupHeader } from "./SignupHeader";
import { StepChoosePlan } from "./StepChoosePlan";
import { StepYourDetails } from "./StepYourDetails";
import { StepPayment } from "./StepPayment";
import { AppliedCoupon, SignupConfirmationData, PaymentFailedState, SignUpFormValues } from "./types";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .matches(NAME_REGEX, "First name can only contain letters, spaces, hyphens and dots")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .matches(NAME_REGEX, "Last name can only contain letters, spaces, hyphens and dots")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: Yup.string()
    .required("Email address is required")
    .matches(EMAIL_REGEX, "Invalid email format"),
  mobile: Yup.string()
    .required("Phone number is required")
    .test(
      "valid-phone",
      "Phone number must be a valid 10-digit number",
      (val) => {
        if (!val) return false;
        const digits = val.replace(/\D/g, "");
        return digits.length === 10;
      }
    ),
  practiceName: Yup.string()
    .required("Practice name is required"),
  medicalSpecialty: Yup.string()
    .required("Specialty is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      PASSWORD_REGEX,
      "Password must be at least 8 chars, include 1 uppercase, 1 lowercase, 1 number & 1 special character"
    ),
  messageAlert: Yup.boolean().oneOf([true], "You must accept account alerts"),
});

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

export const SignupFlow: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const isUpgrade = location.pathname.includes("upgrade-plan") || searchParams.get("mode") === "upgrade";

  const retryState = location.state as
    | { step?: 1 | 2 | 3; formData?: Partial<SignUpFormValues>; planId?: string }
    | undefined;

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(
    retryState?.step === 3 ? 3 : retryState?.step === 2 ? 2 : 1
  );
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [country, setCountry] = useState("India");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [emailInUseError, setEmailInUseError] = useState("");
  const planParam = retryState?.planId || searchParams.get("planId") || searchParams.get("plan") || searchParams.get("id");

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoadingPlans(true);
      const res = await fetchPlansAndFeatures();
      const data = res?.data || res;
      const fetchedPlans: PlanData[] = Array.isArray(data?.plans) ? data.plans : Array.isArray(data) ? data : [];
      setPlans(fetchedPlans);
      if (fetchedPlans.length > 0) {
        let matched: PlanData | undefined;
        if (planParam) {
          const target = planParam.toLowerCase().trim();
          matched = fetchedPlans.find(
            (p) =>
              (p._id && p._id.toLowerCase() === target) ||
              (p.planId && p.planId.toLowerCase() === target) ||
              (p.name && p.name.toLowerCase() === target)
          );
        }
        if (matched) {
          setSelectedPlan(matched);
        } else {
          const popular =
            fetchedPlans.find(
              (p) =>
                p.isPopular === true ||
                (p as any).isPopular === "true" ||
                (p as any).is_popular === true ||
                (p as any).is_popular === "true"
            ) || fetchedPlans[0];
          if (popular) {
            setSelectedPlan(popular);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch superadmin plans:", err);
    } finally {
      setLoadingPlans(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: retryState?.formData?.firstName || searchParams.get("firstName") || searchParams.get("name") || "",
      lastName: retryState?.formData?.lastName || searchParams.get("lastName") || "",
      email: retryState?.formData?.email || searchParams.get("email") || "",
      mobile: retryState?.formData?.mobile ? formatPhoneNumber(retryState.formData.mobile) : (searchParams.get("mobile") || searchParams.get("phone") || ""),
      practiceName: retryState?.formData?.practiceName || searchParams.get("practiceName") || "",
      medicalSpecialty: retryState?.formData?.medicalSpecialty || searchParams.get("medicalSpecialty") || searchParams.get("specialty") || "",
      password: retryState?.formData?.password || "",
      messageAlert: retryState?.formData?.messageAlert || false,
    },
    validationSchema,
    onSubmit: async (values, { setFieldError, setFieldTouched, setSubmitting }) => {
      try {
        setEmailInUseError("");
        const email = (values.email || "").trim().toLowerCase();
        const res: any = await checkEmailAvailability(email);
        const isTaken =
          res?.data?.exists === true ||
          res?.exists === true ||
          res?.data?.isAvailable === false ||
          res?.isAvailable === false;

        if (isTaken) {
          const errMsg = "This email address is already in use. Please sign in or use another email.";
          setEmailInUseError(errMsg);
          setFieldTouched("email", true, true);
          setFieldError("email", errMsg);
          return;
        }
        setEmailInUseError("");
        setCurrentStep(3);
      } catch (err: any) {
        console.error("Email verification error:", err);
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Failed to verify email availability. Please try again.";
        setEmailInUseError(msg);
        setFieldTouched("email", true, true);
        setFieldError("email", msg);
        addToast({
          title: "Verification Failed",
          description: msg,
          color: "danger",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
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
          description: `${discountText} has been applied to your plan.`,
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
    const cleanCard = cardNumber.replace(/\s/g, "");
    if (!cleanCard) {
      errs.cardNumber = "Card number is required";
    } else if (cleanCard.length < 13 || cleanCard.length > 16 || !luhnCheck(cleanCard)) {
      errs.cardNumber = "Invalid card number";
    }
    if (!expiry || !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiry)) {
      errs.expiry = "Invalid date (MM/YY)";
    }
    if (!cvc || cvc.length !== 3) {
      errs.cvc = "CVC must be 3 digits";
    }
    if (!agreeToTerms) {
      errs.terms = "You must agree to the Terms of Service & Privacy Policy";
    }
    setPaymentErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCompleteSignup = async () => {
    if (!validatePayment()) return;
    const cleanCard = cardNumber.replace(/\s/g, "");

    if (isUpgrade) {
      try {
        setIsSubmitting(true);
        const planIdentifier = selectedPlan?._id || selectedPlan?.planId || planParam || "starter_199";
        await upgradePlan({
          planId: planIdentifier,
          billingCycle,
          cardNumber: cleanCard,
          expire: expiry,
          cvc,
          couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        });

        queryClient.invalidateQueries({ queryKey: ["billing"] });
        queryClient.invalidateQueries({ queryKey: ["user"] });

        addToast({
          title: "Plan Upgraded Successfully!",
          description: `Your subscription has been updated to the ${selectedPlan?.name || "selected"} plan.`,
          color: "success",
        });

        navigate("/settings/billing");
      } catch (err: any) {
        console.error("Upgrade plan error:", err);
        const errMsg = err?.response?.data?.message || err?.message || "Failed to upgrade subscription plan.";
        addToast({
          title: "Upgrade Failed",
          description: errMsg,
          color: "danger",
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        email: formik.values.email,
        phone: formik.values.mobile,
        practiceName: formik.values.practiceName,
        medicalSpecialty: formik.values.medicalSpecialty,
        password: formik.values.password,
        messageAlert: formik.values.messageAlert,
        status: "trial",
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        payment: {
          planId: selectedPlan?._id || selectedPlan?.planId || planParam || "professional",
          plan: selectedPlan?.planId || selectedPlan?.name || planParam || "professional",
          billingCycle,
          cardNumber: cleanCard,
          expire: expiry,
          cvc,
          method: "card",
          couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        },
      };
      const res = await registerUser(payload);
      const data = res?.data;
      if (data?.accessToken || data?.user?.accessToken) {
        const token = data.accessToken || data.user.accessToken;
        dispatch(setCredentials({ token }));
      }

      // Calculate price details for confirmation receipt
      const rawPrice =
        billingCycle === "annual"
          ? selectedPlan?.annualPrice || selectedPlan?.price || 199
          : selectedPlan?.price || 199;
      let finalPrice = rawPrice;
      let discountVal = 0;
      if (appliedCoupon) {
        if (appliedCoupon.type === "percent") {
          discountVal = (rawPrice * appliedCoupon.value) / 100;
        } else {
          discountVal = appliedCoupon.value;
        }
        finalPrice = Math.max(0, Math.round((rawPrice - discountVal) * 100) / 100);
      }

      const confirmationState: SignupConfirmationData = {
        planName: selectedPlan?.name || "Professional Plan",
        planId: selectedPlan?._id || selectedPlan?.planId || "professional",
        billingCycle,
        price: finalPrice,
        originalPrice: rawPrice,
        discountAmount: discountVal,
        trialDays: 14,
        cardLast4: cleanCard.slice(-4),
        cardBrand: "Visa",
        orderId: data?.user?.subscriptionId || `PROI-${Math.floor(100000 + Math.random() * 900000)}`,
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
          firstName: formik.values.firstName,
          lastName: formik.values.lastName,
          email: formik.values.email,
          practiceName: formik.values.practiceName,
          phone: formik.values.mobile,
        },
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      };

      try {
        sessionStorage.setItem("practice_roi_last_signup", JSON.stringify(confirmationState));
      } catch (_) { }

      addToast({
        title: "Account Created Successfully!",
        description: `Welcome to Practice ROI! Your 14-day free trial on the ${selectedPlan?.name || "Professional"} plan has started.`,
        color: "success",
      });

      navigate("/signup/thank-you", { state: confirmationState });
    } catch (err: any) {
      console.error("Signup error:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred during signup. Please try again.";

      const isPaymentFailure =
        msg.toLowerCase().includes("payment") ||
        msg.toLowerCase().includes("card") ||
        msg.toLowerCase().includes("stripe") ||
        msg.toLowerCase().includes("declined") ||
        msg.toLowerCase().includes("cvc") ||
        msg.toLowerCase().includes("expired");

      if (isPaymentFailure) {
        const failedState: PaymentFailedState = {
          errorMessage: msg,
          errorCode: "card_payment_failed",
          planName: selectedPlan?.name || "Professional Plan",
          planId: selectedPlan?._id || selectedPlan?.planId || "professional",
          billingCycle,
          price: selectedPlan?.price || 199,
          userEmail: formik.values.email,
          userName: `${formik.values.firstName} ${formik.values.lastName}`.trim(),
          retryFormValues: formik.values,
          cardLast4: cleanCard.slice(-4),
        };

        navigate("/signup/payment-failed", { state: failedState });
      } else {
        addToast({
          title: "Sign Up Failed",
          description: msg,
          color: "danger",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingPlans) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#070C18] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" color="primary" />
        <span className="text-xs font-bold text-slate-400">Preparing plans page...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070C18] text-slate-900 dark:text-slate-100 flex flex-col items-center py-8 px-4 sm:px-6">
      <SignupHeader
        currentStep={isUpgrade && currentStep === 3 ? 2 : currentStep}
        isUpgrade={isUpgrade}
        showThemeToggle={true}
        showBackButton={isUpgrade ? true : (currentStep === 2 || currentStep === 3)}
        backButtonText={isUpgrade ? (currentStep === 3 ? "Back to Choose Plan" : "Back to Billing") : (currentStep === 3 ? "Back to Details" : "Back to Choose Plan")}
        onBackClick={() => {
          if (isUpgrade) {
            if (currentStep === 3) {
              setCurrentStep(1);
            } else {
              navigate("/settings/billing");
            }
          } else {
            setCurrentStep((prev) => (prev === 3 ? 2 : 1));
          }
        }}
        onStepClick={(step) => {
          if (isUpgrade) {
            if (step === 1) setCurrentStep(1);
            else if (step === 2 && selectedPlan) setCurrentStep(3);
          } else {
            if (step === 1) {
              setCurrentStep(1);
            } else if (step === 2 && selectedPlan) {
              setCurrentStep(2);
            }
          }
        }}
      />
      {currentStep === 1 && (
        <StepChoosePlan
          plans={plans}
          selectedPlan={selectedPlan}
          onSelectPlan={(plan) => setSelectedPlan(plan)}
          billingCycle={billingCycle}
          setBillingCycle={setBillingCycle}
          onContinue={(chosenPlan) => {
            if (chosenPlan) setSelectedPlan(chosenPlan);
            if (isUpgrade) {
              setCurrentStep(3);
            } else {
              setCurrentStep(2);
            }
          }}
          loading={loadingPlans}
        />
      )}
      {currentStep === 2 && !isUpgrade && (
        <StepYourDetails
          onContinue={() => formik.handleSubmit()}
          onBack={() => setCurrentStep(1)}
          formik={formik}
          emailError={emailInUseError}
          setEmailError={setEmailInUseError}
          selectedPlan={selectedPlan}
          billingCycle={billingCycle}
        />
      )}
      {currentStep === 3 && (
        <StepPayment
          selectedPlan={selectedPlan}
          billingCycle={billingCycle}
          isUpgrade={isUpgrade}
          onBack={() => {
            if (isUpgrade) {
              setCurrentStep(1);
            } else {
              setCurrentStep(2);
            }
          }}
          onSubmitSignup={handleCompleteSignup}
          isSubmitting={isSubmitting}
          cardNumber={cardNumber}
          setCardNumber={setCardNumber}
          expiry={expiry}
          setExpiry={setExpiry}
          cvc={cvc}
          setCvc={setCvc}
          country={country}
          setCountry={setCountry}
          agreeToTerms={agreeToTerms}
          setAgreeToTerms={setAgreeToTerms}
          paymentErrors={paymentErrors}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          appliedCoupon={appliedCoupon}
          onApplyCoupon={handleApplyCoupon}
          onRemoveCoupon={handleRemoveCoupon}
          isApplyingCoupon={isApplyingCoupon}
          couponError={couponError}
          setCouponError={setCouponError}
        />
      )}
    </div>
  );
};

export default SignupFlow;
