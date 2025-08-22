
import { Input, Select, SelectItem, Textarea } from "@heroui/react";
import { useFormik } from "formik";
import * as Yup from "yup";

const ReferralConnectionsConfig = ({ initialData = {} }) => {
  const formik = useFormik({
    initialValues: {
      referrerType: initialData.referrerType || "doctor",
      patientName: initialData.patientName || "",
      patientAge: initialData.patientAge || "",
      patientPhone: initialData.patientPhone || "",
      patientEmail: initialData.patientEmail || "",
      doctorName: initialData.doctorName || "",
      practiceName: initialData.practiceName || "",
      specialty: initialData.specialty || "",
      doctorPhone: initialData.doctorPhone || "",
      doctorEmail: initialData.doctorEmail || "",
      fax: initialData.fax || "",
      website: initialData.website || "",
      streetAddress: initialData.streetAddress || "",
      city: initialData.city || "",
      state: initialData.state || "",
      zipCode: initialData.zipCode || "",
      referringPatientName: initialData.referringPatientName || "",
      relationship: initialData.relationship || "",
      referringPatientPhone: initialData.referringPatientPhone || "",
      referringPatientEmail: initialData.referringPatientEmail || "",
      treatmentType: initialData.treatmentType || "",
      urgency: initialData.urgency || "Medium",
      insuranceProvider: initialData.insuranceProvider || "",
      preferredTime: initialData.preferredTime || "",
      reasonForReferral: initialData.reasonForReferral || "",
      additionalNotes: initialData.additionalNotes || "",
    },
    validationSchema: Yup.object({
      patientName: Yup.string().required("Patient name is required"),
      doctorName: Yup.string().when("referrerType", {
        is: "doctor",
        then: (schema) => schema.required("Doctor name is required"),
      }),
      practiceName: Yup.string().when("referrerType", {
        is: "doctor",
        then: (schema) => schema.required("Practice name is required"),
      }),
      doctorEmail: Yup.string().when("referrerType", {
        is: "doctor",
        then: (schema) => schema.email("Invalid email").required("Doctor email is required"),
      }),
      referringPatientName: Yup.string().when("referrerType", {
        is: "patient",
        then: (schema) => schema.required("Referring patient name is required"),
      }),
    }),
    onSubmit: (values) => {
      console.log("✅ Submitted:", values);
    },
  });


  // const states = [
  //   'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  //   'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  //   'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  //   'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  //   'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
  //   'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
  //   'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  // ];

  const treatmentTypes = [
    'General Dentistry', 'Orthodontics', 'Oral Surgery', 'Periodontics', 'Endodontics',
    'Prosthodontics', 'Pediatric Dentistry', 'Cosmetic Dentistry', 'Dental Implants', 'Teeth Whitening'
  ];
  const relationshipTypes = ["Family", "Friend", "Colleague", "Neighbor", "Other"];
  const preferredTimes = ["Morning", "Afternoon", "Evening", "Any Time"];

  const renderField = (field) => {
    const { id, label, type, options, placeholder, minRows } = field;
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
              onChange={formik.handleChange}
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
          selectedKeys={[formik.values.referrerType]}
          onSelectionChange={(keys) =>
            formik.setFieldValue("referrerType", [...keys][0])
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
            { id: "patientName", label: "Patient Name *", type: "text" },
            { id: "patientAge", label: "Age", type: "number" },
            { id: "patientPhone", label: "Phone", type: "tel" },
            { id: "patientEmail", label: "Email", type: "email" },
          ].map(renderField)}
        </div>
      </div>

      {formik.values.referrerType === "doctor" && (
        <div className="border-b border-gray-200 pb-4">
          <h5 className="text-sm font-medium mb-3 text-gray-700">Doctor Information</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: "doctorName", label: "Doctor Name *", type: "text" },
              { id: "practiceName", label: "Practice Name *", type: "text" },
              { id: "specialty", label: "Specialty", type: "text" },
              { id: "doctorPhone", label: "Phone *", type: "tel" },
              { id: "doctorEmail", label: "Email *", type: "email" },
            ].map(renderField)}
          </div>
        </div>
      )}

      {formik.values.referrerType === "patient" && (
        <div className="border-b border-gray-200 pb-4">
          <h5 className="text-sm font-medium mb-3 text-gray-700">Patient Referrer Information</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: "referringPatientName", label: "Referring Patient Name *", type: "text" },
              { id: "relationship", label: "Relationship", type: "select", options: relationshipTypes },
              { id: "referringPatientPhone", label: "Phone", type: "tel" },
              { id: "referringPatientEmail", label: "Email", type: "email" },
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
              options: ["Low", "Medium", "High"],
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
              id: "additionalNotes",
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
};

export default ReferralConnectionsConfig;
