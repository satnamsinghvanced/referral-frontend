import { useState } from "react";
import { Modal, ModalContent, ModalBody, Button, addToast } from "@heroui/react";
import { Conversation } from "../../../consts/conversations";
import { HiCheck, HiOutlinePaperAirplane, HiOutlineCheckCircle } from "react-icons/hi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { sendFormLink } from "../../../services/leadTrackingForms";

interface SendFormsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Conversation | null;
}

const FORMS = [
  {
    id: "registration",
    title: "New Patient Registration",
    description: "Personal info, insurance, and contact details",
  },
  {
    id: "history",
    title: "Health History Form",
    description: "Medical conditions, medications, and allergies",
  },
  {
    id: "hipaa",
    title: "HIPAA Privacy Notice",
    description: "Required consent and privacy acknowledgment",
  },
  {
    id: "financial",
    title: "Financial Agreement",
    description: "Treatment fees, payment plans, and insurance assignment",
  },
  {
    id: "photo",
    title: "Photo / Video Consent",
    description: "Permission for before/after photography",
  },
  {
    id: "orthodontic",
    title: "Orthodontic Treatment Consent",
    description: "Treatment risks, duration, and expectations",
  },
];

const FORM_FIELDS_MAP: Record<string, any[]> = {
  registration: [
    { name: "firstName", label: "First Name", type: "text", required: true },
    { name: "lastName", label: "Last Name", type: "text", required: false },
    { name: "email", label: "Email Address", type: "text", required: true },
    { name: "phone", label: "Phone Number", type: "text", required: true },
    { name: "location", label: "Location", type: "text", required: false },
    { name: "insuranceProvider", label: "Insurance Provider", type: "text", required: false }
  ],
  history: [
    { name: "medicalConditions", label: "Medical Conditions", type: "text", required: false },
    { name: "medications", label: "Current Medications", type: "text", required: false },
    { name: "allergies", label: "Allergies", type: "text", required: false }
  ],
  hipaa: [
    { name: "hipaaConsent", label: "I accept HIPAA Privacy terms", type: "boolean", required: true }
  ],
  financial: [
    { name: "financialAgreement", label: "I accept Financial terms & conditions", type: "boolean", required: true }
  ],
  photo: [
    { name: "photoConsent", label: "I consent to Photo / Video usage", type: "boolean", required: true }
  ],
  orthodontic: [
    { name: "orthoConsent", label: "I accept Orthodontic Treatment consent", type: "boolean", required: true }
  ]
};

