import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Spinner,
} from "@heroui/react";
import { Form, Formik } from "formik";
import { useState } from "react";
import { FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { useUpdatePassword } from "../../hooks/settings/useSecurity";
import { useFetchUser } from "../../hooks/settings/useUser";
import { PASSWORD_REGEX } from "../../consts/consts";
import { RootState } from "../../store";

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
  const { isLoading: isUserLoading } = useFetchUser(user?.userId || "") as any;

  const { mutate: updatePassword, isPending: isUpdatingPassword } =
    useUpdatePassword();

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

  if (isUserLoading) {
    return (
      <Card className="rounded-xl shadow-none border border-foreground/10 bg-background h-[400px] flex items-center justify-center">
        <Spinner />
      </Card>
    );
  }

  return (
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
      </CardBody>
    </Card>
  );
};

export default Security;
