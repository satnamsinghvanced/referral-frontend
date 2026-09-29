import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useFormik } from "formik";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
import { LuBriefcase } from "react-icons/lu";
import * as Yup from "yup";
import { EMAIL_REGEX, NAME_REGEX, PHONE_REGEX } from "../../../consts/consts";
import { LEAD_PRIORITIES, LEAD_SOURCES, LEAD_TREATMENTS } from "../../../consts/lead-pipeline";
import { useFetchTeamMembers } from "../../../hooks/settings/useTeam";
import { useAddLead } from "../../../hooks/useLeadPipeline";
import { useLocationContext } from "../../../providers/LocationContext";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";

const formatTreatmentLabel = (key: string) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

interface AddLeadModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const AddLeadModal = ({ isOpen, onOpenChange }: AddLeadModalProps) => {
  const { locations, getLocationColor } = useLocationContext();
  const { mutateAsync: addLead, isPending: submitting } = useAddLead();
  const { data: teamMembers, isLoading: loadingTeam } = useFetchTeamMembers();
  const [selectedTreatments, setSelectedTreatments] = useState<Set<string>>(new Set());
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .trim()
      .required("First name is required")
      .matches(NAME_REGEX, "First name can only contain letters and spaces"),
    lastName: Yup.string()
      .trim()
      .nullable()
      .notRequired()
      .test("is-valid-name", "Last name can only contain letters and spaces", (value) => {
        if (!value) return true;
        return NAME_REGEX.test(value);
      }),
    email: Yup.string().required("Email is required").matches(EMAIL_REGEX, "Invalid email format"),
    phone: Yup.string().required("Phone is required").matches(PHONE_REGEX, "Phone must be in format (XXX) XXX-XXXX"),
    location: Yup.string().nullable().notRequired(),
    source: Yup.string().required("Source is required"),
    priority: Yup.string().required("Priority is required"),
    estimatedValue: Yup.number()
      .typeError("Value must be a number")
      .min(0, "Estimated value cannot be negative")
      .max(100000, "Estimated value cannot exceed $100,000")
      .nullable(),
    notes: Yup.string()
      .max(200, "Additional notes cannot exceed 200 characters")
      .nullable(),
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      source: "website",
      priority: "medium",
      assignedTo: "Unassigned",
      estimatedValue: "",
      notes: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const locObj = values.location
          ? locations?.find(
            (l: any) => l._id === values.location || l.name?.toLowerCase() === values.location?.toLowerCase()
          )
          : null;
        const locId = locObj?._id || (values.location && /^[0-9a-fA-F]{24}$/.test(values.location) ? values.location : null);
        const { location: _loc, ...restValues } = values;
        const payload = {
          ...restValues,
          locationId: locId,
          estimatedValue: Math.min(Math.max(Number(values.estimatedValue) || 0, 0), 100000),
          notes: values.notes ? values.notes.slice(0, 200) : "",
          assignedTo:
            values.assignedTo === "Unassigned" ||
              !/^[0-9a-fA-F]{24}$/.test(values.assignedTo)
              ? null
              : values.assignedTo,
          treatments: Array.from(selectedTreatments),
          tags: tags.slice(0, 5),
          status: "newLead",
        };
        await addLead(payload);
        onOpenChange(false);
        resetForm();
        setSelectedTreatments(new Set());
        setTags([]);
      } catch (error: any) {
        console.error("Failed to add lead:", error);
      }
    },
  });

  const handleAddTag = () => {
    if (tags.length >= 5) return;
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTreatment = (treatment: string) => {
    const newSet = new Set(selectedTreatments);
    newSet.delete(treatment);
    setSelectedTreatments(newSet);
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      placement="center"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh] sm:max-h-[85vh] my-auto mx-3 sm:mx-auto w-full max-w-lg bg-background border border-foreground/10 shadow-2xl rounded-2xl overflow-hidden",
        closeButton: "top-4 right-4 z-50 cursor-pointer text-foreground/60 hover:text-foreground",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
            autoComplete="on"
            noValidate
            className="flex flex-col h-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden"
          >
            <ModalHeader className="flex flex-col gap-0.5 px-5 py-4 border-b border-foreground/10 shrink-0 bg-background">
              <h3 className="text-base font-semibold text-foreground">
                Add New Lead
              </h3>
              <p className="text-xs text-foreground/60 font-normal">
                Enter the patient lead information into your pipeline
              </p>
            </ModalHeader>

            <ModalBody className="py-4 px-5 gap-4 overflow-y-auto flex-1 scrollbar-thin">
              {/* Contact Information Card */}
              <div className="border border-foreground/10 rounded-xl p-3.5 sm:p-4 space-y-3.5 bg-foreground/[0.01]">
                <h4 className="font-semibold text-xs text-foreground/70 uppercase tracking-wider">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    label="First Name"
                    labelPlacement="outside"
                    placeholder="Enter first name"
                    variant="flat"
                    size="sm"
                    radius="md"
                    name="firstName"
                    id="lead_first_name"
                    autoComplete="given-name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      !!(formik.touched.firstName && formik.errors.firstName)
                    }
                    errorMessage={
                      formik.touched.firstName &&
                      (formik.errors.firstName as string)
                    }
                    isRequired
                  />
                  <Input
                    label="Last Name"
                    labelPlacement="outside"
                    placeholder="Enter last name"
                    variant="flat"
                    size="sm"
                    radius="md"
                    name="lastName"
                    id="lead_last_name"
                    autoComplete="family-name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      !!(formik.touched.lastName && formik.errors.lastName)
                    }
                    errorMessage={
                      formik.touched.lastName &&
                      (formik.errors.lastName as string)
                    }
                  />
                  <Input
                    label="Email Address"
                    labelPlacement="outside"
                    placeholder="example@email.com"
                    variant="flat"
                    size="sm"
                    radius="md"
                    name="email"
                    id="lead_email"
                    type="email"
                    autoComplete="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.touched.email && formik.errors.email)}
                    errorMessage={
                      formik.touched.email && (formik.errors.email as string)
                    }
                    startContent={
                      <HiOutlineMail className="text-default-400 size-4" />
                    }
                    isRequired
                  />
                  <Input
                    label="Phone Number"
                    labelPlacement="outside"
                    placeholder="(XXX) XXX-XXXX"
                    variant="flat"
                    size="sm"
                    radius="md"
                    name="phone"
                    id="lead_phone"
                    type="tel"
                    autoComplete="tel"
                    value={formik.values.phone}
                    onValueChange={(val) =>
                      formik.setFieldValue("phone", formatPhoneNumber(val))
                    }
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                    errorMessage={
                      formik.touched.phone && (formik.errors.phone as string)
                    }
                    startContent={
                      <HiOutlinePhone className="text-default-400 size-4" />
                    }
                    isRequired
                  />
                  <div className="col-span-1 sm:col-span-2">
                    {locations && locations.length > 0 ? (
                      <Select
                        label="Practice Location"
                        labelPlacement="outside"
                        placeholder="Select location"
                        variant="flat"
                        size="sm"
                        radius="md"
                        disableAnimation
                        selectedKeys={formik.values.location ? [formik.values.location] : []}
                        onSelectionChange={(keys) =>
                          formik.setFieldValue("location", Array.from(keys)[0] as string)
                        }
                        onBlur={() => formik.setFieldTouched("location", true)}
                        isInvalid={!!(formik.touched.location && formik.errors.location)}
                        errorMessage={
                          formik.touched.location && (formik.errors.location as string)
                        }
                        startContent={
                          !formik.values.location ? (
                            <HiOutlineLocationMarker className="text-default-400 size-4 shrink-0" />
                          ) : undefined
                        }
                        renderValue={(items) => {
                          return items.map((item) => {
                            const loc = locations.find((l) => l._id === item.key);
                            const locIdx = locations.findIndex((l) => l._id === item.key);
                            const locColor = getLocationColor(loc?._id, locIdx >= 0 ? locIdx : undefined);
                            return (
                              <div key={item.key} className="flex items-center gap-2.5 min-w-0">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                                  style={{ backgroundColor: locColor }}
                                />
                                <span className="text-xs font-medium text-foreground truncate">
                                  {loc?.name || item.textValue}
                                </span>
                              </div>
                            );
                          });
                        }}
                        popoverProps={{
                          disableAnimation: true,
                          classNames: {
                            content: "p-0 shadow-xl rounded-xl border border-foreground/10 overflow-hidden bg-background text-foreground",
                          },
                        }}
                        listboxProps={{
                          topContent: (
                            <div className="px-3.5 py-2 border-b border-foreground/10 bg-foreground/[0.02]">
                              <span className="text-[10px] font-bold text-foreground/50 tracking-wider uppercase">
                                Select Practice Location
                              </span>
                            </div>
                          ),
                          itemClasses: {
                            base: "rounded-lg py-2 px-2.5 data-[hover=true]:bg-foreground/5 data-[selectable=true]:focus:bg-foreground/5",
                          },
                        }}
                      >
                        {locations.map((loc, index) => {
                          const locColor = getLocationColor(loc._id, index);
                          const locAddress = [loc.address?.city, loc.address?.state].filter(Boolean).join(", ");
                          return (
                            <SelectItem key={loc._id} textValue={loc.name}>
                              <div className="flex items-start gap-2.5 min-w-0 pr-1">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0 mt-1 shadow-xs"
                                  style={{ backgroundColor: locColor }}
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-semibold leading-tight text-foreground truncate">
                                    {loc.name}
                                  </p>
                                  {locAddress && (
                                    <p className="text-[10px] text-foreground/60 leading-tight truncate mt-0.5 font-normal">
                                      {locAddress}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </Select>
                    ) : (
                      <Input
                        label="Location"
                        labelPlacement="outside"
                        placeholder="Enter location (City, State, etc.)"
                        variant="flat"
                        size="sm"
                        radius="md"
                        name="location"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={!!(formik.touched.location && formik.errors.location)}
                        errorMessage={
                          formik.touched.location && (formik.errors.location as string)
                        }
                        startContent={
                          <HiOutlineLocationMarker className="text-default-400 size-4" />
                        }
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Lead Details Card */}
              <div className="border border-foreground/10 rounded-xl p-3.5 sm:p-4 space-y-3.5 bg-foreground/[0.01]">
                <h4 className="font-semibold text-xs text-foreground/70 uppercase tracking-wider">
                  Lead Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Select
                    label="Lead Source"
                    labelPlacement="outside"
                    placeholder="Select source"
                    variant="flat"
                    size="sm"
                    radius="md"
                    disableAnimation
                    selectedKeys={formik.values.source ? [formik.values.source] : []}
                    onSelectionChange={(keys) =>
                      formik.setFieldValue(
                        "source",
                        Array.from(keys)[0] as string,
                      )
                    }
                    onBlur={() => formik.setFieldTouched("source", true)}
                    isInvalid={
                      !!(formik.touched.source && formik.errors.source)
                    }
                    errorMessage={
                      formik.touched.source && (formik.errors.source as string)
                    }
                    isRequired
                    popoverProps={{ disableAnimation: true }}
                  >
                    {LEAD_SOURCES.map((source) => (
                      <SelectItem key={source.key} textValue={source.label}>
                        {source.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Priority Level"
                    labelPlacement="outside"
                    placeholder="Select priority"
                    variant="flat"
                    size="sm"
                    radius="md"
                    disableAnimation
                    selectedKeys={formik.values.priority ? [formik.values.priority] : []}
                    onSelectionChange={(keys) =>
                      formik.setFieldValue(
                        "priority",
                        Array.from(keys)[0] as string,
                      )
                    }
                    onBlur={() => formik.setFieldTouched("priority", true)}
                    isInvalid={
                      !!(formik.touched.priority && formik.errors.priority)
                    }
                    errorMessage={
                      formik.touched.priority &&
                      (formik.errors.priority as string)
                    }
                    isRequired
                    popoverProps={{ disableAnimation: true }}
                  >
                    {LEAD_PRIORITIES.map((priority) => (
                      <SelectItem key={priority.key} textValue={priority.label}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Assign To"
                    labelPlacement="outside"
                    placeholder="Select staff member"
                    variant="flat"
                    size="sm"
                    radius="md"
                    disableAnimation
                    selectedKeys={formik.values.assignedTo ? [formik.values.assignedTo] : []}
                    onSelectionChange={(keys) =>
                      formik.setFieldValue(
                        "assignedTo",
                        Array.from(keys)[0] as string,
                      )
                    }
                    startContent={
                      loadingTeam ? (
                        <LuBriefcase className="text-default-400 size-4 animate-pulse mr-1" />
                      ) : (
                        <LuBriefcase className="text-default-400 size-4 mr-1" />
                      )
                    }
                    popoverProps={{ disableAnimation: true }}
                  >
                    {[
                      { _id: "Unassigned", firstName: "Unassigned", lastName: "" },
                      ...(teamMembers?.data || []),
                    ].map((member: any) => (
                      <SelectItem
                        key={member._id}
                        textValue={
                          member._id === "Unassigned"
                            ? "Unassigned"
                            : `${member.firstName} ${member.lastName}`
                        }
                      >
                        {member._id === "Unassigned"
                          ? "Unassigned"
                          : `${member.firstName} ${member.lastName}`}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    label="Estimated Value"
                    labelPlacement="outside"
                    placeholder="0"
                    variant="flat"
                    size="sm"
                    radius="md"
                    type="number"
                    min={0}
                    max={100000}
                    name="estimatedValue"
                    id="lead_estimated_value"
                    value={formik.values.estimatedValue}
                    onValueChange={(val) => {
                      if (val === "") {
                        formik.setFieldValue("estimatedValue", "");
                        return;
                      }
                      const cleanVal = val.replace(/[^0-9.]/g, "");
                      const num = parseFloat(cleanVal);
                      if (isNaN(num)) {
                        formik.setFieldValue("estimatedValue", "");
                      } else if (num < 0) {
                        formik.setFieldValue("estimatedValue", "0");
                      } else if (num > 100000) {
                        formik.setFieldValue("estimatedValue", "100000");
                      } else {
                        formik.setFieldValue("estimatedValue", cleanVal);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                        e.preventDefault();
                      }
                    }}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      !!(
                        formik.touched.estimatedValue &&
                        formik.errors.estimatedValue
                      )
                    }
                    errorMessage={
                      formik.touched.estimatedValue &&
                      formik.errors.estimatedValue
                    }
                    startContent={
                      <span className="text-default-400 text-sm mr-1">$</span>
                    }
                  />
                </div>
              </div>

              {/* Treatment Interest Card */}
              <div className="border border-foreground/10 rounded-xl p-3.5 sm:p-4 space-y-3.5 bg-foreground/[0.01]">
                <h4 className="font-semibold text-xs text-foreground/70 uppercase tracking-wider">
                  Treatment Interest
                </h4>
                <div className="space-y-3">
                  <Select
                    label="Select Treatments"
                    labelPlacement="outside"
                    placeholder="Select options..."
                    variant="flat"
                    size="sm"
                    radius="md"
                    selectionMode="multiple"
                    disableAnimation
                    popoverProps={{ disableAnimation: true }}
                    onSelectionChange={(keys) =>
                      setSelectedTreatments(
                        new Set(Array.from(keys) as string[]),
                      )
                    }
                    selectedKeys={selectedTreatments}
                    items={LEAD_TREATMENTS}
                  >
                    {(treatment) => (
                      <SelectItem key={treatment.key}>
                        {treatment.label}
                      </SelectItem>
                    )}
                  </Select>
                  {selectedTreatments.size > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {Array.from(selectedTreatments).map((treatment) => (
                        <Chip
                          key={treatment}
                          variant="flat"
                          size="sm"
                          className="bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 font-semibold border-none h-7 px-3"
                          onClose={() => removeTreatment(treatment)}
                        >
                          {formatTreatmentLabel(treatment)}
                        </Chip>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tags Card */}
              <div className="border border-foreground/10 rounded-xl p-3.5 sm:p-4 space-y-3.5 bg-foreground/[0.01]">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-xs text-foreground/70 uppercase tracking-wider">
                    Tags
                  </h4>
                  <span className="text-[11px] text-foreground/50">
                    {tags.length}/5 tags
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      labelPlacement="outside"
                      placeholder={tags.length >= 5 ? "Maximum 5 tags reached" : "Add custom tag..."}
                      variant="flat"
                      size="sm"
                      radius="md"
                      className="flex-1"
                      value={tagInput}
                      onValueChange={setTagInput}
                      isDisabled={tags.length >= 5}
                      onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                    />
                    <Button
                      size="sm"
                      variant="flat"
                      radius="md"
                      className="font-medium px-4 h-8"
                      onPress={handleAddTag}
                      isDisabled={tags.length >= 5 || !tagInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Chip
                          key={tag}
                          variant="flat"
                          size="sm"
                          className="bg-default-100 text-default-600 font-medium h-7"
                          onClose={() => removeTag(tag)}
                        >
                          {tag}
                        </Chip>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Notes Card */}
              <div className="border border-foreground/10 rounded-xl p-3.5 sm:p-4 space-y-3.5 bg-foreground/[0.01]">
                <h4 className="font-semibold text-xs text-foreground/70 uppercase tracking-wider">
                  Additional Notes
                </h4>
                <Textarea
                  labelPlacement="outside"
                  placeholder="Add any additional details..."
                  variant="flat"
                  size="sm"
                  radius="md"
                  minRows={3}
                  maxLength={200}
                  name="notes"
                  id="lead_notes"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.touched.notes && formik.errors.notes)}
                  errorMessage={formik.touched.notes && (formik.errors.notes as string)}
                  description={`${formik.values.notes?.length || 0}/200 characters`}
                />
              </div>
            </ModalBody>

            <ModalFooter className="px-5 py-3.5 border-t border-foreground/10 shrink-0 bg-background flex items-center justify-end gap-2.5">
              <Button
                size="sm"
                radius="md"
                variant="flat"
                color="default"
                onPress={onClose}
                className="font-medium"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                radius="md"
                variant="solid"
                color="primary"
                type="submit"
                isLoading={submitting}
                startContent={!submitting && <FiPlus className="text-[15px]" />}
                isDisabled={submitting || !formik.isValid || !formik.dirty}
                className="font-semibold px-4"
              >
                Add Lead
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddLeadModal;
