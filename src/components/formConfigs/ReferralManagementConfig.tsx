
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
      age: initialData.age || "",
      patientPhone: initialData.patientPhone || "",
      email: initialData.patientEmail || "",
      referringByName: initialData.referringByName || "",
      referringPracticeName: initialData.referringPracticeName || "",
      referringSpecialty: initialData.referringSpecialty || "",
      referringPhoneNumber: initialData.referringPhoneNumber || "",
      referringEmail: initialData.referringEmail || "",
      referringFax: initialData.referringFax || "",
      referringWebsite: initialData.referringWebsite || "",
      practiceAddress: initialData.practiceAddress || "",
      practiceAddressCity: initialData.practiceAddressCity || "",
      practiceAddressState: initialData.practiceAddressState || "",
      practiceAddressZip: initialData.practiceAddressZip || "",
      referringPatientName: initialData.referringPatientName || "",
      relationshipName: initialData.relationshipName || "",
      treatmentType: initialData.treatmentType || "",
      status: initialData.status || "new",
      urgency: initialData.urgency || "low",
      insuranceProvider: initialData.insuranceProvider || "",
      preferredTime: initialData.preferredTime || "",
      reasonForReferral: initialData.reasonForReferral || "",
      notes: initialData.notes || "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Patient name is required"),

      referringByName: Yup.string().when("role", {
        is: "doctor",
        then: (schema) => schema.required("Doctor name is required"),
        otherwise: (schema) => schema.required("Referring patient name is required"),
      }),

      referringPracticeName: Yup.string().when("role", {
        is: "doctor",
        then: (schema) => schema.required("Practice name is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      referringEmail: Yup.string().when("role", {
        is: "doctor",
        then: (schema) =>
          schema.email("Invalid email").required("Doctor email is required"),
        otherwise: (schema) =>
          schema.email("Invalid email").required("Patient email is required"),
      }),

      referringPhoneNumber: Yup.string().when("role", {
        is: "doctor",
        then: (schema) => schema.required("Doctor phone number is required"),
        otherwise: (schema) => schema.required("Patient phone number is required"),
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


  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
    'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
    'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  const relationshipTypes = ["family", "friend", "colleague", "neighbor", "other"];
  const preferredTimes = ["morning", "afternoon", "evening", "afterSchool", "lunchBreak", "weekend"];
  const treatmentTypes = ["Invisalign", "Traditional Braces", "Clear Aligners", "Adult Orthodontics", "Early Intervention", "Consultation", "Other"];
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
    <form onSubmit={formik.handleSubmit} className="space-y-6 py-1">
      <div className=" ">
        <Select
          size="sm"
          label="Select Referrer Type"
          selectedKeys={[formik.values.role]}
          onSelectionChange={(keys) =>
            formik.setFieldValue("role", [...keys][0])
          }
        >
          <SelectItem key="doctor" value="doctor">Doctor Referrer</SelectItem>
          <SelectItem key="patient" value="patient">Patient Referrer</SelectItem>
        </Select>
      </div>

      {/* Example sections */}
      <div className=" ">
        <h5 className="text-sm font-medium mb-3 text-text">Patient Information</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: "fullName", label: "Patient Name *", type: "text" },
            { id: "age", label: "Age", type: "number" },
            { id: "phoneNumber", label: "Phone", type: "tel" },
            { id: "email", label: "Email", type: "email" },
          ].map(renderField)}
        </div>
      </div>

      {formik.values.role === "doctor" && (
        <div className=" ">
          <h5 className="text-sm font-medium mb-3 text-text">Doctor Referrer Information</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: "referringByName", label: "Doctor Name *", type: "text" },
              { id: "referringPracticeName", label: "Practice Name *", type: "text" },
              { id: "referringSpecialty", label: "Specialty", type: "select", options: specialtyOptions },
              { id: "referringPhoneNumber", label: "Phone *", type: "tel" },
              { id: "referringEmail", label: "Email *", type: "email" },
              { id: "referringFax", label: "Fax", type: "text" },
              { id: "referringWebsite", label: "Website", type: "text" },
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

      {formik.values.role === "doctor" && (
        <div className=" ">
          <h5 className="text-sm font-medium mb-3 text-text">Practice Address</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: "practiceAddress", label: "Street Address", type: "text" },
              { id: "practiceAddressCity", label: "City", type: "text" },
              { id: "practiceAddressState", label: "State", type: "select", options: states },
              { id: "practiceAddressZip", label: "Zip Code", type: "text" },
            ].map(renderField)}
          </div>
        </div>
      )}

      {formik.values.role === "patient" && (
        <div className=" ">
          <h5 className="text-sm font-medium mb-3 text-text">Patient Referrer Information</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: "referringByName", label: "Referring Patient Name *", type: "text" },
              { id: "relationshipName", label: "Relationship to Patient", type: "select", options: relationshipTypes },
              { id: "referringPhoneNumber", label: "Referring Patient Phone", type: "tel" },
              { id: "referringEmail", label: "Referring Patient Email", type: "email" },
            ].map(renderField)}
          </div>
        </div>
      )}
      {/** ✅ Treatment Information Section */}
      <div className=" ">
        <h5 className="text-sm font-medium mb-3 text-text">Treatment Information</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              id: "treatmentType",
              label: "Treatment Type",
              type: "select",
              options: treatmentTypes,
            },
            {
              id: "urgency",
              label: "Urgency",
              type: "select",
              options: ["low", "medium", "high"],
            },
            {
              id: "insuranceProvider",
              label: "Insurance Provider",
              type: "text",
            },
            {
              id: "preferredTime",
              label: "Preferred Time",
              type: "select",
              options: preferredTimes,
            },
          ].map(renderField)}
        </div>
      </div>



      <div className=" ">
        <h5 className="text-sm font-medium mb-3 text-text">Additional Information</h5>
        <div className="grid grid-cols-1 gap-4">
          {[
            {
              id: "reasonForReferral",
              label: "Reason for Referral",
              type: "textarea",
              placeholder: "Describe the reason for the referral...",
              minRows: 3,
            },
            {
              id: "notes",
              label: "Additional Notes",
              type: "textarea",
              placeholder: "Any additional notes or special considerations...",
              minRows: 2,
            },
          ].map(renderField)}
        </div>
      </div>

    </form>
  );
});

export default ReferralManagementConfig;
