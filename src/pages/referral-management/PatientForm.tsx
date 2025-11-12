import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaPhone, FaRegStar } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { TREATMENT_OPTIONS, URGENCY_OPTIONS } from "../../consts/referral";
import { useFetchUserForTrackings } from "../../hooks/settings/useUser";
import { useCreateReferral, useTrackScan } from "../../hooks/useReferral";
import { Referral } from "../../types/referral";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { downloadVcf } from "../../utils/vcfGenerator";
import { EMAIL_REGEX, PHONE_REGEX } from "../../consts/consts";

interface PatientFormValues {
  fullName: string;
  email: string;
  phone: string;
  age: number | "";
  insuranceProvider: string;
  preferredTreatment: string;
  urgencyLevel: string;
  preferredTime: string;
  referralReason: string;
  additionalNotes: string;
}

const PatientForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [referredBy, setReferredBy] = useState("");
  const [addedVia, setAddedVia] = useState<string>("");

  const { mutateAsync: createReferral, isPending } = useCreateReferral();
  const { data: fetchedUser } = useFetchUserForTrackings(referredBy);
  const { mutate: trackScan } = useTrackScan();

  useEffect(() => {
    const pathSegments = location.pathname.split("/referral/");
    const referralIdSegment = pathSegments.length > 1 ? pathSegments[1] : null;

    setReferredBy(referralIdSegment?.split("?")[0] || "");

    const queryParams = new URLSearchParams(location.search);
    const source = queryParams.get("source");
    setAddedVia(source || "");
  }, [location.pathname, location.search]);

  useEffect(() => {
    const trackingKey = `scanTracked_${referredBy}_${addedVia}`;
    const alreadyTracked = sessionStorage.getItem(trackingKey);

    if (referredBy && addedVia && !alreadyTracked) {
      trackScan({ userId: referredBy, source: addedVia });
      sessionStorage.setItem(trackingKey, "true");
    }
  }, [referredBy, addedVia, trackScan]);

  const validationSchema = Yup.object<PatientFormValues>().shape({
    fullName: Yup.string()
      .required("Full name is required")
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must be less than 100 characters"),
    email: Yup.string()
      .required("Email is required")
      .matches(EMAIL_REGEX, "Invalid email format"),
    phone: Yup.string().matches(
      PHONE_REGEX,
      "Phone must be in format (XXX) XXX-XXXX"
    ),
    age: Yup.number()
      .required("Age is required")
      .integer("Age must be a whole number")
      .min(1, "Age must be greater than 0")
      .max(120, "Age must be less than or equal to 120")
      .typeError("Age must be a number"),
    insuranceProvider: Yup.string()
      .max(100, "Insurance provider must be less than 100 characters")
      .nullable(),
    preferredTreatment: Yup.string().nullable(),
    urgencyLevel: Yup.string().nullable(),
    preferredTime: Yup.string().nullable(),
    referralReason: Yup.string()
      .max(500, "Referral reason must be less than 500 characters")
      .nullable(),
    additionalNotes: Yup.string()
      .max(1000, "Additional notes must be less than 1000 characters")
      .nullable(),
  });

  const formFields = [
    {
      type: "text",
      name: "fullName",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
    },
    {
      type: "number",
      name: "age",
      label: "Age",
      placeholder: "Enter age",
      required: true,
    },
    {
      type: "email",
      name: "email",
      label: "Email Address",
      placeholder: "your.email@example.com",
      required: true,
    },
    {
      type: "tel",
      name: "phone",
      label: "Phone Number",
      placeholder: "(555) 123-4567",
    },
    {
      type: "text",
      name: "insuranceProvider",
      label: "Insurance Provider",
      placeholder: "e.g., Delta Dental, Aetna, Cigna, etc.",
    },
  ];

  const formik = useFormik<PatientFormValues>({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      age: "",
      insuranceProvider: "",
      preferredTreatment: "",
      urgencyLevel: "medium",
      preferredTime: "",
      referralReason: "",
      additionalNotes: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const payload: Partial<Referral> = {
          referredBy: referredBy,
          addedVia: addedVia || "Direct",
          name: values.fullName,
          email: values.email,
          phone: values.phone || "",
          age: values.age ? Number(values.age) : undefined,
          insurance: values.insuranceProvider || "",
          treatment: values.preferredTreatment || "",
          priority: values.urgencyLevel || "medium",
          appointmentTime: values.preferredTime || new Date().toISOString(),
          reason: values.referralReason || "",
          notes: values.additionalNotes || "",
        };

        await createReferral(payload);
        formik.resetForm();
        navigate("/thank-you", { state: { user: fetchedUser } });
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
  });

  console.log(fetchedUser);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-5 px-4 flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto">
        <Card className="shadow-lg mb-5 border-0">
          <CardBody className="p-0">
            <div className="flex justify-between items-center text-sm bg-gradient-to-l from-green-600 to-blue-600 m-0 px-5 py-4 text-background">
              <div>
                <h1 className="text-base font-medium mb-1">
                  {fetchedUser?.practiceName}
                </h1>
                <div>
                  {fetchedUser?.firstName} {fetchedUser?.lastName}
                </div>
              </div>
              <div>
                {fetchedUser?.phone && (
                  <Link
                    to={`tel:${fetchedUser?.phone}`}
                    className="mb-1 flex items-center justify-center gap-2"
                  >
                    <FaPhone className="text-sm" />
                    {fetchedUser?.phone}
                  </Link>
                )}
              </div>
            </div>

            <div className="px-5 py-4">
              <p className="text-sm font-medium">
                Referred by {fetchedUser?.firstName} {fetchedUser?.lastName}{" "}
                from {fetchedUser?.practiceName}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Specialty in {fetchedUser?.medicalSpecialty?.title}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-xl border-0">
          <CardBody className="p-5">
            <div className="mb-5">
              <h2 className="text-base font-medium mb-1.5 flex items-center gap-1.5">
                <FaRegStar className="text-yellow-500 text-lg" /> Schedule Your
                Orthodontic Consultation
              </h2>
              <p className="text-left text-gray-600 text-xs">
                Please fill out the form below and we'll contact you to schedule
                your appointment.
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formFields.map((field) => (
                  <Input
                    key={field.name}
                    type={field.type}
                    label={field.label}
                    labelPlacement="outside-top"
                    size="sm"
                    radius="sm"
                    name={field.name}
                    placeholder={field.placeholder}
                    value={
                      (formik.values[
                        field.name as keyof PatientFormValues
                      ] as string) || ""
                    }
                    onChange={(event: any) =>
                      formik.setFieldValue(
                        field.name,
                        field.type === "tel"
                          ? formatPhoneNumber(event.target.value)
                          : field.type === "number"
                          ? event.target.value === ""
                            ? ""
                            : Number(event.target.value)
                          : event.target.value
                      )
                    }
                    onBlur={formik.handleBlur}
                    isRequired={field.required as boolean}
                    isInvalid={
                      !!(
                        formik.touched[field.name as keyof PatientFormValues] &&
                        formik.errors[field.name as keyof PatientFormValues]
                      )
                    }
                    errorMessage={
                      formik.touched[field.name as keyof PatientFormValues] &&
                      (formik.errors[
                        field.name as keyof PatientFormValues
                      ] as string)
                    }
                    className="w-full"
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                >
                  {URGENCY_OPTIONS.map((urgency) => (
                    <SelectItem key={urgency.key}>{urgency.label}</SelectItem>
                  ))}
                </Select>
              </div>

              <div>
                <Input
                  key="preferredTime"
                  type="text"
                  label="Preferred Appointment Time"
                  labelPlacement="outside-top"
                  size="sm"
                  radius="sm"
                  name="preferredTime"
                  placeholder="e.g., Mornings, After 3 PM, Weekends"
                  value={formik.values.preferredTime}
                  onValueChange={(value: any) =>
                    formik.setFieldValue("preferredTime", value)
                  }
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(
                      formik.touched[
                        "preferredTime" as keyof PatientFormValues
                      ] &&
                      formik.errors["preferredTime" as keyof PatientFormValues]
                    )
                  }
                  errorMessage={
                    formik.touched[
                      "preferredTime" as keyof PatientFormValues
                    ] &&
                    (formik.errors[
                      "preferredTime" as keyof PatientFormValues
                    ] as string)
                  }
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 gap-6">
                <Textarea
                  label="Reason for Referral"
                  labelPlacement="outside-top"
                  name="referralReason"
                  placeholder="Please describe what brings you to our practice..."
                  size="sm"
                  radius="sm"
                  value={formik.values.referralReason}
                  onValueChange={(val: string) =>
                    formik.setFieldValue("referralReason", val)
                  }
                  onBlur={formik.handleBlur}
                  minRows={3}
                  className="w-full"
                  isInvalid={
                    !!(
                      formik.touched.referralReason &&
                      formik.errors.referralReason
                    )
                  }
                  errorMessage={
                    formik.touched.referralReason &&
                    (formik.errors.referralReason as string)
                  }
                  classNames={{ inputWrapper: "py-2" }}
                />
              </div>

              <div>
                <Textarea
                  label="Additional Notes"
                  labelPlacement="outside-top"
                  name="additionalNotes"
                  placeholder="Any additional information you'd like us to know..."
                  size="sm"
                  radius="sm"
                  value={formik.values.additionalNotes}
                  onValueChange={(val: string) =>
                    formik.setFieldValue("additionalNotes", val)
                  }
                  onBlur={formik.handleBlur}
                  minRows={3}
                  className="w-full"
                  isInvalid={
                    !!(
                      formik.touched.additionalNotes &&
                      formik.errors.additionalNotes
                    )
                  }
                  errorMessage={
                    formik.touched.additionalNotes &&
                    (formik.errors.additionalNotes as string)
                  }
                  classNames={{ inputWrapper: "py-2" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="submit"
                  color="primary"
                  size="sm"
                  radius="sm"
                  isLoading={isPending}
                  isDisabled={!formik.isValid || isPending || !formik.dirty}
                >
                  {isPending ? "Submitting..." : "Submit Referral"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  radius="sm"
                  className="border-small"
                  startContent={<FiDownload className="text-sm" />}
                  onPress={() => {
                    downloadVcf({
                      firstName: fetchedUser?.firstName,
                      lastName: fetchedUser?.lastName,
                      phone: fetchedUser?.phone,
                      email: fetchedUser?.email,
                      organization: fetchedUser?.practiceName,
                    });
                  }}
                >
                  {"Save Our Contact"}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <div className="">
          <p className="text-center mt-5 text-xs">
            Questions? Call us directly at{" "}
            <span className="font-medium">+1 (555) 123-4567</span> or visit{" "}
            <span className="font-medium">www.orthodontics.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
