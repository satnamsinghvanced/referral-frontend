import {
  Button,
  Card,
  CardBody,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { getLocalTimeZone, now } from "@internationalized/date";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaRegStar } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { EMAIL_REGEX, NAME_REGEX, PHONE_REGEX } from "../../../consts/consts";
import { TREATMENT_OPTIONS, URGENCY_OPTIONS } from "../../../consts/referral";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";

interface WebhookFormValues {
  fullName: string;
  email: string;
  phone: string;
  age: number | "";
  insuranceProvider: string;
  preferredTreatment: string;
  scheduledDate: string;
  urgencyLevel: string;
  notes: string;
}

function WebhookReferralForm() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [webhookSecret, setWebhookSecret] = useState<string>("");

  // Fetch webhook secret on component mount
  useEffect(() => {
    const fetchWebhookSecret = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/webhook/referral`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (response.data?.data?.secretKey) {
          setWebhookSecret(response.data.data.secretKey);
        }
      } catch (err) {
        console.error("Failed to fetch webhook secret:", err);
      }
    };

    fetchWebhookSecret();
  }, []);

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .trim()
      .required("Full name is required")
      .matches(
        NAME_REGEX,
        "Full name can only contain letters, spaces, hyphens, apostrophes, and full stops",
      )
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must be less than 100 characters"),
    email: Yup.string()
      .required("Email is required")
      .matches(EMAIL_REGEX, "Invalid email format"),
    phone: Yup.string()
      .matches(PHONE_REGEX, "Phone must be in format (XXX) XXX-XXXX")
      .required("Phone is required"),
    age: Yup.number()
      .required("Age is required")
      .integer("Age must be a whole number")
      .min(1, "Age must be greater than 0")
      .max(120, "Age must be less than or equal to 120")
      .typeError("Age must be a number"),
    insuranceProvider: Yup.string()
      .max(100, "Insurance provider must be less than 100 characters")
      .nullable(),
    preferredTreatment: Yup.string().required(
      "Preferred treatment is required",
    ),
    urgencyLevel: Yup.string().required("Urgency level is required"),
    notes: Yup.string()
      .max(1000, "Additional notes must be less than 1000 characters")
      .nullable(),
    scheduledDate: Yup.string().nullable(),
  });

  const formFields = [
    {
      type: "text",
      name: "fullName",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
      maxLength: 100,
    },
    {
      type: "number",
      name: "age",
      label: "Age",
      placeholder: "Enter age",
      required: true,
      maxLength: 3,
    },
    {
      type: "email",
      name: "email",
      label: "Email Address",
      placeholder: "your.email@example.com",
      required: true,
      maxLength: 255,
    },
    {
      type: "tel",
      name: "phone",
      label: "Phone Number",
      placeholder: "(555) 123-4567",
      maxLength: 14,
      required: true,
    },
    {
      type: "text",
      name: "insuranceProvider",
      label: "Insurance Provider",
      placeholder: "e.g., Delta Dental, Aetna, Cigna, etc.",
      maxLength: 100,
    },
    {
      type: "date",
      name: "scheduledDate",
      label: "Scheduled Date",
      placeholder: "Select scheduled date",
    },
  ];

  const formik = useFormik<WebhookFormValues>({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      age: "",
      insuranceProvider: "",
      preferredTreatment: TREATMENT_OPTIONS[0]?.key || "invisalign",
      urgencyLevel: URGENCY_OPTIONS[0]?.key || "medium",
      scheduledDate: "",
      notes: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const webhookUrl = `${import.meta.env.VITE_API_BASE_URL?.replace("/api", "")}/webhook/referral/${userId}`;

        await axios.post(
          webhookUrl,
          {
            name: values.fullName,
            email: values.email,
            age: Number(values.age),
            phone: values.phone,
            insurance: values.insuranceProvider || undefined,
            scheduledDate: values.scheduledDate || undefined,
            treatment: values.preferredTreatment,
            priority: values.urgencyLevel,
            notes: values.notes || undefined,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-referral-signature": webhookSecret || "DEMO_SECRET_KEY",
            },
          },
        );

        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          formik.resetForm();
        }, 3000);
      } catch (err: any) {
        formik.setStatus(
          err?.response?.data?.message ||
            "Failed to submit referral. Please try again.",
        );
      }
    },
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof WebhookFormValues,
    type: string,
    maxLength?: number,
  ) => {
    let value: string | number | undefined = event.target.value;

    if (type === "tel") {
      value = formatPhoneNumber(value);
    } else if (type === "number") {
      if (maxLength && value.length > maxLength) {
        return;
      }
      value = value === "" ? "" : Number(value);
    }

    formik.setFieldValue(fieldName as string, value);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-background dark:to-background flex items-center justify-center p-4">
        <Card className="shadow-sm border-0 dark:bg-content1 max-w-md w-full">
          <CardBody className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Thank You!
            </h2>
            <p className="text-gray-600 dark:text-foreground/60">
              Your consultation has been scheduled successfully. We'll contact
              you soon.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-background dark:to-background flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto max-lg:py-5 max-lg:px-4">
        <Card className="shadow-sm border-0 dark:bg-content1">
          <CardBody className="p-5">
            <div className="mb-5">
              <h2 className="text-base font-medium mb-1.5 flex items-center gap-1.5 dark:text-white">
                <FaRegStar className="text-yellow-500 text-lg" />
                Schedule Your Orthodontic Consultation
              </h2>
              <p className="text-left text-gray-600 dark:text-foreground/60 text-xs">
                Please fill out the form below and we'll contact you to schedule
                your appointment.
              </p>
            </div>

            <form
              onSubmit={formik.handleSubmit}
              className="md:space-y-6 space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-x-4 md:gap-y-6">
                {formFields.map((field) => {
                  const fieldName = field.name as keyof WebhookFormValues;
                  const value = formik.values[fieldName];
                  const touched = formik.touched[fieldName];
                  const error = formik.errors[fieldName];

                  return field.type !== "date" ? (
                    <Input
                      key={field.name}
                      type={field.type}
                      label={field.label}
                      labelPlacement="outside-top"
                      size="sm"
                      radius="sm"
                      name={field.name}
                      placeholder={field.placeholder}
                      value={(value as string) || ""}
                      onChange={(e) =>
                        handleInputChange(
                          e as React.ChangeEvent<HTMLInputElement>,
                          fieldName,
                          field.type,
                          field.maxLength,
                        )
                      }
                      onBlur={formik.handleBlur}
                      isRequired={field.required as boolean}
                      isInvalid={!!(touched && error)}
                      errorMessage={touched && (error as string)}
                      className="w-full"
                      {...(field.name === "age"
                        ? { maxLength: field.maxLength }
                        : {})}
                    />
                  ) : (
                    <DatePicker
                      key={field.name}
                      id={field.name}
                      name={field.name}
                      label={field.label}
                      labelPlacement="outside"
                      size="sm"
                      radius="sm"
                      hideTimeZone
                      minValue={now(getLocalTimeZone())}
                      granularity="minute"
                      onChange={(dateObject: any) => {
                        if (dateObject) {
                          const year = dateObject.year;
                          const month = String(dateObject.month).padStart(
                            2,
                            "0",
                          );
                          const day = String(dateObject.day).padStart(2, "0");
                          const hour = String(dateObject.hour).padStart(2, "0");
                          const minute = String(dateObject.minute).padStart(
                            2,
                            "0",
                          );
                          const second = String(dateObject.second).padStart(
                            2,
                            "0",
                          );
                          const millisecond = String(
                            dateObject.millisecond,
                          ).padStart(3, "0");

                          const localDateTimeString = `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}`;
                          formik.setFieldValue(
                            fieldName as string,
                            localDateTimeString,
                          );
                        } else {
                          formik.setFieldValue(fieldName as string, null);
                        }
                      }}
                      onBlur={() => formik.setFieldTouched(fieldName, true)}
                    />
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-x-4 md:gap-y-6">
                <Select
                  label="Preferred Treatment"
                  labelPlacement="outside"
                  placeholder="Select treatment type"
                  size="sm"
                  radius="sm"
                  name="preferredTreatment"
                  selectedKeys={
                    formik.values.preferredTreatment
                      ? new Set([formik.values.preferredTreatment])
                      : new Set([])
                  }
                  disabledKeys={
                    formik.values.preferredTreatment
                      ? new Set([formik.values.preferredTreatment])
                      : new Set([])
                  }
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    formik.setFieldValue("preferredTreatment", value);
                  }}
                  onBlur={() =>
                    formik.setFieldTouched("preferredTreatment", true)
                  }
                  isInvalid={
                    !!(
                      formik.touched.preferredTreatment &&
                      formik.errors.preferredTreatment
                    )
                  }
                  errorMessage={
                    formik.touched.preferredTreatment &&
                    (formik.errors.preferredTreatment as string)
                  }
                  className="w-full"
                  isRequired
                >
                  {TREATMENT_OPTIONS.map((treatment) => (
                    <SelectItem key={treatment.key}>
                      {treatment.label}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Urgency Level"
                  labelPlacement="outside"
                  placeholder="Select urgency level"
                  size="sm"
                  radius="sm"
                  name="urgencyLevel"
                  selectedKeys={
                    formik.values.urgencyLevel
                      ? new Set([formik.values.urgencyLevel])
                      : new Set([])
                  }
                  disabledKeys={[formik.values.urgencyLevel]}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    formik.setFieldValue("urgencyLevel", value);
                  }}
                  onBlur={() => formik.setFieldTouched("urgencyLevel", true)}
                  isInvalid={
                    !!(
                      formik.touched.urgencyLevel && formik.errors.urgencyLevel
                    )
                  }
                  errorMessage={
                    formik.touched.urgencyLevel &&
                    (formik.errors.urgencyLevel as string)
                  }
                  className="w-full"
                  isRequired
                >
                  {URGENCY_OPTIONS.map((urgency) => (
                    <SelectItem key={urgency.key}>{urgency.label}</SelectItem>
                  ))}
                </Select>
              </div>

              <div>
                <Textarea
                  label="Additional Notes"
                  labelPlacement="outside-top"
                  name="notes"
                  placeholder="Any additional information you'd like us to know..."
                  size="sm"
                  radius="sm"
                  value={formik.values.notes}
                  onValueChange={(val: string) =>
                    formik.setFieldValue("notes", val)
                  }
                  onBlur={formik.handleBlur}
                  minRows={3}
                  className="w-full"
                  isInvalid={!!(formik.touched.notes && formik.errors.notes)}
                  errorMessage={
                    formik.touched.notes && (formik.errors.notes as string)
                  }
                  classNames={{ inputWrapper: "py-2" }}
                />
              </div>

              {formik.status && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {formik.status}
                  </p>
                </div>
              )}

              <div>
                <Button
                  type="submit"
                  color="primary"
                  size="sm"
                  radius="sm"
                  isLoading={formik.isSubmitting}
                  isDisabled={
                    !formik.isValid || formik.isSubmitting || !formik.dirty
                  }
                  className="w-full"
                >
                  {formik.isSubmitting ? "Submitting..." : "Submit Referral"}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default WebhookReferralForm;
