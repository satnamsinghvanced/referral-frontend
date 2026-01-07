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
  isSwitchChecked = status === "Connected",
  onSwitchChange,
}) => {
  const isCredentialsSaved = !!id;

  let statusClasses = "";
  let StatusIcon = null;
  switch (status) {
    case "Connected":
      statusClasses = "bg-green-100 text-green-700";
      StatusIcon = <BiCheckCircle className="h-4 w-4 text-green-600" />;
      break;
    case "Disconnected":
      statusClasses = "bg-secondary text-secondary-foreground";
      break;
    case "Error":
      statusClasses =
        "bg-red text-white focus-visible:ring-red/20 dark:bg-red/60";
      StatusIcon = <FiAlertCircle className="h-4 w-4 text-red-600" />;
      break;
  }

  const actionButton = isCredentialsSaved ? (
    <>
      {onConfigure && (
        <Button
          size="sm"
          radius="sm"
          variant="ghost"
          onPress={onConfigure}
          startContent={<FiSettings className="size-3.5" />}
          className="border-small"
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
    <div className="flex items-start justify-between py-5 first:pt-0 last:pb-4">
      <div className="flex items-start gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-sm font-normal">{name}</h3>
            {StatusIcon}
            <Chip
              size="sm"
              radius="sm"
              className={`text-[11px] capitalize h-5 ${statusClasses}`}
            >
              {status}
            </Chip>
          </div>
          <p className="text-xs text-gray-600 mb-3">{description}</p>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge: string) => (
              <Chip
                key={badge}
                size="sm"
                variant="bordered"
                className="text-[11px] border-small h-5"
              >
                {badge}
              </Chip>
            ))}
          </div>
          {lastSync && (
            <p className="text-xs text-gray-600 mt-2">Last sync: {lastSync}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">{actionButton}</div>
    </div>
  );
};

export default IntegrationItem;
