import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Switch,
} from "@heroui/react";
import React, { useState } from "react";
import { FiSettings } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { toggleTheme } from "../../store/uiSlice";

interface GeneralSettingsProps {
  darkMode: boolean;
  autoRefresh: boolean;
  showTips: boolean;
}

const General: React.FC = () => {
  const theme = useTypedSelector((state) => state.ui.theme);
  const dispatch = useDispatch();

  const [settings, setSettings] = useState<GeneralSettingsProps>({
    darkMode: false,
    autoRefresh: true,
    showTips: true,
  });

  const handleToggle = (setting: keyof GeneralSettingsProps) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [setting]: !prevSettings[setting],
    }));
  };

  return (
    <Card className="rounded-xl shadow-none border border-foreground/10 bg-background">
      <CardHeader className="flex items-center gap-2 px-4 pt-4 pb-1">
        <FiSettings className="size-5" />
        <h4 className="text-base">General Settings</h4>
      </CardHeader>

      <CardBody className="p-4 space-y-5">
        {/* Dark Mode Setting */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-sm">Dark Mode</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Switch to dark theme
            </p>
          </div>
          <Switch
            size="sm"
            aria-label="Theme"
            isSelected={theme === "dark"}
            onChange={() => dispatch(toggleTheme())}
          />
        </div>

        {/* Auto-refresh Setting */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-sm">Auto-refresh Data</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Automatically refresh dashboard data
            </p>
          </div>
          <Switch size="sm" aria-label="Auto-refresh Data" />
        </div>

        {/* Show Tips Setting */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-sm">Show Tips</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Display helpful tips and tutorials
            </p>
          </div>
          <Switch size="sm" aria-label="Show Tips" />
        </div>

        <Divider />

        {/* Data Export Section */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm">Data Export</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Export your referral data and analytics
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="bordered"
              className="border-small font-medium"
            >
              Export Referrals
            </Button>
            <Button
              size="sm"
              variant="bordered"
              className="border-small font-medium"
            >
              Export Reviews
            </Button>
            <Button
              size="sm"
              variant="bordered"
              className="border-small font-medium"
            >
              Export Analytics
            </Button>
          </div>
        </div>

        <Divider />

        {/* Account Management Section */}
        <div className="space-y-4">
          <h4 className="text-sm">Account Management</h4>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="bordered"
              className="border-small font-medium"
            >
              Download Account Data
            </Button>
            <Button
              size="sm"
              variant="solid"
              color="danger"
              className="font-medium"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default General;
