import { Button, Card, CardBody, Input, Spinner, Chip } from "@heroui/react";
import { useFormik } from "formik";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiLock, FiMail } from "react-icons/fi";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import * as Yup from "yup";
import { PASSWORD_REGEX } from "../../../consts/consts";
import { useFetchTeamMemberById, useSetTeamMemberPassword } from "../../../hooks/settings/useTeam";
import NotFoundPage from "../../NotFoundPage";
import Logo from "../../../components/ui/Logo";

const AcceptInvitation = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { data: member, isLoading: isMemberLoading } = useFetchTeamMemberById(id || "");
  const email = searchParams.get("email") || member?.email;
  const memberAny = member as any;
  const inviterObj = typeof memberAny?.createdBy === "object" ? memberAny?.createdBy : null;
  const adminEmail = searchParams.get("adminEmail") || inviterObj?.email || memberAny?.inviterEmail || memberAny?.adminEmail || "";
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const navigate = useNavigate();

  const { mutate: setPassword, isPending } = useSetTeamMemberPassword();

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: email || "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .matches(
          PASSWORD_REGEX,
          "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, one number and one special character"
        ),
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

  if (isMemberLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Loading invitation details...</p>
      </div>
    );
  }

  if (!id || !email) {
    return <NotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-foreground flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 relative overflow-hidden">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full mx-auto relative z-10">
        <Card className="border border-gray-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 shadow-2xl backdrop-blur-xl rounded-2xl overflow-hidden">
          <CardBody className="p-6 sm:p-8">
            {/* Header / Logo */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-10 w-auto mb-4 flex items-center justify-center">
                <Logo style={{ height: "36px" }} />
              </div>

              <Chip
                size="sm"
                variant="flat"
                color="primary"
                className="mb-3 text-xs font-semibold px-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40"
              >
                Team Invitation
              </Chip>

              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                Activate Your Account
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 max-w-sm leading-relaxed">
                Create a secure password to complete your registration and access the Practice ROI dashboard.
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-5 pt-2">
              {/* Email Address */}
              <div className="space-y-1.5">
                <Input
                  label="Email Address"
                  labelPlacement="outside"
                  type="email"
                  name="email"
                  size="md"
                  radius="md"
                  variant="bordered"
                  value={formik.values.email}
                  isDisabled
                  startContent={<FiMail className="text-gray-400 dark:text-zinc-500 text-base" />}
                  endContent={<FiLock className="text-gray-400 dark:text-zinc-500 text-sm" />}
                  classNames={{
                    label: "font-medium text-xs text-gray-700 dark:text-zinc-300 mb-1.5 block",
                    inputWrapper: "bg-gray-50/80 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 opacity-90",
                    input: "text-gray-600 dark:text-zinc-300 font-medium text-sm",
                  }}
                />
              </div>

              {/* New Password */}
              <div className="space-y-1.5 pt-2">
                <Input
                  label="New Password"
                  labelPlacement="outside"
                  placeholder="Enter your new password"
                  type={isVisible ? "text" : "password"}
                  name="password"
                  size="md"
                  radius="md"
                  variant="bordered"
                  value={formik.values.password}
                  onValueChange={(val) => formik.setFieldValue("password", val)}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.touched.password && formik.errors.password)}
                  errorMessage={formik.touched.password && formik.errors.password}
                  isRequired
                  endContent={
                    <button
                      className="focus:outline-none cursor-pointer p-1 rounded-md text-gray-400 hover:text-gray-600 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? <FaEyeSlash className="text-base" /> : <FaEye className="text-base" />}
                    </button>
                  }
                  classNames={{
                    label: "font-medium text-xs text-gray-700 dark:text-zinc-300 mb-1.5 block",
                    inputWrapper: "bg-white dark:bg-zinc-800/80 border-gray-300 dark:border-zinc-700 focus-within:border-blue-500 dark:focus-within:border-blue-500",
                    input: "text-gray-900 dark:text-white text-sm",
                  }}
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5 pt-2">
                <Input
                  label="Confirm Password"
                  labelPlacement="outside"
                  placeholder="Confirm your new password"
                  type={isConfirmVisible ? "text" : "password"}
                  name="confirmPassword"
                  size="md"
                  radius="md"
                  variant="bordered"
                  value={formik.values.confirmPassword}
                  onValueChange={(val) => formik.setFieldValue("confirmPassword", val)}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                  errorMessage={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  isRequired
                  endContent={
                    <button
                      className="focus:outline-none cursor-pointer p-1 rounded-md text-gray-400 hover:text-gray-600 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                      type="button"
                      onClick={toggleConfirmVisibility}
                    >
                      {isConfirmVisible ? <FaEyeSlash className="text-base" /> : <FaEye className="text-base" />}
                    </button>
                  }
                  classNames={{
                    label: "font-medium text-xs text-gray-700 dark:text-zinc-300 mb-1.5 block",
                    inputWrapper: "bg-white dark:bg-zinc-800/80 border-gray-300 dark:border-zinc-700 focus-within:border-blue-500 dark:focus-within:border-blue-500",
                    input: "text-gray-900 dark:text-white text-sm",
                  }}
                />
              </div>

              {/* Password Requirement Hint */}
              <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-zinc-800/40 border border-gray-200/60 dark:border-zinc-800 text-[11px] text-gray-500 dark:text-zinc-400 space-y-1 mt-3">
                <p className="font-semibold text-gray-700 dark:text-zinc-300">Password requirements:</p>
                <p>• At least 8 characters</p>
                <p>• Must include uppercase, lowercase, number & special character</p>
              </div>

              <Button
                type="submit"
                variant="solid"
                color="primary"
                size="lg"
                radius="md"
                isLoading={isPending}
                spinner={<Spinner size="sm" color="white" />}
                isDisabled={isPending || !formik.isValid}
                className="w-full mt-4 font-semibold text-sm shadow-md bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white transition-all"
              >
                {isPending ? "Activating Account..." : "Activate Account"}
              </Button>
            </form>

            {/* Need Help Support Footer */}
            {adminEmail ? (
              <div className="mt-6 text-center pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-1">
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Need help with your invitation?
                </p>
                <p className="text-xs text-gray-600 dark:text-zinc-400">
                  Contact administrator:{" "}
                  <a
                    href={`mailto:${adminEmail}`}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                  >
                    {adminEmail}
                  </a>
                </p>
              </div>
            ) : null}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AcceptInvitation;
