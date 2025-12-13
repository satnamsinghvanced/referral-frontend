import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
} from "@heroui/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import * as Yup from "yup";
import { useUpdatePassword } from "../../hooks/settings/useSecurity";

const SecuritySchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required("Current password is required")
    .min(6, "Password must be at least 6 characters"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your new password"),
});

const Security: React.FC = () => {
  const { mutate: updatePassword, isPending } = useUpdatePassword();
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);

  const handle2FAUpdate = () => {
    setTwoFAEnabled((prev) => !prev);
  };

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

  return (
    <Card className="rounded-xl shadow-none border border-foreground/10">
      <CardHeader className="flex items-center gap-2 px-5 pt-5 pb-0">
        <FiShield className="size-5" />
        <h4 className="text-base">Security & Privacy</h4>
      </CardHeader>

      <CardBody className="p-5 space-y-8">
        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          }}
          validationSchema={SecuritySchema}
          onSubmit={(values, { resetForm }) => {
            updatePassword(
              {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
                confirmNewPassword: values.confirmNewPassword,
              },
              {
                onSuccess: () => {
                  resetForm();
                },
              }
            );
          }}
        >
          {({ setFieldValue, values, isValid, dirty }) => (
            <Form className="space-y-3">
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

                  return (
                    <div key={field} className="space-y-1">
                      <label
                        htmlFor={field}
                        className="text-sm font-medium select-none"
                      >
                        {labelMap[field]}
                      </label>
                      <Field
                        as={Input}
                        id={field}
                        name={field}
                        type={showPassword[field] ? "text" : "password"}
                        placeholder={placeholderMap[field]}
                        variant="bordered"
                        value={values[field as keyof typeof values]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFieldValue(field, e.target.value)
                        }
                        className="mt-1"
                        endContent={
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(field)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {showPassword[field] ? <FiEyeOff /> : <FiEye />}
                          </button>
                        }
                      />
                      <ErrorMessage
                        name={field}
                        component="p"
                        className="text-xs text-red-500 mt-1"
                      />
                    </div>
                  );
                }
              )}

              <Button
                size="sm"
                color="primary"
                className="mt-1"
                type="submit"
                isLoading={isPending}
                isDisabled={!isValid || !dirty || isPending}
              >
                {isPending ? "Updating..." : "Update Password"}
              </Button>
            </Form>
          )}
        </Formik>

        <Divider className="border-foreground/10 mb-7" />

        <div className="space-y-4">
          <h4 className="leading-none flex items-center gap-2 text-sm">
            Two-Factor Authentication
          </h4>

          <div className="flex items-center justify-between p-4 border border-foreground/10 rounded-lg">
            <div className="space-y-1">
              <p className="font-medium text-sm">SMS Authentication</p>
              <p className="text-xs text-gray-600">
                Receive codes via SMS to +1 (918) ***-0100
              </p>
            </div>
            <span
              className={`inline-flex items-center justify-center rounded-md px-2 py-1 text-[11px] font-medium w-fit whitespace-nowrap shrink-0 ${
                twoFAEnabled
                  ? "bg-sky-100 text-sky-800"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              {twoFAEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>

          <Button
            size="sm"
            variant="bordered"
            className="font-medium border-small"
            onPress={handle2FAUpdate}
            radius="sm"
          >
            {twoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default Security;
