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
import { useEffect, useMemo, useState } from "react";
import { FaRegStar } from "react-icons/fa";
import { FiDownload, FiLoader } from "react-icons/fi";
import { RiPhoneFill } from "react-icons/ri";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { EMAIL_REGEX, NAME_REGEX, PHONE_REGEX } from "../../../consts/consts";
import { TREATMENT_OPTIONS, URGENCY_OPTIONS } from "../../../consts/referral";
import { useFetchUserForTrackings } from "../../../hooks/settings/useUser";
import {
  useCreateReferral,
  useFetchTrackings,
  useTrackScan,
} from "../../../hooks/useReferral";
import { CreateReferralPayload, ReferralStatus } from "../../../types/referral";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
import { downloadVcf } from "../../../utils/vcfGenerator";
import NotFoundPage from "../../NotFoundPage";

interface PatientFormValues {
  fullName: string;
  email: string;
  phone: string;
  age: number | "";
  insuranceProvider: string;
  preferredTreatment: string;
  scheduledDate: string;
  urgencyLevel: string;
  preferredTime: string;
  referralReason: string;
  notes: string;
}

const PatientForm = () => {
  const { customPath, id } = useParams<{ customPath: string; id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [addedVia, setAddedVia] = useState<string>("");
  const [sourceId, setSourceId] = useState<string>("");

  const { mutateAsync: createReferral, isPending } = useCreateReferral();
  const { data: fetchedUser, isLoading: isUserLoading } =
    useFetchUserForTrackings(id || "");
  const { data: trackings, isLoading: isTrackingsLoading } = useFetchTrackings(
    id || ""
  );
  const { mutate: trackScan } = useTrackScan();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const source = queryParams.get("source");
    const sId = queryParams.get("sourceId");
    setAddedVia(source || "");
    setSourceId(sId || "");
  }, [location.search]);

  // Validate if the current URL's custom path exists in the user's personalized QR configurations
  const isValidPath = useMemo(() => {
    if (isTrackingsLoading || !trackings) return true; // specific logic: assume valid while loading
    // Check if any QR config matches the current customPath from the URL
    return trackings.personalizedQR.some(
      (qr: any) => qr.customPath === customPath
    );
  }, [trackings, customPath, isTrackingsLoading]);

  useEffect(() => {
    const trackingKey = `scanTracked_${id}_${addedVia}_${sourceId}`;
    const alreadyTracked = sessionStorage.getItem(trackingKey);

    if (id && isValidPath && addedVia && !alreadyTracked) {
      trackScan({
        userId: id,
        source: addedVia,
        ...(sourceId ? { sourceId } : {}),
      });
      sessionStorage.setItem(trackingKey, "true");
    }
  }, [id, addedVia, sourceId, trackScan, isValidPath]);

  const showInvalidLink = !isTrackingsLoading && trackings && !isValidPath;

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .required("Full name is required")
      .matches(
        NAME_REGEX,
        "Full name can only contain letters, spaces, hyphens, apostrophes, and full stops"
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
      "Preferred treatment is required"
    ),
    urgencyLevel: Yup.string().required("Urgency level is required"),
    preferredTime: Yup.string().nullable(),
    referralReason: Yup.string()
      .max(500, "Referral reason must be less than 500 characters")
      .nullable(),
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
      maxLength: 14, // (XXX) XXX-XXXX
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

  const formik = useFormik<PatientFormValues>({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      age: "",
      insuranceProvider: "",
      preferredTreatment: TREATMENT_OPTIONS[0]?.key || "invisalign",
      urgencyLevel: URGENCY_OPTIONS[0]?.key || "medium",
      preferredTime: "",
      scheduledDate: "",
      referralReason: "",
      notes: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const payload: CreateReferralPayload = {
        referredBy: id as string,
        addedVia: addedVia || "Direct",
        name: values.fullName,
        email: values.email,
        phone: values.phone || "",
        age: Number(values.age),
        insurance: values.insuranceProvider || "",
        treatment: values.preferredTreatment || "",
        priority: values.urgencyLevel || "medium",
        appointmentTime: values.preferredTime || "",
        reason: values.referralReason || "",
        notes: values.notes || "",
        scheduledDate: values.scheduledDate || "",
        status: "new" as ReferralStatus,
        estValue: 0,
      };

      await createReferral(payload, {
        onSuccess() {
          formik.resetForm();
          navigate("/thank-you", { state: { user: fetchedUser } });
        },
      });
    },
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof PatientFormValues,
    type: string,
    maxLength?: number
  ) => {
    let value: string | number | undefined = event.target.value;

    if (type === "tel") {
      value = formatPhoneNumber(value);
    } else if (type === "number") {
      if (maxLength && value.length > maxLength) {
        // Enforce max length for age by not updating the value
        return;
      }
      // Convert to number or empty string if input is empty
      value = value === "" ? "" : Number(value);
    }

    formik.setFieldValue(fieldName as string, value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      {isUserLoading ? (
        <div className="flex items-center justify-center p-4">
          <FiLoader className="animate-spin size-8 text-primary" />
        </div>
      ) : showInvalidLink ? (
        <NotFoundPage />
      ) : (
        <div className="max-w-3xl w-full mx-auto max-lg:py-5 max-lg:px-4">
          <Card className="shadow-sm mb-5 border-0">
            <CardBody className="p-0">
              <div className="flex justify-between items-center text-sm bg-gradient-to-l from-green-600 to-blue-600 m-0 px-5 py-4 text-background">
                <div>
                  {fetchedUser?.practiceName && (
                    <h1 className="text-base font-medium mb-1">
                      {fetchedUser?.practiceName}
                    </h1>
                  )}
                  <div>
                    {fetchedUser?.practiceName
                      ? `${fetchedUser?.firstName} ${fetchedUser?.lastName}`
                      : `Referred by ${fetchedUser?.firstName} ${fetchedUser?.lastName}`}
                  </div>
                </div>
                <div>
                  {fetchedUser?.phone && (
                    <Link
                      to={`tel:${fetchedUser?.phone}`}
                      className="flex items-center justify-center gap-1.5"
                    >
                      <RiPhoneFill className="text-lg" />
                      {fetchedUser?.phone}
                    </Link>
                  )}
                </div>
              </div>

              {fetchedUser?.practiceName && (
                <div className="px-5 py-4">
                  <p className="text-sm font-medium">
                    {`Referred by ${fetchedUser?.firstName} ${
                      fetchedUser?.lastName
                    } ${
                      fetchedUser?.practiceName &&
                      `from ${fetchedUser?.practiceName}`
                    }`}
                  </p>
                  {fetchedUser?.medicalSpecialty && (
                    <p className="text-xs text-gray-600 mt-1">
                      Specialty in {fetchedUser?.medicalSpecialty?.title}
                    </p>
                  )}
                </div>
              )}
            </CardBody>
          </Card>

          <Card className="shadow-sm border-0">
            <CardBody className="p-5">
              <div className="mb-5">
                <h2 className="text-base font-medium mb-1.5 flex items-center gap-1.5">
                  <FaRegStar className="text-yellow-500 text-lg" /> Schedule
                  Your Orthodontic Consultation
                </h2>
                <p className="text-left text-gray-600 text-xs">
                  Please fill out the form below and we'll contact you to
                  schedule your appointment.
                </p>
              </div>

              <form
                onSubmit={formik.handleSubmit}
                className="md:space-y-6 space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-x-4 md:gap-y-6">
                  {formFields.map((field) => {
                    const fieldName = field.name as keyof PatientFormValues;
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
                            field.maxLength
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
                            // Extract parts, pad with leading zeros
                            const year = dateObject.year;
                            const month = String(dateObject.month).padStart(
                              2,
                              "0"
                            );
                            const day = String(dateObject.day).padStart(2, "0");
                            const hour = String(dateObject.hour).padStart(
                              2,
                              "0"
                            );
                            const minute = String(dateObject.minute).padStart(
                              2,
                              "0"
                            );
                            const second = String(dateObject.second).padStart(
                              2,
                              "0"
                            );
                            const millisecond = String(
                              dateObject.millisecond
                            ).padStart(3, "0");

                            const localDateTimeString = `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}`;
                            formik.setFieldValue(
                              fieldName as string,
                              localDateTimeString
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
                        formik.touched.urgencyLevel &&
                        formik.errors.urgencyLevel
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

                {/* <div className="grid grid-cols-1 gap-6">
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
                </div> */}

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

          <div>
            <p className="text-center mt-5 text-xs leading-relaxed">
              Questions? Call us directly at{" "}
              <span className="font-medium">+1 (555) 123-4567</span> or visit{" "}
              <span className="font-medium">www.orthodontics.com</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientForm;
