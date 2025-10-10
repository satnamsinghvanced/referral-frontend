import { Select, SelectItem, Textarea } from "@heroui/react";
import { useFormik } from "formik";
import { forwardRef, useImperativeHandle } from "react";
import * as Yup from "yup";
import { specialtyOptions } from "../../Utils/filters";
import Input from "../ui/Input";

interface FormValues {
  role: "doctor" | "patient";
  fullName: string;
  patientPhone: string;
  email: string;
  referringPracticeName: string;
  referringSpecialty: string;
  practiceAddress: string;
  notes: string;
}

interface ReferralManagementConfigProps {
  initialData?: Partial<FormValues>;
}

const ReferralManagementConfig = forwardRef<any, ReferralManagementConfigProps>(
  ({ initialData = {} }, ref) => {
    const formik = useFormik<FormValues>({
      initialValues: {
        role: initialData.role || "doctor",
        fullName: initialData.fullName || "",
        patientPhone: initialData.patientPhone || "",
        email: initialData.email || "",
        referringPracticeName: initialData.referringPracticeName || "",
        referringSpecialty: initialData.referringSpecialty || "",
        practiceAddress: initialData.practiceAddress || "",
        notes: initialData.notes || "",
      },
      validationSchema: Yup.object({
        fullName: Yup.string().required("Patient name is required"),
        patientPhone: Yup.string().required("Phone number is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        referringPracticeName: Yup.string().when("role", {
          is: "doctor",
          then: (schema) => schema.required("Practice name is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
        practiceAddress: Yup.string().when("role", {
          is: "doctor",
          then: (schema) => schema.required("Practice address is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
      }),
      validateOnMount: true,
      onSubmit: (values) => {
        console.log("✅ Submitting:", values);
      },
    });

    useImperativeHandle(ref, () => ({
      submitForm: formik.submitForm,
      validateForm: formik.validateForm,
      setTouched: formik.setTouched,
      values: formik.values,
      isValid: formik.isValid,
      dirty: formik.dirty,
      resetForm: formik.resetForm,
    }));

    const renderField = (field: {
      id: keyof FormValues;
      label: string;
      type?: string;
      options?: string[];
      placeholder?: string;
      minRows?: number;
    }) => {
      const { id, label, type, options, placeholder, minRows } = field;
      const error = formik.touched[id] && formik.errors[id];

      switch (type) {
        case "select":
          return (
            <div key={id} className="w-full">
              <Select
                size="sm"
                placeholder={placeholder}
                label={label}
                labelPlacement="outside"
                selectedKeys={formik.values[id] ? [formik.values[id]] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  formik.setFieldValue(id, selectedKey || "");
                }}
              >
                {options?.map((opt: string) => (
                  <SelectItem key={opt} className="capitalize">
                    {opt}
                  </SelectItem>
                ))}
              </Select>
              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>
          );

        case "textarea":
          return (
            <div key={id} className="w-full">
              <Textarea
                size="sm"
                label={label}
                value={formik.values[id]}
                onChange={(e) => formik.setFieldValue(id, e.target.value)}
                onBlur={formik.handleBlur}
                placeholder={placeholder}
                minRows={minRows || 3}
                className="text-sm"
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>
          );

        default:
          return (
            <div key={id} className="w-full">
              <Input
                size="sm"
                type={type}
                label={label}
                labelPlacement="outside-top"
                placeholder={placeholder}
                name={id}
                value={formik.values[id]}
                className="text-sm"
                formik={formik}
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>
          );
      }
    };

    return (
      <form
        onSubmit={formik.handleSubmit}
        className="space-y-4 py-1 h-fit w-full"
      >
        {/* Referrer Type */}
        <div className="border border-primary/20 rounded-lg p-4">
          <h5 className="text-sm font-medium mb-3">Referrer Type *</h5>
          <Select
            size="sm"
            placeholder="Select specialties"
            selectedKeys={[formik.values.role]}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as "doctor" | "patient";
              formik.setFieldValue("role", selectedKey || "doctor");
            }}
          >
            <SelectItem key="doctor">
              Doctor Referrer
            </SelectItem>
            <SelectItem key="patient">
              Patient Referrer
            </SelectItem>
          </Select>
        </div>

        {/* Basic Information */}
        <div className="border border-primary/20 rounded-lg p-4">
          <h5 className="text-sm font-medium mb-3">Basic Information</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                id: "fullName",
                label: "Patient Name *",
                type: "text",
                placeholder: "Enter full name",
              },
              {
                id: "patientPhone",
                label: "Phone *",
                type: "tel",
                placeholder: "e.g., (123) 456-7890",
              },
            ].map(renderField)}
          </div>
          <div className="grid grid-cols-1 mt-4 gap-4">
            {[
              {
                id: "email",
                label: "Email *",
                type: "email",
                placeholder: "e.g., johndoe@gmail.com",
              },
            ].map(renderField)}
          </div>
        </div>

        {/* Practice Information */}
        {formik.values.role === "doctor" && (
          <div className="border border-primary/20 rounded-lg p-4">
            <h5 className="text-sm font-medium mb-3">Practice Information</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: "referringPracticeName",
                  label: "Practice Name *",
                  type: "text",
                  placeholder: "Enter practice name",
                },
                {
                  id: "referringSpecialty",
                  label: "Specialty",
                  type: "select",
                  options: specialtyOptions,
                  placeholder: "Select specialty",
                },
                {
                  id: "practiceAddress",
                  label: "Practice Address *",
                  type: "text",
                  placeholder: "Enter practice address",
                },
              ].map((field) => (
                <div
                  key={field.id}
                  className={
                    field.id === "practiceAddress" ? "md:col-span-2" : ""
                  }
                >
                  {renderField(field)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="border border-primary/20 rounded-lg p-4">
          <h5 className="text-sm font-medium mb-3">Additional Information</h5>
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                id: "notes",
                label: "Notes (optional)",
                type: "textarea",
                placeholder:
                  "Any additional information about this referrer...",
                minRows: 2,
              },
            ].map(renderField)}
          </div>
        </div>
      </form>
    );
  }
);

ReferralManagementConfig.displayName = "ReferralManagementConfig";

export default ReferralManagementConfig;
