import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Divider,
  Input,
  Link,
  Select,
  SelectItem,
  Spinner
} from "@heroui/react";
import { useState, type FormEvent } from 'react';
import { FaEyeSlash } from 'react-icons/fa';
import { TbEyeFilled } from "react-icons/tb";
import { useNavigate } from "react-router";

interface FormData {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  practiceName: string;
  medicalSpecialty: string[];
  role: string[];
  agreeToTerms: boolean;
}

interface Errors {
  firstName?: string;
  lastName?: string;
  mobile?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  practiceName?: string;
  medicalSpecialty?: string;
  role?: string;
  agreeToTerms?: string;
  general?: string;
}

interface SignUpProps {
  onSignUp: (formData: FormData) => Promise<void>;
  onNavigateToSignIn: () => void;
}

// Medical specialties options
const MEDICAL_SPECIALTIES = [
  { key: "orthodontics", label: "Orthodontics" },
  { key: "generalDentistry", label: "General Dentistry" },
  { key: "OralSurgery", label: "Oral Surgery" },
  { key: "endodontics", label: "Endodontics" },
  { key: "periodontics", label: "Periodontics" },
  { key: "other", label: "Other" }
];

// Role options
const ROLES = [
  { key: "admin", label: "Admin" },
  { key: "manager", label: "Manager" },
  { key: "doctor", label: "Doctor" },
  { key: "staff", label: "Staff" },
  { key: "assistant", label: "Assistant" }
];

