import {
    Button,
    Card,
    CardBody,
    Checkbox,
    Divider,
    Select,
    SelectItem,
    Textarea
} from "@heroui/react";
import { useFormik } from 'formik';
import { useState } from 'react';
import { FaCalendarAlt, FaGlobe, FaPhone, FaUserMd } from 'react-icons/fa';
import Input from '../../../components/ui/Input'; // Your custom Input component
import { timeOptions, treatmentOptions } from "../../../utils/consts";
import { urgencyOptions } from "../../../Utils/filters";

const PatientForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formFields = [
        {
            type: 'text',
            name: 'fullName',
            label: 'Full Name',
            placeholder: 'Enter your full name',
            required: true,
        },
        {
            type: 'email',
            name: 'email',
            label: 'Email Address',
            placeholder: 'your.email@example.com',
            required: true,
        },
        {
            type: 'tel',
            name: 'phone',
            label: 'Phone Number',
            placeholder: '(555) 123-4567',
            required: false,
        },
        {
            type: 'text',
            name: 'insuranceProvider',
            label: 'Insurance Provider',
            placeholder: 'e.g., Delta Dental, Aetna, Cigna, etc.',
            required: false,
        }
    ];

    // Formik configuration
    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            phone: '',
            insuranceProvider: '',
            preferredTreatment: '',
            urgencyLevel: '',
            preferredTime: '',
            referralReason: '',
            additionalNotes: '',
            agreeToTerms: false
        },
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));

                console.log('Form submitted with values:', values);

                // Here you would typically send the data to your backend
                // await submitForm(values);

                alert('Form submitted successfully! Check console for values.');
            } catch (error) {
                console.error('Form submission error:', error);
                alert('Error submitting form. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        },
        validate: (values) => {
            const errors: any = {};

            if (!values.fullName) {
                errors.fullName = 'Full name is required';
            }

            if (!values.email) {
                errors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(values.email)) {
                errors.email = 'Email address is invalid';
            }

            if (!values.agreeToTerms) {
                errors.agreeToTerms = 'You must agree to the terms and conditions';
            }

            return errors;
        }
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-8 px-4 text-xs">
            <div className="max-w-4xl mx-auto">
                {/* Header Card */}
                <Card className="shadow-lg mb-6 border-0  p-0">
                    <CardBody className="p-0">
                        <div className="flex justify-between items-center mb-4 text-sm bg-gradient-to-l from-green-600 to-blue-600 m-0 p-3 text-background">
                            <div>
                                <h1 className="text-xl font-bold mb-2">
                                    Downtown Orthodontics
                                </h1>
                                <div className="text-sm mb-1">
                                    Dr. Sarah Martinez, DDS, MS
                                </div>
                            </div>
                            <div>
                                <div className="mb-1 flex items-center justify-center gap-2">
                                    <FaPhone className="text-sm" />
                                    +1 (555) 123-4567
                                </div>
                                <div className="">
                                    123 New Street, City, State 12345
                                </div>
                            </div>
                        </div>
 

                        <div className="p-4">
                            <p className="text-sm text-primary">
                                <strong>Referred by Dr. Sarah Wilson, DDS from Family Dental Center</strong>
                            </p>
                            <p className="text-xs text-primary mt-1">
                                [Monday] [Dashboard Name] [Audit Orthodontics] [Product Orthodontics]
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
                                Please fill out the form below and we'll contact you to schedule your appointment.
                            </p>
                        </div>

                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            {/* Personal Information Grid - Using Input Component */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {formFields.map((field) => (
                                    <Input
                                        key={field.name}
                                        label={field.label}
                                        name={field.name}
                                        placeholder={field.placeholder}
                                        type={field.type}
                                        value={formik.values[field.name as keyof typeof formik.values]}
                                        className="w-full"
                                        formik={formik}
                                        isRequired={field.required}
                                    // labelPlacement="outside"
                                    />
                                ))}
                            </div>

                            {/* Treatment Preferences Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Preferred Treatment */}
                                <Select
                                    label="Preferred Treatment"
                                    placeholder="Select treatment type"
                                    selectedKeys={formik.values.preferredTreatment ? [formik.values.preferredTreatment] : []}
                                    onSelectionChange={(keys) => {
                                        const value = Array.from(keys)[0] as string;
                                        formik.setFieldValue('preferredTreatment', value);
                                    }}
                                    className="w-full"
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
                                    selectedKeys={formik.values.urgencyLevel ? [formik.values.urgencyLevel] : []}
                                    onSelectionChange={(keys) => {
                                        const value = Array.from(keys)[0] as string;
                                        formik.setFieldValue('urgencyLevel', value);
                                    }}
                                    className="w-full"
                                >
                                    {urgencyOptions.map((urgency) => (
                                        <SelectItem key={urgency.key}>
                                            {urgency.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>

                            {/* Appointment Time */}
                            <div className="grid grid-cols-1 gap-6">
                                <Select
                                    label="Preferred Appointment Time"
                                    placeholder="e.g., Morning, Afternoon, Evening, Weekend"
                                    selectedKeys={formik.values.preferredTime ? [formik.values.preferredTime] : []}
                                    onSelectionChange={(keys) => {
                                        const value = Array.from(keys)[0] as string;
                                        formik.setFieldValue('preferredTime', value);
                                    }}
                                    className="w-full"
                                >
                                    {timeOptions.map((time) => (
                                        <SelectItem key={time.key}>
                                            {time.label}
                                        </SelectItem>
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
                                />
                            </div>

                            <Divider />

                            {/* Additional Notes */}
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Additional Notes
                                    </label>
                                    <p className="text-smmb-3">
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
                                    />
                                </div>
                            </div>

                            {/* Terms Agreement */}
                            <Checkbox
                                name="agreeToTerms"
                                isSelected={formik.values.agreeToTerms}
                                onValueChange={(value) => formik.setFieldValue('agreeToTerms', value)}
                                classNames={{
                                    label: "text-sm"
                                }}
                                isRequired
                            >
                                I agree to the terms and conditions and consent to being contacted by Downtown Orthodontics.
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
                                    isLoading={isSubmitting}
                                    isDisabled={!formik.isValid || isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Consultation Request'}
                                </Button>
                            </div>
                        </form>

                        <Divider className="my-6" />

                        {/* Footer Information */}
                        <div className="text-center space-y-4">
                            {/* Referral Info */}
                            <div className="rounded-lg p-4">
                                <h3 className="font-semibold mb-2">Submit Referral</h3>
                                <p className="text-sm">
                                    Sara Ott Counsel
                                </p>
                            </div>

                            {/* Contact Alternatives */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-blue-800 font-medium mb-2">
                                    Questions?
                                </p>
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
                            💡 <strong>Insurance Note:</strong> We accept most major insurance providers.
                            Please bring your insurance card to your first appointment for verification.
                        </p>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default PatientForm;