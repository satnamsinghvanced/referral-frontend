import { PlanData } from "../../../services/planFeature";

export interface SignUpFormValues {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  practiceName: string;
  medicalSpecialty: string;
  password: string;
  messageAlert: boolean;
}

export interface SignupHeaderProps {
  currentStep?: 1 | 2 | 3;
  onStepClick?: (step: number) => void;
  title?: React.ReactNode;
  subtitle?: string;
  isTwilioCredits?: boolean;
  hideStepper?: boolean;
  showThemeToggle?: boolean;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export interface StepYourDetailsProps {
  onContinue: () => void;
  formik: any;
  emailError?: string;
  setEmailError?: (err: string) => void;
}

export interface AppliedCoupon {
  code: string;
  title?: string;
  description?: string;
  value: number;
  type: "percent" | "fixed";
}

export interface StepPaymentProps {
  selectedPlan: PlanData | null;
  billingCycle: "monthly" | "annual";
  onBack: () => void;
  onSubmitSignup: () => void;
  isSubmitting: boolean;
  cardNumber: string;
  setCardNumber: (val: string) => void;
  expiry: string;
  setExpiry: (val: string) => void;
  cvc: string;
  setCvc: (val: string) => void;
  country: string;
  setCountry: (val: string) => void;
  agreeToTerms: boolean;
  setAgreeToTerms: (val: boolean) => void;
  paymentErrors: Record<string, string>;
  couponCode: string;
  setCouponCode: (val: string) => void;
  appliedCoupon: AppliedCoupon | null;
  onApplyCoupon: (codeToApply?: string) => Promise<void> | void;
  onRemoveCoupon: () => void;
  isApplyingCoupon: boolean;
  couponError: string;
  setCouponError: (err: string) => void;
}

export interface SignupConfirmationData {
  planName: string;
  planId?: string | undefined;
  billingCycle: "monthly" | "annual";
  price: number;
  originalPrice?: number | undefined;
  discountAmount?: number | undefined;
  trialDays?: number | undefined;
  cardLast4?: string | undefined;
  cardBrand?: string | undefined;
  orderId?: string | undefined;
  transactionDate?: string | undefined;
  nextBillingDate?: string | undefined;
  user: {
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
    practiceName?: string | undefined;
    phone?: string | undefined;
  };
  couponCode?: string | undefined;
}

export interface PaymentFailedState {
  errorMessage?: string | undefined;
  errorCode?: string | undefined;
  planName?: string | undefined;
  planId?: string | undefined;
  billingCycle?: "monthly" | "annual" | undefined;
  price?: number | undefined;
  userEmail?: string | undefined;
  userName?: string | undefined;
  retryFormValues?: Partial<SignUpFormValues> | undefined;
  cardLast4?: string | undefined;
}