const SendFormsModal = ({ isOpen, onClose, lead }: SendFormsModalProps) => {
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState<{
    emailSent: boolean;
    smsSent: boolean;
    emailError?: string;
    smsError?: string;
  } | null>(null);

  const handleClose = () => {
    setGeneratedLink("");
    setDeliveryResult(null);
    setCopied(false);
    formik.resetForm();
    onClose();
  };

  const validationSchema = Yup.object().shape({
    selectedForms: Yup.array().min(1, "Please select at least one form"),
  });

  const formik = useFormik({
    initialValues: {
      selectedForms: [] as string[],
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!lead) return;

      // Require either leadId or the conversation id (fallback for pre-linked leads)
      if (!lead.leadId && !lead.id) {
        addToast({
          title: "Save Lead First",
          description: "Please open 'View Lead' and save this contact as a lead first.",
          color: "danger",
        });
        return;
      }

      // Combine selected fields
      const combinedFields: any[] = [];
      const selectedTitles: string[] = [];

      values.selectedForms.forEach((formId) => {
        const formObj = FORMS.find(f => f.id === formId);
        if (formObj) {
          selectedTitles.push(formObj.title);
        }
        const fields = FORM_FIELDS_MAP[formId];
        if (fields) {
          // Avoid duplicate field names
          fields.forEach((newField) => {
            if (!combinedFields.some((f) => f.name === newField.name)) {
              combinedFields.push(newField);
            }
          });
        }
      });

      const formName = selectedTitles.join(", ");

      try {
        const payload: Parameters<typeof sendFormLink>[0] = {
          formName,
          fields: combinedFields,
          sendType: "both"
        };
        if (lead.leadId) {
          payload.leadId = lead.leadId;
        } else {
          payload.conversationId = lead.id; // fallback for pre-linked leads
        }
        const res = await sendFormLink(payload);

        if (res && res.success && res.data) {
          setGeneratedLink(res.data.formLink);
          setDeliveryResult({
            emailSent: res.data.emailSent,
            smsSent: res.data.smsSent,
            emailError: res.data.emailError,
            smsError: res.data.smsError
          });
        } else {
          setGeneratedLink(res.formLink || "");
        }

        addToast({
          title: "Link Created",
          description: `link generated successfully.`,
          color: "success",
        });
      } catch (err: any) {
        console.error("Failed to generate form link", err);
        addToast({
          title: "Send Error",
          description: err.response?.data?.message || err.message || "Failed to generate dynamic forms.",
          color: "danger",
        });
      }
    },
  });

  const toggleForm = (id: string) => {
    const current = formik.values.selectedForms;
    const next = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];
    formik.setFieldValue("selectedForms", next);
  };

  const selectedCount = formik.values.selectedForms.length;

  if (!lead) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      placement="center"
      size="md"
      scrollBehavior="inside"
      classNames={{
        base: "max-sm:!mx-3 max-sm:!my-4 !m-0 w-full max-w-[480px] bg-white dark:bg-content1",
        closeButton: "text-white hover:bg-white/20 z-50 top-3 right-3",
      }}
    >
      <ModalContent className="overflow-hidden">
        {() => (
          <>
            <div className="bg-[#8b5cf6] px-5 py-4 text-white">
              <h3 className="font-bold text-[15px] sm:text-[16px] leading-tight text-white">
                {generatedLink ? "Form Link Generated" : "Send Forms"}
              </h3>
              <p className="text-white/85 text-[12px] sm:text-[13px] mt-0.5">To: {lead.patientName}</p>
            </div>

            <ModalBody className="px-5 py-4 gap-4">
              {generatedLink ? (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    The Forms link has been successfully created for the selected form(s).
                  </p>

                  {deliveryResult && (
                    <div className="space-y-2 p-3 bg-slate-50 dark:bg-default-50/20 rounded-xl border border-slate-100 dark:border-default-200/50">
                      <div className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">
                        Delivery Status:
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Email Delivery:</span>
                        {deliveryResult.emailSent ? (
                          <span className="text-emerald-600 font-semibold">✓ Sent</span>
                        ) : (
                          <span className="text-amber-500 font-semibold" title={deliveryResult.emailError}>
                            ⚠️ Failed ({deliveryResult.emailError || "Credentials issue"})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-slate-500">SMS Delivery:</span>
                        {deliveryResult.smsSent ? (
                          <span className="text-emerald-600 font-semibold">✓ Sent</span>
                        ) : (
                          <span className="text-amber-500 font-semibold" title={deliveryResult.smsError}>
                            ⚠️ Failed ({deliveryResult.smsError || "Credentials issue"})
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5 mt-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Share Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={generatedLink}
                        className="flex-1 bg-slate-50 dark:bg-default-100/50 border border-slate-200 dark:border-default-200 px-3 py-1.5 text-xs rounded-lg select-all outline-none"
                      />
                      <Button
                        size="sm"
                        radius="md"
                        color={copied ? "success" : "primary"}
                        className="bg-[#8b5cf6] text-white font-semibold"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedLink);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                      >
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Copy this link to send directly in the conversation or open in a browser.
                    </p>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <Button
                      className="w-full font-bold bg-[#8b5cf6] text-white text-[12.5px] sm:text-[13px] h-9 rounded-lg"
                      onClick={handleClose}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-[12px] text-slate-500 dark:text-slate-400 leading-normal">
                    Select one or more forms to send. The patient will receive a secure link via SMS and email.
                  </div>

                  <div className="flex flex-col gap-2">
                    {FORMS.map((form) => {
                      const isSelected = formik.values.selectedForms.includes(form.id);
                      return (
                        <div
                          key={form.id}
                          onClick={() => toggleForm(form.id)}
                          className={`cursor-pointer rounded-xl border p-3 flex gap-3 items-center transition-all ${isSelected
                              ? "border-[#8b5cf6] bg-violet-50/20 dark:bg-violet-950/20"
                              : "border-slate-200 dark:border-default-200 hover:border-slate-300"
                            }`}
                        >
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${isSelected
                                ? "bg-[#8b5cf6] border-[#8b5cf6] text-white"
                                : "border-slate-300 dark:border-default-300"
                              }`}
                          >
                            {isSelected && <HiCheck className="text-[12px] stroke-[1.5]" />}
                          </div>
                          <div className="min-w-0">
                            <div
                              className={`text-[12.5px] sm:text-[13px] font-semibold leading-tight ${isSelected ? "text-[#8b5cf6]" : "text-slate-700 dark:text-slate-200"
                                }`}
                            >
                              {form.title}
                            </div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                              {form.description}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-slate-50 dark:bg-default-100/40 p-3.5 rounded-xl border border-slate-100 dark:border-default-200/50">
                    <div className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">
                      Forms will be sent via: <span className="font-bold">SMS + Email</span>
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-normal">
                      Link expires in 7 days. Patient data is encrypted and HIPAA-compliant.
                    </div>
                  </div>

                  <div className="flex gap-2.5 pb-1">
                    <Button
                      isLoading={formik.isSubmitting}
                      className={`flex-[2] font-bold text-white text-[12.5px] sm:text-[13px] h-9 rounded-lg ${selectedCount > 0
                          ? "bg-[#8b5cf6]"
                          : "bg-[#c0a9fa] cursor-not-allowed opacity-80"
                        }`}
                      startContent={!formik.isSubmitting && <HiOutlinePaperAirplane className="text-[15px] shrink-0 rotate-45" />}
                      onPress={() => formik.handleSubmit()}
                      disabled={selectedCount === 0 || formik.isSubmitting}
                    >
                      {formik.isSubmitting ? "Sending..." : selectedCount > 0 ? `Send ${selectedCount} Forms` : "Send Forms"}
                    </Button>
                    <Button
                      variant="bordered"
                      className="flex-1 font-semibold text-slate-600 dark:text-slate-300 border-slate-200 dark:border-default-300 text-[12.5px] sm:text-[13px] h-9 rounded-lg"
                      onPress={handleClose}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SendFormsModal;
