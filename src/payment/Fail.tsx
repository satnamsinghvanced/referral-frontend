import { Button, Card, CardBody } from "@heroui/react";
import { FaRedo, FaTimesCircle } from 'react-icons/fa';
import { useNavigate, useSearchParams } from "react-router";

const Fail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const errorMessage = searchParams.get('errorMessage') || 'Payment could not be processed.';

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardBody className="p-8 text-center">
                    {/* Error Icon */}
                    <div className="flex justify-center mb-6">
                        <FaTimesCircle className="text-6xl text-red-500" />
                    </div>

                    {/* Error Message */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        Payment Failed
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {errorMessage}
                    </p>
                    <p className="text-sm text-red-600 mb-6">
                        Please try again or use a different payment method.
                    </p>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Button
                            color="primary"
                            className="w-full flex items-center justify-center gap-2"
                            onPress={() => navigate(-1)} // Go back to payment page
                        >
                            <FaRedo />
                            Try Again
                        </Button>
                        <Button
                            variant="light"
                            className="w-full"
                            onPress={() => navigate('/plans')}
                        >
                            Choose Different Plan
                        </Button>
                    </div>

                    {/* Support Link */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Need help?{' '}
                            <button
                                className="text-red-600 hover:text-red-800 underline"
                                onClick={() => navigate('/support')}
                            >
                                Contact our support team
                            </button>
                        </p>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default Fail;