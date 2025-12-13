import { Outlet } from "react-router";
import ComponentContainer from "../../components/common/ComponentContainer";
import SettingNavigation from "./SettingNavigation";

const Settings = () => {
  const headingData = {
    heading: "Settings",
    subHeading: "Manage your account preferences and configurations.",
  };

  return (
    <ComponentContainer headingData={headingData}>
      <div className="flex items-start gap-5">
        <div className="max-w-1/5 w-full border border-foreground/10  rounded-xl bg-background sticky top-0">
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
