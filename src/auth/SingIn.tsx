import { useState, ChangeEvent, FormEvent } from 'react';
import {
    Card,
    CardBody,
    Input,
    Button,
    Checkbox,
    Link,
    Divider,
    Spinner
} from "@heroui/react";
import { TbEyeFilled } from "react-icons/tb";
import { FaEyeSlash, FaLock } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';

interface Errors {
    email: string;
    password: string;
    rememberMe?: boolean;
    general?: string;
}

interface FormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

interface Errors {
    email: string;
    password: string;
    general?: string;
}

// Define props for the SignIn component (if needed)
interface SignInProps {
    onSignIn: (formData: FormData) => Promise<void>;
    onNavigateToForgotPassword: () => void;
    onNavigateToSignUp: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn, onNavigateToForgotPassword, onNavigateToSignUp }) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        rememberMe: false
    });

    const [errors, setErrors] = useState<Errors>({
        email: '',
        password: ''
    });

    const toggleVisibility = () => setIsVisible(!isVisible);

    const validateForm = (): boolean => {
        const newErrors: Errors = {
            email: '',
            password: ''
        };

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return !newErrors.email && !newErrors.password;
    };

    const handleInputChange = (field: keyof FormData, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            await onSignIn(formData);
        } catch (error: any) {
            console.error('Sign in error:', error);
            setErrors(prev => ({
                ...prev,
                general: error.message || 'Failed to sign in. Please try again.'
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardBody className="p-6 sm:p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-text/90 mb-2">Welcome Back</h1>
                        <p className="text-text/70">Sign in to your account to continue</p>
                    </div>

                    {/* Error Message */}
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <Input
                                label="Email Address"
                                placeholder="Enter your email"
                                type="email"
                                value={formData.email}
                                onValueChange={(value: string) => handleInputChange('email', value)}
                                startContent={<IoMdMail className="text-default-400 pointer-events-none flex-shrink-0" />}
                                isInvalid={!!errors.email}
                                errorMessage={errors.email}
                                className="w-full"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <Input
                                label="Password"
                                placeholder="Enter your password"
                                type={isVisible ? "text" : "password"}
                                value={formData.password}
                                onValueChange={(value: string) => handleInputChange('password', value)}
                                startContent={<FaLock className="text-default-400 pointer-events-none flex-shrink-0" />}
                                endContent={
                                    <button
                                        className="focus:outline-none"
                                        type="button"
                                        onClick={toggleVisibility}
                                    >
                                        {isVisible ? (
                                            <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                                        ) : (
                                            <TbEyeFilled className="text-2xl text-default-400 pointer-events-none" />
                                        )}
                                    </button>
                                }
                                isInvalid={!!errors.password}
                                errorMessage={errors.password}
                                className="w-full"
                            />
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex justify-between items-center">
                            <Checkbox
                                isSelected={formData.rememberMe}
                                onValueChange={(value: boolean) => handleInputChange('rememberMe', value)}
                                classNames={{
                                    label: "text-small"
                                }}
                            >
                                Remember me
                            </Checkbox>
                            <Link
                                className="text-sm cursor-pointer text-primary-600 hover:text-primary-700"
                                onPress={onNavigateToForgotPassword}
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Sign In Button */}
                        <Button
                            type="submit"
                            color="primary"
                            className="w-full font-semibold h-12"
                            isLoading={isLoading}
                            spinner={<Spinner size="sm" />}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>

                        <Divider className="my-6" />

                        {/* Sign Up Link */}
                        <div className="text-center">
                            <span className="text-text/60">Don't have an account? </span>
                            <Link
                                className="font-semibold cursor-pointer text-primary-600 hover:text-primary-700"
                                onPress={onNavigateToSignUp}
                            >
                                Create an account
                            </Link>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-xs text-text/50">
                        By signing in, you agree to our Terms of Service and Privacy Policy.
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default SignIn;
