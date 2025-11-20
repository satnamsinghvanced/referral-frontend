import { Tab, Tabs } from "@heroui/react";
import ComponentContainer from "../../components/common/ComponentContainer";
import BrowseMedia from "./BrowseMedia";
import FolderManagement from "./FolderManagement";
import UploadMedia from "./UploadMedia";

function MediaManagement() {
  const HEADING_DATA = {
    heading: "Media Management",
    subHeading:
      "Organize and manage your images and videos with tags and folders.",
    buttons: [],
  };

  return (
    <>
      <ComponentContainer headingData={HEADING_DATA}>
        <div className="flex flex-col gap-5">
          <BrowseMedia />
          {/* <Tabs
            aria-label="Options"
            classNames={{
              tabList: "flex w-full rounded-full bg-primary/10 text-sm",
              tab: "flex-1 text-sm font-medium transition-all",
              cursor: "rounded-full text-sm",
              panel: "p-0",
            }}
            className="text-background w-full"
          >
            <Tab key="browse_media" title="Browse Media">
              <BrowseMedia />
            </Tab>

            <Tab key="folder_management" title="Folder Management">
              <FolderManagement />
            </Tab>

            <Tab key="upload_media" title="Upload Media">
              <UploadMedia />
            </Tab>
          </Tabs> */}
        </div>
      </ComponentContainer>
    </>
  );
}

export default MediaManagement;
