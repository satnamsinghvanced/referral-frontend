import React, { useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Select,
    SelectItem,
    Textarea,
    Chip,
    Skeleton,
} from "@heroui/react";
import {
    HiOutlineMail,
    HiOutlinePhone,
} from "react-icons/hi";
import { LuBriefcase } from "react-icons/lu";
import { FiPlus } from "react-icons/fi";
import { useAddLead } from "../../../hooks/useLeadTracking";
import { LEAD_SOURCE, LEAD_PRIORITY, LEAD_TREATMENTS } from "../../../consts/LeadTrackingConstants";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
import { useFormik } from "formik";
import * as Yup from "yup";
import { EMAIL_REGEX, PHONE_REGEX } from "../../../consts/consts";
import { useFetchTeamMembers } from "../../../hooks/settings/useTeam";

const orangeItemClasses = {
    base: [
        "data-[hover=true]:!bg-orange-100",
        "data-[hover=true]:!text-orange-600",
        "data-[selected=true]:!bg-orange-100",
        "data-[selected=true]:!text-orange-600",
        "data-[focus=true]:!bg-orange-100",
        "data-[focus=true]:!text-orange-600",
    ],
};

const formatTreatmentLabel = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

interface AddLeadModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const AddLeadModal = ({ isOpen, onOpenChange }: AddLeadModalProps) => {
    const { mutateAsync: addLead, isPending: submitting } = useAddLead();
    const { data: teamMembers, isLoading: loadingTeam } = useFetchTeamMembers();

