import { Outlet } from "react-router";
import ComponentContainer from "../../components/common/ComponentContainer";
import SettingNavigation from "./SettingNavigation";

const Settings = () => {
  const headingDate = {
    heading: "Settings",
    subHeading: "Manage your account preferences and configuration",
  };

  return (
    <ComponentContainer headingDate={headingDate}>
      <div className="flex items-start gap-4">
        <div className="max-w-1/6 w-full border border-text/10 dark:border-background/10 rounded-lg bg-backgrounsd sticky top-0">
          <SettingNavigation />
        </div>
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </ComponentContainer>
  );
};

export default Settings;