// Field configuration array - easily customizable
const formFields = [
  {
    id: 'firstName',
    label: 'First Name',
    type: 'text',
    required: true,
    validation: (value: string) => {
      if (!value) return 'First name is required';
      if (value.length < 2) return 'First name must be at least 2 characters';
      return '';
    }
  },
  {
    id: 'lastName',
    label: 'Last Name',
    type: 'text',
    required: true,
    validation: (value: string) => {
      if (!value) return 'Last name is required';
      if (value.length < 2) return 'Last name must be at least 2 characters';
      return '';
    }
  },
  {
    id: 'mobile',
    label: 'Mobile Number',
    type: 'tel',
    required: true,
    validation: (value: string) => {
      if (!value) return 'Mobile number is required';
      if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) return 'Mobile number must be 10 digits';
      return '';
    }
  },
  {
    id: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    validation: (value: string) => {
      if (!value) return 'Email is required';
      if (!/\S+@\S+\.\S+/.test(value)) return 'Email address is invalid';
      return '';
    }
  },
  {
    id: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    validation: (value: string) => {
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters';
      return '';
    }
  },
  {
    id: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    required: true,
    validation: (value: string, formData: FormData) => {
      if (!value) return 'Please confirm your password';
      if (value !== formData.password) return 'Passwords do not match';
      return '';
    }
  },
  {
    id: 'practiceName',
    label: 'Practice Name',
    type: 'text',
    required: false,
    validation: (value: string) => {
      return '';
    }
  }
];

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onNavigateToSignIn }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    practiceName: '',
    medicalSpecialty: [],
    role: [],
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<Errors>({});

  const toggleVisibility = () => setIsVisible(!isVisible);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    // Validate all fields from the configuration array
    formFields.forEach(field => {
      const error = field.validation(
        formData[field.id as keyof FormData] as string,
        formData
      );
      if (error) {
        newErrors[field.id as keyof Errors] = error;
      }
    });

    // Validate medical specialty
    if (formData.medicalSpecialty.length === 0) {
      newErrors.medicalSpecialty = 'Please select at least one medical specialty';
    }

    // Validate role
    if (formData.role.length === 0) {
      newErrors.role = 'Please select at least one role';
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field as keyof Errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleMultiSelectChange = (field: 'medicalSpecialty' | 'role', keys: Set<string>) => {
    handleInputChange(field, Array.from(keys));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // await onSignUp(formData);
      console.log('Sign up successful');
      alert('Sign up successful!');
    } catch (error: any) {
      console.error('Sign up error:', error);
      setErrors(prev => ({
        ...prev,
        general: error.message || 'Failed to create account. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const onNavigateToSignInLocal = () => {
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl"> {/* Increased max width for better layout */}
        <CardBody className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text/90 mb-2">Create Your Account</h2>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dynamically render basic fields from configuration array */}
              {formFields.map((field) => (
                <div key={field.id} className={field.id === 'practiceName' ? 'md:col-span-2' : ''}>
                  <Input
                    label={field.label}
                    type={
                      field.type === 'password'
                        ? (isVisible ? "text" : "password")
                        : field.type
                    }
                    value={formData[field.id as keyof FormData] as string}
                    onValueChange={(value: string) =>
                      handleInputChange(field.id as keyof FormData, value)
                    }
                    endContent={
                      field.type === 'password' ? (
                        <button
                          className="focus:outline-none"
                          type="button"
                          onClick={toggleVisibility}
                        >
                          {isVisible ? (
                            <FaEyeSlash className="text-default-400 pointer-events-none" />
                          ) : (
                            <TbEyeFilled className="text-default-400 pointer-events-none" />
                          )}
                        </button>
                      ) : null
                    }
                    isInvalid={!!errors[field.id as keyof Errors]}
                    errorMessage={errors[field.id as keyof Errors]}
                    className="w-full"
                  />
                </div>
              ))}

              {/* Medical Specialty Multi-Select */}
              <div className="md:col-span-2">
                <Select
                  label="Medical Specialty"
                  selectionMode="multiple"
                  selectedKeys={new Set(formData.medicalSpecialty)}
                  onSelectionChange={(keys) =>
                    handleMultiSelectChange('medicalSpecialty', keys as Set<string>)
                  }
                  isInvalid={!!errors.medicalSpecialty}
                  errorMessage={errors.medicalSpecialty}
                  classNames={{
                    trigger: "h-12"
                  }}
                >
                  {MEDICAL_SPECIALTIES.map((specialty) => (
                    <SelectItem key={specialty.key}>
                      {specialty.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Role Multi-Select */}
              <div className="md:col-span-2">
                <Select
                  label="Role"
                  selectionMode="multiple"
                  selectedKeys={new Set(formData.role)}
                  onSelectionChange={(keys) =>
                    handleMultiSelectChange('role', keys as Set<string>)
                  }
                  isInvalid={!!errors.role}
                  errorMessage={errors.role}
                  classNames={{
                    trigger: "h-12"
                  }}
                >
                  {ROLES.map((role) => (
                    <SelectItem key={role.key}>
                      {role.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="pt-2">
              <Checkbox
                isSelected={formData.agreeToTerms}
                onValueChange={(value: boolean) =>
                  handleInputChange('agreeToTerms', value)
                }
                classNames={{
                  label: "text-small"
                }}
                isInvalid={!!errors.agreeToTerms}
              >
                I agree to the{' '}
                <Link href="/terms" className="text-primary-600 text-small">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-600 text-small">
                  Privacy Policy
                </Link>
              </Checkbox>
              {errors.agreeToTerms && (
                <div className="text-danger text-tiny mt-1 ml-1">
                  {errors.agreeToTerms}
                </div>
              )}
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              color="primary"
              className="w-full font-semibold h-12 mt-4"
              isLoading={isLoading}
              spinner={<Spinner size="sm" />}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Divider className="my-6" />

            {/* Sign In Link */}
            <div className="text-center">
              <span className="text-text/60">Already have an account? </span>
              <Link
                className="font-semibold cursor-pointer text-primary-600 hover:text-primary-700"
                onPress={onNavigateToSignIn || onNavigateToSignInLocal}
              >
                Sign in
              </Link>
            </div>
          </form>

          {/* <div className="mt-6 text-center text-xs text-text/50">
            Your account will be activated after verification by our team.
          </div> */}

          <div className="mt-3 text-center text-xs text-text/50 w-full">
            By signing in, you agree to our
            <Link href="/referral-retrieve/terms" className="text-xs">
              Terms of Service
            </Link>
            {" "}and{" "}
            <Link href="/referral-retrieve/privacy" className="text-xs">
              Privacy Policy
            </Link>.
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SignUp;