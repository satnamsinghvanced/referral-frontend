import { Button, Card, CardBody, Input, Spinner } from "@heroui/react";
import { useFormik } from "formik";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { FiLoader } from "react-icons/fi";
import {
  useFetchTeamMemberById,
  useSetTeamMemberPassword,
} from "../../hooks/settings/useTeam";
import NotFoundPage from "../NotFoundPage";

const AcceptInvitation = () => {
  const { id } = useParams<{ id: string }>();
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const navigate = useNavigate();

  const {
    data: member,
    isLoading: isMemberLoading,
    isError,
  } = useFetchTeamMemberById(id || "");

  const { mutate: setPassword, isPending } = useSetTeamMemberPassword();

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: member?.email || "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: (values) => {
      setPassword(
        { email: values.email, password: values.password },
        {
          onSuccess: () => {
            setTimeout(() => {
              navigate("/signin");
            }, 1000);
          },
        }
      );
    },
  });

  if (!id || (isError && !isMemberLoading)) {
    return <NotFoundPage />;
  }

  if (isMemberLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <FiLoader className="animate-spin size-8 text-primary" />
      </div>
    );
  }

  if (!member && !isMemberLoading) {
    return <NotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        <Card shadow="none" className="border-0">
          <CardBody className="p-6">
            <div className="text-center mb-5">
              <h1 className="text-xl font-semibold mb-2">
                Activate Your Account
              </h1>
              <p className="text-gray-600 text-sm">
                Create a password to complete your registration and access the
                dashboard.
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <div className="flex">
                <Input
                  label="Email Address"
                  labelPlacement="outside"
                  type="email"
                  name="email"
                  size="sm"
                  radius="sm"
                  variant="flat"
                  value={formik.values.email}
                  isDisabled
                  classNames={{
                    label: "font-medium",
                  }}
                />
              </div>

              <div className="flex">
                <Input
                  label="New Password"
                  labelPlacement="outside"
                  placeholder="Enter your new password"
                  type={isVisible ? "text" : "password"}
                  name="password"
                  size="sm"
                  radius="sm"
                  variant="flat"
                  value={formik.values.password}
                  onValueChange={(val) => formik.setFieldValue("password", val)}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(formik.touched.password && formik.errors.password)
                  }
                  errorMessage={
                    formik.touched.password && formik.errors.password
                  }
                  isRequired
                  endContent={
                    <button
                      className="focus:outline-none cursor-pointer"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <FaEyeSlash className="text-xl text-default-400" />
                      ) : (
                        <FaEye className="text-xl text-default-400" />
                      )}
                    </button>
                  }
                  classNames={{
                    label: "font-medium",
                  }}
                />
              </div>

              <div className="flex">
                <Input
                  label="Confirm Password"
                  labelPlacement="outside"
                  placeholder="Confirm your new password"
                  type={isConfirmVisible ? "text" : "password"}
                  name="confirmPassword"
                  size="sm"
                  radius="sm"
                  variant="flat"
                  value={formik.values.confirmPassword}
                  onValueChange={(val) =>
                    formik.setFieldValue("confirmPassword", val)
                  }
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                    )
                  }
                  errorMessage={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  isRequired
                  endContent={
                    <button
                      className="focus:outline-none cursor-pointer"
                      type="button"
                      onClick={toggleConfirmVisibility}
                    >
                      {isConfirmVisible ? (
                        <FaEyeSlash className="text-xl text-default-400" />
                      ) : (
                        <FaEye className="text-xl text-default-400" />
                      )}
                    </button>
                  }
                  classNames={{
                    label: "font-medium",
                  }}
                />
              </div>

              <Button
                type="submit"
                variant="solid"
                color="primary"
                size="sm"
                isLoading={isPending}
                spinner={<Spinner size="sm" />}
                isDisabled={isPending || !formik.isValid}
                fullWidth
              >
                {isPending ? "Creating Account..." : "Activate Account"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-tiny text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-primary font-medium hover:underline underline-offset-2 cursor-pointer"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AcceptInvitation;
