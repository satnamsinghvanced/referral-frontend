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
import { useFormik } from "formik";
import React, { useState } from "react";
import { FiSmartphone } from "react-icons/fi";
import { LuQrCode } from "react-icons/lu";
import * as Yup from "yup";
import { fetchLocations } from "../../../services/settings/location";
import { fetchTeamMembers, TeamMember } from "../../../services/settings/team";
import { Location } from "../../../types/common";

interface CreateTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
}

const PLATFORMS = [
  { id: "google", name: "Google" },
  { id: "yelp", name: "Yelp" },
  { id: "healthgrades", name: "Healthgrades" },
];

interface CreateTagFormValues {
  type: "nfc" | "qr";
  name: string;
  locations: string[];
  platform: string;
  teamMember: string;
}

const CreateTagSchema = Yup.object().shape({
  type: Yup.string().oneOf(["nfc", "qr"]).required("Type is required"),
  name: Yup.string().required("Tag name is required").max(100, "Too long"),
  locations: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one location")
    .required("Locations are required"),
  platform: Yup.string().required("Platform is required"),
  teamMember: Yup.string().required("Team member is required"),
});

const CreateTagModal: React.FC<CreateTagModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const formik = useFormik<CreateTagFormValues>({
    initialValues: {
      type: "nfc",
      name: "",
      locations: [],
      platform: "google",
      teamMember: "",
    },
    validationSchema: CreateTagSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await onCreate(values);
        onClose();
        resetForm();
      } catch (error) {
        console.error("Error creating tag:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  React.useEffect(() => {
    const loadData = async () => {
      setIsDataLoading(true);
      try {
        const [locsRes, teamRes] = await Promise.all([
          fetchLocations({ limit: 100 }),
          fetchTeamMembers({ limit: 100 }),
        ]);
        setLocations(locsRes.data);
        setTeamMembers(teamRes.data);
      } catch (error) {
        console.error("Error loading modal data:", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    if (isOpen) {
      loadData();
    } else {
      formik.resetForm();
    }
  }, [isOpen]);

  const handleLocationChange = (locId: string, checked: boolean) => {
    const currentLocations = formik.values.locations;
    if (checked) {
      formik.setFieldValue("locations", [...currentLocations, locId]);
    } else {
      formik.setFieldValue(
        "locations",
        currentLocations.filter((id) => id !== locId)
      );
    }
  };

  const handleSelectAllLocations = (checked: boolean) => {
    if (checked) {
      formik.setFieldValue(
        "locations",
        locations.map((l) => l._id).filter((id): id is string => !!id)
      );
    } else {
      formik.setFieldValue("locations", []);
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
                  selectedKey={formik.values.type}
                  onSelectionChange={(key) =>
                    formik.setFieldValue("type", key as "nfc" | "qr")
                  }
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
                name="name"
                value={formik.values.name}
                onValueChange={(val) => formik.setFieldValue("name", val)}
                onBlur={formik.handleBlur}
                description="Help you identify where this tag is placed"
                size="sm"
                radius="sm"
                variant="flat"
                classNames={{ description: "mt-1 text-xs text-gray-500" }}
                isRequired
                isInvalid={!!(formik.touched.name && formik.errors.name)}
                errorMessage={formik.touched.name && formik.errors.name}
              />

              {/* Practice Locations */}
              <div className="flex flex-col gap-2">
                <label className="text-xs">
                  Practice Locations <span className="text-[#eb0000]">*</span>
                </label>
                <div
                  className={`border ${
                    formik.touched.locations && formik.errors.locations
                      ? "border-danger"
                      : "border-default-200"
                  } rounded-lg divide-y divide-default-100 max-h-56 overflow-y-auto`}
                >
                  <div className="p-3 pt-2 hover:bg-default-50 transition-colors">
                    <Checkbox
                      isSelected={
                        formik.values.locations.length === locations.length &&
                        locations.length > 0
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
                  {locations.map((loc) => (
                    <div
                      key={loc._id}
                      className="relative px-3 pt-1.5 pb-2.5 hover:bg-default-50 transition-colors"
                    >
                      <Checkbox
                        isSelected={
                          !!loc._id && formik.values.locations.includes(loc._id)
                        }
                        onValueChange={(checked) =>
                          loc._id && handleLocationChange(loc._id, checked)
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
                {formik.touched.locations && formik.errors.locations && (
                  <p className="text-tiny text-danger">
                    {formik.errors.locations as string}
                  </p>
                )}
              </div>

              {/* Team Member Selection */}
              <div>
                <Select
                  label="Assign Team Member"
                  labelPlacement="outside"
                  placeholder="Select a team member"
                  name="teamMember"
                  selectedKeys={
                    formik.values.teamMember ? [formik.values.teamMember] : []
                  }
                  onSelectionChange={(keys) => {
                    formik.setFieldValue("teamMember", Array.from(keys)[0]);
                  }}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(formik.touched.teamMember && formik.errors.teamMember)
                  }
                  errorMessage={
                    formik.touched.teamMember && formik.errors.teamMember
                  }
                  size="sm"
                  radius="sm"
                  variant="flat"
                  isRequired
                >
                  {teamMembers.map((member) => (
                    <SelectItem
                      key={member._id}
                      textValue={`${member.firstName} ${member.lastName}`}
                    >
                      {member.firstName} {member.lastName}
                    </SelectItem>
                  ))}
                </Select>
                <p className="text-xs text-gray-500 mt-1.5">
                  The team member who will be credited for reviews
                </p>
              </div>

              {/* Review Platform */}
              <div>
                <Select
                  label="Review Platform"
                  labelPlacement="outside"
                  placeholder="Select a platform"
                  name="platform"
                  selectedKeys={[formik.values.platform]}
                  onSelectionChange={(keys) => {
                    formik.setFieldValue("platform", Array.from(keys)[0]);
                  }}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(formik.touched.platform && formik.errors.platform)
                  }
                  errorMessage={
                    formik.touched.platform && formik.errors.platform
                  }
                  size="sm"
                  radius="sm"
                  variant="flat"
                  isRequired
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
                  {formik.values.type === "nfc" ? (
                    <FiSmartphone className="text-sky-500 text-lg" />
                  ) : (
                    <LuQrCode className="text-sky-500 text-lg" />
                  )}
                </div>
                <p className="text-xs text-sky-900 leading-[1.5]">
                  {formik.values.type === "nfc" ? (
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
                onPress={() => formik.handleSubmit()}
                size="sm"
                radius="sm"
                isLoading={formik.isSubmitting}
                isDisabled={!formik.isValid || !formik.dirty}
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
