import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Tab,
  Tabs,
} from "@heroui/react";
import React, { useState } from "react";
import { FiSmartphone } from "react-icons/fi";
import { LuQrCode } from "react-icons/lu";

interface CreateTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
}

const LOCATIONS = [
  { id: "loc1", name: "Downtown Office" },
  { id: "loc2", name: "Westside Clinic" },
  { id: "loc3", name: "Medical Center" },
  { id: "loc4", name: "Northgate Branch" },
];

const PLATFORMS = [
  { id: "google", name: "Google" },
  { id: "facebook", name: "Facebook" },
  { id: "yelp", name: "Yelp" },
  { id: "healthgrades", name: "Healthgrades" },
];

const CreateTagModal: React.FC<CreateTagModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [type, setType] = useState<"nfc" | "qr">("nfc");
  const [name, setName] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [platform, setPlatform] = useState<string>("google");

  const handleCreate = () => {
    onCreate({
      type,
      name,
      locations: selectedLocations,
      platform,
    });
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setSelectedLocations([]);
    setPlatform("google");
    setType("nfc");
  };

  const handleLocationChange = (locId: string, checked: boolean) => {
    if (checked) {
      setSelectedLocations([...selectedLocations, locId]);
    } else {
      setSelectedLocations(selectedLocations.filter((id) => id !== locId));
    }
  };

  const handleSelectAllLocations = (checked: boolean) => {
    if (checked) {
      setSelectedLocations(LOCATIONS.map((l) => l.id));
    } else {
      setSelectedLocations([]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 px-5">
              <h4 className="text-base font-medium">
                Create NFC Tag or QR Code
              </h4>
              <p className="text-xs text-gray-500 font-normal">
                Create a new NFC tag or QR code to collect reviews from patients
                at your practice.
              </p>
            </ModalHeader>
            <ModalBody className="py-0 px-5 gap-5">
              {/* Type Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-xs">
                  Type <span className="text-[#eb0000]">*</span>
                </label>
                <Tabs
                  aria-label="Tag Type"
                  selectedKey={type}
                  onSelectionChange={(key) => setType(key as "nfc" | "qr")}
                  classNames={{
                    tabList: "flex w-full rounded-full bg-primary/10",
                    tab: "flex-1 text-xs font-medium transition-all",
                    cursor: "rounded-full text-xs",
                    panel: "p-0",
                  }}
                  className="w-full text-xs"
                >
                  <Tab
                    key="nfc"
                    title={
                      <div className="flex items-center gap-2">
                        <FiSmartphone className="text-base" />
                        <span>NFC Tag</span>
                      </div>
                    }
                  />
                  <Tab
                    key="qr"
                    title={
                      <div className="flex items-center gap-2">
                        <LuQrCode className="text-base" />
                        <span>QR Code</span>
                      </div>
                    }
                  />
                </Tabs>
              </div>

              {/* Tag Name */}
              <Input
                label="Tag Name/Description"
                labelPlacement="outside"
                placeholder="e.g., Front Desk Card, Waiting Room Poster"
                value={name}
                onValueChange={setName}
                description="Help you identify where this tag is placed"
                size="sm"
                radius="sm"
                variant="flat"
                classNames={{ description: "mt-1 text-xs text-gray-500" }}
                isRequired
              />

              {/* Practice Locations */}
              <div className="flex flex-col gap-2">
                <label className="text-xs">
                  Practice Locations <span className="text-[#eb0000]">*</span>
                </label>
                <div className="border border-default-200 rounded-lg divide-y divide-default-100 max-h-56 overflow-y-auto">
                  <div className="p-3 pt-2 hover:bg-default-50 transition-colors">
                    <Checkbox
                      isSelected={
                        selectedLocations.length === LOCATIONS.length &&
                        LOCATIONS.length > 0
                      }
                      onValueChange={handleSelectAllLocations}
                      classNames={{
                        base: "max-w-full w-full p-0 m-0",
                        label: "text-sm font-medium text-gray-900 w-full",
                      }}
                      size="sm"
                      radius="sm"
                    >
                      All Locations
                    </Checkbox>
                  </div>
                  {LOCATIONS.map((loc) => (
                    <div
                      key={loc.id}
                      className="relative px-3 pt-1.5 pb-2.5 hover:bg-default-50 transition-colors"
                    >
                      <Checkbox
                        isSelected={selectedLocations.includes(loc.id)}
                        onValueChange={(checked) =>
                          handleLocationChange(loc.id, checked)
                        }
                        classNames={{
                          base: "max-w-full w-full p-0 m-0",
                          label: "text-sm text-gray-600 w-full",
                        }}
                        size="sm"
                        radius="sm"
                      >
                        {loc.name}
                      </Checkbox>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Platform */}
              <div>
                <Select
                  label="Review Platform"
                  labelPlacement="outside"
                  placeholder="Select a platform"
                  selectedKeys={[platform]}
                  onChange={(e) => setPlatform(e.target.value)}
                  size="sm"
                  radius="sm"
                  variant="flat"
                >
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p.id} textValue={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </Select>
                <p className="text-xs text-gray-500 mt-1.5">
                  Where patients will be directed to leave a review
                </p>
              </div>

              {/* Info Box */}
              <div className="px-2 py-2.5 rounded-lg bg-sky-50 border border-sky-100 flex gap-2 items-center">
                <div className="mt-0.5 shrink-0">
                  {type === "nfc" ? (
                    <FiSmartphone className="text-sky-500 text-lg" />
                  ) : (
                    <LuQrCode className="text-sky-500 text-lg" />
                  )}
                </div>
                <p className="text-xs text-sky-900 leading-[1.5]">
                  {type === "nfc" ? (
                    <>
                      <span className="font-semibold">NFC Tag:</span> After
                      creation, use the "Write to NFC" button to program a
                      physical NFC tag.
                    </>
                  ) : (
                    <>
                      <span className="font-semibold">QR Code:</span> After
                      creation, you can download a printable QR code image.
                    </>
                  )}
                </p>
              </div>
            </ModalBody>
            <ModalFooter className="px-5 py-4">
              <Button
                variant="ghost"
                color="default"
                onPress={onClose}
                size="sm"
                radius="sm"
                className="border-small"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleCreate}
                size="sm"
                radius="sm"
                className="font-medium"
              >
                Create Tag
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateTagModal;
