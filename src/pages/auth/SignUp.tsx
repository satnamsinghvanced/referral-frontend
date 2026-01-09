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
  Spinner,
} from "@heroui/react";
import { useFormik } from "formik";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { TbEyeFilled } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX } from "../../consts/consts";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { AppDispatch } from "../../store";

interface FormData {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  practiceName: string;
  medicalSpecialty: string;
  agreeToTerms: boolean;
}

interface SignUpProps {
  onNavigateToSignIn?: () => void;
}

const MEDICAL_SPECIALTIES = [
  { key: "orthodontics", label: "Orthodontics" },
  { key: "generalDentistry", label: "General Dentistry" },
  { key: "OralSurgery", label: "Oral Surgery" },
  { key: "endodontics", label: "Endodontics" },
  { key: "periodontics", label: "Periodontics" },
  { key: "other", label: "Other" },
];

const validationSchema = Yup.object({
  firstName: Yup.string()
    .matches(
      NAME_REGEX,
      "First name can only contain letters, spaces, hyphens, apostrophes, and full stops"
    )
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: Yup.string()
    .matches(
      NAME_REGEX,
      "Last name can only contain letters, spaces, hyphens, apostrophes, and full stops"
    )
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  mobile: Yup.string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  email: Yup.string()
    .required("Email is required")
    .matches(EMAIL_REGEX, "Invalid email format"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      PASSWORD_REGEX,
      "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, one number and one special character"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  practiceName: Yup.string(),
  medicalSpecialty: Yup.array()
    .min(1, "Please select medical specialty")
    .required("Medical specialty is required"),
  agreeToTerms: Yup.boolean()
    .oneOf([true], "You must agree to the terms and conditions")
    .required("You must agree to the terms and conditions"),
});

const SignUp = ({ onNavigateToSignIn }: SignUpProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useTypedSelector((state) => state.auth);

  const formik = useFormik<FormData>({
    initialValues: {
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      password: "",
      confirmPassword: "",
      practiceName: "",
      medicalSpecialty: "",
      agreeToTerms: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // await dispatch(setCredentials(values)).unwrap();
      } catch (error: any) {
        console.error("Sign up error:", error);
      }
    },
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleMultiSelectChange = (keys: Set<string>) => {
    formik.setFieldValue("medicalSpecialty", Array.from(keys));
  };

  const onNavigateToSignInLocal = () => {
    navigate("/signin");
  };

  const getFieldError = (fieldName: keyof FormData) => {
    return formik.touched[fieldName] && formik.errors[fieldName]
      ? (formik.errors[fieldName] as string)
      : "";
  };

  const isFieldInvalid = (fieldName: keyof FormData) => {
    return !!(formik.touched[fieldName] && formik.errors[fieldName]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardBody className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground/90 mb-2">
              Create Your Account
            </h2>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={isFieldInvalid("firstName")}
                  errorMessage={getFieldError("firstName")}
                  className="w-full"
                />
              </div>

              <div>
                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={isFieldInvalid("lastName")}
                  errorMessage={getFieldError("lastName")}
                  className="w-full"
                />
              </div>

              <div>
                <Input
                  label="Mobile Number"
                  type="tel"
                  name="mobile"
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={isFieldInvalid("mobile")}
                  errorMessage={getFieldError("mobile")}
                  className="w-full"
                />
              </div>

              <div>
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={isFieldInvalid("email")}
                  errorMessage={getFieldError("email")}
                  className="w-full"
                />
              </div>

              <div>
                <Input
                  label="Password"
                  type={isVisible ? "text" : "password"}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  endContent={
                    <Button
                      className="focus:outline-none"
                      type="button"
                      onPress={toggleVisibility}
                    >
                      {isVisible ? (
                        <FaEyeSlash className="text-default-400 pointer-events-none" />
                      ) : (
                        <TbEyeFilled className="text-default-400 pointer-events-none" />
                      )}
                    </Button>
                  }
                  isInvalid={isFieldInvalid("password")}
                  errorMessage={getFieldError("password")}
                  className="w-full"
                />
              </div>

              <div>
                <Input
                  label="Confirm Password"
                  type={isVisible ? "text" : "password"}
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={isFieldInvalid("confirmPassword")}
                  errorMessage={getFieldError("confirmPassword")}
                  className="w-full"
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Practice Name"
                  type="text"
                  name="practiceName"
                  value={formik.values.practiceName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={isFieldInvalid("practiceName")}
                  errorMessage={getFieldError("practiceName")}
                  className="w-full"
                />
              </div>

              <div className="md:col-span-2">
                <Select
                  label="Medical Specialty"
                  selectedKeys={new Set(formik.values.medicalSpecialty)}
                  // @ts-ignore
                  onSelectionChange={handleMultiSelectChange}
                  isInvalid={isFieldInvalid("medicalSpecialty")}
                  errorMessage={getFieldError("medicalSpecialty")}
                  classNames={{
                    trigger: "h-12",
                  }}
                >
                  {MEDICAL_SPECIALTIES.map((specialty) => (
                    <SelectItem key={specialty.key}>
                      {specialty.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            <div className="pt-2">
              <Checkbox
                isSelected={formik.values.agreeToTerms}
                onValueChange={(value: boolean) =>
                  formik.setFieldValue("agreeToTerms", value)
                }
                classNames={{
                  label: "text-small",
                }}
                isInvalid={isFieldInvalid("agreeToTerms")}
              >
                I agree to the{" "}
                <Link href="/terms" className="text-primary-600 text-small">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary-600 text-small">
                  Privacy Policy
                </Link>
              </Checkbox>
              {isFieldInvalid("agreeToTerms") && (
                <div className="text-danger text-tiny mt-1 ml-1">
                  {getFieldError("agreeToTerms")}
                </div>
              )}
            </div>

            <Button
              type="submit"
              color="primary"
              className="w-full font-semibold h-12 mt-4"
              isLoading={loading}
              spinner={<Spinner size="sm" />}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <Divider className="my-6" />

            <div className="text-center">
              <span className="text-foreground/60">
                Already have an account?{" "}
              </span>
              <Link
                className="font-semibold cursor-pointer text-primary-600 hover:text-primary-700"
                onPress={onNavigateToSignIn || onNavigateToSignInLocal}
              >
                Sign in
              </Link>
            </div>
          </form>

          <div className="mt-3 text-center text-xs text-foreground/50 w-full">
            By signing in, you agree to our
            <Link href="/referral-retrieve/terms" className="text-xs">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/referral-retrieve/privacy" className="text-xs">
              Privacy Policy
            </Link>
            .
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SignUp;
