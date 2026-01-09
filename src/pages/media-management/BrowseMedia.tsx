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
import { useState } from "react";

/* ------------------------------------------------------------
   New Folder Modal
------------------------------------------------------------- */
function NewFolderModal({
  isOpen,
  onClose,
  newFolderName,
  setNewFolderName,
  onCreateFolder,
}: {
  isOpen: boolean;
  onClose: () => void;
  newFolderName: string;
  setNewFolderName: (value: string) => void;
  onCreateFolder: () => void;
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/5 z-40"></div>

      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] h-[200px] relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
          >
            &times;
          </button>

          <h4 className="text-sm font-medium mb-1">Create New Folder</h4>
          <p className="text-xs text-gray-400 mb-4">
            Create a new folder in the root directory
          </p>

          <h4 className="text-xs mb-1">Folder Name</h4>

          <Input
            placeholder="Enter Folder name"
            size="sm"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="mb-4 bg-gray-100 rounded-md"
          />

          <div className="flex justify-end  gap-3">
            <Button size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" color="primary" onClick={onCreateFolder}>
              Create Folder
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------
   Upload Media Modal
------------------------------------------------------------- */
function UploadMediaModal({
  isOpen,
  onClose,
  onUpload,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: () => void;
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/5 z-40"></div>

      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] h-[300px] relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 text-xl"
          >
            &times;
          </button>

          <h4 className="text-sm font-medium mb-1">Upload Media</h4>
          <p className="text-xs text-gray-400 mb-4">
            Upload images and videos to the root folder
          </p>
          <h4 className="text-xs mb-1">Tags(comma-Separated,optinonal)</h4>
          <input
            placeholder="e.g , marketing,Product,Campaign"
            type="text"
            className="mb-4 bg-gray-100 rounded-md p-2 w-full text-xs text-gray-700 border border-gray-200"
          />

          <div className="flex justify-end gap-3">
            <Button size="sm" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------
   Original BrowseMedia Code (unchanged UI)
------------------------------------------------------------- */

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
  /* ---- Added states for Modals ---- */
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreateFolder = () => {
    setNewFolderName("");
    setIsFolderModalOpen(false);
  };

  const handleUpload = () => {
    setIsUploadModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ---------------- Top Buttons --------------- */}
      <div className="flex items-center justify-between gap-4 border border-primary/15 rounded-xl p-4 bg-white shadow-none">
        <p className="text-sm">Root</p>
        <div className="space-x-2">
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            startContent={<LuFolderPlus fontSize={15} />}
            className="border-small"
            onClick={() => setIsFolderModalOpen(true)}
          >
            New Folder
          </Button>

          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            startContent={<FiUpload fontSize={15} />}
            className="border-small"
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload Here
          </Button>
        </div>
      </div>

      {/* ---------------- Search & Filters --------------- */}
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

      {/* ---------------- Folders & Media --------------- */}
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
                onClick={() => setIsUploadModalOpen(true)}
              >
                Upload Media
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ---------------- Modals Here --------------- */}
      <NewFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        onCreateFolder={handleCreateFolder}
      />

      <UploadMediaModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}

export default BrowseMedia;
