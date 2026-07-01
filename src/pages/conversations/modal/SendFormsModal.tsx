import { Modal, ModalContent, ModalBody, Button, addToast } from "@heroui/react";
import { Conversation } from "../../../consts/conversations";
import { HiCheck, HiOutlinePaperAirplane } from "react-icons/hi";
import { useFormik } from "formik";
import * as Yup from "yup";

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

const SendFormsModal = ({ isOpen, onClose, lead }: SendFormsModalProps) => {
  if (!lead) return null;

  const validationSchema = Yup.object().shape({
    selectedForms: Yup.array().min(1, "Please select at least one form"),
  });

  const formik = useFormik({
    initialValues: {
      selectedForms: [] as string[],
    },
    validationSchema,
    onSubmit: (values) => {
      addToast({
        title: "Forms Sent",
        description: `Successfully sent ${values.selectedForms.length} forms to ${lead.patientName}.`,
        color: "success",
      });
      onClose();
      formik.resetForm();
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

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="center"
      size="md"
      scrollBehavior="inside"
      classNames={{
        base: "max-sm:!mx-3 max-sm:!my-4 !m-0 w-full max-w-[480px] bg-white dark:bg-content1",
        closeButton: "text-white hover:bg-white/20 z-50 top-3 right-3",
      }}
    >
      <ModalContent className="overflow-hidden">
        {(onClose) => (
          <>
            <div className="bg-[#8b5cf6] px-5 py-4 text-white">
              <h3 className="font-bold text-[15px] sm:text-[16px] leading-tight text-white">Send Forms</h3>
              <p className="text-white/85 text-[12px] sm:text-[13px] mt-0.5">To: {lead.patientName}</p>
            </div>

            <ModalBody className="px-5 py-4 gap-4">
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
                      className={`cursor-pointer rounded-xl border p-3 flex gap-3 items-center transition-all ${
                        isSelected
                          ? "border-[#8b5cf6] bg-violet-50/20 dark:bg-violet-950/20"
                          : "border-slate-200 dark:border-default-200 hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? "bg-[#8b5cf6] border-[#8b5cf6] text-white"
                            : "border-slate-300 dark:border-default-300"
                        }`}
                      >
                        {isSelected && <HiCheck className="text-[12px] stroke-[1.5]" />}
                      </div>
                      <div className="min-w-0">
                        <div
                          className={`text-[12.5px] sm:text-[13px] font-semibold leading-tight ${
                            isSelected ? "text-[#8b5cf6]" : "text-slate-700 dark:text-slate-200"
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
                  className={`flex-[2] font-bold text-white text-[12.5px] sm:text-[13px] h-9 rounded-lg ${
                    selectedCount > 0
                      ? "bg-[#8b5cf6]"
                      : "bg-[#c0a9fa] cursor-not-allowed opacity-80"
                  }`}
                  startContent={<HiOutlinePaperAirplane className="text-[15px] shrink-0 rotate-45" />}
                  onPress={() => formik.handleSubmit()}
                  disabled={selectedCount === 0}
                >
                  {selectedCount > 0 ? `Send ${selectedCount} Forms` : "Send Forms"}
                </Button>
                <Button
                  variant="bordered"
                  className="flex-1 font-semibold text-slate-600 dark:text-slate-300 border-slate-200 dark:border-default-300 text-[12.5px] sm:text-[13px] h-9 rounded-lg"
                  onPress={onClose}
                >
                  Cancel
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SendFormsModal;
