
// import React, { useState } from 'react';
// import {
//     Modal,
//     ModalBody,
//     ModalContent,
//     ModalHeader,
//     ModalFooter,
//     Button,
//     Input,
//     Select,
//     SelectItem,
//     Textarea,
//     RadioGroup,
//     Radio
// } from "@heroui/react";


// const ReferralConnectionsConfig = ({ initialData = {} }) => {
//     const [referrerType, setReferrerType] = useState(initialData.referrerType || 'doctor');

//     const onSelectChange = () => {
//         setReferrerType(referrerType === 'doctor' ? 'patient' : 'doctor')
//     }
//     const [formData, setFormData] = useState({
//         // Patient Information
//         patientName: initialData.patientName || 'John Doe',
//         patientAge: initialData.patientAge || '25',
//         patientPhone: initialData.patientPhone || '(555) 123-4567',
//         patientEmail: initialData.patientEmail || 'john.doe@email.com',

//         // Doctor Referrer Information
//         doctorName: initialData.doctorName || 'Dr. John Smith, DDS',
//         practiceName: initialData.practiceName || 'Family Dental Center',
//         specialty: initialData.specialty || 'General Dentistry',
//         doctorPhone: initialData.doctorPhone || '(555) 987-6543',
//         doctorEmail: initialData.doctorEmail || 'doctor@practice.com',
//         fax: initialData.fax || '(555) 987-6544',
//         website: initialData.website || 'www.practice.com',
//         streetAddress: initialData.streetAddress || '',
//         city: initialData.city || '',
//         state: initialData.state || '',
//         zipCode: initialData.zipCode || '',

//         // Patient Referrer Information
//         referringPatientName: initialData.referringPatientName || 'Jane Smith',
//         relationship: initialData.relationship || '',
//         referringPatientPhone: initialData.referringPatientPhone || '(555) 123-4567',
//         referringPatientEmail: initialData.referringPatientEmail || 'jane.smith@email.com',

//         // Treatment Information
//         treatmentType: initialData.treatmentType || '',
//         urgency: initialData.urgency || 'Medium',
//         insuranceProvider: initialData.insuranceProvider || 'Blue Cross Blue Shield',
//         preferredTime: initialData.preferredTime || '',
//         reasonForReferral: initialData.reasonForReferral || '',
//         additionalNotes: initialData.additionalNotes || ''
//     });
//     const handleInputChange = (field, value) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     // const handleSave = () => {
//     //     // Here you would typically process the form data
//     //     const dataToSave = {
//     //         ...formData,
//     //         referrerType
//     //     };
//     //     console.log('Form data:', dataToSave);
//     //     addBtnData.function(dataToSave);
//     // };

//     // const handleCancel = () => {
//     //     cancelBtnData.function();
//     // };

//     const states = [
//         'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
//         'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
//         'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
//         'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
//         'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
//         'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
//         'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
//     ];

//     const treatmentTypes = [
//         'General Dentistry', 'Orthodontics', 'Oral Surgery', 'Periodontics', 'Endodontics',
//         'Prosthodontics', 'Pediatric Dentistry', 'Cosmetic Dentistry', 'Dental Implants', 'Teeth Whitening'
//     ];

//     const relationshipTypes = [
//         'Family', 'Friend', 'Colleague', 'Neighbor', 'Other'
//     ];

//     const preferredTimes = [
//         'Morning (8am-12pm)', 'Afternoon (12pm-5pm)', 'Evening (5pm-8pm)', 'Any Time'
//     ];

//     return (
//         <div className="space-y-2 py-1">
//             {/* Referrer Type Selection */}
//             <div className="border-b border-gray-200 pb-4">
//                 {/* <h5 className="text-sm font-medium mb-1 text-gray-700">Referrer Type</h5> */}
//                 <Select
//                     value={referrerType}
//                     onChange={onSelectChange}
//                     className="w-full max-w-sm"
//                     label="Select Referrer Type"
//                     labelPlacement='inside'
//                     size='sm'
//                 >
//                     <SelectItem value="doctor">Doctor Referrer</SelectItem>
//                     <SelectItem value="patient">Patient Referrer</SelectItem>
//                 </Select>
//             </div>

