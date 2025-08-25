
import { Input, Select, SelectItem, Textarea } from "@heroui/react";
import { useFormik, validateYupSchema } from "formik";
import * as Yup from "yup";
import { forwardRef, useImperativeHandle } from "react";

const ReferralManagementConfig = forwardRef(({ initialData = {} }, ref) => {
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

  const specialty = [
    'General Dentistry', 'Orthodontics', 'Oral Surgery', 'Periodontics', 'Endodontics',
    'Prosthodontics', 'Pediatric Dentistry', 'Cosmetic Dentistry', 'Dental Implants', 'Teeth Whitening'
  ];
  const relationshipTypes = ["family", "friend", "colleague", "neighbor", "other"];
  const preferredTimes = ["morning", "afternoon", "evening", "afterSchool", "lunchBreak","weekend"];
  const treatmentTypes = ["Invisalign", "Traditional Braces", "Clear Aligners", "Adult Orthodontics", "Early Intervention","Consultation","Other"];
  const renderField = (field) => {
    const { id, label, type , options, placeholder, minRows } = field;
    
    const error = formik.touched[id] && formik.errors[id];

    switch (type) {
      case "select":
        return (
          <div key={id} className="w-full">
            <Select
              size="sm"
              label={label}
              selectedKeys={formik.values[id] ? [formik.values[id]] : []}
              onSelectionChange={(keys) => formik.setFieldValue(id, [...keys][0])}
            >
              {options.map((opt) => (
                <SelectItem key={opt} value={opt}>
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
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        );
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 py-1">
      <div className="border-b border-gray-200 pb-4">
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
      <div className="border-b border-gray-200 pb-4">
        <h5 className="text-sm font-medium mb-3 text-gray-700">Patient Information</h5>
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
        <div className="border-b border-gray-200 pb-4">
          <h5 className="text-sm font-medium mb-3 text-gray-700">Doctor Information</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: "referringByName", label: "Doctor Name *", type: "text" },
              { id: "referringPracticeName", label: "Practice Name *", type: "text" },
              { id: "referringSpecialty", label: "Specialty", type: "select", options: specialty },
              { id: "referringPhoneNumber", label: "Phone *", type: "tel" },
              { id: "referringEmail", label: "Email *", type: "email" },
              { id: "referringFax", label: "Fax", type: "text" },
              { id: "referringWebsite", label: "Website", type: "text" },
              { id: "practiceAddress", label: "Street Address", type: "text" },
              { id: "practiceAddressCity", label: "City", type: "text" },
              { id: "practiceAddressState", label: "State", type: "select", options: states },
              { id: "practiceAddressZip", label: "Zip Code", type: "text" },
            ].map(renderField)}
          </div>
        </div>
      )}

      {formik.values.role === "patient" && (
        <div className="border-b border-gray-200 pb-4">
          <h5 className="text-sm font-medium mb-3 text-gray-700">Patient Referrer Information</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: "referringByName", label: "Referring Patient Name *", type: "text" },
              { id: "relationshipName", label: "Relationship", type: "select", options: relationshipTypes },
              { id: "referringPhoneNumber", label: "Phone", type: "tel" },
              { id: "referringEmail", label: "Email", type: "email" },
            ].map(renderField)}
          </div>
        </div>
      )}
      {/** ✅ Treatment Information Section */}
      <div className="border-b border-gray-200 pb-4">
        <h5 className="text-sm font-medium mb-3 text-gray-700">Treatment Information</h5>
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



      <div className="border-b border-gray-200 pb-4">
        <h5 className="text-sm font-medium mb-3 text-gray-700">Additional Information</h5>
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
