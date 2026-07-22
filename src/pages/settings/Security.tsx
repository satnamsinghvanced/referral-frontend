import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
} from "@heroui/react";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import {
  useUpdatePassword,
  useVerifyUpdatePassword,
  useEnable2FA,
  useVerifyEnable2FA,
  useDisable2FA,
} from "../../hooks/settings/useSecurity";
import { useFetchUser } from "../../hooks/settings/useUser";
import { User } from "../../services/settings/user";
import { PASSWORD_REGEX } from "../../consts/consts";
import { RootState } from "../../store";
import { useFetchTwilioConfig } from "../../hooks/integrations/useTwilio";
import { Link } from "react-router-dom";
import { OtpVerificationModal } from "../../components/OtpVerificationModal";

const SecuritySchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required("Current password is required")
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be at most 16 characters")
    .matches(
      PASSWORD_REGEX,
      "Password must include one uppercase letter, one lowercase letter, one number and one special character",
    ),
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be at most 16 characters")
    .matches(
      PASSWORD_REGEX,
      "Password must include one uppercase letter, one lowercase letter, one number and one special character",
    ),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your new password"),
});

const Security: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const {
    data: userData,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useFetchUser(user?.userId || "") as any;

  const { mutate: updatePassword, isPending: isUpdatingPassword } =
    useUpdatePassword();
  const { mutate: verifyPasswordUpdate, isPending: isVerifyingPassword } =
    useVerifyUpdatePassword();
  const { mutate: enable2FA, isPending: isEnabling2FA } = useEnable2FA();
  const { mutate: verifyEnable2FA, isPending: isVerifying2FA } =
    useVerifyEnable2FA();
  const { mutate: disable2FA, isPending: isDisabling2FA } = useDisable2FA();

  const { data: twilioConfig, isLoading: isTwilioLoading } =
    useFetchTwilioConfig();
  console.log("userData >>>", userData);
  const [otpMode, setOtpMode] = useState<
    "password_update" | "enable_2fa" | null
  >(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [otpError, setOtpError] = useState<string | undefined>(undefined);
  const [maskedPhone, setMaskedPhone] = useState<string | undefined>(undefined);
  const [passwordFormValues, setPasswordFormValues] = useState<any>(null);

  const [showPassword, setShowPassword] = useState<any>({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const togglePasswordVisibility = (field: string) => {
    setShowPassword((prev: any) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handle2FAAction = () => {
    if (userData?.isTwoFactorEnabled) {
      disable2FA(undefined, {
        onSuccess: () => refetchUser(),
      });
    } else {
      enable2FA(undefined, {
        onSuccess: (data: any) => {
          setOtpMode("enable_2fa");
          setOtpError(undefined);
          setMaskedPhone(data?.phone || userData?.phone);
          onOpen();
        },
      });
    }
  };

  const handleVerifyOtp = (otpCode: string) => {
    setOtpError(undefined);
    if (otpMode === "password_update") {
      verifyPasswordUpdate(otpCode, {
        onSuccess: () => {
          onClose();
          setOtpMode(null);
        },
        onError: (error: any) => {
          const errorMessage =
            (error.response?.data as { message?: string })?.message ||
            error.message ||
            "Verification failed";
          setOtpError(errorMessage);
        },
      });
    } else if (otpMode === "enable_2fa") {
      verifyEnable2FA(otpCode, {
        onSuccess: () => {
          onClose();
          setOtpMode(null);
          refetchUser();
        },
        onError: (error: any) => {
          const errorMessage =
            (error.response?.data as { message?: string })?.message ||
            error.message ||
            "Verification failed";
          setOtpError(errorMessage);
        },
      });
    }
  };

  const handleResendOtp = async () => {
    setOtpError(undefined);
    if (otpMode === "password_update") {
      if (passwordFormValues) {
        updatePassword({
          currentPassword: passwordFormValues.currentPassword,
          newPassword: passwordFormValues.newPassword,
          confirmNewPassword: passwordFormValues.confirmNewPassword,
        }, {
          onSuccess: (data: any) => {
            setMaskedPhone(data?.phone || userData?.phone);
          }
        });
      }
    } else if (otpMode === "enable_2fa") {
      enable2FA(undefined, {
        onSuccess: (data: any) => {
          setMaskedPhone(data?.phone || userData?.phone);
        }
      });
    }
  };

  if (isUserLoading) {
    return (
      <Card className="rounded-xl shadow-none border border-foreground/10 bg-background h-[400px] flex items-center justify-center">
        <Spinner />
      </Card>
    );
  }

  return (
    <>
      <Card className="rounded-xl shadow-none border border-foreground/10 bg-background">
        <CardHeader className="flex items-center gap-2 px-4 pt-4 pb-1">
          <FiShield className="size-5" />
          <h4 className="text-base">Security & Privacy</h4>
        </CardHeader>

        <CardBody className="p-4">
          <Formik
            initialValues={{
              currentPassword: "",
              newPassword: "",
              confirmNewPassword: "",
            }}
            validationSchema={SecuritySchema}
            onSubmit={(values, { resetForm }) => {
              setPasswordFormValues(values);
              updatePassword(
                {
                  currentPassword: values.currentPassword,
                  newPassword: values.newPassword,
                  confirmNewPassword: values.confirmNewPassword,
                },
                {
                  onSuccess: (data: any) => {
                    if (data?.twoFactorRequired) {
                      setOtpMode("password_update");
                      setOtpError(undefined);
                      setMaskedPhone(data?.phone || userData?.phone);
                      onOpen();
                    }
                    resetForm();
                  },
                },
              );
            }}
          >
            {({
              setFieldValue,
              handleBlur,
              touched,
              errors,
              values,
              isValid,
              dirty,
            }) => (
              <Form className="space-y-3.5">
                {["currentPassword", "newPassword", "confirmNewPassword"].map(
                  (field) => {
                    const labelMap: Record<string, string> = {
                      currentPassword: "Current Password",
                      newPassword: "New Password",
                      confirmNewPassword: "Confirm New Password",
                    };
                    const placeholderMap: Record<string, string> = {
                      currentPassword: "Enter current password",
                      newPassword: "Enter new password",
                      confirmNewPassword: "Confirm new password",
                    };

                    const fieldName = field as keyof typeof values;
                    const isInvalid = !!(
                      touched[fieldName] && errors[fieldName]
                    );
                    const errorMessage = touched[fieldName]
                      ? (errors[fieldName] as string)
                      : "";

                    return (
                      <div key={field} className="space-y-1.5">
                        <Input
                          id={field}
                          name={field}
                          type={showPassword[field] ? "text" : "password"}
                          value={values[fieldName]}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFieldValue(field, e.target.value)
                          }
                          onBlur={handleBlur}
                          isInvalid={isInvalid}
                          errorMessage={errorMessage}
                          variant="flat"
                          size="sm"
                          radius="sm"
                          label={labelMap[field]}
                          labelPlacement="outside-top"
                          placeholder={placeholderMap[field] as string}
                          endContent={
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(field)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                            >
                              {showPassword[field] ? <FiEyeOff /> : <FiEye />}
                            </button>
                          }
                          isRequired
                        />
                      </div>
                    );
                  },
                )}

                <Button
                  size="sm"
                  color="primary"
                  className="mt-1"
                  type="submit"
                  isLoading={isUpdatingPassword}
                  isDisabled={!isValid || !dirty || isUpdatingPassword}
                >
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                </Button>
              </Form>
            )}
          </Formik>

          <Divider className="border-foreground/10 my-5" />

          <div className="space-y-4">
            <h4 className="leading-none flex items-center gap-2 text-sm">
              Two-Factor Authentication
            </h4>

            <div className="flex items-center justify-between p-3 border border-foreground/10 rounded-lg">
              <div className="space-y-1">
                <p className="font-medium text-sm">SMS Authentication</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {userData?.phone
                    ? `Receive codes via SMS to ${userData.phone}`
                    : "Please add a phone number to enable SMS authentication"}
                </p>
              </div>
              <span
                className={`inline-flex items-center justify-center rounded-md px-2 py-1 text-[11px] font-medium w-fit whitespace-nowrap shrink-0 ${userData?.isTwoFactorEnabled
                  ? "bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300"
                  : "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300"
                  }`}
              >
                {userData?.isTwoFactorEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>

            {twilioConfig && (!twilioConfig.phoneNumbers || twilioConfig.phoneNumbers.length === 0) && !userData?.isTwoFactorEnabled ? (
              <div className="p-3 border border-warning-200 bg-warning-50 dark:bg-warning-950/20 text-warning-800 dark:text-warning-300 rounded-lg text-xs font-medium flex items-center gap-2">
                <span>⚠️ Two-Factor Authentication requires a Twilio phone number. Please purchase a Twilio phone number under Integrations to enable 2FA.</span>
              </div>
            ) : (
              <Button
                size="sm"
                variant="bordered"
                className="font-medium border-small"
                onPress={handle2FAAction}
                isLoading={isEnabling2FA || isDisabling2FA}
                isDisabled={!userData?.phone && !userData?.isTwoFactorEnabled}
                radius="sm"
              >
                {userData?.isTwoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      <OtpVerificationModal
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isVerifyingPassword || isVerifying2FA}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        phoneNumber={maskedPhone}
        error={otpError}
        onClearError={() => setOtpError(undefined)}
        title={otpMode === "password_update" ? "Verify Password Change" : "Verify Enable 2FA"}
      />
    </>
  );
};

export default Security;
