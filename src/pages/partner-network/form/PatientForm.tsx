import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Divider,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaGlobe, FaPhone } from "react-icons/fa";
import * as Yup from "yup";
import { timeOptions, treatmentOptions } from "../../../utils/consts";
import { urgencyOptions } from "../../../Utils/filters";
import { useCreateReferral } from "../../../hooks/useReferral";
import { useLocation, useNavigate } from "react-router";

const PatientForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referredBy, setReferredBy] = useState("");
  const [addedVia, setAddedVia] = useState("");
  const createReferralMutation = useCreateReferral();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const currentPath = window.location.href;
    const referralId =
      currentPath.split("/referral/")[1]?.split("?")[0] ||
      currentPath.split("/referral/")[1];
    setReferredBy(referralId ?? "");
    console.log("referredBy ", referredBy);

    const queryParams = new URLSearchParams(location.search);
    const source = queryParams.get("source");
    console.log("source: ", source);
    setAddedVia(source);
    console.log("addedVia ", addedVia);
  }, []);
  // Validation Schema
  const validationSchema = Yup.object({
    fullName: Yup.string()
      .required("Full name is required")
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must be less than 100 characters"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
    phone: Yup.string()
      .matches(
        /^[0-9+\-\s()]*$/,
        "Phone number can only contain numbers, spaces, hyphens, and parentheses"
      )
      .test(
        "phone-length",
        "Phone number should be between 10-15 digits",
        (value) => {
          if (!value) return true; // Optional field
          const digitsOnly = value.replace(/[^0-9]/g, "");
          return digitsOnly.length >= 10 && digitsOnly.length <= 15;
        }
      )
      .nullable(),
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
    agreeToTerms: Yup.boolean()
      .oneOf([true], "You must agree to the terms and conditions")
      .required("You must agree to the terms and conditions"),
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
      required: false,
    },
    {
      type: "text",
      name: "insuranceProvider",
      label: "Insurance Provider",
      placeholder: "e.g., Delta Dental, Aetna, Cigna, etc.",
      required: false,
    },
  ];

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      insuranceProvider: "",
      preferredTreatment: "",
      urgencyLevel: "",
      preferredTime: "",
      referralReason: "",
      additionalNotes: "",
      agreeToTerms: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        // Prepare the payload for the API
        const payload: Partial<Referral> = {
          referredBy: referredBy,
          addedVia: addedVia,
          name: values.fullName,
          email: values.email,
          phone: values.phone || undefined,
          insurance: values.insuranceProvider || undefined,
          appointment: values.preferredTreatment || undefined,
          priority: values.urgencyLevel || undefined,
          scheduledDate: values.preferredTime || undefined,
          reason: values.referralReason || undefined,
          notes: values.additionalNotes || undefined,
        };

        console.log("Submitting payload:", payload);
        const ttt = await createReferralMutation.mutateAsync(payload);
        console.log("fnjksabdgsdklf: ", ttt);
        formik.resetForm();
        navigate("/thank-you");
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-8 px-4 text-xs">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <Card className="shadow-lg mb-6 border-0 p-0">
          <CardBody className="p-0">
            <div className="flex justify-between items-center mb-4 text-sm bg-gradient-to-l from-green-600 to-blue-600 m-0 p-3 text-background">
              <div>
                <h1 className="text-xl font-bold mb-2">
                  Downtown Orthodontics
                </h1>
                <div className="text-sm mb-1">Dr. Sarah Martinez, DDS, MS</div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-center gap-2">
                  <FaPhone className="text-sm" />
                  +1 (555) 123-4567
                </div>
                <div className="">123 New Street, City, State 12345</div>
              </div>
            </div>

            <div className="p-4">
              <p className="text-sm text-primary">
                <strong>
                  Referred by Dr. Sarah Wilson, DDS from Family Dental Center
                </strong>
              </p>
              <p className="text-xs text-primary mt-1">
                [Monday] [Dashboard Name] [Audit Orthodontics] [Product
                Orthodontics]
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Main Form Card */}
        <Card className="shadow-xl border-0">
          <CardBody className="p-6">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-3">
                Schedule Your Orthodontic Consultation
              </h2>
              <p className="max-w-2xl mx-auto">
                Please fill out the form below and we'll contact you to schedule
                your appointment.
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Personal Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formFields.map((field) => (
                  <Input
                    key={field.name}
                    type={field.type}
                    label={field.label}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={
                      formik.values[field.name as keyof typeof formik.values]
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isRequired={field.required}
                    isInvalid={
                      formik.touched[
                        field.name as keyof typeof formik.touched
                      ] &&
                      !!formik.errors[field.name as keyof typeof formik.errors]
                    }
                    errorMessage={
                      formik.touched[
                        field.name as keyof typeof formik.touched
                      ] &&
                      formik.errors[field.name as keyof typeof formik.errors]
                    }
                    className="w-full"
                  />
                ))}
              </div>

              {/* Treatment Preferences Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Preferred Treatment */}
                <Select
                  label="Preferred Treatment"
                  placeholder="Select treatment type"
                  selectedKeys={
                    formik.values.preferredTreatment
                      ? [formik.values.preferredTreatment]
                      : []
                  }
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    formik.setFieldValue("preferredTreatment", value);
                  }}
                  className="w-full"
                  isInvalid={
                    formik.touched.preferredTreatment &&
                    !!formik.errors.preferredTreatment
                  }
                  errorMessage={
                    formik.touched.preferredTreatment &&
                    formik.errors.preferredTreatment
                  }
                >
                  {treatmentOptions.map((treatment) => (
                    <SelectItem key={treatment.key}>
                      {treatment.label}
                    </SelectItem>
                  ))}
                </Select>

                {/* Urgency Level */}
                <Select
                  label="Urgency Level"
                  placeholder="Select urgency level"
                  selectedKeys={
                    formik.values.urgencyLevel
                      ? [formik.values.urgencyLevel]
                      : []
                  }
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    formik.setFieldValue("urgencyLevel", value);
                  }}
                  className="w-full"
                  isInvalid={
                    formik.touched.urgencyLevel && !!formik.errors.urgencyLevel
                  }
                  errorMessage={
                    formik.touched.urgencyLevel && formik.errors.urgencyLevel
                  }
                >
                  {urgencyOptions.map((urgency) => (
                    <SelectItem key={urgency.key}>{urgency.label}</SelectItem>
                  ))}
                </Select>
              </div>

              {/* Appointment Time */}
              <div className="grid grid-cols-1 gap-6">
                <Select
                  label="Preferred Appointment Time"
                  placeholder="e.g., Morning, Afternoon, Evening, Weekend"
                  selectedKeys={
                    formik.values.preferredTime
                      ? [formik.values.preferredTime]
                      : []
                  }
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    formik.setFieldValue("preferredTime", value);
                  }}
                  className="w-full"
                  isInvalid={
                    formik.touched.preferredTime &&
                    !!formik.errors.preferredTime
                  }
                  errorMessage={
                    formik.touched.preferredTime && formik.errors.preferredTime
                  }
                >
                  {timeOptions.map((time) => (
                    <SelectItem key={time.key}>{time.label}</SelectItem>
                  ))}
                </Select>
              </div>

              {/* Referral Reason */}
              <div className="grid grid-cols-1 gap-6">
                <Textarea
                  label="Reason for Referral"
                  name="referralReason"
                  placeholder="Please describe what brings you to our practice..."
                  value={formik.values.referralReason}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  minRows={3}
                  className="w-full"
                  isInvalid={
                    formik.touched.referralReason &&
                    !!formik.errors.referralReason
                  }
                  errorMessage={
                    formik.touched.referralReason &&
                    formik.errors.referralReason
                  }
                />
              </div>

              <Divider />

              {/* Additional Notes */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Additional Notes
                  </label>
                  <p className="text-sm mb-3">
                    Any additional information you'd like us to know...
                  </p>
                  <Textarea
                    name="additionalNotes"
                    placeholder="Enter any additional notes or concerns..."
                    value={formik.values.additionalNotes}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    minRows={3}
                    className="w-full"
                    isInvalid={
                      formik.touched.additionalNotes &&
                      !!formik.errors.additionalNotes
                    }
                    errorMessage={
                      formik.touched.additionalNotes &&
                      formik.errors.additionalNotes
                    }
                  />
                </div>
              </div>

              {/* Terms Agreement */}
              <Checkbox
                name="agreeToTerms"
                isSelected={formik.values.agreeToTerms}
                onValueChange={(value) =>
                  formik.setFieldValue("agreeToTerms", value)
                }
                classNames={{
                  label: "text-sm",
                }}
                isRequired
                isInvalid={
                  formik.touched.agreeToTerms && !!formik.errors.agreeToTerms
                }
              >
                I agree to the terms and conditions and consent to being
                contacted by Downtown Orthodontics.
              </Checkbox>
              {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
                <div className="text-danger text-sm mt-1">
                  {formik.errors.agreeToTerms}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  color="primary"
                  className="px-8 py-3 text-lg font-semibold"
                  size="lg"
                  isLoading={isSubmitting || createReferralMutation.isPending}
                  isDisabled={
                    !formik.isValid ||
                    isSubmitting ||
                    createReferralMutation.isPending ||
                    !formik.dirty
                  }
                >
                  {isSubmitting || createReferralMutation.isPending
                    ? "Submitting..."
                    : "Submit Consultation Request"}
                </Button>
              </div>
            </form>

            <Divider className="my-6" />

            {/* Footer Information */}
            <div className="text-center space-y-4">
              {/* Referral Info */}
              <div className="rounded-lg p-4">
                <h3 className="font-semibold mb-2">Submit Referral</h3>
                <p className="text-sm">Sara Ott Counsel</p>
              </div>

              {/* Contact Alternatives */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium mb-2">Questions?</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-blue-700">
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-xs" />
                    Call us directly at +1 (555) 123-4567
                  </div>
                  <div className="flex items-center gap-2">
                    <FaGlobe className="text-xs" />
                    Visit www.orthodontics.com
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Insurance Notice */}
        <Card className="mt-6 bg-amber-50 border-amber-200">
          <CardBody className="p-4">
            <p className="text-sm text-amber-800 text-center">
              💡 <strong>Insurance Note:</strong> We accept most major insurance
              providers. Please bring your insurance card to your first
              appointment for verification.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default PatientForm;
