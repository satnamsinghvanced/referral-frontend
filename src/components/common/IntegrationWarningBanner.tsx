import React from "react";
import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";

export interface IntegrationWarningBannerProps {
  /** Display name of the platform, e.g. "Google Review", "Google Ads", "Google Calendar", "Meta Ads", "Twilio" */
  platformName: string;
  /** Integration key to highlight on the integrations page, e.g. "google_business", "google_ads", "google_calendar", "meta_ads", "twilio" */
  integrationKey: string;
  /** Custom warning message to display */
  message?: string;
  /** Custom button text */
  buttonText?: string;
  /** Custom container class names */
  className?: string;
}

export const IntegrationWarningBanner: React.FC<IntegrationWarningBannerProps> = ({
  platformName,
  integrationKey,
  message,
  buttonText,
  className = "",
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/integrations?highlight=${integrationKey}#integration-${integrationKey}`);
  };

  const displayMessage =
    message ||
    `${platformName} is not connected. Connect your ${platformName} account to enable features.`;

  const displayButtonText = buttonText || `Connect ${platformName}`;

  return (
    <div
      className={`bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-500/30 rounded-lg p-3 flex items-center justify-between flex-wrap gap-3 ${className}`}
    >
      <p className="text-sm text-yellow-800 dark:text-amber-400">
        {displayMessage}
      </p>
      <Button
        size="sm"
        color="warning"
        variant="flat"
        onPress={handleNavigate}
        className="bg-yellow-200 dark:bg-amber-500/20 text-yellow-800 dark:text-amber-400 font-medium"
      >
        {displayButtonText}
      </Button>
    </div>
  );
};

export default IntegrationWarningBanner;