    const [selectedTreatments, setSelectedTreatments] = useState<Set<string>>(new Set());
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required("First name is required"),
        lastName: Yup.string().required("Last name is required"),
        email: Yup.string()
            .required("Email is required")
            .matches(EMAIL_REGEX, "Invalid email format"),
        phone: Yup.string()
            .required("Phone is required")
            .matches(PHONE_REGEX, "Phone must be in format (XXX) XXX-XXXX"),
        source: Yup.string().required("Source is required"),
        priority: Yup.string().required("Priority is required"),
        estimatedValue: Yup.number().typeError("Value must be a number").nullable(),
    });

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            source: "website",
            priority: "medium",
            assignedTo: "Unassigned",
            estimatedValue: "",
            notes: "",
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const payload = {
                    ...values,
                    estimatedValue: Number(values.estimatedValue) || 0,
                    assignedTo: (values.assignedTo === "Unassigned" || !/^[0-9a-fA-F]{24}$/.test(values.assignedTo)) ? null : values.assignedTo,
                    treatments: Array.from(selectedTreatments),
                    tags: tags,
                    status: "newLead"
                };

                await addLead(payload);
                onOpenChange(false);
                resetForm();
                setSelectedTreatments(new Set());
                setTags([]);
            } catch (error: any) {
                // Error is handled by the hook
            }
        }
    });

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTreatment = (treatment: string) => {
        const newSet = new Set(selectedTreatments);
        newSet.delete(treatment);
        setSelectedTreatments(newSet);
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="md"
            placement="center"
            scrollBehavior="inside"
            classNames={{
                base: "max-sm:!m-3 !m-0",
                closeButton: "cursor-pointer",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 px-4">
                            <h4 className="text-base font-medium dark:text-white">Add New Lead</h4>
                            <p className="text-xs text-gray-500 font-normal dark:text-foreground/60">
                                Enter the patient lead information into your pipeline
                            </p>
                        </ModalHeader>
                        <ModalBody className="py-0 px-4 gap-3">
                            {/* Contact Information */}
                            <div className="border border-foreground/10 rounded-xl p-4 space-y-3">
                                <h4 className="font-medium text-sm dark:text-white">
                                    Contact Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2.5 gap-y-4">
                                    <Input
                                        label="First Name"
                                        labelPlacement="outside"
                                        placeholder="Enter first name"
                                        variant="flat"
                                        size="sm"
                                        radius="sm"
                                        name="firstName"
                                        value={formik.values.firstName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={!!(formik.touched.firstName && formik.errors.firstName)}
                                        errorMessage={formik.touched.firstName && (formik.errors.firstName as string)}
                                        isRequired
                                    />
                                    <Input
                                        label="Last Name"
                                        labelPlacement="outside"
                                        placeholder="Enter last name"
                                        variant="flat"
                                        size="sm"
                                        radius="sm"
                                        name="lastName"
                                        value={formik.values.lastName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={!!(formik.touched.lastName && formik.errors.lastName)}
                                        errorMessage={formik.touched.lastName && (formik.errors.lastName as string)}
                                        isRequired
                                    />
                                    <Input
                                        label="Email Address"
                                        labelPlacement="outside"
                                        placeholder="example@email.com"
                                        variant="flat"
                                        size="sm"
                                        radius="sm"
                                        name="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={!!(formik.touched.email && formik.errors.email)}
                                        errorMessage={formik.touched.email && (formik.errors.email as string)}
                                        startContent={<HiOutlineMail className="text-default-400 size-4" />}
                                        isRequired
                                    />
                                    <Input
                                        label="Phone Number"
                                        labelPlacement="outside"
                                        placeholder="(XXX) XXX-XXXX"
                                        variant="flat"
                                        size="sm"
                                        radius="sm"
                                        name="phone"
                                        value={formik.values.phone}
                                        onValueChange={(val) => formik.setFieldValue("phone", formatPhoneNumber(val))}
                                        onBlur={formik.handleBlur}
                                        isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                                        errorMessage={formik.touched.phone && (formik.errors.phone as string)}
                                        startContent={<HiOutlinePhone className="text-default-400 size-4" />}
                                        isRequired
                                    />
                                </div>
                            </div>

                            {/* Lead Details */}
                            <div className="border border-foreground/10 rounded-xl p-4 space-y-3">
                                <h4 className="font-medium text-sm dark:text-white">
                                    Lead Details
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2.5 gap-y-4">
                                    <Select
                                        label="Lead Source"
                                        labelPlacement="outside"
                                        placeholder="Select source"
                                        variant="flat"
                                        size="sm"
                                        radius="sm"
                                        selectedKeys={new Set([formik.values.source])}
                                        onSelectionChange={(keys) => formik.setFieldValue("source", Array.from(keys)[0] as string)}
                                        onBlur={() => formik.setFieldTouched("source", true)}
                                        isInvalid={!!(formik.touched.source && formik.errors.source)}
                                        errorMessage={formik.touched.source && (formik.errors.source as string)}
                                        isRequired
                                        listboxProps={{ itemClasses: orangeItemClasses }}
                                        items={Object.entries(LEAD_SOURCE).map(([id, label]) => ({ id, label }))}
                                    >
                                        {(item) => (
                                            <SelectItem key={item.id} textValue={item.label}>
                                                {item.label}
                                            </SelectItem>
                                        )}
                                    </Select>
                                    <Select
                                        label="Priority Level"
                                        labelPlacement="outside"
                                        placeholder="Select priority"
                                        variant="flat"
                                        size="sm"
                                        radius="sm"
                                        selectedKeys={new Set([formik.values.priority])}
                                        onSelectionChange={(keys) => formik.setFieldValue("priority", Array.from(keys)[0] as string)}
                                        onBlur={() => formik.setFieldTouched("priority", true)}
                                        isInvalid={!!(formik.touched.priority && formik.errors.priority)}
                                        errorMessage={formik.touched.priority && (formik.errors.priority as string)}
                                        isRequired
                                        listboxProps={{ itemClasses: orangeItemClasses }}
                                        items={Object.entries(LEAD_PRIORITY).map(([id, label]) => ({ id, label }))}
                                    >
                                        {(item) => (
                                            <SelectItem key={item.id} textValue={`${item.label} Priority`}>
                                                {item.label} Priority
                                            </SelectItem>
                                        )}
                                    </Select>
                                    <Select
                                        label="Assign To"
                                        labelPlacement="outside"
                                        placeholder="Select staff member"
                                        variant="flat"
                                        size="sm"
                                        radius="sm"
                                        selectedKeys={new Set([formik.values.assignedTo])}
                                        onSelectionChange={(keys) => formik.setFieldValue("assignedTo", Array.from(keys)[0] as string)}
                                        startContent={loadingTeam ? <LuBriefcase className="text-default-400 size-4 animate-pulse mr-1" /> : <LuBriefcase className="text-default-400 size-4 mr-1" />}
                                        listboxProps={{ itemClasses: orangeItemClasses }}
                                        items={[
                                            { _id: "Unassigned", name: "Unassigned" },
                                            ...(teamMembers?.data || []).map((m) => ({ _id: m._id, name: `${m.firstName} ${m.lastName}` }))
                                        ]}
                                    >
                                        {(item) => (
                                            <SelectItem key={item._id}>
                                                {item.name}
                                            </SelectItem>
                                        )}
                                    </Select>
                                    <Input
                                        label="Estimated Value"
                                        labelPlacement="outside"
                                        placeholder="0"
                                        variant="flat"
                                        size="sm"
                                        radius="sm"
                                        type="number"
                                        name="estimatedValue"
                                        value={formik.values.estimatedValue}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={!!(formik.touched.estimatedValue && formik.errors.estimatedValue)}
                                        errorMessage={formik.touched.estimatedValue && formik.errors.estimatedValue}
                                        startContent={<span className="text-default-400 text-sm mr-1">$</span>}
                                    />
                                </div>
                            </div>

                            {/* Treatment Interest */}
                            <div className="border border-foreground/10 rounded-xl p-4 space-y-3">
                                <h4 className="font-medium text-sm dark:text-white">
                                    Treatment Interest
                                </h4>
                                <div className="space-y-3">
                                    <Select
                                        label="Select Treatments"
                                        labelPlacement="outside"
                                        placeholder="Select options..."
                                        variant="flat"
                                        size="sm"
                                        radius="sm"
                                        selectionMode="multiple"
                                        onSelectionChange={(keys) => setSelectedTreatments(new Set(Array.from(keys) as string[]))}
                                        selectedKeys={selectedTreatments}
                                        listboxProps={{ itemClasses: orangeItemClasses }}
                                    >
                                        {Object.entries(LEAD_TREATMENTS).map(([key, label]) => (
                                            <SelectItem key={key}>{label}</SelectItem>
                                        ))}
                                    </Select>
                                    {selectedTreatments.size > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {Array.from(selectedTreatments).map((treatment) => (
                                                <Chip
                                                    key={treatment}
                                                    variant="flat"
                                                    size="sm"
                                                    className="bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 font-bold border-none h-7 px-3"
                                                    onClose={() => removeTreatment(treatment)}
                                                >
                                                    {formatTreatmentLabel(treatment)}
                                                </Chip>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="border border-foreground/10 rounded-xl p-4 space-y-3">
                                <h4 className="font-medium text-sm dark:text-white">
                                    Tags
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <Input
                                            labelPlacement="outside"
                                            placeholder="Add custom tag..."
                                            variant="flat"
                                            size="sm"
                                            radius="sm"
                                            className="flex-1"
                                            value={tagInput}
                                            onValueChange={setTagInput}
                                            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                                        />
                                        <Button
                                            size="sm"
                                            variant="flat"
                                            radius="sm"
                                            className="font-bold px-4 h-8"
                                            onPress={handleAddTag}
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
                                                    className="bg-default-100 text-default-600 font-bold h-7"
                                                    onClose={() => removeTag(tag)}
                                                >
                                                    {tag}
                                                </Chip>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="border border-foreground/10 rounded-xl p-4 space-y-3">
                                <h4 className="font-medium text-sm dark:text-white">
                                    Additional Notes
                                </h4>
                                <Textarea
                                    labelPlacement="outside"
                                    placeholder="Add any additional details..."
                                    variant="flat"
                                    size="sm"
                                    radius="sm"
                                    minRows={3}
                                    name="notes"
                                    value={formik.values.notes}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter className="px-4">
                            <Button
                                size="sm"
                                radius="sm"
                                variant="ghost"
                                color="default"
                                onPress={onClose}
                                className="border-small"
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                radius="sm"
                                variant="solid"
                                color="primary"
                                onPress={() => formik.handleSubmit()}
                                isLoading={submitting}
                                startContent={!submitting && <FiPlus className="text-[15px]" />}
                                isDisabled={submitting || !formik.isValid || !formik.dirty}
                            >
                                Add Lead
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default AddLeadModal;

