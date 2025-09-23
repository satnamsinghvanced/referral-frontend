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
      <div className="flex gap-4">
        <div className="max-w-1/8 w-full border border-text/10 rounded-lg bg-background">
          <SettingNavigation />
        </div>
        <div className="w-full border border-text/10 rounded-lg p-3 bg-background">
          <Outlet />
        </div>
      </div>
    </ComponentContainer>
  );
};

export default Settings;
