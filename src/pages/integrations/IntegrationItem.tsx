import { Button, Chip, Switch } from "@heroui/react";
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
      {isError && onReconnect ? (
        <Button
          size="sm"
          radius="sm"
          variant="solid"
          color="primary"
          onPress={onReconnect}
          endContent={<FiExternalLink className="size-3.5" />}
        >
          Reconnect
        </Button>
      ) : (
        <>
          {onConfigure && (
            <Button
              size="sm"
              radius="sm"
              variant="ghost"
              onPress={onConfigure}
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
      )}
    </>
  ) : (
    // @ts-ignore
    <Button
      size="sm"
      radius="sm"
      variant="solid"
      color="primary"
      onPress={onConnect}
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
          {isCredentialsSaved && lastSync && (
            <p className="text-xs text-gray-600 dark:text-foreground/40 mt-2">
              Last sync: {lastSync}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">{actionButton}</div>
    </div>
  );
};

export default IntegrationItem;
