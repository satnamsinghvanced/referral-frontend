import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Spinner, addToast } from "@heroui/react";
import { fetchPlansAndFeatures, PlanData } from "../../../services/planFeature";
import { registerUser } from "../../../services/auth";
import { setCredentials } from "../../../store/authSlice";
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX } from "../../../consts/consts";
import { SignupHeader } from "./SignupHeader";
import { StepYourDetails } from "./StepYourDetails";
import { StepPayment } from "./StepPayment";

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
    .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
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
  const planParam = searchParams.get("planId") || searchParams.get("plan") || searchParams.get("id");

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoadingPlans(true);
      const res = await fetchPlansAndFeatures();
      const data = res?.data || res;
      const fetchedPlans: PlanData[] = Array.isArray(data?.plans) ? data.plans : Array.isArray(data) ? data : [];
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
          const popular = fetchedPlans.find((p) => p.isPopular) || fetchedPlans[0];
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
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      practiceName: "",
      medicalSpecialty: "",
      password: "",
      messageAlert: false,
    },
    validationSchema,
    onSubmit: () => {
      setCurrentStep(2);
    },
  });

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
    try {
      setIsSubmitting(true);
      const cleanCard = cardNumber.replace(/\s/g, "");
      const payload = {
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        email: formik.values.email,
        phone: formik.values.mobile,
        practiceName: formik.values.practiceName,
        medicalSpecialty: formik.values.medicalSpecialty,
        password: formik.values.password,
        messageAlert: formik.values.messageAlert,
        status: "active",
        payment: {
          planId: selectedPlan?._id || selectedPlan?.planId || planParam || "professional",
          plan: selectedPlan?.planId || selectedPlan?.name || planParam || "professional",
          billingCycle,
          cardNumber: cleanCard,
          expire: expiry,
          cvc,
          method: "card",
        },
      };
      const res = await registerUser(payload);
      const data = res?.data;
      if (data?.accessToken || data?.user?.accessToken) {
        const token = data.accessToken || data.user.accessToken;
        dispatch(setCredentials({ token }));
      }
      addToast({
        title: "Account Created Successfully!",
        description: "Welcome to Practice ROI. Getting your dashboard ready...",
        color: "success",
      });
      navigate("/");
    } catch (err: any) {
      console.error("Signup failed:", err);
      const msg = err.response?.data?.message || err.message || "Sign up failed. Please check your inputs.";
      addToast({
        title: "Sign Up Failed",
        description: msg,
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingPlans) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#070C18] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" color="primary" />
        <span className="text-xs font-bold text-slate-400">Preparing signup page...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070C18] text-slate-900 dark:text-slate-100 flex flex-col items-center py-8 px-4 sm:px-6">
      <SignupHeader
        currentStep={currentStep === 1 ? 2 : 3}
        showThemeToggle={true}
        showBackButton={currentStep === 2}
        onBackClick={() => setCurrentStep(1)}
        onStepClick={(step) => {
          if (step === 1) navigate("/pricing");
          if (step === 2) setCurrentStep(1);
        }}
      />
      {currentStep === 1 && (
        <StepYourDetails
          onContinue={() => formik.handleSubmit()}
          formik={formik}
        />
      )}
      {currentStep === 2 && (
        <StepPayment
          selectedPlan={selectedPlan}
          billingCycle={billingCycle}
          onBack={() => setCurrentStep(1)}
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
        />
      )}
    </div>
  );
};

export default SignupFlow;
