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
} from "@heroui/react";
import {
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineCurrencyDollar,
} from "react-icons/hi";
import { LuUser, LuMapPin, LuTag, LuBriefcase } from "react-icons/lu";

interface AddLeadModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const AddLeadModal = ({ isOpen, onOpenChange }: AddLeadModalProps) => {
    const [selectedTreatments, setSelectedTreatments] = useState<Set<string>>(new Set(["Retainers", "Teeth Whitening", "Emergency Orthodontics"]));
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");

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
            size="2xl"
            scrollBehavior="inside"
            className="max-h-[90vh]"
            backdrop="opaque"
            classNames={{
                base: "rounded-xl",
                header: "border-b-0 pb-0",
                footer: "border-t gap-3",
            }}
        >
            <ModalContent className="w-[500px]">
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 px-8 pt-8">
                            <h2 className="text-lg font-bold tracking-tight">Add New Lead</h2>
                            <p className="text-sm font-normal text-gray-500">
                                Manually add a new patient lead to your pipeline
                            </p>
                        </ModalHeader>
                        <ModalBody className="px-8 py-6 space-y-8">
                            {/* Contact Information */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 font-bold text-sm text-foreground/80">
                                    <LuUser className="size-4 text-gray-500" />
                                    <h3 className="uppercase tracking-wider text-[11px]">Contact Information</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-gray-600 ml-0.5">First Name *</label>
                                        <Input
                                            placeholder="John"
                                            variant="flat"
                                            size="sm"
                                            classNames={{
                                                inputWrapper: "bg-gray-50/80 hover:bg-gray-100/80 transition-background",
                                                input: "text-sm",
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-gray-600 ml-0.5">Last Name *</label>
                                        <Input
                                            placeholder="Doe"
                                            variant="flat"
                                            size="sm"
                                            classNames={{
                                                inputWrapper: "bg-gray-50/80 hover:bg-gray-100/80 transition-background",
                                                input: "text-sm",
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-gray-600 ml-0.5">Email *</label>
                                        <Input
                                            placeholder="john.doe@email.com"
                                            variant="flat"
                                            size="sm"
                                            startContent={<HiOutlineMail className="text-gray-400 size-4" />}
                                            classNames={{
                                                inputWrapper: "bg-gray-50/80 hover:bg-gray-100/80 transition-background",
                                                input: "text-sm",
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-gray-600 ml-0.5">Phone *</label>
                                        <Input
                                            placeholder="(555) 123-4567"
                                            variant="flat"
                                            size="sm"
                                            startContent={<HiOutlinePhone className="text-gray-400 size-4" />}
                                            classNames={{
                                                inputWrapper: "bg-gray-50/80 hover:bg-gray-100/80 transition-background",
                                                input: "text-sm",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Lead Details */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 font-bold text-sm text-foreground/80">
                                    <LuMapPin className="size-4 text-gray-500" />
                                    <h3 className="uppercase tracking-wider text-[11px]">Lead Details</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-gray-600 ml-0.5">Lead Source *</label>
                                        <Select
                                            placeholder="Instagram"
                                            variant="flat"
                                            size="sm"
                                            defaultSelectedKeys={["Instagram"]}
                                            classNames={{
                                                trigger: "bg-gray-50/80 hover:bg-gray-100/80",
                                                value: "text-sm",
                                            }}
                                            listboxProps={{ itemClasses: orangeItemClasses }}
                                        >
                                            <SelectItem key="Google Ads">Google Ads</SelectItem>
                                            <SelectItem key="Facebook Ads">Facebook Ads</SelectItem>
                                            <SelectItem key="Instagram">Instagram</SelectItem>
                                            <SelectItem key="Referral">Referral</SelectItem>
                                            <SelectItem key="Website">Website</SelectItem>
                                            <SelectItem key="Walk-in">Walk-in</SelectItem>
                                            <SelectItem key="Direct Mail">Direct Mail</SelectItem>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-gray-600 ml-0.5">Priority *</label>
                                        <Select
                                            placeholder="Medium Priority"
                                            variant="flat"
                                            size="sm"
                                            defaultSelectedKeys={["Medium"]}
                                            classNames={{
                                                trigger: "bg-gray-50/80 hover:bg-gray-100/80",
                                                value: "text-sm",
                                            }}
                                            listboxProps={{ itemClasses: orangeItemClasses }}
                                        >
                                            <SelectItem key="High">High Priority</SelectItem>
                                            <SelectItem key="Medium">Medium Priority</SelectItem>
                                            <SelectItem key="Low">Low Priority</SelectItem>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-gray-600 ml-0.5">Assign To</label>
                                        <Select
                                            placeholder="Unassigned"
                                            variant="flat"
                                            size="sm"
                                            defaultSelectedKeys={["Unassigned"]}
                                            startContent={<LuBriefcase className="text-gray-400 size-4 mr-1" />}
                                            classNames={{
                                                trigger: "bg-gray-50/80 hover:bg-gray-100/80",
                                                value: "text-sm",
                                            }}
                                            listboxProps={{ itemClasses: orangeItemClasses }}
                                        >
                                            <SelectItem key="Unassigned">Unassigned</SelectItem>
                                            <SelectItem key="Dr. Smith">Dr. Smith</SelectItem>
                                            <SelectItem key="Sarah Wilson">Sarah Wilson</SelectItem>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-gray-600 ml-0.5">Estimated Value</label>
                                        <Input
                                            placeholder="0"
                                            variant="flat"
                                            size="sm"
                                            type="number"
                                            startContent={<span className="text-gray-400 text-sm mr-1">$</span>}
                                            classNames={{
                                                inputWrapper: "bg-gray-50/80 hover:bg-gray-100/80 transition-background",
                                                input: "text-sm",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Treatment Interest */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 font-bold text-sm text-foreground/80">
                                    <h3 className="font-bold text-sm">Treatment Interest</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-gray-600 ml-0.5">Select Treatments</label>
                                        <Select
                                            placeholder="Select treatment options..."
                                            variant="flat"
                                            size="sm"
                                            selectionMode="multiple"
                                            classNames={{
                                                trigger: "bg-gray-50/80 hover:bg-gray-100/80",
                                                value: "text-sm",
                                            }}
                                            onSelectionChange={(keys) => setSelectedTreatments(new Set(Array.from(keys) as string[]))}
                                            selectedKeys={selectedTreatments}
                                            listboxProps={{ itemClasses: orangeItemClasses }}
                                        >
                                            <SelectItem key="Invisalign">Invisalign</SelectItem>
                                            <SelectItem key="Invisalign Teen">Invisalign Teen</SelectItem>
                                            <SelectItem key="Traditional Braces">Traditional Braces</SelectItem>
                                            <SelectItem key="Retainers">Retainers</SelectItem>
                                            <SelectItem key="Teeth Whitening">Teeth Whitening</SelectItem>
                                            <SelectItem key="Emergency Orthodontics">Emergency Orthodontics</SelectItem>
                                        </Select>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {Array.from(selectedTreatments).map((treatment) => (
                                            <Chip
                                                key={treatment}
                                                variant="flat"
                                                size="sm"
                                                className="bg-sky-50 text-sky-600 font-bold border-none h-7 px-3"
                                                onClose={() => removeTreatment(treatment)}
                                            >
                                                {treatment}
                                            </Chip>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 font-bold text-sm text-foreground/80">
                                    <LuTag className="size-4 text-gray-500" />
                                    <h3 className="uppercase tracking-wider text-[11px]">Tags</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <Input
                                            placeholder="Add custom tag..."
                                            variant="flat"
                                            size="sm"
                                            className="flex-1"
                                            value={tagInput}
                                            onValueChange={setTagInput}
                                            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                                            classNames={{
                                                inputWrapper: "bg-gray-50/80 hover:bg-gray-100/80",
                                                input: "text-sm",
                                            }}
                                        />
                                        <Button
                                            size="sm"
                                            variant="bordered"
                                            className="bg-white border-gray-200 font-bold text-gray-600 px-6 px-4"
                                            onPress={handleAddTag}
                                        >
                                            Add Tag
                                        </Button>
                                    </div>
                                    {tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map((tag) => (
                                                <Chip
                                                    key={tag}
                                                    variant="flat"
                                                    size="sm"
                                                    className="bg-gray-100 text-gray-600 font-bold h-7"
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
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 font-bold text-sm text-foreground/80">
                                    <h3 className="font-bold text-sm">Notes</h3>
                                </div>
                                <Textarea
                                    placeholder="Add any additional notes about this lead..."
                                    variant="flat"
                                    size="sm"
                                    minRows={3}
                                    classNames={{
                                        inputWrapper: "bg-gray-50/80 hover:bg-gray-100/80 px-4 py-3",
                                        input: "text-sm",
                                    }}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter className="px-8 py-6">
                            <Button
                                variant="light"
                                onPress={onClose}
                                className="font-bold text-gray-500 px-6"
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onPress={onClose}
                                className="font-bold px-10 bg-sky-500"
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