//             {/* Patient Information */}
//             <div className="border-b border-gray-200 pb-4">
//                 <h5 className="text-sm font-medium mb-3 text-gray-700">Patient Information</h5>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <Input
//                         label="Patient Name *"
//                         value={formData.patientName}
//                         onChange={(e) => handleInputChange('patientName', e.target.value)}
//                         className="w-full"
//                     />
//                     <Input
//                         label="Age"
//                         type="number"
//                         value={formData.patientAge}
//                         onChange={(e) => handleInputChange('patientAge', e.target.value)}
//                         className="w-full"
//                     />
//                     <Input
//                         label="Phone"
//                         value={formData.patientPhone}
//                         onChange={(e) => handleInputChange('patientPhone', e.target.value)}
//                         className="w-full"
//                     />
//                     <Input
//                         label="Email"
//                         type="email"
//                         value={formData.patientEmail}
//                         onChange={(e) => handleInputChange('patientEmail', e.target.value)}
//                         className="w-full"
//                     />
//                 </div>
//             </div>

//             {/* Referrer Specific Information */}
//             {referrerType === 'doctor' ? (
//                 <div className="border-b border-gray-200 pb-4">
//                     <h5 className="text-sm font-medium mb-3 text-gray-700">Doctor Referrer Information</h5>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <Input
//                             size="sm"
//                             label="Doctor Name *"
//                             value={formData.doctorName}
//                             onChange={(e) => handleInputChange('doctorName', e.target.value)}
//                         />
//                         <Input
//                             size="sm"
//                             label="Practice Name *"
//                             value={formData.practiceName}
//                             onChange={(e) => handleInputChange('practiceName', e.target.value)}
//                         />
//                         <Input
//                             size="sm"
//                             label="Specialty"
//                             value={formData.specialty}
//                             onChange={(e) => handleInputChange('specialty', e.target.value)}
//                         />
//                         <Input
//                             size="sm"
//                             label="Phone *"
//                             value={formData.doctorPhone}
//                             onChange={(e) => handleInputChange('doctorPhone', e.target.value)}
//                         />
//                         <Input
//                             size="sm"
//                             label="Email *"
//                             type="email"
//                             value={formData.doctorEmail}
//                             onChange={(e) => handleInputChange('doctorEmail', e.target.value)}
//                         />
//                         <Input
//                             size="sm"
//                             label="Fax"
//                             value={formData.fax}
//                             onChange={(e) => handleInputChange('fax', e.target.value)}
//                         />
//                         <Input
//                             size="sm"
//                             label="Website"
//                             value={formData.website}
//                             onChange={(e) => handleInputChange('website', e.target.value)}
//                         />
//                     </div>

