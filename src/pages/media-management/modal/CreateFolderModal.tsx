import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useCreateFolder, useUpdateFolderName } from "../../../hooks/useMedia";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentFolderId?: any;
  folderToEdit?: { id: string; name: string } | null;
}

export function CreateFolderModal({
  isOpen,
  onClose,
  parentFolderId,
  folderToEdit,
}: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    if (folderToEdit) {
      setFolderName(folderToEdit.name);
    } else {
      setFolderName("");
    }
  }, [folderToEdit, isOpen]);

  const { mutate: createFolder, isPending: isCreatePending } =
    useCreateFolder();
  const { mutate: updateFolder, isPending: isUpdatePending } =
    useUpdateFolderName(folderToEdit?.id || "");

  const isPending = isCreatePending || isUpdatePending;
  const isEditMode = !!folderToEdit;

  const handleSubmit = () => {
    if (!folderName.trim()) return;

    if (isEditMode) {
      updateFolder(
        { name: folderName },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    } else {
      createFolder(
        { name: folderName, parentFolder: parentFolderId },
        {
          onSuccess: () => {
            setFolderName("");
            onClose();
          },
        },
      );
    }
  };

  const isNameValid = folderName.trim().length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent className="p-4">
        <ModalHeader className="flex flex-col gap-1 font-normal p-0">
          <h4 className="text-base font-medium text-foreground">
            {isEditMode ? "Rename Folder" : "Create New Folder"}
          </h4>
          <p className="text-xs text-gray-500 dark:text-foreground/60">
            {isEditMode
              ? `Rename the current folder "${folderToEdit?.name}"`
              : "Create a new folder in the current directory"}
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
                handleSubmit();
            }}
          />
        </ModalBody>

        <ModalFooter className="flex justify-end gap-1.5 p-0">
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            color="default"
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
            onPress={handleSubmit}
            isDisabled={!isNameValid || isPending}
            isLoading={isPending}
          >
            {isEditMode ? "Save Changes" : "Create Folder"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
