import {
  addToast,
  Button,
  Card,
  CardBody,
  Input,
  Spinner,
} from "@heroui/react";
import React, { useState } from "react";
import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaMailBulk,
  FaPaperPlane,
} from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PASSWORD_REGEX } from "../../consts/consts";
import { useForgotPassword, useResetPassword } from "../../hooks/useAuth";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialEmail = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  // If email is present in URL, jump directly to set password screen!
  const [step, setStep] = useState<
    "email" | "email_sent" | "password" | "success" | "contact_admin"
  >(initialEmail ? "password" : "email");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [adminContactEmail, setAdminContactEmail] = useState("");

  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address");
      return;
    }
    setErrorMessage("");
    forgotPasswordMutation.mutate(email, {
      onSuccess: () => {
        addToast({
          title: "Reset Link Sent",
          description: "Check your email for the password reset link.",
          color: "success",
        });
        setStep("email_sent");
      },
      onError: (err: any) => {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Failed to send reset link. Please check your email.";

        // Extract email address if backend asks to contact practice administrator
        const emailMatch = msg.match(
          /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
        );
        if (
          emailMatch ||
          msg.toLowerCase().includes("administrator") ||
          msg.toLowerCase().includes("contact") ||
          msg.toLowerCase().includes("configured")
        ) {
          setAdminContactEmail(emailMatch ? emailMatch[0] : "");
          setStep("contact_admin");
          setErrorMessage("");
        } else {
          setErrorMessage(msg);
        }
      },
    });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Email address is required");
      return;
    }
    if (!password) {
      setErrorMessage("Password is required");
      return;
    }
    if (!PASSWORD_REGEX.test(password)) {
      setErrorMessage(
        "Password must be at least 8 characters, include one uppercase, one lowercase, one number, and one special character"
      );
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    setErrorMessage("");
    resetPasswordMutation.mutate(
      { email, password, token },
      {
        onSuccess: () => {
          addToast({
            title: "Password Updated",
            description: "Your password has been successfully updated.",
            color: "success",
          });
          setStep("success");
        },
        onError: (err: any) => {
          const msg =
            err.response?.data?.message ||
            err.message ||
            "Failed to reset password. Please try again.";
          setErrorMessage(msg);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border border-foreground/10 bg-content1 backdrop-blur-xl">
        <CardBody className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="mx-auto size-12 rounded-full flex items-center justify-center mb-3 transition-transform duration-300">
              {step === "success" ? (
                <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <FaCheckCircle className="size-6" />
                </div>
              ) : step === "email_sent" ? (
                <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <FaPaperPlane className="size-5" />
                </div>
              ) : step === "contact_admin" ? (
                <div className="size-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <FaExclamationTriangle className="size-5" />
                </div>
              ) : (
                <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <FaLock className="size-5" />
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold mb-1 text-foreground">
              {step === "email" && "Forgot Password"}
              {step === "email_sent" && "Check Your Email"}
              {step === "password" && "Set New Password"}
              {step === "success" && "Password Updated!"}
              {step === "contact_admin" && "Email Delivery Unavailable"}
            </h1>
            <p className="text-xs text-foreground/60 leading-relaxed">
              {step === "email" &&
                "Enter your email to receive a password reset link"}
              {step === "email_sent" &&
                `We've sent a password reset link to ${email}`}
              {step === "password" &&
                "Set a new password for your account below"}
              {step === "success" &&
                "Your password has been updated in our database. You can now sign in."}
              {step === "contact_admin" &&
                "Automated password reset email delivery is not configured for your practice account."}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium text-center">
              {errorMessage}
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === "email" && (
            <form onSubmit={handleSendResetLink} className="space-y-4">
              <Input
                label="Email Address"
                placeholder="Enter your email"
                type="email"
                radius="sm"
                variant="flat"
                value={email}
                onValueChange={setEmail}
                startContent={<FaMailBulk className="text-gray-400 text-sm" />}
                isRequired
              />
              <Button
                size="lg"
                radius="md"
                type="submit"
                color="primary"
                variant="solid"
                isLoading={forgotPasswordMutation.isPending}
                spinner={<Spinner color="white" size="sm" />}
                className="font-semibold"
                fullWidth
              >
                Send Password Reset Link
              </Button>
            </form>
          )}

          {/* STEP: Email Sent Confirmation */}
          {step === "email_sent" && (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-xs text-foreground/80 space-y-2">
                <p>
                  Please check your email inbox for <strong>{email}</strong> and click the reset link to create your new password.
                </p>
                <p className="text-[11px] text-foreground/50">
                  Didn't receive the email? Check your spam folder or click below to resend.
                </p>
              </div>
              <Button
                size="md"
                radius="md"
                variant="bordered"
                isLoading={forgotPasswordMutation.isPending}
                onClick={handleSendResetLink}
                className="font-medium"
                fullWidth
              >
                Resend Link
              </Button>
            </div>
          )}

          {/* STEP: Professional Contact Admin Screen */}
          {step === "contact_admin" && (
            <div className="space-y-5 text-center">
              <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/10 text-xs space-y-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Practice Administrator
                </p>
                {adminContactEmail ? (
                  <p className="text-base font-bold text-foreground">
                    {adminContactEmail}
                  </p>
                ) : null}
                <p className="text-foreground/70 text-xs leading-relaxed pt-1 border-t border-foreground/10">
                  Please contact your practice administrator at{" "}
                  <strong className="text-blue-600 dark:text-sky-400 font-semibold">{adminContactEmail || "your administrator"}</strong>{" "}
                  directly to reset your password or update your account settings.
                </p>
              </div>

              <Button
                size="lg"
                radius="md"
                color="primary"
                variant="solid"
                onClick={() => navigate("/signin")}
                className="font-semibold"
                fullWidth
              >
                Back to Sign In
              </Button>
            </div>
          )}

          {/* STEP 2: Set New Password (default when coming from email link) */}
          {step === "password" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Display Email by Default on UI */}
              <div className="p-3 rounded-xl bg-foreground/5 border border-foreground/10">
                <p className="text-[11px] font-medium text-foreground/50 uppercase tracking-wider">Account Email</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">{email || "Your Account Email"}</p>
              </div>

              <Input
                label="New Password"
                placeholder="Enter new password"
                type={showPassword ? "text" : "password"}
                radius="sm"
                variant="flat"
                value={password}
                onValueChange={setPassword}
                isRequired
                endContent={
                  <button
                    className="focus:outline-none cursor-pointer"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-sm text-default-400" />
                    ) : (
                      <FaEye className="text-sm text-default-400" />
                    )}
                  </button>
                }
              />
              <Input
                label="Confirm New Password"
                placeholder="Confirm new password"
                type={showConfirmPassword ? "text" : "password"}
                radius="sm"
                variant="flat"
                value={confirmPassword}
                onValueChange={setConfirmPassword}
                isRequired
                endContent={
                  <button
                    className="focus:outline-none cursor-pointer"
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-sm text-default-400" />
                    ) : (
                      <FaEye className="text-sm text-default-400" />
                    )}
                  </button>
                }
              />
              <div className="text-[11px] text-foreground/50 space-y-0.5 leading-relaxed bg-foreground/5 p-2.5 rounded-lg">
                <p className="font-semibold text-foreground/70">Password must contain:</p>
                <p>• At least 8 characters</p>
                <p>• Uppercase & lowercase letters</p>
                <p>• At least 1 number & 1 special character (!@#$%^&*)</p>
              </div>
              <Button
                size="lg"
                radius="md"
                type="submit"
                color="primary"
                variant="solid"
                isLoading={resetPasswordMutation.isPending}
                spinner={<Spinner color="white" size="sm" />}
                className="font-semibold mt-2"
                fullWidth
              >
                Set New Password
              </Button>
            </form>
          )}

          {/* STEP: Success */}
          {step === "success" && (
            <div className="space-y-4 pt-2">
              <Button
                size="lg"
                radius="md"
                color="primary"
                variant="solid"
                onClick={() => navigate("/signin")}
                className="font-semibold"
                fullWidth
              >
                Sign In Now
              </Button>
            </div>
          )}

          {step !== "contact_admin" && (
            <div className="mt-6 text-center text-xs">
              <Link to="/signin" className="text-primary hover:underline font-medium">
                Back to Sign In
              </Link>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
