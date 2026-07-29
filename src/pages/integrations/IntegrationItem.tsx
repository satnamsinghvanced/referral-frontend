import { Button, Chip, Switch, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { BiCheckCircle } from "react-icons/bi";
import { FiAlertCircle, FiExternalLink, FiSettings } from "react-icons/fi";
import { FaFacebook, FaInstagram } from "react-icons/fa6";

interface IntegrationItemProps {
  id: string;
  platformId?: string;
  name: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  status: "Connected" | "Disconnected" | "Error" | string;
  description: string;
  badges: string[];
  lastSync?: string | undefined;
  onConfigure?: (() => void) | undefined;
  onConnect?: (() => void) | undefined;
  onReconnect?: (() => void) | undefined;
  onSync?: (() => void) | undefined;
  isSyncing?: boolean | undefined;
  syncButtonText?: string | undefined;
  isFullyConnected?: boolean;
  isSwitchChecked?: boolean | undefined;
  isSwitchLoading?: boolean | undefined;
  onSwitchChange?: ((checked: boolean) => void) | undefined;
  account?: {
    accountName?: string | undefined | null;
    accountEmail?: string | undefined | null;
    accountAvatar?: string | undefined | null;
    instagramUsername?: string | undefined | null;
  };
  connectedLocation?: string | undefined;
  isHighlighted?: boolean;
}

const IntegrationItem: React.FC<IntegrationItemProps> = ({
  id,
  platformId,
  name,
  icon,
  iconBg,
  iconColor,
  status = "Disconnected",
  description,
  badges,
  lastSync,
  onConfigure,
  onConnect,
  onReconnect,
  onSync,
  isSyncing,
  syncButtonText,
  isFullyConnected,
  isSwitchChecked = status === "Connected",
  isSwitchLoading = false,
  onSwitchChange,
  account,
  connectedLocation,
  isHighlighted,
}) => {
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  useEffect(() => {
    if (!isSwitchLoading) {
      setIsLocalLoading(false);
    }
  }, [isSwitchLoading, isSwitchChecked]);

  const handleSwitchToggle = (checked: boolean) => {
    setIsLocalLoading(true);
    onSwitchChange?.(checked);
  };

  const isLoading = isSwitchLoading || isLocalLoading;
  const isCredentialsSaved = !!id;
  const showConnectedActions =
    isFullyConnected ?? isCredentialsSaved;
  const isError = status === "Error";
  let statusClasses = "";
  let StatusIcon = null;
  switch (status) {
    case "Connected":
      statusClasses =
        "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400";
      StatusIcon = (
        <BiCheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      );
      break;
    case "Disconnected":
      statusClasses =
        "bg-secondary dark:bg-default-100 text-secondary-foreground dark:text-foreground/60";
      StatusIcon = (
        <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-600" />
      );
      break;
    case "Error":
      statusClasses =
        "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
      StatusIcon = (
        <FiAlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      );
      break;
    case "Pending":
      statusClasses =
        "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300";
      StatusIcon = (
        <FiAlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      );
      break;
  }

  const actionButton = showConnectedActions ? (
    <>
      {onConfigure && (
        <Button
          size="sm"
          radius="sm"
          variant="ghost"
          onPress={() => onConfigure?.()}
          startContent={<FiSettings className="size-3.5" />}
          className="border-small border-gray-300 dark:border-default-200"
        >
          Configure
        </Button>
      )}
      {onReconnect && (
        <Button
          size="sm"
          radius="sm"
          variant="ghost"
          color="primary"
          onPress={() => onReconnect()}
          startContent={<FiExternalLink className="size-3.5" />}
          className="border-small"
        >
          Re-connect
        </Button>
      )}
      {onSwitchChange && (
        isLoading ? (
          <div className="w-10 h-6 flex items-center justify-center">
            <Spinner size="sm" color="primary" />
          </div>
        ) : (
          <Switch
            size="sm"
            isSelected={isSwitchChecked}
            onValueChange={handleSwitchToggle}
            isDisabled={status !== "Connected" && status !== "Disconnected"}
          />
        )
      )}
    </>
  ) : (
    <Button
      size="sm"
      radius="sm"
      variant="solid"
      color="primary"
      isLoading={isSyncing ?? false}
      isDisabled={isSyncing ?? false}
      onPress={() =>
        (status === "Pending" && onSync ? onSync : (status === "Error" ? onReconnect || onConnect : onConnect))?.()
      }
      endContent={!isSyncing && status !== "Pending" ? <FiExternalLink className="size-3.5" /> : undefined}
    >
      {status === "Pending"
        ? (syncButtonText || "Connecting...")
        : status === "Error"
          ? "Reconnect"
          : "Connect"}
    </Button>
  );

  return (
    <div className="md:flex md:items-start md:justify-between py-5 max-md:space-y-4">
      <div className="flex items-start gap-3 max-sm:flex-col">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3
              className={`text-sm transition-all duration-300 ${isHighlighted
                ? "text-black dark:text-white font-extrabold text-base scale-105 origin-left animate-pulse"
                : "text-foreground font-normal"
                }`}
            >
              {name}
            </h3>
            {StatusIcon}
            <Chip
              size="sm"
              radius="sm"
              className={`text-[11px] capitalize h-5 border-none ${statusClasses}`}
            >
              {status}
            </Chip>
          </div>
          <p className="text-xs text-gray-600 dark:text-foreground/50 mb-3">
            {description}
          </p>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge: string) => (
              <Chip
                key={badge}
                size="sm"
                variant="bordered"
                className="text-[11px] border-small h-5 dark:border-default-200 dark:text-foreground/70"
              >
                {badge}
              </Chip>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-2 h-6">
            {status === "Connected" && account && (account.accountEmail || account.accountName) && (
              <p
                className="h-5 flex items-center gap-2 text-xs dark:text-foreground/40"
              >
                <span className="flex relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap px-1 rounded-small capitalize text-[11px] h-5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">Syncing with</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {platformId === "meta" && (
                    <FaFacebook className="w-3.5 h-3.5 text-[#1877F2] dark:text-[#1877F2]/90" />
                  )}
                  <span>{account.accountEmail || account.accountName}</span>
                  {connectedLocation && (
                    <span className="text-primary font-medium">({connectedLocation})</span>
                  )}
                  {account.instagramUsername && (
                    <>
                      <span className="text-gray-300 dark:text-foreground/20 font-light">•</span>
                      <span className="inline-flex items-center gap-1 text-gray-500 dark:text-foreground/50">
                        <FaInstagram className="w-3.5 h-3.5 text-[#E1306C]" />
                        <span className="font-medium text-[#E1306C] dark:text-[#f45690]">@{account.instagramUsername}</span>
                      </span>
                    </>
                  )}
                </div>
              </p>
            )}
          </div>
          {lastSync && (
            <p className="text-xs text-gray-500 dark:text-foreground/50 mt-2">
              Last sync: {lastSync}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">{actionButton}</div>
    </div>
  );
}
export default IntegrationItem;
