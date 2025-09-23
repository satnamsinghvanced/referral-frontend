import { Alert, Button, Card, CardBody, Link } from "@heroui/react";
import { useState } from "react";
import { FaCheckCircle, FaDownload, FaEnvelope } from 'react-icons/fa';
import { useNavigate, useSearchParams } from "react-router";
type AlertColor = "primary" | "default" | "secondary" | "success" | "warning" | "danger";

interface AlertInfo {
    color: AlertColor;
    title: string;
    description: string;
    isVisible: boolean;
}


const Success = () => {
    const navigate = useNavigate();
    const [alertInfo, setAlertInfo] = useState<AlertInfo>({
        isVisible: false,
        title: '',
        description: '',
        color: 'success',
    });
    const [searchParams] = useSearchParams();
    const transactionId = searchParams.get('transactionId') || 'N/A';
    const amount = searchParams.get('amount') || '0.00';
    const planName = searchParams.get('planName') || 'Premium Plan';

    const handleDownloadInvoice = () => {
        console.log('Downloading invoice...');

        // Only trigger a new alert if no alert is currently shown
        if (!alertInfo.isVisible) {
            setAlertInfo({
                isVisible: true,
                title: 'Invoice Sent',
                description: 'Invoice Downloaded Successfully!',
                color: 'success',
            });

            // Auto-hide after 3 seconds
            hideOpenedAlert();
        }
    };

    const hideOpenedAlert = () => {
        setTimeout(() => setAlertInfo(prev => ({ ...prev, isVisible: false })), 3000);
    }

    const handleEmailReceipt = () => {
        console.log('Sending email receipt...');
        setAlertInfo({
            isVisible: true,
            title: 'Mail not sent',
            description: 'Unable to send email at this moment.',
            color: 'danger',
        });
    };

    // const nextSteps = [
    //     {
    //         icon: FaCalendarCheck,
    //         title: "Schedule Your First Session",
    //         description: "Book an appointment with our dental specialists"
    //     },
    //     {
    //         icon: FaDownload,
    //         title: "Download Our App",
    //         description: "Get mobile access to your dental records"
    //     },
    //     {
    //         icon: FaEnvelope,
    //         title: "Check Your Email",
    //         description: "We've sent setup instructions to your inbox"
    //     }
    // ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Success Card */}
                <Card className=" border-0">
                    <CardBody className="p-6 sm:p-8 text-center">
                        {/* Success Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <FaCheckCircle className="text-6xl text-green-500" />
                                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping ease-in-out duration-500 opacity-75"></div>
                            </div>
                        </div>

                        {/* Success Message */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Payment Successful!
                        </h1>
                        <p className="text-lg text-gray-600 mb-6">
                            Thank you for subscribing to {planName}. Your account is now active.
                        </p>

                        {/* Transaction Details */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-left">
                            <h3 className="font-semibold text-green-800 mb-4 flex items-center">
                                <FaCheckCircle className="mr-2" />
                                Transaction Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Transaction ID:</span>
                                    <p className="font-mono text-gray-900">{transactionId}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Amount Paid:</span>
                                    <p className="font-semibold text-green-600 text-lg">${amount}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Plan:</span>
                                    <p className="font-medium text-gray-900">{planName}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Status:</span>
                                    <p className="font-medium text-green-600">Completed</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mb-8 flex flex-col justify-center items-center gap-4">
                            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg">
                                <Button
                                    color="primary"
                                    className="flex items-center gap-2"
                                    onPress={handleDownloadInvoice}
                                >
                                    <FaDownload />
                                    Download Invoice
                                </Button>
                                <Button
                                    variant="flat"
                                    className="flex items-center gap-2"
                                    onPress={handleEmailReceipt}
                                >
                                    <FaEnvelope />
                                    Email Receipt
                                </Button>
                            </div>
                            <Button
                                color="primary"
                                onPress={() => navigate('/signup')}
                                className="w-full  max-w-xs"
                            >
                                Complete your Profile
                            </Button>
                        </div>

                        {/* Next Steps */}
                        {/* <div className="border-t pt-6">
                            <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {nextSteps.map((step, index) => (
                                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                                        <step.icon className="text-2xl text-green-500 mx-auto mb-2" />
                                        <h4 className="font-medium text-gray-900 mb-1">{step.title}</h4>
                                        <p className="text-sm text-gray-600">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div> */}
                    </CardBody>
                </Card>

                {/* Additional Information */}
                <div className="mt-4 text-center">
                    <div className="bg-background border border-text/10 rounded-xl p-4">
                        <h4 className="font-semibold text-primary mb-2">Need Help?</h4>
                        <p className="text-sm text-text/70 mb-2">
                            Our support team is here to help you get started.
                        </p>
                        <div className="flex justify-center gap-4 text-sm">
                            <Link href="/referral-retrieve/support" className="text-primary/70 hover:text-primary/90">
                                Contact Support
                            </Link>
                            <Link href="/referral-retrieve/help" className="text-primary/70 hover:text-primary/90">
                                Help Center
                            </Link>
                        </div>
                    </div>
                </div>

                {alertInfo.isVisible && (
                    <Alert
                        className="fixed top-4 right-4 transform   w-full max-w-sm z-50"
                        color={alertInfo.color}
                        title={alertInfo.title}
                        description={alertInfo.description}
                        variant="faded"
                        isClosable
                        onClose={() =>
                            setAlertInfo(prev => ({ ...prev, isVisible: false }))
                        }
                    />
                )}

            </div>
        </div>
    );
};

export default Success;