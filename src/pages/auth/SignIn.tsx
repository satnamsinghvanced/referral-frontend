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
import { useLogin } from "../../hooks/useAuth";
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

  const { mutate: loginUser, isPending } = useLogin();

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
          "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, one number and one special character"
        ),
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
              dispatch(
                setCredentials({
                  token: response?.accessToken,
                })
              );
              navigate("/");
            },
          }
        );
      } catch (error: any) {
        console.error("Login error:", error);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl dark:shadow-primary/5 border border-foreground/5/50 bg-white/80 bg-content1 backdrop-blur-xl">
        <CardBody className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2 text-foreground">
              Welcome Back
            </h1>
            <p className="text-sm text-foreground/60">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div className="flex">
              <Input
                label="Email Address"
                labelPlacement="inside"
                name="email"
                placeholder="Enter your email"
                type="email"
                // size="sm"
                radius="sm"
                variant="flat"
                value={formik.values.email}
                onValueChange={(value) => formik.setFieldValue("email", value)}
                onBlur={formik.handleBlur}
                errorMessage={formik.touched.email && formik.errors.email}
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
                // size="sm"
                radius="sm"
                variant="flat"
                value={formik.values.password}
                onValueChange={(value) =>
                  formik.setFieldValue("password", value)
                }
                onBlur={formik.handleBlur}
                errorMessage={formik.touched.password && formik.errors.password}
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
              variant="shadow"
              isLoading={isPending}
              spinner={<Spinner color="white" size="sm" />}
              isDisabled={isPending || !formik.isValid}
              className="mt-2 font-semibold"
              fullWidth
            >
              {isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>

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
