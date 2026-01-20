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
import { useFetchLocations } from "../../../hooks/settings/useLocation";
import { useFetchTeamMembers } from "../../../hooks/settings/useTeam";
import { useCreateNFCDesk } from "../../../hooks/useNFCDesk";
import { Location } from "../../../types/common";
import { TeamMember } from "../../../services/settings/team";

interface CreateTagModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const CreateTagModal: React.FC<CreateTagModalProps> = ({ isOpen, onClose }) => {
  const { data: locationsProps } = useFetchLocations();
  const { data: teamProps } = useFetchTeamMembers();
  const createMutation = useCreateNFCDesk();

  const locations =
    locationsProps?.data ||
    (Array.isArray(locationsProps) ? locationsProps : []);
  const teamMembers = teamProps?.data || [];

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
        await createMutation.mutateAsync({
          ...values,
          type: values.type.toUpperCase(),
        });
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
    if (!isOpen) {
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
        currentLocations.filter((id) => id !== locId),
      );
    }
  };

  const handleSelectAllLocations = (checked: boolean) => {
    if (checked) {
      formik.setFieldValue(
        "locations",
        locations.map((l) => l._id).filter((id): id is string => !!id),
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
            <ModalHeader className="flex flex-col gap-1 px-4">
              <h4 className="text-base font-medium">
                Create NFC Tag or QR Code
              </h4>
              <p className="text-xs text-gray-500 dark:text-foreground/60 font-normal">
                Create a new NFC tag or QR code to collect reviews from patients
                at your practice.
              </p>
            </ModalHeader>
            <ModalBody className="py-0 px-4 gap-5">
              {/* Type Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-xs">
                  Type <span className="text-[#eb0000]">*</span>
                </label>
                <div className="">
                  <Tabs
                    aria-label="Tag Type"
                    selectedKey={formik.values.type}
                    onSelectionChange={(key) =>
                      formik.setFieldValue("type", key as "nfc" | "qr")
                    }
                    variant="light"
                    radius="full"
                    classNames={{
                      base: "bg-primary/15 dark:bg-background rounded-full p-1 w-full",
                      tabList: "flex w-full rounded-full p-0 gap-0",
                      tab: "flex-1 h-9 text-sm font-medium transition-all",
                      cursor: "rounded-full bg-white dark:bg-primary",
                      tabContent:
                        "dark:group-data-[selected=true]:text-primary-foreground text-default-500 dark:text-foreground/60 transition-colors",
                    }}
                    className="w-full"
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
                classNames={{
                  description:
                    "mt-1 text-xs text-gray-500 dark:text-foreground/60",
                }}
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
                  <div className="p-3 pt-2 hover:bg-default-50 dark:hover:bg-content2 transition-colors">
                    <Checkbox
                      isSelected={
                        formik.values.locations.length === locations.length &&
                        locations.length > 0
                      }
                      onValueChange={handleSelectAllLocations}
                      classNames={{
                        base: "max-w-full w-full p-0 m-0",
                        label:
                          "text-sm font-medium text-gray-900 dark:text-foreground w-full",
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
                      className="relative px-3 pt-1.5 pb-2.5 hover:bg-default-50 dark:hover:bg-content2 transition-colors"
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
                          label:
                            "text-sm text-gray-600 dark:text-foreground/80 w-full",
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
                  disabledKeys={
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
                <p className="text-xs text-gray-500 dark:text-foreground/60 mt-1.5">
                  The team member who will be credited for reviews
                </p>
              </div>

              {/* Review Platform */}
              {/* <div>
                <Select
                  label="Review Platform"
                  labelPlacement="outside"
                  placeholder="Select a platform"
                  name="platform"
                  selectedKeys={[formik.values.platform]}
                  disabledKeys={[formik.values.platform]}
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
                <p className="text-xs text-gray-500 dark:text-foreground/60 mt-1.5">
                  Where patients will be directed to leave a review
                </p>
              </div> */}

              {/* Info Box */}
              <div className="px-2 py-2.5 rounded-lg bg-sky-50 border border-sky-100 dark:bg-sky-500/10 dark:border-sky-500/20 flex gap-2 items-center">
                <div className="mt-0.5 shrink-0">
                  {formik.values.type === "nfc" ? (
                    <FiSmartphone className="text-sky-500 text-lg" />
                  ) : (
                    <LuQrCode className="text-sky-500 text-lg" />
                  )}
                </div>
                <p className="text-xs text-sky-900 dark:text-sky-300 leading-[1.5]">
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
            <ModalFooter className="px-4 py-4">
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
