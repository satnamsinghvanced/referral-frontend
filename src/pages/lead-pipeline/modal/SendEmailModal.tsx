import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  Chip,
} from "@heroui/react";
import { useFormik } from "formik";
import { HiOutlineMail, HiOutlineInbox } from "react-icons/hi";
import * as Yup from "yup";
import { useSendLeadEmail } from "../../../hooks/useLeadPipeline";

interface SendEmailModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  lead: {
    id: string;
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

const SendEmailModal = ({ isOpen, onOpenChange, lead }: SendEmailModalProps) => {
  const { mutateAsync: sendEmail, isPending: sending } = useSendLeadEmail();

  const validationSchema = Yup.object().shape({
    subject: Yup.string().required("Subject is required"),
    body: Yup.string().required("Email body is required"),
  });

  const formik = useFormik({
    initialValues: {
      subject: "",
      body: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      if (!lead) return;
      try {
        await sendEmail({
          id: lead.id || lead._id || "",
          subject: values.subject,
          body: values.body,
        });
        onOpenChange(false);
        resetForm();
      } catch (error) {
        // Handled by hook toast
      }
    },
  });

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
              {/* Recipient Details Card */}
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
                    To: {lead.firstName} {lead.lastName}
                  </Chip>
                  <span className="text-xs text-default-500 truncate">
                    &lt;{lead.email}&gt;
                  </span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <Input
                  label="Subject"
                  labelPlacement="outside"
                  placeholder="Enter email subject line"
                  variant="flat"
                  size="sm"
                  radius="md"
                  name="subject"
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
                <Textarea
                  label="Message Body"
                  labelPlacement="outside"
                  placeholder="Type your email content here..."
                  variant="flat"
                  size="sm"
                  radius="md"
                  minRows={6}
                  name="body"
                  value={formik.values.body}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.touched.body && formik.errors.body)}
                  errorMessage={
                    formik.touched.body && (formik.errors.body as string)
                  }
                  classNames={{
                    inputWrapper: "bg-default-100 hover:bg-default-200 focus-within:!bg-default-100 transition-colors",
                  }}
                  isRequired
                />
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
                isDisabled={sending || !formik.isValid || !formik.dirty}
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
