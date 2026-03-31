import React, { useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Input, addToast } from "@heroui/react";
import { useCreatePatientDetails } from "../../../hooks/useReferral";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
import { EMAIL_REGEX, NAME_REGEX, PHONE_REGEX } from "../../../consts/consts";

const PatientDetailsRetrieve = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const refererName = searchParams.get("refererName") || "Doctor";
  const navigate = useNavigate();

  const createPatientMutation = useCreatePatientDetails();

  const downloadVCF = (name: string, phone: string = "", email: string = "") => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
N:${name};;;;
${phone ? `TEL;TYPE=WORK,VOICE:${phone}\n` : ""}${email ? `EMAIL;TYPE=WORK,INTERNET:${email}\n` : ""
      }END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${name.replace(/\s+/g, "_")}_Contact.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .trim()
      .matches(NAME_REGEX, "First name can only contain letters, spaces, hyphens, and full stops")
      .min(2, "First Name is too short")
      .required("First Name is required"),
    lastName: Yup.string()
      .trim()
      .matches(NAME_REGEX, "Last name can only contain letters, spaces, hyphens, and full stops")
      .min(2, "Last Name is too short")
      .required("Last Name is required"),
    email: Yup.string()
      .matches(EMAIL_REGEX, { message: "Invalid email format", excludeEmptyString: true })
      .required("Email is required"),
    phone: Yup.string()
      .matches(PHONE_REGEX, "Phone must be in format (XXX) XXX-XXXX")
      .required("Phone number is required"),
  });

  const formFields = [
    {
      type: "text",
      name: "firstName",
      label: "First Name",
      placeholder: "Enter your first name",
      required: true,
      maxLength: 50,
      gridSpan: 1,
    },
    {
      type: "text",
      name: "lastName",
      label: "Last Name",
      placeholder: "Enter your last name",
      required: true,
      maxLength: 50,
      gridSpan: 1,
    },
    {
      type: "email",
      name: "email",
      label: "Email Address",
      placeholder: "john@example.com",
      required: true,
      maxLength: 255,
      gridSpan: 2,
    },
    {
      type: "tel",
      name: "phone",
      label: "Phone Number",
      placeholder: "(555) 555-5555",
      maxLength: 14,
      required: true,
      gridSpan: 2,
    },
  ];

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        referrerId: id,
      };

      createPatientMutation.mutate(payload, {
        onSuccess: () => {
          // Download the Referrer's VCF
          downloadVCF(refererName);

          // Navigate to thank you page
          navigate("/thank-you");
        },
      });
    },
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    type: string,
    maxLength?: number,
  ) => {
    let value: string = event.target.value;

    if (type === "tel") {
      value = formatPhoneNumber(value);
    }

    if (maxLength && value.length > maxLength) {
      return;
    }

    formik.setFieldValue(fieldName, value);
    formik.setFieldTouched(fieldName, true, false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-content1 rounded-2xl shadow-[0_2px_20px_rgb(0,0,0,0.06)] border border-foreground/5 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-semibold shadow-sm border border-blue-200 dark:border-blue-800/50">
            {refererName.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
            Connect with {refererName}
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed">
            Input your contact info to save our contact and we will be connected
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {formFields.map((field) => {
              const fieldName = field.name as keyof typeof formik.values;
              const value = formik.values[fieldName];
              const touched = formik.touched[fieldName];
              const error = formik.errors[fieldName];

              return (
                <div key={field.name} className={`col-span-${field.gridSpan}`}>
                  <Input
                    type={field.type}
                    label={field.label}
                    labelPlacement="outside"
                    size="md"
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
                    variant="bordered"
                    className="w-full"
                    {...(field.maxLength ? { maxLength: field.maxLength } : {})}
                  />
                </div>
              );
            })}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              color="primary"
              className="w-full text-sm font-medium h-12 shadow-sm rounded-lg"
              isLoading={createPatientMutation.isPending}
              isDisabled={!formik.isValid || !formik.dirty || createPatientMutation.isPending}
            >
              Submit
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-default-100 text-center text-xs text-foreground/40">
          By sharing your contact information, you agree to allow our practice to collect and use the details you provide to connect with you and provide relevant information about our services. We respect your privacy and will never share your information without your consent.
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsRetrieve;
