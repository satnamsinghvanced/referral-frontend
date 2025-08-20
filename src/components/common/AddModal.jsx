import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Button,
} from "@heroui/react";

const AddModal = ({ isOpen, heading, description, cancelBtnData, addBtnData, config }) => {
    return (
        <div className="flex absolute top-0 ">
            <Modal isOpen={isOpen} onOpenChange={cancelBtnData.function} >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className=" flex flex-col">
                                    <h4 className="text-base font-normal">{heading}</h4>
                                    <p className="text-xs font-extralight text-text/90">{description}</p>
                                </div>
                            </ModalHeader>

                            <div className=" overflow-y-scroll h-[700px]">
                                <ModalBody className="">

                                    {config}
                                </ModalBody>
                            </div>
                            <ModalFooter>
                                <Button color="default" variant="light" onPress={cancelBtnData.function || onClose} className={`capitalize ${cancelBtnData.style}`}>
                                    {cancelBtnData.text}
                                </Button>
                                <Button color="default" onPress={addBtnData.function} className={`capitalize ${addBtnData.style}`}>
                                    {addBtnData.text}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default AddModal;


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

// const AddModal = ({
//     isOpen,
//     heading,
//     description,
//     cancelBtnData,
//     addBtnData,
//     initialData = {}
// }) => {
//     const [referrerType, setReferrerType] = useState(initialData.referrerType || 'doctor');
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

//     const handleSave = () => {
//         // Here you would typically process the form data
//         const dataToSave = {
//             ...formData,
//             referrerType
//         };
//         console.log('Form data:', dataToSave);
//         addBtnData.function(dataToSave);
//     };

//     const handleCancel = () => {
//         cancelBtnData.function();
//     };

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
//         <Modal isOpen={isOpen} onOpenChange={cancelBtnData.function} size="3xl">
//             <ModalContent>
//                 {(onClose) => (
//                     <>
//                         <ModalHeader>
//                             <div className="flex flex-col">
//                                 <h4 className="text-lg font-semibold">{heading}</h4>
//                                 <p className="text-sm text-gray-600 mt-1">{description}</p>
//                             </div>
//                         </ModalHeader>

//                         <ModalBody>
//                             <div className="space-y-6 py-2">
//                                 {/* Referrer Type Selection */}
//                                 <div className="border-b border-gray-200 pb-4">
//                                     <h5 className="text-sm font-medium mb-3 text-gray-700">Referrer Type</h5>
//                                     <RadioGroup
//                                         orientation="horizontal"
//                                         value={referrerType}
//                                         onValueChange={setReferrerType}
//                                         className="gap-4"
//                                     >
//                                         <Radio value="doctor" className="mr-2">
//                                             Doctor Referrer
//                                         </Radio>
//                                         <Radio value="patient">
//                                             Patient Referrer
//                                         </Radio>
//                                     </RadioGroup>
//                                 </div>

//                                 {/* Patient Information */}
//                                 <div className="border-b border-gray-200 pb-4">
//                                     <h5 className="text-sm font-medium mb-3 text-gray-700">Patient Information</h5>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         <Input
//                                             label="Patient Name *"
//                                             value={formData.patientName}
//                                             onChange={(e) => handleInputChange('patientName', e.target.value)}
//                                             className="w-full"
//                                         />
//                                         <Input
//                                             label="Age"
//                                             type="number"
//                                             value={formData.patientAge}
//                                             onChange={(e) => handleInputChange('patientAge', e.target.value)}
//                                             className="w-full"
//                                         />
//                                         <Input
//                                             label="Phone"
//                                             value={formData.patientPhone}
//                                             onChange={(e) => handleInputChange('patientPhone', e.target.value)}
//                                             className="w-full"
//                                         />
//                                         <Input
//                                             label="Email"
//                                             type="email"
//                                             value={formData.patientEmail}
//                                             onChange={(e) => handleInputChange('patientEmail', e.target.value)}
//                                             className="w-full"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Referrer Specific Information */}
//                                 {referrerType === 'doctor' ? (
//                                     <div className="border-b border-gray-200 pb-4">
//                                         <h5 className="text-sm font-medium mb-3 text-gray-700">Doctor Referrer Information</h5>
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                             <Input
//                                                 label="Doctor Name *"
//                                                 value={formData.doctorName}
//                                                 onChange={(e) => handleInputChange('doctorName', e.target.value)}
//                                             />
//                                             <Input
//                                                 label="Practice Name *"
//                                                 value={formData.practiceName}
//                                                 onChange={(e) => handleInputChange('practiceName', e.target.value)}
//                                             />
//                                             <Input
//                                                 label="Specialty"
//                                                 value={formData.specialty}
//                                                 onChange={(e) => handleInputChange('specialty', e.target.value)}
//                                             />
//                                             <Input
//                                                 label="Phone *"
//                                                 value={formData.doctorPhone}
//                                                 onChange={(e) => handleInputChange('doctorPhone', e.target.value)}
//                                             />
//                                             <Input
//                                                 label="Email *"
//                                                 type="email"
//                                                 value={formData.doctorEmail}
//                                                 onChange={(e) => handleInputChange('doctorEmail', e.target.value)}
//                                             />
//                                             <Input
//                                                 label="Fax"
//                                                 value={formData.fax}
//                                                 onChange={(e) => handleInputChange('fax', e.target.value)}
//                                             />
//                                             <Input
//                                                 label="Website"
//                                                 value={formData.website}
//                                                 onChange={(e) => handleInputChange('website', e.target.value)}
//                                             />
//                                         </div>

//                                         <div className="mt-4">
//                                             <h6 className="text-sm font-medium mb-2 text-gray-700">Practice Address *</h6>
//                                             <div className="grid grid-cols-1 gap-4">
//                                                 <Input
//                                                     label="Street Address"
//                                                     value={formData.streetAddress}
//                                                     onChange={(e) => handleInputChange('streetAddress', e.target.value)}
//                                                 />
//                                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                                     <Input
//                                                         label="City"
//                                                         value={formData.city}
//                                                         onChange={(e) => handleInputChange('city', e.target.value)}
//                                                     />
//                                                     <Select
//                                                         label="State"
//                                                         selectedKeys={formData.state ? [formData.state] : []}
//                                                         onChange={(e) => handleInputChange('state', e.target.value)}
//                                                     >
//                                                         {states.map((state) => (
//                                                             <SelectItem key={state} value={state}>
//                                                                 {state}
//                                                             </SelectItem>
//                                                         ))}
//                                                     </Select>
//                                                     <Input
//                                                         label="ZIP Code"
//                                                         value={formData.zipCode}
//                                                         onChange={(e) => handleInputChange('zipCode', e.target.value)}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ) : (
//                                     <div className="border-b border-gray-200 pb-4">
//                                         <h5 className="text-sm font-medium mb-3 text-gray-700">Patient Referrer Information</h5>
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                             <Input
//                                                 label="Referring Patient Name *"
//                                                 value={formData.referringPatientName}
//                                                 onChange={(e) => handleInputChange('referringPatientName', e.target.value)}
//                                             />
//                                             <Select
//                                                 label="Relationship to Patient"
//                                                 selectedKeys={formData.relationship ? [formData.relationship] : []}
//                                                 onChange={(e) => handleInputChange('relationship', e.target.value)}
//                                             >
//                                                 {relationshipTypes.map((relationship) => (
//                                                     <SelectItem key={relationship} value={relationship}>
//                                                         {relationship}
//                                                     </SelectItem>
//                                                 ))}
//                                             </Select>
//                                             <Input
//                                                 label="Referring Patient Phone"
//                                                 value={formData.referringPatientPhone}
//                                                 onChange={(e) => handleInputChange('referringPatientPhone', e.target.value)}
//                                             />
//                                             <Input
//                                                 label="Referring Patient Email"
//                                                 type="email"
//                                                 value={formData.referringPatientEmail}
//                                                 onChange={(e) => handleInputChange('referringPatientEmail', e.target.value)}
//                                             />
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Treatment Information */}
//                                 <div className="border-b border-gray-200 pb-4">
//                                     <h5 className="text-sm font-medium mb-3 text-gray-700">Treatment Information</h5>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         <Select
//                                             label="Treatment Type"
//                                             selectedKeys={formData.treatmentType ? [formData.treatmentType] : []}
//                                             onChange={(e) => handleInputChange('treatmentType', e.target.value)}
//                                         >
//                                             {treatmentTypes.map((treatment) => (
//                                                 <SelectItem key={treatment} value={treatment}>
//                                                     {treatment}
//                                                 </SelectItem>
//                                             ))}
//                                         </Select>
//                                         <Select
//                                             label="Urgency"
//                                             selectedKeys={formData.urgency ? [formData.urgency] : []}
//                                             onChange={(e) => handleInputChange('urgency', e.target.value)}
//                                         >
//                                             <SelectItem value="Low">Low</SelectItem>
//                                             <SelectItem value="Medium">Medium</SelectItem>
//                                             <SelectItem value="High">High</SelectItem>
//                                         </Select>
//                                         <Input
//                                             label="Insurance Provider"
//                                             value={formData.insuranceProvider}
//                                             onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
//                                         />
//                                         <Select
//                                             label="Preferred Time"
//                                             selectedKeys={formData.preferredTime ? [formData.preferredTime] : []}
//                                             onChange={(e) => handleInputChange('preferredTime', e.target.value)}
//                                         >
//                                             {preferredTimes.map((time) => (
//                                                 <SelectItem key={time} value={time}>
//                                                     {time}
//                                                 </SelectItem>
//                                             ))}
//                                         </Select>
//                                     </div>
//                                 </div>

//                                 {/* Additional Fields for Patient Referrer */}
//                                 {referrerType === 'patient' && (
//                                     <div className="space-y-4">
//                                         <Textarea
//                                             label="Reason for Referral"
//                                             placeholder="Describe the reason for the referral..."
//                                             value={formData.reasonForReferral}
//                                             onChange={(e) => handleInputChange('reasonForReferral', e.target.value)}
//                                             minRows={3}
//                                         />
//                                         <Textarea
//                                             label="Additional Notes"
//                                             placeholder="Any additional notes or special considerations..."
//                                             value={formData.additionalNotes}
//                                             onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
//                                             minRows={2}
//                                         />
//                                     </div>
//                                 )}
//                             </div>
//                         </ModalBody>
//                         <ModalFooter>
//                             <Button
//                                 color="default"
//                                 variant="light"
//                                 onPress={cancelBtnData.function || onClose}
//                                 className={`capitalize ${cancelBtnData.style}`}
//                             >
//                                 {cancelBtnData.text}
//                             </Button>
//                             <Button
//                                 color="primary"
//                                 onPress={handleSave}
//                                 className={`capitalize ${addBtnData.style}`}
//                             >
//                                 {addBtnData.text}
//                             </Button>
//                         </ModalFooter>
//                     </>
//                 )}
//             </ModalContent>
//         </Modal>
//     );
// };

// export default AddModal;
