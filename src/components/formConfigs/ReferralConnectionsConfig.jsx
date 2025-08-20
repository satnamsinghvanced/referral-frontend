
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







import React, { useState } from 'react';
import {
    Input,
    Select,
    SelectItem,
    Textarea
} from "@heroui/react";

const ReferralConnectionsConfig = ({ initialData = {} }) => {
    const [referrerType, setReferrerType] = useState(initialData.referrerType || 'doctor');
    const [formData, setFormData] = useState({
        patientName: initialData.patientName || 'John Doe',
        patientAge: initialData.patientAge || '25',
        patientPhone: initialData.patientPhone || '(555) 123-4567',
        patientEmail: initialData.patientEmail || 'john.doe@email.com',
        doctorName: initialData.doctorName || 'Dr. John Smith, DDS',
        practiceName: initialData.practiceName || 'Family Dental Center',
        specialty: initialData.specialty || 'General Dentistry',
        doctorPhone: initialData.doctorPhone || '(555) 987-6543',
        doctorEmail: initialData.doctorEmail || 'doctor@practice.com',
        fax: initialData.fax || '(555) 987-6544',
        website: initialData.website || 'www.practice.com',
        streetAddress: initialData.streetAddress || '',
        city: initialData.city || '',
        state: initialData.state || '',
        zipCode: initialData.zipCode || '',
        referringPatientName: initialData.referringPatientName || 'Jane Smith',
        relationship: initialData.relationship || '',
        referringPatientPhone: initialData.referringPatientPhone || '(555) 123-4567',
        referringPatientEmail: initialData.referringPatientEmail || 'jane.smith@email.com',
        treatmentType: initialData.treatmentType || '',
        urgency: initialData.urgency || 'Medium',
        insuranceProvider: initialData.insuranceProvider || 'Blue Cross Blue Shield',
        preferredTime: initialData.preferredTime || '',
        reasonForReferral: initialData.reasonForReferral || '',
        additionalNotes: initialData.additionalNotes || ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

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

    const relationshipTypes = [
        'Family', 'Friend', 'Colleague', 'Neighbor', 'Other'
    ];

    const preferredTimes = [
        'Morning (8am-12pm)', 'Afternoon (12pm-5pm)', 'Evening (5pm-8pm)', 'Any Time'
    ];

    const formSections = [
        {
            id: "patient-info",
            title: "Patient Information",
            fields: [
                {
                    id: "patientName",
                    label: "Patient Name *",
                    type: "text",
                    required: true,
                    value: formData.patientName,
                    colSpan: "full"
                },
                {
                    id: "patientAge",
                    label: "Age",
                    type: "number",
                    required: false,
                    value: formData.patientAge,
                    colSpan: "half"
                },
                {
                    id: "patientPhone",
                    label: "Phone",
                    type: "tel",
                    required: false,
                    value: formData.patientPhone,
                    colSpan: "half"
                },
                {
                    id: "patientEmail",
                    label: "Email",
                    type: "email",
                    required: false,
                    value: formData.patientEmail,
                    colSpan: "full"
                }
            ]
        },
        {
            id: "doctor-info",
            title: "Doctor Referrer Information",
            condition: referrerType === 'doctor',
            fields: [
                {
                    id: "doctorName",
                    label: "Doctor Name *",
                    type: "text",
                    required: true,
                    value: formData.doctorName,
                    colSpan: "half"
                },
                {
                    id: "practiceName",
                    label: "Practice Name *",
                    type: "text",
                    required: true,
                    value: formData.practiceName,
                    colSpan: "half"
                },
                {
                    id: "specialty",
                    label: "Specialty",
                    type: "text",
                    required: false,
                    value: formData.specialty,
                    colSpan: "half"
                },
                {
                    id: "doctorPhone",
                    label: "Phone *",
                    type: "tel",
                    required: true,
                    value: formData.doctorPhone,
                    colSpan: "half"
                },
                {
                    id: "doctorEmail",
                    label: "Email *",
                    type: "email",
                    required: true,
                    value: formData.doctorEmail,
                    colSpan: "half"
                },
                {
                    id: "fax",
                    label: "Fax",
                    type: "tel",
                    required: false,
                    value: formData.fax,
                    colSpan: "half"
                },
                {
                    id: "website",
                    label: "Website",
                    type: "url",
                    required: false,
                    value: formData.website,
                    colSpan: "full"
                },
                {
                    id: "streetAddress",
                    label: "Street Address",
                    type: "text",
                    required: false,
                    value: formData.streetAddress,
                    colSpan: "full"
                },
                {
                    id: "city",
                    label: "City",
                    type: "text",
                    required: false,
                    value: formData.city,
                    colSpan: "third"
                },
                {
                    id: "state",
                    label: "State",
                    type: "select",
                    required: false,
                    value: formData.state,
                    options: states,
                    colSpan: "third"
                },
                {
                    id: "zipCode",
                    label: "ZIP Code",
                    type: "text",
                    required: false,
                    value: formData.zipCode,
                    colSpan: "third"
                }
            ]
        },
        {
            id: "patient-referrer-info",
            title: "Patient Referrer Information",
            condition: referrerType === 'patient',
            fields: [
                {
                    id: "referringPatientName",
                    label: "Referring Patient Name *",
                    type: "text",
                    required: true,
                    value: formData.referringPatientName,
                    colSpan: "half"
                },
                {
                    id: "relationship",
                    label: "Relationship to Patient",
                    type: "select",
                    required: false,
                    value: formData.relationship,
                    options: relationshipTypes,
                    colSpan: "half"
                },
                {
                    id: "referringPatientPhone",
                    label: "Referring Patient Phone",
                    type: "tel",
                    required: false,
                    value: formData.referringPatientPhone,
                    colSpan: "half"
                },
                {
                    id: "referringPatientEmail",
                    label: "Referring Patient Email",
                    type: "email",
                    required: false,
                    value: formData.referringPatientEmail,
                    colSpan: "half"
                }
            ]
        },
        {
            id: "treatment-info",
            title: "Treatment Information",
            fields: [
                {
                    id: "treatmentType",
                    label: "Treatment Type",
                    type: "select",
                    required: false,
                    value: formData.treatmentType,
                    options: treatmentTypes,
                    colSpan: "half"
                },
                {
                    id: "urgency",
                    label: "Urgency",
                    type: "select",
                    required: false,
                    value: formData.urgency,
                    options: ["Low", "Medium", "High"],
                    colSpan: "half"
                },
                {
                    id: "insuranceProvider",
                    label: "Insurance Provider",
                    type: "text",
                    required: false,
                    value: formData.insuranceProvider,
                    colSpan: "half"
                },
                {
                    id: "preferredTime",
                    label: "Preferred Time",
                    type: "select",
                    required: false,
                    value: formData.preferredTime,
                    options: preferredTimes,
                    colSpan: "half"
                }
            ]
        },
        {
            id: "additional-info",
            title: "Additional Information",
            condition: referrerType === 'patient',
            fields: [
                {
                    id: "reasonForReferral",
                    label: "Reason for Referral",
                    type: "textarea",
                    required: false,
                    value: formData.reasonForReferral,
                    placeholder: "Describe the reason for the referral...",
                    minRows: 3,
                    colSpan: "full"
                },
                {
                    id: "additionalNotes",
                    label: "Additional Notes",
                    type: "textarea",
                    required: false,
                    value: formData.additionalNotes,
                    placeholder: "Any additional notes or special considerations...",
                    minRows: 2,
                    colSpan: "full"
                }
            ]
        }
    ];
    const onSelectChange = () => {
        setReferrerType(referrerType === 'doctor' ? 'patient' : 'doctor')
    }
    const renderField = (field) => {
        const commonProps = {
            key: field.id,
            label: field.label,
            value: field.value || '',
            onChange: (e) => handleInputChange(field.id, e.target.value),
            className: `w-full ${field.colSpan === 'half' ? 'md:col-span-1' : field.colSpan === 'third' ? 'md:col-span-1' : 'md:col-span-2'}`,
            size: "sm"
        };

        switch (field.type) {
            case 'select':
                return (
                    <Select
                        key={field.placeholder}
                        size='sm'
                        {...commonProps}
                        selectedKeys={field.value ? [field.value] : []}
                    >
                        {field.options.map(option => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </Select>
                );
            case 'textarea':
                return (
                    <Textarea
                        size='sm'
                        {...commonProps}
                        minRows={field.minRows || 3}
                        placeholder={field.placeholder}
                    />
                );
            default:
                return <Input size='sm' {...commonProps} type={field.type} />;
        }
    };

    return (
        <div className="space-y-6 py-1">
            <div className="border-b border-gray-200 pb-4">
                <Select
                    value={referrerType}
                    onChange={onSelectChange}
                    className="w-full max-w-sm"
                    label="Select Referrer Type"
                    labelPlacement='inside'
                    size='sm'
                >
                    <SelectItem value="doctor">Doctor Referrer</SelectItem>
                    <SelectItem value="patient">Patient Referrer</SelectItem>
                </Select>
            </div>

            {formSections.map(section => {
                if (section.condition !== undefined && !section.condition) return null;

                return (
                    <div key={section.id} className="border-b border-gray-200 pb-4">
                        <h5 className="text-sm font-medium mb-3 text-gray-700">{section.title}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {section.fields.map(field => renderField(field))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ReferralConnectionsConfig;