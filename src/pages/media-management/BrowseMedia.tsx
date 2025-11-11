import {
  Button,
  Input,
  Select,
  SelectItem,
  Card,
  CardHeader,
  CardBody,
} from "@heroui/react";
import { FaRegFolder } from "react-icons/fa";
import { FiImage, FiSearch, FiUpload } from "react-icons/fi";
import { LuFolderOpen, LuFolderPlus } from "react-icons/lu";

interface BrowseMediaProps {
  currentFilters: any;
  onFilterChange: any;
}

const FolderItem = ({ name, items }: { name: string; items: number }) => (
  <div className="p-4 border border-primary/15 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
    <div className="text-center">
      <LuFolderOpen className="size-6 mx-auto mb-2 text-blue-500" />
      <p className="text-sm truncate font-medium mb-1">{name}</p>
      <p className="text-xs text-gray-500">{items} items</p>
    </div>
  </div>
);

const mockFolders = [
  { name: "dgdfg", items: 0 },
  { name: "hawaii pics", items: 0 },
  { name: "1", items: 0 },
  { name: "sdasd", items: 0 },
];

function BrowseMedia({ currentFilters, onFilterChange }: BrowseMediaProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4 border border-primary/15 rounded-xl p-4 bg-white shadow-none">
        <p className="text-sm">Root</p>
        <div className="space-x-2">
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            startContent={<LuFolderPlus fontSize={15} />}
            className="border-small"
          >
            New Folder
          </Button>
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            startContent={<FiUpload fontSize={15} />}
            className="border-small"
          >
            Upload Here
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 border border-primary/15 rounded-xl p-4 bg-white shadow-none">
        <div className="relative flex-1">
          <Input
            placeholder="Search media by name or tags..."
            size="sm"
            value={currentFilters.search}
            onValueChange={(value) => onFilterChange("search", value as string)}
            startContent={<FiSearch className="text-gray-400 h-4 w-4" />}
          />
        </div>

        <div className="min-w-[200px]">
          <Select
            aria-label="Call Types"
            placeholder="All Types"
            size="sm"
            selectedKeys={new Set([currentFilters.type])}
            onSelectionChange={(keys) =>
              onFilterChange("type", Array.from(keys)[0] as string)
            }
          >
            <SelectItem key="all">All Media</SelectItem>
            <SelectItem key="images">Images</SelectItem>
            <SelectItem key="videos">Videos</SelectItem>
          </Select>
        </div>
      </div>

      <div className="space-y-5">
        <Card className="shadow-none border border-primary/15 p-5">
          <CardHeader className="p-0 pb-5">
            <h4 className="leading-none flex items-center gap-2 text-sm font-medium">
              <FaRegFolder className="size-4" />
              Folders
            </h4>
          </CardHeader>
          <CardBody className="p-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {mockFolders.map((folder, index) => (
                <FolderItem key={index} {...folder} />
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-none border border-primary/15 p-5">
          <CardHeader className="p-0 pb-5">
            <div className="flex justify-between items-center">
              <h4 className="leading-none flex items-center gap-2 text-sm font-medium">
                <FiImage className="size-4" />
                Media (0)
              </h4>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              <FiImage className="size-10 mx-auto mb-4 opacity-50 text-gray-400" />
              <p className="mb-4">No media found in this folder</p>
              <Button
                size="sm"
                radius="sm"
                variant="ghost"
                startContent={<FiUpload className="w-4 h-4" />}
                className="border-small"
              >
                Upload Media
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default BrowseMedia;
