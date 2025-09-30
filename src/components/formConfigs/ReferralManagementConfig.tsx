import { Input, Select, SelectItem, Textarea } from "@heroui/react";
import { useFormik, } from "formik";
import { forwardRef, useImperativeHandle } from "react";
import * as Yup from "yup";
import { specialtyOptions } from "../../Utils/filters";

interface ReferralManagementConfigProps {
  initialData?: { [key: string]: any };
}

const ReferralManagementConfig = forwardRef(({ initialData = {} }: ReferralManagementConfigProps, ref) => {
  const formik = useFormik({
    initialValues: {
      role: initialData.role || "doctor",
      fullName: initialData.patientName || "",
      patientPhone: initialData.patientPhone || "",
      email: initialData.patientEmail || "",
      referringPracticeName: initialData.referringPracticeName || "",
      referringSpecialty: initialData.referringSpecialty || "",
      practiceAddress: initialData.practiceAddress || "",
      notes: initialData.notes || "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Patient name is required"),
      patientPhone: Yup.string().required("Phone number is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
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

  const renderField = (field: any) => {
    const { id, label, type, options, placeholder, minRows } = field;

    const error = formik?.touched[id] && formik?.errors[id];

    switch (type) {
      case "select":
        return (
          <div key={id} className="w-full">
            <Select
              size="sm"
              label={label}
              selectedKeys={formik?.values[id] ? [formik?.values[id]] : []}
              onSelectionChange={(keys) => formik.setFieldValue(id, [...keys][0])}
            >
              {options.map((opt: string) => (
                <SelectItem key={opt} value={opt} className="capitalize">
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
              name={id}
              value={formik.values[id]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="text-sm"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        );
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 py-1 h-fit w-full">
      <div className="border border-primary/20 rounded-lg p-4">
        <h5 className="text-sm font-medium mb-3">Referrer Type *</h5>
        <Select
          size="sm"
          selectedKeys={[formik.values.role]}
          onSelectionChange={(keys) =>
            formik.setFieldValue("role", [...keys][0])
          }
        >
          <SelectItem key="doctor" value="doctor">Doctor Referrer</SelectItem>
          <SelectItem key="patient" value="patient">Patient Referrer</SelectItem>
        </Select>
      </div>

      {/* Basic Information Section */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h5 className="text-sm font-medium mb-3">Basic Information</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: "fullName", label: "Patient Name *", type: "text" },
            { id: "patientPhone", label: "Phone *", type: "tel" },
          ].map(renderField)}
        </div>
        <div className="grid grid-cols-1 mt-4 gap-4">
          {[
            { id: "email", label: "Email *", type: "email" },
          ].map(renderField)}
        </div>
      </div>

      {formik.values.role === "doctor" && (
        <div className="border border-primary/20 rounded-lg p-4">
          <h5 className="text-sm font-medium mb-3">Practice Information</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: "referringPracticeName", label: "Practice Name *", type: "text" },
              { id: "referringSpecialty", label: "Specialty", type: "select", options: specialtyOptions },
              { id: "practiceAddress", label: "Practice Address *", type: "text" },
            ].map((field, index, arr) => {
              const isLast = index === arr.length - 1;
              const isOdd = arr.length % 2 !== 0;
              const spanFull = isLast && isOdd ? "md:col-span-2" : "";

              return (
                <div key={field.id} className={spanFull}>
                  {renderField(field)}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="border border-primary/20 rounded-lg p-4 ">
        <h5 className="text-sm font-medium mb-3 ">Additional Information</h5>
        <div className="grid grid-cols-1 gap-4">
          {[
            {
              id: "notes",
              label: "Notes (optional)",
              type: "textarea",
              placeholder: "Any additional information about this referrer...",
              minRows: 2,
            },
          ].map(renderField)}
        </div>
      </div>
    </form>
  );
});
export default ReferralManagementConfig;