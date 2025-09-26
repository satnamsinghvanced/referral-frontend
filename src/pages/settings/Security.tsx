import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
} from "@heroui/react";
import React from "react";
import { FiShield } from "react-icons/fi";

const Security: React.FC = () => {
  const [passwords, setPasswords] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [twoFAEnabled, setTwoFAEnabled] = React.useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswords((prev) => ({ ...prev, [id]: value }));
  };

  const handlePasswordUpdate = () => {
    console.log("Updating password...", passwords);
  };

  const handle2FAUpdate = () => {
    setTwoFAEnabled((prev) => !prev);
    console.log("Toggled 2FA:", !twoFAEnabled);
  };

  return (
    <Card className="rounded-xl bg-white text-gray-900 shadow-none border border-text/10">
      <CardHeader className="flex items-center gap-3 px-5 pt-5 pb-0">
        <FiShield className="h-5 w-5 text-gray-700" />
        <h4 className="text-base">Security & Privacy</h4>
      </CardHeader>

      <CardBody className="p-5 space-y-8">
        {/* Change Password */}
        <div className="space-y-3">
          {["currentPassword", "newPassword", "confirmPassword"].map(
            (field) => {
              const labelMap: Record<string, string> = {
                currentPassword: "Current Password",
                newPassword: "New Password",
                confirmPassword: "Confirm New Password",
              };
              const placeholderMap: Record<string, string> = {
                currentPassword: "Enter current password",
                newPassword: "Enter new password",
                confirmPassword: "Confirm new password",
              };
              return (
                <div key={field} className="space-y-1">
                  <label
                    htmlFor={field}
                    className="text-sm font-medium text-gray-700 select-none"
                  >
                    {labelMap[field]}
                  </label>
                  {/* @ts-ignore */}
                  <Input
                    id={field}
                    type="password"
                    placeholder={placeholderMap[field]}
                    variant="bordered"
                    value={passwords[field as keyof typeof passwords]}
                    onChange={handleChange}
                    className="mt-1"
                    classNames={{ inputWrapper: "border-small" }}
                  />
                </div>
              );
            }
          )}

          <Button
            size="sm"
            color="primary"
            className="mt-1"
            onPress={handlePasswordUpdate}
          >
            Update Password
          </Button>
        </div>

        <Divider className="border-text/10 mb-7" />

        {/* Two-Factor Authentication */}
        <div className="space-y-4">
          <h4 className="leading-none flex items-center gap-2 text-sm">
            Two-Factor Authentication
          </h4>

          <div className="flex items-center justify-between p-4 border border-text/10 rounded-lg">
            <div className="space-y-1">
              <p className="font-medium text-sm">SMS Authentication</p>
              <p className="text-xs text-gray-500">
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
