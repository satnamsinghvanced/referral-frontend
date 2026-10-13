import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Chip,
  addToast,
} from "@heroui/react";
import { useEffect } from "react";
import { useFormik } from "formik";
import { HiOutlineMail, HiOutlineInbox } from "react-icons/hi";
import * as Yup from "yup";
import { useSendLeadEmail } from "../../../hooks/useLeadPipeline";
import QuillEditor from "../../../components/editor/QuillEditor";

interface SendEmailModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  lead: {
    id?: string;
    _id?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
  } | null;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const SendEmailModal = ({ isOpen, onOpenChange, lead }: SendEmailModalProps) => {
  const { mutateAsync: sendEmail, isPending: sending } = useSendLeadEmail();

  const existingEmail =
    lead?.email && !lead.email.toLowerCase().includes("@ivr.local")
      ? lead.email.trim()
      : "";
  const hasExistingEmail = !!existingEmail;
  const recipientName =
    (lead as any)?.name ||
    `${lead?.firstName || ""} ${lead?.lastName || ""}`.trim() ||
    "Lead";

  const validationSchema = Yup.object().shape({
    email: hasExistingEmail
      ? Yup.string().notRequired()
      : Yup.string()
        .trim()
        .required("Recipient email is required")
        .matches(EMAIL_REGEX, "Invalid email format"),
    subject: Yup.string().required("Subject is required"),
    body: Yup.string().required("Email body is required"),
  });

  const formik = useFormik<{ email: string; subject: string; body: string; attachments: File[] }>({
    initialValues: {
      email: existingEmail,
      subject: "",
      body: "",
      attachments: [],
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      if (!lead) return;
      const targetEmail = hasExistingEmail ? existingEmail : values.email?.trim().toLowerCase();
      if (!targetEmail) {
        addToast({
          title: "Email Required",
          description: "Please enter a valid recipient email address.",
          color: "danger",
        });
        return;
      }
      try {
        await sendEmail({
          id: lead.id || lead._id || "",
          email: targetEmail,
          subject: values.subject,
          body: values.body,
          attachments: values.attachments,
        });
        if (!lead.email || lead.email.toLowerCase().includes("@ivr.local")) {
          lead.email = targetEmail;
        }
        resetForm();
        onOpenChange(false);
      } catch (error: any) {
        console.log("error message in send email >>>>>>>", error.message)
      }
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
      const fileInput = document.getElementById("email-attachments") as HTMLInputElement | null;
      if (fileInput) {
        fileInput.value = "";
      }
    }
  }, [isOpen]);

  if (!lead) return null;
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      placement="center"
      scrollBehavior="inside"
      classNames={{
        base: "max-sm:!m-3 !m-0 bg-content1 dark:bg-zinc-900 border border-foreground/10 rounded-2xl shadow-xl",
        closeButton: "cursor-pointer hover:bg-foreground/10 transition-colors",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 px-5 pt-5 pb-3">
              <div className="flex items-center gap-2 text-purple-500">
                <HiOutlineMail className="size-5" />
                <h4 className="text-base font-semibold text-foreground">
                  Compose Email
                </h4>
              </div>
              <p className="text-xs text-default-500 font-normal">
                Send a personalized email directly to your lead
              </p>
            </ModalHeader>
            <ModalBody className="py-2 px-5 gap-4">
              {hasExistingEmail ? (
                <div className="flex flex-col gap-1.5 p-3.5 border border-foreground/5 rounded-xl bg-default-50/50 dark:bg-white/5">
                  <span className="text-[10px] text-default-400 font-bold uppercase tracking-wider">
                    Recipient
                  </span>
                  <div className="flex items-center gap-2">
                    <Chip
                      variant="flat"
                      color="secondary"
                      size="sm"
                      className="font-semibold text-xs"
                    >
                      To: {recipientName}
                    </Chip>
                    <span className="text-xs text-default-500 truncate">
                      &lt;{existingEmail}&gt;
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 p-3.5 border border-purple-500/20 rounded-xl bg-purple-50/30 dark:bg-purple-950/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-default-400 font-bold uppercase tracking-wider">
                      Recipient
                    </span>
                    <Chip
                      variant="flat"
                      color="secondary"
                      size="sm"
                      className="font-semibold text-xs"
                    >
                      To: {recipientName}
                    </Chip>
                  </div>
                  <Input
                    label="Recipient Email Address"
                    labelPlacement="outside"
                    placeholder="Enter email address (e.g. name@example.com)"
                    variant="flat"
                    size="sm"
                    radius="md"
                    type="email"
                    name="email"
                    id="recipient-email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.touched.email && formik.errors.email)}
                    errorMessage={
                      formik.touched.email && (formik.errors.email as string)
                    }
                    startContent={<HiOutlineMail className="text-default-400 size-4" />}
                    classNames={{
                      inputWrapper:
                        "bg-white dark:bg-zinc-800 border border-foreground/10 hover:border-foreground/20 focus-within:!border-purple-500 transition-colors",
                    }}
                    isRequired
                  />
                  <p className="text-[11px] text-default-400">
                    This lead does not have an email saved yet. Enter it here to send the email and save it to the lead.
                  </p>
                </div>
              )}
              <div className="space-y-4">
                <Input
                  label="Subject"
                  labelPlacement="outside"
                  placeholder="Enter email subject line"
                  variant="flat"
                  size="sm"
                  radius="md"
                  name="subject"
                  autoComplete="off"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.touched.subject && formik.errors.subject)}
                  errorMessage={
                    formik.touched.subject && (formik.errors.subject as string)
                  }
                  classNames={{
                    inputWrapper: "bg-default-100 hover:bg-default-200 focus-within:!bg-default-100 transition-colors",
                  }}
                  isRequired
                />
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Message Body <span className="text-danger">*</span>
                  </label>
                  <QuillEditor
                    value={formik.values.body}
                    onChange={(val) => formik.setFieldValue("body", val)}
                    placeholder="Type your email content here..."
                    enableImage={false}
                  />
                  {formik.touched.body && formik.errors.body && (
                    <span className="text-xs text-danger">{formik.errors.body as string}</span>
                  )}
                </div>
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <span>Attachments</span>
                    <span className="text-[10px] text-default-400 font-normal">
                      (Max size: 10MB per file)
                    </span>
                  </label>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id="email-attachments"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const validFiles: File[] = [];
                      let hasOverSized = false;
                      for (const file of files) {
                        if (file.size > 10 * 1024 * 1024) {
                          hasOverSized = true;
                        } else {
                          validFiles.push(file);
                        }
                      }
                      if (hasOverSized) {
                        addToast({
                          title: "File too large",
                          description: "Some files exceed the maximum size of 10 MB and were not added.",
                          color: "danger",
                        });
                      }
                      if (validFiles.length > 0) {
                        formik.setFieldValue("attachments", [
                          ...(formik.values.attachments || []),
                          ...validFiles,
                        ]);
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2 items-center">
                    <Button
                      size="sm"
                      variant="bordered"
                      className="border-dashed border-foreground/10 text-default-600 font-medium"
                      onPress={() => document.getElementById("email-attachments")?.click()}
                    >
                      Choose Files...
                    </Button>
                    {(formik.values.attachments || []).map((file: File, index: number) => (
                      <Chip
                        key={index}
                        variant="flat"
                        size="sm"
                        onClose={() => {
                          const updated = [...(formik.values.attachments || [])];
                          updated.splice(index, 1);
                          formik.setFieldValue("attachments", updated);
                        }}
                        className="text-xs max-w-xs truncate"
                      >
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="px-5 pb-5 pt-3">
              <Button
                size="sm"
                radius="md"
                variant="light"
                onPress={onClose}
                className="font-medium hover:bg-default-100 transition-colors"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                radius="md"
                variant="solid"
                color="secondary"
                className="font-semibold bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20 transition-all"
                onPress={() => formik.handleSubmit()}
                isLoading={sending}
                startContent={!sending && <HiOutlineInbox className="text-[16px]" />}
                isDisabled={
                  sending ||
                  !formik.values.subject?.trim() ||
                  !formik.values.body?.trim() ||
                  (!hasExistingEmail && !formik.values.email?.trim())
                }
              >
                Send Email
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SendEmailModal;