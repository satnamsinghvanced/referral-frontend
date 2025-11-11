import { Tab, Tabs } from "@heroui/react";
import ComponentContainer from "../../components/common/ComponentContainer";
import BrowseMedia from "./BrowseMedia";
import FolderManagement from "./FolderManagement";
import UploadMedia from "./UploadMedia";
import { useState } from "react";

function MediaManagement() {
  const [currentFilters, setCurrentFilters] = useState<any>({
    search: "",
    type: "all",
  });

  const onFilterChange = (key: string, value: string) => {
    setCurrentFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const HEADING_DATA = {
    heading: "Media Management",
    subHeading:
      "Organize and manage your images and videos with tags and folders.",
    buttons: [
      {
        label: "Show Debug",
        onClick: () => {},
        variant: "ghost" as const,
        color: "default" as const,
        className: "border-small",
      },
    ],
  };

  return (
    <>
      <ComponentContainer headingData={HEADING_DATA}>
        <div className="flex flex-col gap-5">
          <Tabs
            aria-label="Options"
            classNames={{
              tabList: "flex w-full rounded-full bg-primary/10 text-xs",
              tab: "flex-1 text-xs font-medium transition-all",
              cursor: "rounded-full text-xs",
              panel: "p-0",
            }}
            className="text-background w-full text-xs"
          >
            <Tab key="browse_media" title="Browse Media" className="text-sm">
              <BrowseMedia
                currentFilters={currentFilters}
                onFilterChange={onFilterChange}
              />
            </Tab>

            <Tab
              key="folder_management"
              title="Folder Management"
              className="text-sm"
            >
              <FolderManagement />
            </Tab>

            <Tab key="upload_media" title="Upload Media" className="text-sm">
              <UploadMedia />
            </Tab>
          </Tabs>
        </div>
      </ComponentContainer>
    </>
  );
}

export default MediaManagement;
