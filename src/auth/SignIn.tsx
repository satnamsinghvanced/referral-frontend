import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Divider,
  Spinner,
} from "@heroui/react";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import Input from "../components/ui/Input";
import { useLoginMutation } from "../hooks/auth/login";
import { setCredentials } from "../store/authSlice";
import { AppDispatch } from "../store/index";

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const SignIn = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { mutate: loginUser, isPending } = useLoginMutation();

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
        loginUser(
          {
            email: values.email,
            password: values.password,
            rememberMe: values.rememberMe,
          },
          {
            onSuccess: (response) => {
              console.log(response);
              dispatch(
                setCredentials({
                  token: response?.accessToken,
                })
              );
              navigate("/dashboard");
            },
          }
        );
      } catch (error: any) {
        console.error("Login error:", error);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-none">
        <CardBody className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="">Sign in to your account to continue</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <Input
                label="Email Address"
                name="email"
                placeholder="Enter your email"
                type="email"
                value={formik.values.email}
                onChange={(value) => formik.setFieldValue("email", value)}
                onBlur={formik.handleBlur}
                errorMessage={formik.touched.email && formik.errors.email}
                isInvalid={!!(formik.touched.email && formik.errors.email)}
                isRequired
              />
            </div>

            <div>
              <Input
                label="Password"
                placeholder="Enter your password"
                type="password"
                name="password"
                value={formik.values.password}
                onChange={(value) => formik.setFieldValue("password", value)}
                onBlur={formik.handleBlur}
                errorMessage={formik.touched.password && formik.errors.password}
                isInvalid={
                  !!(formik.touched.password && formik.errors.password)
                }
                isRequired
              />
            </div>

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
            </div>

            <Button
              type="submit"
              color="primary"
              className="w-full font-semibold h-12"
              isLoading={isPending}
              spinner={<Spinner size="sm" />}
              isDisabled={isPending || !formik.isValid}
            >
              {isPending ? "Signing In..." : "Sign In"}
            </Button>

            <Divider className="my-0" />
          </form>

          <div className="mt-6 text-center text-xs">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SignIn;
