import { Card, CardBody, Button } from "@heroui/react";
import { FaCheckCircle, FaPhone, FaClock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // or use next/navigation if using Next.js

const ThankYouPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-8 px-4">
            <div className="max-w-4xl mx-auto flex justify-center items-center flex-col min-h-screen -mt-16">
                {/* Success Header Card */}
                <Card className="shadow-lg mb-6 border-0 w-full">
                    <CardBody className="p-6">
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <FaCheckCircle className="text-6xl text-green-500" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                Thank You for Your Submission!
                            </h1>
                            <p className="text-lg text-gray-600 mb-6">
                                Your orthodontic consultation request has been received successfully.
                            </p>
                        </div>
                    </CardBody>
                </Card>

                {/* Next Steps Card */}
                <Card className="shadow-lg mb-6 border-0">
                    <CardBody className="p-6">
                        <h2 className="text-2xl font-bold text-center mb-6">
                            What Happens Next?
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Step 1 */}
                            <div className="text-center">
                                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaEnvelope className="text-blue-600 text-xl" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Confirmation Email</h3>
                                <p className="text-gray-600 text-sm">
                                    You'll receive a confirmation email within 24 hours with your appointment details.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="text-center">
                                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaPhone className="text-green-600 text-xl" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Phone Confirmation</h3>
                                <p className="text-gray-600 text-sm">
                                    Our team will call you within 1-2 business days to confirm your appointment time.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="text-center">
                                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaClock className="text-purple-600 text-xl" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Prepare for Visit</h3>
                                <p className="text-gray-600 text-sm">
                                    Bring your insurance card and ID to your first appointment.
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Contact Information */}
                {/* <Card className="shadow-lg mb-6 border-0">
                    <CardBody className="p-6">
                        <h2 className="text-2xl font-bold text-center mb-6">
                            Need Immediate Assistance?
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    <FaPhone className="text-blue-600" />
                                    <h3 className="font-semibold text-lg">Call Us Directly</h3>
                                </div>
                                <p className="text-gray-600 mb-2">
                                    Speak with our reception team
                                </p>
                                <p className="text-lg font-semibold text-blue-600">
                                    +1 (555) 123-4567
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Mon-Fri: 8:00 AM - 6:00 PM
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    <FaEnvelope className="text-green-600" />
                                    <h3 className="font-semibold text-lg">Email Us</h3>
                                </div>
                                <p className="text-gray-600 mb-2">
                                    Send us your questions
                                </p>
                                <p className="text-lg font-semibold text-green-600">
                                    info@downtownortho.com
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Response within 24 hours
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card> */}

                {/* Practice Information */}
                {/* <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-cyan-50">
                    <CardBody className="p-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">
                                Downtown Orthodontics
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <h3 className="font-semibold mb-2">Address</h3>
                                    <p className="text-gray-600">
                                        123 New Street<br />
                                        City, State 12345
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Hours</h3>
                                    <p className="text-gray-600">
                                        Monday - Friday: 8AM - 6PM<br />
                                        Saturday: 9AM - 2PM
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Provider</h3>
                                    <p className="text-gray-600">
                                        Dr. Sarah Martinez, DDS, MS<br />
                                        Specialist in Orthodontics
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card> */}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Button
                        color="primary"
                        size="lg"
                        className="px-8 py-3 text-lg font-semibold"
                        onPress={() => navigate('/referral')}
                    >
                        Submit Another Referral
                    </Button>
                    {/* <Button
                        variant="bordered"
                        size="lg"
                        className="px-8 py-3 text-lg font-semibold"
                        onPress={() => navigate('/referral')}
                    >
                        Submit Another Referral
                    </Button>*/}
                </div>

                {/* Insurance Note */}
                <Card className="mt-6 bg-amber-50 border-amber-200">
                    <CardBody className="p-4">
                        <p className="text-sm text-amber-800 text-center">
                            💡 <strong>Remember:</strong> Please bring your insurance card and valid photo ID to your first appointment.
                            If you need to reschedule, please call us at least 24 hours in advance.
                        </p>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default ThankYouPage;