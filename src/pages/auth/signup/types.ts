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

export const MEDICAL_SPECIALTIES = [
  { key: "orthodontics", label: "Orthodontics" },
  { key: "generalDentistry", label: "General Dentistry" },
  { key: "oralSurgery", label: "Oral Surgery" },
  { key: "endodontics", label: "Endodontics" },
  { key: "periodontics", label: "Periodontics" },
  { key: "other", label: "Other" },
];

export interface SignupHeaderProps {
  currentStep: 1 | 2;
  onStepClick: (step: 1 | 2) => void;
}

export interface StepYourDetailsProps {
  onContinue: () => void;
  formik: any;
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
}
