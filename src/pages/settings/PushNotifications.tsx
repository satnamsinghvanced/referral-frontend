import { Card, CardBody, Switch } from "@heroui/react";
import { useState } from "react";
import { FiBell, FiCheckCircle } from "react-icons/fi";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { ImConnection } from "react-icons/im";
import { LuSmartphone } from "react-icons/lu";
import { MdOutlineInfo, MdOutlineShield } from "react-icons/md";
import { TbDeviceDesktop } from "react-icons/tb";

const PushNotifications = () => {
  const [isEnabled, setIsEnabled] = useState(true);

  const handleSwitchChange = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base">Push Notification Settings</h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Configure browser and device push notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs border border-foreground/10 px-2 py-1 rounded-lg font-medium">
            <ImConnection className="text-green-600" />
            Connected
          </span>
        </div>
      </div>

      {/* Browser Permission Card */}
      <Card className="shadow-none">
        <CardBody className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="leading-none flex items-center gap-2 text-sm">
              <FiBell className="h-5 w-5" />
              Notification Permission Status
            </h4>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="text-green-600" />
              <div>
                <label className="text-sm font-medium">
                  Browser Permission
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Current status:{" "}
                  <span className="text-green-600">Granted</span>
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Push Notification Settings Card */}
      <Card className="shadow-none">
        <CardBody className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="leading-none flex items-center gap-2 text-sm">
              <HiOutlineLightningBolt className="h-5 w-5" />
              Push Notification Settings
            </h4>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">
                Enable Push Notifications
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Receive real-time notifications for referrals, reviews, and
                important updates
              </p>
            </div>
            <Switch
              size="sm"
              checked={isEnabled}
              onChange={handleSwitchChange}
            />
          </div>
        </CardBody>
      </Card>

      {/* Connected Devices Card */}
      <Card className="shadow-none">
        <CardBody className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h4 className="leading-none flex items-center gap-2 text-sm">
              <LuSmartphone className="h-5 w-5" />
              Connected Devices
            </h4>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-foreground/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-transparent dark:border dark:border-foreground/10 rounded-lg">
                  <TbDeviceDesktop />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium mb-1">
                    Chrome on MacBook Pro
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 dark:text-gray-400">
                    Chrome 120.0
                  </p>
                  <p className="text-xs text-gray-600">
                    Last seen: 9/25/2025, 3:56:52 PM
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  size="sm"
                  checked={isEnabled}
                  onChange={handleSwitchChange}
                />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Security and Privacy Card */}
      <Card className="shadow-none">
        <CardBody className="p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="leading-none flex items-center gap-2 text-sm">
              <MdOutlineShield className="h-5 w-5" />
              Security & Privacy
            </h4>
          </div>
          <div className="flex items-start gap-2 border border-foreground/10 rounded-lg p-3">
            <div>
              <MdOutlineInfo />
            </div>
            <div className="text-xs">
              <p className="font-semibold mb-1.5">Privacy Note:</p>
              <p className="text-gray-600 dark:text-gray-400 leading-snug">
                Push notifications are sent directly from our secure servers to
                your browser. We never store personal information in
                notification payloads and all communications are encrypted.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2">
            <div className="space-y-1.5">
              <p className="font-semibold text-xs">What we collect:</p>
              <ul className="text-xs space-y-1.5 list-disc list-inside">
                <li>Device registration tokens</li>
                <li>Notification preferences</li>
                <li>Delivery status</li>
              </ul>
            </div>
            <div className="space-y-1.5">
              <p className="font-semibold text-xs">What we collect:</p>
              <ul className="text-xs space-y-1.5 list-disc list-inside">
                <li>Device registration tokens</li>
                <li>Notification preferences</li>
                <li>Delivery status</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PushNotifications;