//                     <div className="mt-4">
//                         <h6 className="text-sm font-medium mb-2 text-gray-700">Practice Address *</h6>
//                         <div className="grid grid-cols-1 gap-4">
//                             <Input
//                                 size="sm"
//                                 label="Street Address"
//                                 value={formData.streetAddress}
//                                 onChange={(e) => handleInputChange('streetAddress', e.target.value)}
//                             />
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                 <Input
//                                     size="sm"
//                                     label="City"
//                                     value={formData.city}
//                                     onChange={(e) => handleInputChange('city', e.target.value)}
//                                 />
//                                 <Select
//                                     size="sm"
//                                     label="State"
//                                     selectedKeys={formData.state ? [formData.state] : []}
//                                     onChange={(e) => handleInputChange('state', e.target.value)}
//                                 >
//                                     {states.map((state) => (
//                                         <SelectItem key={state} value={state}>
//                                             {state}
//                                         </SelectItem>
//                                     ))}
//                                 </Select>
//                                 <Input
//                                     size="sm"
//                                     label="ZIP Code"
//                                     value={formData.zipCode}
//                                     onChange={(e) => handleInputChange('zipCode', e.target.value)}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             ) : (
//                 <div className="border-b border-gray-200 pb-4">
//                     <h5 className="text-sm font-medium mb-3 text-gray-700">Patient Referrer Information</h5>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <Input
//                             label="Referring Patient Name *"
//                             value={formData.referringPatientName}
//                             onChange={(e) => handleInputChange('referringPatientName', e.target.value)}
//                         />
//                         <Select
//                             label="Relationship to Patient"
//                             selectedKeys={formData.relationship ? [formData.relationship] : []}
//                             onChange={(e) => handleInputChange('relationship', e.target.value)}
//                         >
//                             {relationshipTypes.map((relationship) => (
//                                 <SelectItem key={relationship} value={relationship}>
//                                     {relationship}
//                                 </SelectItem>
//                             ))}
//                         </Select>
//                         <Input
//                             label="Referring Patient Phone"
//                             value={formData.referringPatientPhone}
//                             onChange={(e) => handleInputChange('referringPatientPhone', e.target.value)}
//                         />
//                         <Input
//                             label="Referring Patient Email"
//                             type="email"
//                             value={formData.referringPatientEmail}
//                             onChange={(e) => handleInputChange('referringPatientEmail', e.target.value)}
//                         />
//                     </div>
//                 </div>
//             )}

//             {/* Treatment Information */}
//             <div className="border-b border-gray-200 pb-4">
//                 <h5 className="text-sm font-medium mb-3 text-gray-700">Treatment Information</h5>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <Select
//                         label="Treatment Type"
//                         selectedKeys={formData.treatmentType ? [formData.treatmentType] : []}
//                         onChange={(e) => handleInputChange('treatmentType', e.target.value)}
//                     >
//                         {treatmentTypes.map((treatment) => (
//                             <SelectItem key={treatment} value={treatment}>
//                                 {treatment}
//                             </SelectItem>
//                         ))}
//                     </Select>
//                     <Select
//                         label="Urgency"
//                         selectedKeys={formData.urgency ? [formData.urgency] : []}
//                         onChange={(e) => handleInputChange('urgency', e.target.value)}
//                     >
//                         <SelectItem value="Low">Low</SelectItem>
//                         <SelectItem value="Medium">Medium</SelectItem>
//                         <SelectItem value="High">High</SelectItem>
//                     </Select>
//                     <Input
//                         label="Insurance Provider"
//                         value={formData.insuranceProvider}
//                         onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
//                     />
//                     <Select
//                         label="Preferred Time"
//                         selectedKeys={formData.preferredTime ? [formData.preferredTime] : []}
//                         onChange={(e) => handleInputChange('preferredTime', e.target.value)}
//                     >
//                         {preferredTimes.map((time) => (
//                             <SelectItem key={time} value={time}>
//                                 {time}
//                             </SelectItem>
//                         ))}
//                     </Select>
//                 </div>
//             </div>

//             {/* Additional Fields for Patient Referrer */}
//             {referrerType === 'patient' && (
//                 <div className="space-y-4">
//                     <Textarea
//                         label="Reason for Referral"
//                         placeholder="Describe the reason for the referral..."
//                         value={formData.reasonForReferral}
//                         onChange={(e) => handleInputChange('reasonForReferral', e.target.value)}
//                         minRows={3}
//                     />
//                     <Textarea
//                         label="Additional Notes"
//                         placeholder="Any additional notes or special considerations..."
//                         value={formData.additionalNotes}
//                         onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
//                         minRows={2}
//                     />
//                 </div>
//             )}
//         </div>
//     )
// }

// export default ReferralConnectionsConfig







import React from "react";
import { Input, Select, SelectItem, Textarea } from "@heroui/react";
import { useFormik } from "formik";
import * as Yup from "yup";

const ReferralManagementConfig = ({ initialData = {} }) => {
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


  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
    'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
    'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

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

export default ReferralManagementConfig;
