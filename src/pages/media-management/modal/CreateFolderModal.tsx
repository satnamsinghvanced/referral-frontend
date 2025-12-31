import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useState } from "react";
import { useCreateFolder } from "../../../hooks/useMedia";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentFolderId: any;
}

export function CreateFolderModal({
  isOpen,
  onClose,
  parentFolderId,
}: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("");

  const { mutate, isPending } = useCreateFolder();

  const handleCreate = () => {
    if (!folderName.trim()) return;

    mutate(
      { name: folderName, parentFolder: parentFolderId },
      {
        onSuccess: () => {
          setFolderName("");
          onClose();
        },
      }
    );
  };

  const isNameValid = folderName.trim().length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent className="p-5">
        <ModalHeader className="flex flex-col gap-1 font-normal p-0">
          <h4 className="text-base font-medium">Create New Folder</h4>
          <p className="text-xs text-gray-500">
            Create a new folder in the root directory
          </p>
        </ModalHeader>

        <ModalBody className="px-0 pt-4 pb-5">
          <Input
            id="folderName"
            size="sm"
            radius="sm"
            type="text"
            label="Folder Name"
            labelPlacement="outside-top"
            placeholder="Enter folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isNameValid && !isPending)
                handleCreate();
            }}
          />
        </ModalBody>

        <ModalFooter className="flex justify-end gap-1.5 p-0">
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            className="border-small"
            onPress={onClose}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            radius="sm"
            variant="solid"
            color="primary"
            className="border-small"
            onPress={handleCreate}
            isDisabled={!isNameValid || isPending}
            isLoading={isPending}
          >
            Create Folder
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
