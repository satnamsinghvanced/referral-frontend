import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Divider,
  Link,
  Spinner,
} from "@heroui/react";
import { useState } from "react";
import { FaEyeSlash, FaLock } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { TbEyeFilled } from "react-icons/tb";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "../services/authService";
import { loginSuccess } from "../store/authSlice";
import { AppDispatch } from "../store/index";
import Input from "../components/ui/Input";

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const SignIn = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // TanStack Query mutation
  const loginMutation = useLoginMutation();

  // Formik configuration
  const formik = useFormik<FormData>({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      rememberMe: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      try {
        // const response = await loginMutation.mutateAsync({
        //     email: values.email,
        //     password: values.password,
        // });

        // Dispatch to Redux
        // dispatch(loginSuccess({
        //     user: response.data,
        //     token: response.token, // Make sure this matches your API response key
        // }));

        // console.log('Login successful:', response);

        // static login
        localStorage.setItem("token", "its bypass token");
        navigate("/dashboard");
      } catch (error: any) {
        console.error("Login error:", error);
        // Error is automatically handled by TanStack Query
      }
    },
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  const onNavigateToSignUp = () => {
    navigate("/signup");
  };

  const onNavigateToForgotPassword = () => {
    navigate("/forgot-password");
  };

  // Check if form is submitting
  const isLoading = loginMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardBody className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">
              Welcome Back
            </h1>
            <p className="">
              Sign in to your account to continue
            </p>
          </div>

          {/* Error Message from TanStack Query */}
          {loginMutation.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {loginMutation.error?.message ||
                "Failed to sign in. Please try again."}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <Input
                label="Email Address"
                name="email"
                placeholder="Enter your email"
                type="email"
                value={formik.values.email}
                formik={formik}
              />
            </div>

            {/* Password Input */}
            <div>
              <Input
                label="Password"
                placeholder="Enter your password"
                type="password"
                name="password"
                value={formik.values.password}
                formik={formik}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center">
              <Checkbox
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
              isDisabled={!formik.isValid || !formik.dirty}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            <Divider className="my-6" />

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="">
                Don't have an account?{" "}
              </span>
              <Link
                className="font-semibold cursor-pointer text-primary-600 hover:text-primary-700"
                onPress={onNavigateToSignUp}
              >
                Create an account
              </Link>
            </div>
          </form>

          <div className="mt-6 text-center text-xs">
            By signing in, you agree to our
            <Link href="/terms" className="text-xs mx-1">
              Terms of Service
            </Link>
            and
            <Link href="/privacy" className="text-xs mx-1">
              Privacy Policy
            </Link>
            .
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SignIn;
