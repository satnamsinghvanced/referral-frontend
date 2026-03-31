import {
  Button,
  Chip,
  Switch,
  Popover,
  PopoverTrigger,
  PopoverContent,
  User,
} from "@heroui/react";
import { BiCheckCircle } from "react-icons/bi";
import { FiAlertCircle, FiExternalLink, FiSettings } from "react-icons/fi";

interface IntegrationItemProps {
  id: string;
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
  isSwitchChecked?: boolean | undefined;
  onSwitchChange?: ((checked: boolean) => void) | undefined;
  account?: {
    accountName?: string | undefined | null;
    accountEmail?: string | undefined | null;
    accountAvatar?: string | undefined | null;
  };
}

const IntegrationItem: React.FC<IntegrationItemProps> = ({
  id,
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
  isSwitchChecked = status === "Connected",
  onSwitchChange,
  account,
}) => {
  const isCredentialsSaved = !!id;
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
  }

  const actionButton = isCredentialsSaved ? (
    <>
      {(onConfigure || onReconnect || onConnect) && (
        <Button
          size="sm"
          radius="sm"
          variant="ghost"
          onPress={() => (onConfigure || onReconnect || onConnect)?.()}
          startContent={<FiSettings className="size-3.5" />}
          className="border-small border-gray-300 dark:border-default-200"
        >
          Configure
        </Button>
      )}
      <Switch
        size="sm"
        isSelected={isSwitchChecked}
        onValueChange={onSwitchChange}
      />
    </>
  ) : (
    <Button
      size="sm"
      radius="sm"
      variant="solid"
      color="primary"
      onPress={() =>
        (status === "Error" ? onReconnect || onConnect : onConnect)?.()
      }
      endContent={<FiExternalLink className="size-3.5" />}
    >
      Connect
    </Button>
  );

  return (
    <div className="md:flex md:items-start md:justify-between py-5 first:pt-0 last:pb-4 max-md:space-y-4">
      <div className="flex items-start gap-3 max-sm:flex-col">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-sm font-normal text-foreground">{name}</h3>
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
            {isCredentialsSaved && lastSync && (
              <p className="text-xs text-gray-600 dark:text-foreground/40">
                Last sync: {lastSync}
              </p>
            )}

            {isCredentialsSaved && account && (account.accountEmail || account.accountName) && (
              <p
                className="h-5 flex items-center gap-2 text-xs dark:text-foreground/40"
              >
                <span className="flex relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap px-1 rounded-small capitalize text-[11px] h-5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">Syncing with</span>
                {account.accountEmail || account.accountName}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">{actionButton}</div>
    </div>
  );
};

export default IntegrationItem;
