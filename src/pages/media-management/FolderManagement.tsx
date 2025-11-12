import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { BiChevronRight } from "react-icons/bi";
import { FiChevronRight } from "react-icons/fi";
import { LuFolderOpen, LuFolderPlus } from "react-icons/lu";

// --- Folder Detail Card Component ---
const FolderDetailCard = ({ name, items, createdDate }: any) => (
  <Card className="p-4 shadow-none border border-primary/15">
    <CardBody className="p-0">
      <div className="flex items-start gap-3">
        {/* Folder Open Icon with blue color */}
        <LuFolderOpen className="size-6 text-blue-500 flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium mb-1">{name}</p>
          <p className="text-xs text-gray-600">{items} items</p>
          <p className="text-xs text-gray-600 mt-1">Created {createdDate}</p>
          <div className="mt-2">
            <Button
              size="sm"
              radius="sm"
              variant="ghost"
              onPress={() => console.log(`Opening folder: ${name}`)}
              startContent={<FiChevronRight className="size-4" />}
              className="border-small gap-1 px-2.5 h-7"
            >
              Open
            </Button>
          </div>
        </div>
      </div>
    </CardBody>
  </Card>
);

// Mock data for the folders
const mockFolders = [
  { name: "haha", items: 0, createdDate: "11/11/2025" },
  { name: "dgdfg", items: 0, createdDate: "9/5/2025" },
  { name: "hawaii pics", items: 0, createdDate: "9/2/2025" },
  { name: "1", items: 0, createdDate: "11/10/2025" },
  { name: "sdasd", items: 0, createdDate: "11/11/2025" },
];

function FolderManagement() {
  return (
    <div>
      <Card className="p-5 shadow-none border border-primary/15 bg-white">
        <CardHeader className="p-0 pb-5">
          <div className="flex justify-between items-center w-full">
            <h4 className="leading-none text-sm font-medium">
              Folder Management
            </h4>
            <Button
              size="sm"
              radius="sm"
              variant="solid"
              color="primary"
              onPress={() => console.log("Create Folder clicked")}
              startContent={<LuFolderPlus className="w-4 h-4" />}
            >
              Create Folder
            </Button>
          </div>
        </CardHeader>
        {/* Card Body equivalent */}
        <CardBody className="p-0">
          {/* Responsive Grid for Folder Detail Cards (1 col mobile, up to 3 desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {mockFolders.map((folder, index) => (
              <FolderDetailCard key={index} {...folder} />
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default FolderManagement;
