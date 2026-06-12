import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Checkbox,
  addToast,
  Spinner,
} from "@heroui/react";
import { useState, useEffect, Fragment } from "react";
import {
  FiBriefcase,
  FiFileText,
  FiMessageSquare,
  FiPhone,
  FiShield,
  FiInfo,
  FiCheck,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import {
  useFetchA2PRegistration,
  useSaveA2PRegistration,
  useUpdateA2PRegistration,
} from "../../../hooks/integrations/useTwilio";

interface PhoneNumber {
  id: string;
  phoneNumber: string;
  label: string;
  status: string;
  capabilities: { voice: boolean; SMS: boolean; MMS: boolean };
}

interface TwilioA2PRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumbers: PhoneNumber[];
}

interface FieldConfig {
  name: string;
  type: "text" | "email" | "url" | "tel" | "select" | "textarea";
  label: string;
  placeholder?: string;
  step: number;
  options?: { key: string; label: string }[];
  gridSpan: string;
  required?: boolean;
  helperText?: string;
}

export default function TwilioA2PRegistrationModal({
  isOpen,
  onClose,
  phoneNumbers,
}: TwilioA2PRegistrationModalProps) {
  const [step, setStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic field configuration
  const fieldsConfig: FieldConfig[] = [
    // Step 1: Brand Information
    {
      name: "businessName",
      type: "text",
      label: "Business Legal Name *",
      placeholder: "e.g. Practice ROI LLC",
      step: 1,
      gridSpan: "col-span-6",
      required: true,
    },
    {
      name: "businessType",
      type: "select",
      label: "Business Type *",
      step: 1,
      gridSpan: "col-span-3",
      required: true,
      options: [
        { key: "private_company", label: "Private Company" },
        { key: "public_company", label: "Public Company" },
        { key: "non_profit", label: "Non-Profit" },
        { key: "sole_proprietorship", label: "Sole Proprietorship" },
      ],
    },
    {
      name: "ein",
      type: "text",
      label: "EIN / Tax ID *",
      placeholder: "12-3456789",
      step: 1,
      gridSpan: "col-span-3",
      required: true,
    },
    {
      name: "address",
      type: "text",
      label: "Business Address *",
      placeholder: "123 Main Street, Suite 100",
      step: 1,
      gridSpan: "col-span-6",
      required: true,
    },
    {
      name: "city",
      type: "text",
      label: "City *",
      placeholder: "San Francisco",
      step: 1,
      gridSpan: "col-span-2",
      required: true,
    },
    {
      name: "state",
      type: "text",
      label: "State *",
      placeholder: "CA",
      step: 1,
      gridSpan: "col-span-2",
      required: true,
    },
    {
      name: "zipCode",
      type: "text",
      label: "ZIP Code *",
      placeholder: "94102",
      step: 1,
      gridSpan: "col-span-2",
      required: true,
    },
    {
      name: "website",
      type: "url",
      label: "Website *",
      placeholder: "https://practiceroi.com",
      step: 1,
      gridSpan: "col-span-3",
      required: true,
    },
    {
      name: "industry",
      type: "select",
      label: "Industry Vertical *",
      step: 1,
      gridSpan: "col-span-3",
      required: true,
      options: [
        { key: "professional_services", label: "Professional Services" },
        { key: "healthcare", label: "Healthcare" },
        { key: "retail", label: "Retail" },
        { key: "fincial_services", label: "Fincial Services" },
        { key: "education", label: "Education" },
        { key: "other", label: "Other" },
      ],
    },
    {
      name: "firstName",
      type: "text",
      label: "First Name *",
      placeholder: "John",
      step: 1,
      gridSpan: "col-span-3",
      required: true,
    },
    {
      name: "lastName",
      type: "text",
      label: "Last Name *",
      placeholder: "Doe",
      step: 1,
      gridSpan: "col-span-3",
      required: true,
    },
    {
      name: "email",
      type: "email",
      label: "Email *",
      placeholder: "john@practiceroi.com",
      step: 1,
      gridSpan: "col-span-3",
      required: true,
    },
    {
      name: "phone",
      type: "tel",
      label: "Phone *",
      placeholder: "(555) 123-4567",
      step: 1,
      gridSpan: "col-span-3",
      required: true,
    },

    // Step 2: Campaign Details
    {
      name: "campaignName",
      type: "text",
      label: "Campaign Name *",
      placeholder: "Patient Communication & Appointment Reminders",
      step: 2,
      gridSpan: "col-span-6",
      required: true,
    },
    {
      name: "useCase",
      type: "select",
      label: "Primary Use Case *",
      step: 2,
      gridSpan: "col-span-6",
      required: true,
      options: [
        { key: "mixed", label: "Mixed Marketing & Notifications" },
        { key: "accountVerification", label: "2FA / Account Verification" },
        { key: "accountNotification", label: "Account Notification" },
        { key: "customerCare", label: "Customer Care" },
        { key: "deliveryNotifications", label: "Delivery Notifications" },
        { key: "marketing", label: "Marketing" },
        { key: "polling_voting", label: "Polling & Voting" },
      ],
    },
    {
      name: "campaignDescription",
      type: "textarea",
      label: "Campaign Description *",
      placeholder: "Describe how you will use SMS messaging...",
      step: 2,
      gridSpan: "col-span-6",
      required: true,
      helperText: "Include details about appointment reminders, marketing messages, patient communications, etc.",
    },
    {
      name: "messageFlow",
      type: "textarea",
      label: "Message Flow *",
      placeholder: "Describe the typical conversation flow...",
      step: 2,
      gridSpan: "col-span-6",
      required: true,
      helperText: 'Example: "Patient books appointment -> Confirmation SMS -> Reminder 24hrs before -> Follow-up after visit"',
    },
    {
      name: "monthlyVolume",
      type: "select",
      label: "Expected Monthly Volume *",
      step: 2,
      gridSpan: "col-span-6",
      required: true,
      options: [
        { key: "low", label: "Low (0-10,000 messages/month)" },
        { key: "medium", label: "Medium (10,000-100,000 messages/month)" },
        { key: "high", label: "High (100,000+ messages/month)" },
      ],
    },

    // Step 3: Sample Messages
    {
      name: "optInMethod",
      type: "select",
      label: "Opt-In Method *",
      step: 3,
      gridSpan: "col-span-6",
      required: true,
      options: [
        { key: "verbal", label: "Verbal Consent" },
        { key: "web_form", label: "Web Form" },
        { key: "paper_form", label: "Paper Form" },
        { key: "mobile_qr_code", label: "Mobile QR Code" },
        { key: "sms_keyword", label: "SMS Keyword" },
      ],
    },
    {
      name: "optInMessage",
      type: "textarea",
      label: "Opt-In Confirmation Message *",
      placeholder: "Welcome to Practice ROI! You'll receive appointment reminders and practice updates. Reply STOP to opt-out. Msg&data rates may apply.",
      step: 3,
      gridSpan: "col-span-6",
      required: true,
    },
    {
      name: "optOutMessage",
      type: "text",
      label: "Opt-Out Message *",
      placeholder: "Reply STOP to unsubscribe",
      step: 3,
      gridSpan: "col-span-3",
      required: true,
    },
    {
      name: "helpMessage",
      type: "text",
      label: "Help Message *",
      placeholder: "Reply HELP for assistance",
      step: 3,
      gridSpan: "col-span-3",
      required: true,
    },
  ];

  // Unified Form State
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "private_company",
    ein: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    website: "",
    industry: "professional_services",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    campaignName: "",
    useCase: "mixed",
    campaignDescription: "",
    messageFlow: "",
    monthlyVolume: "low",
    optInMethod: "verbal",
    optInMessage: "",
    optOutMessage: "",
    helpMessage: "",
  });

  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);

  const { data: registrationRes, isLoading: isFetchingData } = useFetchA2PRegistration();
  const { mutate: saveRegistration, isPending: isSaving } = useSaveA2PRegistration();
  const { mutate: updateRegistration, isPending: isUpdating } = useUpdateA2PRegistration();

  const registrationData = registrationRes?.data;
  const hasExistingRegistration = !!registrationData;
  const isSubmitting = isSaving || isUpdating;

  // Reset/Load modal state when opened or registration data loads
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setErrors({});
      if (registrationData) {
        setFormData({
          businessName: registrationData.businessName || "",
          businessType: registrationData.businessType || "private_company",
          ein: registrationData.ein || "",
          address: registrationData.address || "",
          city: registrationData.city || "",
          state: registrationData.state || "",
          zipCode: registrationData.zipCode || "",
          website: registrationData.website || "",
          industry: registrationData.industry || "professional_services",
          firstName: registrationData.firstName || "",
          lastName: registrationData.lastName || "",
          email: registrationData.email || "",
          phone: registrationData.phone || "",
          campaignName: registrationData.campaignName || "",
          useCase: registrationData.useCase || "mixed",
          campaignDescription: registrationData.campaignDescription || "",
          messageFlow: registrationData.messageFlow || "",
          monthlyVolume: registrationData.monthlyVolume || "low",
          optInMethod: registrationData.optInMethod || "verbal",
          optInMessage: registrationData.optInMessage || "",
          optOutMessage: registrationData.optOutMessage || "",
          helpMessage: registrationData.helpMessage || "",
        });
        setSelectedNumbers(registrationData.selectedNumbers || []);
      } else {
        setFormData({
          businessName: "",
          businessType: "private_company",
          ein: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          website: "",
          industry: "professional_services",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          campaignName: "",
          useCase: "mixed",
          campaignDescription: "",
          messageFlow: "",
          monthlyVolume: "low",
          optInMethod: "verbal",
          optInMessage: "",
          optOutMessage: "",
          helpMessage: "",
        });
        setSelectedNumbers(phoneNumbers.map((n) => n.phoneNumber));
      }
    }
  }, [isOpen, registrationData, phoneNumbers]);

  const validateField = (name: string, value: string) => {
    const field = fieldsConfig.find((f) => f.name === name);
    if (!field) return "";

    const val = (value || "").trim();

    if (field.required && !val) {
      if (field.type === "select") {
        return "true"; // flag for isInvalid styling
      } else {
        return `${field.label.replace(" *", "")} is required`;
      }
    }

    if (val) {
      if (field.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          return "Please enter a valid email address";
        }
      } else if (field.name === "zipCode") {
        const zipRegex = /^[0-9a-zA-Z\s-]{5,10}$/;
        if (!zipRegex.test(val)) {
          return "Please enter a valid ZIP/Postal code";
        }
      } else if (field.type === "url" || field.name === "website") {
        const urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
        if (!urlRegex.test(val)) {
          return "Please enter a valid URL (e.g. https://example.com)";
        }
      } else if (field.type === "tel" || field.name === "phone") {
        const phoneRegex = /^\+?(\d{1,3})?[-.\s()]*\d{3}[-.\s()]*\d{3}[-.\s()]*\d{4}$/;
        if (!phoneRegex.test(val)) {
          return "Please enter a valid 10-digit phone number";
        }
      }
    }

    return "";
  };

  const handleFieldChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => {
      const copy = { ...prev };
      if (error) {
        copy[name] = error;
      } else {
        delete copy[name];
      }
      return copy;
    });
  };

  const handleFieldBlur = (name: string) => {
    const val = ((formData as any)[name] || "");
    const error = validateField(name, val);
    setErrors((prev) => {
      const copy = { ...prev };
      if (error) {
        copy[name] = error;
      } else {
        delete copy[name];
      }
      return copy;
    });
  };

  const toggleNumberSelection = (num: string) => {
    setSelectedNumbers((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  // Step validation with format assertions
  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    const stepFields = fieldsConfig.filter((f) => f.step === step);

    stepFields.forEach((field) => {
      const val = ((formData as any)[field.name] || "");
      const error = validateField(field.name, val);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors((prev) => {
      const copy = { ...prev };
      stepFields.forEach((field) => {
        const errMsg = newErrors[field.name];
        if (errMsg) {
          copy[field.name] = errMsg;
        } else {
          delete copy[field.name];
        }
      });
      return copy;
    });

    if (Object.keys(newErrors).length > 0) {
      return false;
    }

    if (step === 4 && selectedNumbers.length === 0) {
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    const payload = {
      ...formData,
      selectedNumbers,
    };

    if (hasExistingRegistration) {
      updateRegistration(payload, {
        onSuccess: () => {
          onClose();
        },
      });
    } else {
      saveRegistration(payload, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const stepsList = [
    { num: 1, label: "Brand Information", icon: <FiBriefcase className="w-4 h-4" /> },
    { num: 2, label: "Campaign Details", icon: <FiFileText className="w-4 h-4" /> },
    { num: 3, label: "Sample Messages", icon: <FiMessageSquare className="w-4 h-4" /> },
    { num: 4, label: "Phone Numbers", icon: <FiPhone className="w-4 h-4" /> },
    { num: 5, label: "Review & Submit", icon: <FiShield className="w-4 h-4" /> },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="xl"
      classNames={{
        base: "max-sm:!m-3 !m-0 bg-background border border-foreground/10 text-foreground rounded-2xl max-h-[90vh] flex flex-col overflow-hidden",
        closeButton: "cursor-pointer text-foreground/50 hover:text-foreground",
      }}
      placement="center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 p-5 pb-2">
          <div className="flex items-center gap-2">
            <FiMessageSquare className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">A2P SMS Registration</h2>
          </div>
          <p className="text-xs text-foreground-500 font-normal">
            Register your business for compliant SMS messaging
          </p>
        </ModalHeader>

        {!isFetchingData && (
          <div className="px-5 pb-3 border-b border-foreground/5 select-none">
            {/* Steps Progress Indicator */}
            <div className="flex items-center justify-between w-full px-1 overflow-x-auto pb-2 scrollbar-none">
              {stepsList.map((s, idx) => {
                const isCompleted = step > s.num;
                const isActive = step === s.num;

                return (
                  <div key={s.num} className="flex items-center flex-1 last:flex-initial">
                    <div className="flex flex-col items-center gap-1.5 min-w-[64px]">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : isActive
                            ? "bg-primary border-primary text-white"
                            : "bg-default-50 border-foreground/10 text-foreground-400 dark:bg-default-100/50"
                          }`}
                      >
                        {isCompleted ? <FiCheck className="w-4 h-4" /> : s.icon}
                      </div>
                      <span
                        className={`text-[9px] font-bold text-center leading-tight max-w-[80px] ${isActive
                          ? "text-primary font-extrabold"
                          : isCompleted
                            ? "text-green-500 font-semibold"
                            : "text-foreground-400"
                          }`}
                      >
                        {s.label}
                      </span>
                    </div>

                    {idx < stepsList.length - 1 && (
                      <div
                        className={`h-[2px] flex-1 mx-2 border-t border-dashed ${isCompleted ? "border-green-500" : "border-foreground/10"
                          }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <ModalBody className="p-5 pt-4 flex flex-col gap-6 overflow-y-auto">
          {isFetchingData ? (
            <div className="flex flex-col items-center justify-center py-20 w-full gap-2">
              <Spinner label="Loading registration details..." size="lg" color="primary" />
            </div>
          ) : (
            <>
              {/* Step Contents */}
              <div className="flex flex-col gap-4">
                {/* Step 1, 2, 3 Fields Renderer */}
                {(step === 1 || step === 2 || step === 3) && (
                  <div className="grid grid-cols-6 gap-4 animate-in fade-in duration-200">
                    {/* Header Notes */}
                    <div className="col-span-6 bg-primary-50/50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30 rounded-xl p-4 flex gap-3 items-start">
                      <FiInfo className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex flex-col gap-0.5">
                        <h4 className="text-xs font-bold text-primary">
                          {step === 1 && "Business Verification Required"}
                          {step === 2 && "Campaign Information"}
                          {step === 3 && "Opt-In & Compliance Messages"}
                        </h4>
                        <p className="text-[11px] text-primary-700/80 dark:text-primary-400/80 leading-relaxed">
                          {step === 1 && "Provide your business information for identity verification. This is required by carriers for SMS compliance."}
                          {step === 2 && "Describe your SMS campaign use case. This helps carriers understand your messaging patterns."}
                          {step === 3 && "Define how users consent to receive messages and how they can opt-out."}
                        </p>
                      </div>
                    </div>

                    {/* Dynamic Fields mapping */}
                    {fieldsConfig
                      .filter((f) => f.step === step)
                      .map((field) => {
                        const isSelect = field.type === "select";
                        const isTextarea = field.type === "textarea";

                        const fieldElement = (
                          <div key={field.name} className={field.gridSpan}>
                            {isSelect ? (
                              <Select
                                label={field.label}
                                labelPlacement="outside"
                                selectedKeys={[(formData as any)[field.name]]}
                                onSelectionChange={(keys) =>
                                  handleFieldChange(field.name, Array.from(keys)[0] as string)
                                }
                                onBlur={() => handleFieldBlur(field.name)}
                                variant="bordered"
                                isInvalid={!!errors[field.name]}
                                classNames={{
                                  label: "text-xs font-semibold text-foreground mb-1",
                                  trigger: "border border-foreground/10 rounded-lg bg-transparent h-10 min-h-10",
                                  value: "text-sm",
                                }}
                              >
                                {(field.options || []).map((opt) => (
                                  <SelectItem key={opt.key} textValue={opt.label}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </Select>
                            ) : isTextarea ? (
                              <div className="flex flex-col gap-1 w-full">
                                <Textarea
                                  label={field.label}
                                  labelPlacement="outside"
                                  placeholder={field.placeholder || ""}
                                  value={(formData as any)[field.name]}
                                  onValueChange={(val) => handleFieldChange(field.name, val)}
                                  onBlur={() => handleFieldBlur(field.name)}
                                  isInvalid={!!errors[field.name]}
                                  errorMessage={errors[field.name] || ""}
                                  classNames={{
                                    label: "text-xs font-semibold text-foreground mb-1",
                                    inputWrapper: "border border-foreground/10 rounded-lg bg-transparent min-h-[80px] p-2",
                                    input: "text-sm",
                                  }}
                                />
                                {field.helperText && (
                                  <p className="text-[10px] text-foreground-400">{field.helperText}</p>
                                )}
                              </div>
                            ) : (
                              <Input
                                type={field.type}
                                label={field.label}
                                labelPlacement="outside"
                                placeholder={field.placeholder || ""}
                                value={(formData as any)[field.name]}
                                onValueChange={(val) => handleFieldChange(field.name, val)}
                                onBlur={() => handleFieldBlur(field.name)}
                                isInvalid={!!errors[field.name]}
                                errorMessage={errors[field.name] || ""}
                                classNames={{
                                  label: "text-xs font-semibold text-foreground mb-1",
                                  inputWrapper: "border border-foreground/10 rounded-lg bg-transparent h-10",
                                  input: "text-sm",
                                }}
                              />
                            )}
                          </div>
                        );

                        // Inject Contact Person Heading
                        if (step === 1 && field.name === "firstName") {
                          return (
                            <Fragment key="contact-heading-frag">
                              <div className="col-span-6 border-b border-foreground/5 pb-2 mt-2">
                                <h3 className="text-xs font-bold text-foreground">Contact Person</h3>
                              </div>
                              {fieldElement}
                            </Fragment>
                          );
                        }

                        return fieldElement;
                      })}

                    {/* Sample Compliance Message Visual block under Step 3 */}
                    {step === 3 && (
                      <div className="col-span-6 border border-foreground/10 dark:bg-foreground/5 rounded-xl p-4 flex flex-col gap-2.5 bg-default-50/50 mt-2">
                        <div className="flex items-center gap-1.5 text-foreground font-bold text-[10px] uppercase tracking-wider text-foreground-500">
                          <FiMessageSquare className="w-3.5 h-3.5 text-primary" />
                          <span>Sample Message Examples</span>
                        </div>
                        <div className="flex flex-col gap-2.5">
                          <div className="bg-background border border-foreground/5 p-3 rounded-lg flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-foreground">Appointment Reminder:</span>
                            <p className="text-[10px] text-foreground-500 leading-relaxed">
                              "Hi Sarah! This is Practice ROI reminding you of your appointment tomorrow at 2:00 PM with Dr. Smith. Reply CONFIRM to confirm or RESCHEDULE to change. Reply STOP to opt-out."
                            </p>
                          </div>
                          <div className="bg-background border border-foreground/5 p-3 rounded-lg flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-foreground">Marketing Message:</span>
                            <p className="text-[10px] text-foreground-500 leading-relaxed">
                              "Special offer! Get 20% off your next orthodontic consultation. Book now: practiceroi.com/book. Reply STOP to opt-out."
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Phone Numbers Selection */}
                {step === 4 && (
                  <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                    <div className="bg-primary-50/50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30 rounded-xl p-4 flex gap-3 items-start">
                      <FiInfo className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex flex-col gap-0.5">
                        <h4 className="text-xs font-bold text-primary">Assign Phone Numbers</h4>
                        <p className="text-[11px] text-primary-700/80 dark:text-primary-400/80 leading-relaxed">
                          Select which phone numbers will be used for this SMS campaign.
                        </p>
                      </div>
                    </div>

                    {phoneNumbers.length === 0 ? (
                      <div className="border border-dashed border-foreground/15 rounded-xl p-8 flex flex-col items-center justify-center gap-2 text-center my-4">
                        <FiPhone className="w-8 h-8 text-foreground-300" />
                        <p className="text-xs text-foreground-500 font-bold">No Purchased Numbers Available</p>
                        <p className="text-[10px] text-foreground-400 max-w-[280px] mt-1 leading-normal">
                          You must purchase at least one phone number in the Twilio calling integration before registering for SMS.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                        {phoneNumbers.map((num) => {
                          const isSelected = selectedNumbers.includes(num.phoneNumber);
                          return (
                            <div
                              key={num.id}
                              onClick={() => toggleNumberSelection(num.phoneNumber)}
                              className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${isSelected
                                ? "border-primary bg-primary-500/10 dark:bg-primary-950/25 ring-2 ring-primary/45 shadow-sm"
                                : "border-foreground/10 hover:bg-foreground/5 bg-background"
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  isSelected={isSelected}
                                  onValueChange={() => toggleNumberSelection(num.phoneNumber)}
                                  onClick={(e) => e.stopPropagation()}
                                  color="primary"
                                  size="sm"
                                  aria-label={`Select ${num.phoneNumber}`}
                                />
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-foreground">
                                    {num.phoneNumber}
                                  </span>
                                  <span className="text-[11px] text-foreground-500">{num.label}</span>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                {num.capabilities?.voice && (
                                  <span className="text-[9px] bg-foreground/10 text-foreground-600 dark:text-foreground-300 px-2 py-0.5 rounded font-medium">
                                    Voice
                                  </span>
                                )}
                                {num.capabilities?.SMS && (
                                  <span className="text-[9px] bg-foreground/10 text-foreground-600 dark:text-foreground-300 px-2 py-0.5 rounded font-medium">
                                    SMS
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 5: Review & Submit */}
                {step === 5 && (
                  <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                    <div className="bg-primary-50/50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30 rounded-xl p-4 flex gap-3 items-start">
                      <FiInfo className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex flex-col gap-0.5">
                        <h4 className="text-xs font-bold text-primary">Review Your Submission</h4>
                        <p className="text-[11px] text-primary-700/80 dark:text-primary-400/80 leading-relaxed">
                          Please review your information before submitting. Approval typically takes 1-2 business days.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
                      {/* Brand Information Section */}
                      <div className="border border-foreground/10 rounded-xl p-4 bg-background flex flex-col gap-3">
                        <h3 className="text-xs font-bold text-foreground border-b border-foreground/5 pb-2">
                          Brand Information
                        </h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-foreground-400 text-[10px]">Business Name:</span>
                            <span className="font-bold text-foreground">{formData.businessName || "Not provided"}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-foreground-400 text-[10px]">EIN:</span>
                            <span className="font-bold text-foreground">{formData.ein || "Not provided"}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-foreground-400 text-[10px]">Industry:</span>
                            <span className="font-bold text-foreground uppercase">
                              {formData.industry.replace("_", " ")}
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-foreground-400 text-[10px]">Contact:</span>
                            <span className="font-bold text-foreground">
                              {formData.firstName || formData.lastName ? `${formData.firstName} ${formData.lastName}` : "Not provided"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Campaign Details Section */}
                      <div className="border border-foreground/10 rounded-xl p-4 bg-background flex flex-col gap-3">
                        <h3 className="text-xs font-bold text-foreground border-b border-foreground/5 pb-2">
                          Campaign Details
                        </h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                          <div className="flex flex-col gap-0.5 col-span-2">
                            <span className="text-foreground-400 text-[10px]">Campaign Name:</span>
                            <span className="font-bold text-foreground">{formData.campaignName || "Not provided"}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-foreground-400 text-[10px]">Use Case:</span>
                            <span className="font-bold text-foreground uppercase">
                              {formData.useCase}
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-foreground-400 text-[10px]">Volume:</span>
                            <span className="font-bold text-foreground uppercase">
                              {formData.monthlyVolume}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Phone Numbers Section */}
                      <div className="border border-foreground/10 rounded-xl p-4 bg-background flex flex-col gap-2">
                        <h3 className="text-xs font-bold text-foreground border-b border-foreground/5 pb-2">
                          Phone Numbers
                        </h3>
                        <span className="text-xs font-bold text-foreground">
                          {selectedNumbers.length} number{selectedNumbers.length !== 1 && "s"} selected
                        </span>
                      </div>

                      {/* What Happens Next Section */}
                      <div className="border border-amber-200 dark:border-amber-900/30 bg-amber-50/40 dark:bg-amber-950/10 rounded-xl p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-400 font-bold text-xs">
                          <FiClock className="w-4 h-4 text-amber-500" />
                          <span>What Happens Next?</span>
                        </div>
                        <ul className="text-[10px] text-amber-800/90 dark:text-amber-400/90 list-disc pl-4 space-y-1 font-medium leading-relaxed">
                          <li>Your registration will be submitted to mobile carriers</li>
                          <li>Review typically takes 1-2 business days</li>
                          <li>You'll receive an email when approved</li>
                          <li>Once approved, you can start sending SMS messages</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </ModalBody>

        <ModalFooter className="p-5 pt-2 flex gap-3 justify-end border-t border-foreground/5">
          {step > 1 && (
            <Button
              variant="bordered"
              onPress={handleBack}
              disabled={isSubmitting || isFetchingData}
              className="border border-foreground/10 rounded-lg text-xs font-semibold h-9 px-4"
            >
              Back
            </Button>
          )}

          <Button
            variant="bordered"
            onPress={onClose}
            disabled={isSubmitting || isFetchingData}
            className="border border-foreground/10 rounded-lg text-xs font-semibold h-9 px-4"
          >
            Cancel
          </Button>

          {step < 5 ? (
            <Button
              color="primary"
              onPress={handleNext}
              disabled={isFetchingData || (step === 4 && selectedNumbers.length === 0)}
              className="bg-primary text-white rounded-lg text-xs font-semibold h-9 px-4 flex items-center gap-1"
            >
              Next &rarr;
            </Button>
          ) : (
            <Button
              color="success"
              onPress={handleSubmit}
              isLoading={isSubmitting}
              disabled={isFetchingData}
              startContent={!isSubmitting && <FiCheckCircle className="w-4 h-4" />}
              className="bg-green-600 text-white rounded-lg text-xs font-semibold h-9 px-4"
            >
              Submit Registration
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
