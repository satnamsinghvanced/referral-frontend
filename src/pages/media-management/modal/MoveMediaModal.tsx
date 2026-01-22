import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { useEffect, useState } from "react";
import {
  useGetAllFoldersWithChildFolders,
  useMoveImages,
} from "../../../hooks/useMedia";

interface MoveMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMedia: string[];
  setSelectedMedia: any;
}

export function MoveMediaModal({
  isOpen,
  onClose,
  selectedMedia,
  setSelectedMedia,
}: MoveMediaModalProps) {
  const [selectedFolder, setSelectedFolder] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSelectedFolder("");
    }
  }, [isOpen]);

  const { data: folders } = useGetAllFoldersWithChildFolders();

  const { mutate, isPending } = useMoveImages();

  const handleMove = () => {
    mutate(
      { folderId: selectedFolder, imageIds: selectedMedia },
      {
        onSuccess: () => {
          setSelectedFolder("");
          setSelectedMedia([]);
          onClose();
        },
      },
    );
  };

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
          <h4 className="text-base font-medium text-foreground">Move Media</h4>
          <p className="text-xs text-gray-500 dark:text-foreground/60">
            Move your media to selected folder
          </p>
        </ModalHeader>

        <ModalBody className="px-0 py-4">
          <Select
            size="sm"
            radius="sm"
            label="Select Folder"
            labelPlacement="outside"
            placeholder="Select folder"
            isRequired
            selectedKeys={[selectedFolder]}
            onChange={(event) => {
              setSelectedFolder(event.target.value);
            }}
          >
            {(folders || [])?.map((folder: any) => (
              <SelectItem key={folder._id}>{folder.name}</SelectItem>
            ))}
          </Select>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-1.5 p-0">
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            className="border-small border-gray-300 dark:border-default-200 text-gray-700 dark:text-foreground/70 hover:bg-gray-50 dark:hover:bg-default-100"
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
            onPress={handleMove}
            isDisabled={isPending}
            isLoading={isPending}
          >
            Move
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
