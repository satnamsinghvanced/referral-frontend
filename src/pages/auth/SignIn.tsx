import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Divider,
  Spinner,
  Input,
} from "@heroui/react";
import { useFormik } from "formik";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import { AppDispatch } from "../../store";
import { useLogin, useVerify2FA } from "../../hooks/useAuth";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../../consts/consts";
import { setCredentials } from "../../store/authSlice";

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const SignIn = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { mutate: loginUser, isPending: isLoginPending } = useLogin();
  const { mutate: verifyOtp, isPending: isVerifyPending } = useVerify2FA();

  const [showOtp, setShowOtp] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [otp, setOtp] = useState("");

  const formik = useFormik<FormData>({
    initialValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email is required")
        .matches(EMAIL_REGEX, "Invalid email format"),
      password: Yup.string()
        .required("Password is required")
        .matches(
          PASSWORD_REGEX,
          "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, one number and one special character",
        ),
      rememberMe: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      loginUser(
        {
          email: values.email,
          password: values.password,
          rememberMe: values.rememberMe,
        },
        {
          onSuccess: (response) => {
            if (response?.twoFactorRequired) {
              setShowOtp(true);
              setUserId(response.userId || null);
            } else {
              dispatch(
                setCredentials({
                  token: response?.accessToken || "",
                }),
              );
              navigate("/");
            }
          },
        },
      );
    },
  });

  const handleVerifyOtp = () => {
    if (!userId || !otp) return;
    verifyOtp({
      userId,
      otp,
      rememberMe: formik.values.rememberMe,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border border-foreground/10 bg-content1 backdrop-blur-xl">
        <CardBody className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2 text-foreground">
              {showOtp ? "Verify OTP" : "Welcome Back"}
            </h1>
            <p className="text-sm text-foreground/60">
              {showOtp
                ? "Enter the verification code sent to your phone"
                : "Sign in to your account to continue"}
            </p>
          </div>

          {!showOtp ? (
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <div className="flex">
                <Input
                  label="Email Address"
                  labelPlacement="inside"
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                  radius="sm"
                  variant="flat"
                  value={formik.values.email}
                  onValueChange={(value) =>
                    formik.setFieldValue("email", value)
                  }
                  onBlur={formik.handleBlur}
                  errorMessage={
                    formik.touched.email && (formik.errors.email as string)
                  }
                  isInvalid={!!(formik.touched.email && formik.errors.email)}
                  isRequired
                />
              </div>

              <div className="flex">
                <Input
                  label="Password"
                  labelPlacement="inside"
                  placeholder="Enter your password"
                  type={isVisible ? "text" : "password"}
                  name="password"
                  radius="sm"
                  variant="flat"
                  value={formik.values.password}
                  onValueChange={(value) =>
                    formik.setFieldValue("password", value)
                  }
                  onBlur={formik.handleBlur}
                  errorMessage={
                    formik.touched.password &&
                    (formik.errors.password as string)
                  }
                  isInvalid={
                    !!(formik.touched.password && formik.errors.password)
                  }
                  isRequired
                  endContent={
                    <button
                      className="focus:outline-none cursor-pointer"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
                      ) : (
                        <FaEye className="text-xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                />
              </div>

              <div className="flex justify-between items-center">
                <Checkbox
                  size="sm"
                  name="rememberMe"
                  isSelected={formik.values.rememberMe}
                  onValueChange={(value: boolean) =>
                    formik.setFieldValue("rememberMe", value)
                  }
                  classNames={{
                    label: "text-small",
                  }}
                >
                  Remember me
                </Checkbox>
              </div>

              <Button
                size="lg"
                radius="md"
                type="submit"
                color="primary"
                variant="solid"
                isLoading={isLoginPending}
                spinner={<Spinner color="white" size="sm" />}
                isDisabled={isLoginPending || !formik.isValid}
                className="mt-2 font-semibold"
                fullWidth
              >
                {isLoginPending ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          ) : (
            <div className="space-y-5">
              <Input
                label="Verification Code"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onValueChange={(val) => {
                  if (/^\d*$/.test(val)) {
                    setOtp(val);
                  }
                }}
                radius="sm"
                variant="flat"
                maxLength={6}
                isRequired
              />
              <div className="flex flex-col gap-2">
                <Button
                  size="lg"
                  radius="md"
                  color="primary"
                  variant="solid"
                  isLoading={isVerifyPending}
                  isDisabled={otp.length !== 6 || isVerifyPending}
                  onPress={handleVerifyOtp}
                  fullWidth
                >
                  Verify & Sign In
                </Button>
                <Button
                  variant="light"
                  onPress={() => setShowOtp(false)}
                  className="text-foreground/60"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          )}

          <div className="mt-8 text-center text-xs text-foreground/40 leading-relaxed">
            By signing in, you agree to our <br />
            <span className="hover:text-primary transition-colors cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="hover:text-primary transition-colors cursor-pointer">
              Privacy Policy
            </span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SignIn;
