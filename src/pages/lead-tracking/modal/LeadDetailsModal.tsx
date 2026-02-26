import React, { useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
    Chip,
    Tabs,
    Tab,
    Input,
    Select,
    SelectItem,
    Progress,
    Avatar,
    Textarea,
    Divider
} from "@heroui/react";
import {
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineChat,
    HiOutlinePencil,
    HiOutlineCalendar,
    HiOutlineClock,
    HiOutlineGlobeAlt,
    HiOutlineUser,
    HiOutlineCurrencyDollar,
    HiOutlinePlus,
    HiOutlineInbox,
    HiOutlinePhoneIncoming,
    HiOutlineChartBar
} from "react-icons/hi";
import { LuHistory, LuTarget, LuMousePointer2, LuBriefcase } from "react-icons/lu";
import { useFetchTeamMembers } from "../../../hooks/settings/useTeam";

interface LeadDetailsModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    lead: any;
}

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

import { useFormik } from "formik";
import { useUpdateLead } from "../../../hooks/useLeadTracking";
import { LEAD_SOURCE, LEAD_PRIORITY, LEAD_STATUS } from "../../../consts/LeadTrackingConstants";

const LeadDetailsModal = ({ isOpen, onOpenChange, lead }: LeadDetailsModalProps) => {
    const { data: teamMembers, isLoading: loadingTeam } = useFetchTeamMembers();
    const { mutateAsync: updateLead, isPending: updating } = useUpdateLead();
    const [isEditing, setIsEditing] = useState(false);

    const formik = useFormik({
        initialValues: {
            status: lead?.l_status || lead?.status || "newLead",
            priority: lead?.priority?.toLowerCase() || "medium",
            assignedTo: lead?.assignedTo || "Unassigned",
            estimatedValue: lead?.estimatedValue || 0,
            notes: lead?.notes || "",
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                await updateLead({
                    id: lead.id || lead._id,
                    data: {
                        ...values,
                        estimatedValue: Number(values.estimatedValue),
                        assignedTo: (values.assignedTo === "Unassigned" || !/^[0-9a-fA-F]{24}$/.test(values.assignedTo)) ? null : values.assignedTo,
                    }
                });
                setIsEditing(false);
            } catch (error) {
                // Error handled by hook
            }
        }
    });

    if (!lead) return null;

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="3xl"
            scrollBehavior="inside"
            classNames={{
                base: "max-h-[90vh]",
                header: "border-b border-divider px-8 py-2",
                body: "px-8 py-4",
                wrapper: "overflow-hidden"
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex justify-between items-start w-full">
                                <div className="space-y-3">
                                    <h2 className="text-2xl font-bold text-foreground">
                                        {lead.firstName} {lead.lastName}
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <Chip
                                            variant="flat"
                                            size="sm"
                                            className="font-bold bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-foreground/60 border-none"
                                        >
                                            {LEAD_STATUS[formik.values.status as keyof typeof LEAD_STATUS]?.name || lead.status}
                                        </Chip>
                                        <Chip
                                            variant="flat"
                                            size="sm"
                                            className="font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border-none px-3"
                                        >
                                            {formik.values.priority.charAt(0).toUpperCase() + formik.values.priority.slice(1)} Priority
                                        </Chip>
                                        <span className="text-sm text-gray-500 dark:text-foreground/60">
                                            Lead Score: <span className="font-bold text-gray-700 dark:text-foreground">{lead.score || 0}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {isEditing ? (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="light"
                                                onPress={() => {
                                                    formik.resetForm();
                                                    setIsEditing(false);
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                size="sm"
                                                color="primary"
                                                onPress={() => formik.handleSubmit()}
                                                isLoading={updating}
                                                isDisabled={!formik.dirty}
                                            >
                                                Save Changes
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="bordered"
                                            startContent={<HiOutlinePencil className="size-4" />}
                                            className="font-medium"
                                            onPress={() => setIsEditing(true)}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <Tabs
                                aria-label="Lead Details Tabs"
                                variant="underlined"
                                classNames={{
                                    tabList: "gap-8 w-full relative rounded-none p-0 border-b border-divider overflow-x-auto overflow-y-hidden",
                                    cursor: "w-full bg-primary",
                                    tab: "max-w-fit px-0 h-12",
                                    tabContent: "group-data-[selected=true]:text-primary font-medium"
                                }}
                            >
                                <Tab key="overview" title="Overview">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
                                        {/* Contact Information */}
                                        <div className="lg:col-span-6 space-y-4">
                                            <div className="p-6 border border-divider rounded-2xl space-y-6 bg-content1/50 dark:bg-content1/20">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <HiOutlineUser className="size-5 text-gray-400 dark:text-foreground/40" />
                                                    <h3 className="font-bold text-base text-foreground">Contact Information</h3>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg">
                                                            <HiOutlineMail className="size-5 text-gray-400 dark:text-foreground/40" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium">Email</p>
                                                            <p className="text-sm font-bold text-foreground">{lead.email}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-4">
                                                        <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg">
                                                            <HiOutlinePhone className="size-5 text-gray-400 dark:text-foreground/40" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium">Phone</p>
                                                            <p className="text-sm font-bold text-foreground">{lead.phone}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-3 mt-6">
                                                    <Button fullWidth variant="bordered" startContent={<HiOutlinePhone className="size-4" />} className="justify-start font-medium text-gray-700 dark:text-foreground/80">Call via Twilio</Button>
                                                    <Button fullWidth variant="bordered" startContent={<HiOutlineMail className="size-4" />} className="justify-start font-medium text-gray-700 dark:text-foreground/80">Send Email</Button>
                                                    <Button fullWidth variant="bordered" startContent={<HiOutlineChat className="size-4" />} className="justify-start font-medium text-gray-700 dark:text-foreground/80">Send SMS</Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Lead Details */}
                                        <div className="lg:col-span-6 space-y-4">
                                            <div className="p-6 border border-divider rounded-2xl space-y-6 bg-content1/50 dark:bg-content1/20">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <LuTarget className="size-5 text-gray-400 dark:text-foreground/40" />
                                                    <h3 className="font-bold text-base text-foreground">Lead Details</h3>
                                                </div>

                                                <div className="grid grid-cols-1 gap-6">
                                                    <Select
                                                        label="Status"
                                                        variant="bordered"
                                                        size="sm"
                                                        isDisabled={!isEditing}
                                                        selectedKeys={new Set([formik.values.status])}
                                                        onSelectionChange={(keys) => formik.setFieldValue("status", Array.from(keys)[0])}
                                                    >
                                                        {Object.entries(LEAD_STATUS).map(([key, value]) => (
                                                            <SelectItem key={key}>{value.name}</SelectItem>
                                                        ))}
                                                    </Select>

                                                    <Select
                                                        label="Priority"
                                                        variant="bordered"
                                                        size="sm"
                                                        isDisabled={!isEditing}
                                                        selectedKeys={new Set([formik.values.priority])}
                                                        onSelectionChange={(keys) => formik.setFieldValue("priority", Array.from(keys)[0])}
                                                    >
                                                        {Object.entries(LEAD_PRIORITY).map(([key, label]) => (
                                                            <SelectItem key={key}>{label}</SelectItem>
                                                        ))}
                                                    </Select>

                                                    <Select
                                                        label="Assigned To"
                                                        variant="bordered"
                                                        size="sm"
                                                        isDisabled={!isEditing}
                                                        listboxProps={{ itemClasses: orangeItemClasses }}
                                                        startContent={loadingTeam ? <LuBriefcase className="text-default-400 size-4 animate-pulse mr-1" /> : <LuBriefcase className="text-default-400 size-4 mr-1" />}
                                                        selectedKeys={new Set([formik.values.assignedTo])}
                                                        onSelectionChange={(keys) => formik.setFieldValue("assignedTo", Array.from(keys)[0])}
                                                        items={[
                                                            { _id: "Unassigned", name: "Unassigned" },
                                                            ...(teamMembers?.data || []).map((m: any) => ({ _id: m._id, name: `${m.firstName} ${m.lastName}` }))
                                                        ]}
                                                    >
                                                        {(item: any) => (
                                                            <SelectItem key={item._id}>
                                                                {item.name}
                                                            </SelectItem>
                                                        )}
                                                    </Select>

                                                    <Input
                                                        label="Estimated Value"
                                                        variant="bordered"
                                                        isDisabled={!isEditing}
                                                        value={formik.values.estimatedValue.toString()}
                                                        onValueChange={(val) => formik.setFieldValue("estimatedValue", val)}
                                                        startContent={<HiOutlineCurrencyDollar className="text-gray-400 dark:text-foreground/40" />}
                                                        size="sm"
                                                        type="number"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Treatment Interest */}
                                        <div className="lg:col-span-12">
                                            <div className="p-6 border border-divider rounded-2xl bg-content1/50 dark:bg-content1/20">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <HiOutlinePencil className="size-5 text-gray-400 dark:text-foreground/40" />
                                                    <h3 className="font-bold text-base text-foreground">Treatment Interest</h3>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {lead.treatments?.map((t: string, i: number) => (
                                                        <Chip key={i} variant="flat" size="sm" className="bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 font-bold px-3">
                                                            {t}
                                                        </Chip>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
                                            <div className="p-4 border border-divider rounded-2xl flex items-center gap-4 bg-content1/50 dark:bg-content1/20">
                                                <div className="p-3 bg-blue-50 dark:bg-blue-900/40 text-blue-500 dark:text-blue-400 rounded-xl">
                                                    <HiOutlineClock className="size-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium">Created</p>
                                                    <p className="text-sm font-bold text-foreground">{new Date(lead.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="p-4 border border-divider rounded-2xl flex items-center gap-4 bg-content1/50 dark:bg-content1/20">
                                                <div className="p-3 bg-green-50 dark:bg-green-900/40 text-green-500 dark:text-green-400 rounded-xl">
                                                    <HiOutlineCalendar className="size-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium">Last Contact</p>
                                                    <p className="text-sm font-bold text-foreground">{lead.lastContact ? new Date(lead.lastContact).toLocaleDateString() : 'Never'}</p>
                                                </div>
                                            </div>
                                            <div className="p-4 border border-divider rounded-2xl flex flex-col justify-center gap-2 bg-content1/50 dark:bg-content1/20">
                                                <div className="flex justify-between items-center px-1">
                                                    <span className="text-xs text-gray-400 dark:text-foreground/40 font-medium">Lead Score</span>
                                                    <span className="text-xs font-bold text-foreground">{lead.score || 0}/100</span>
                                                </div>
                                                <Progress size="sm" color="warning" value={lead.score || 0} className="w-full" />
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab key="communication" title="Communication">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-6">
                                        {/* Make a Call */}
                                        <div className="p-5 border border-divider rounded-2xl space-y-4">
                                            <div className="flex items-center gap-2 text-blue-500">
                                                <HiOutlinePhone className="size-5" />
                                                <h4 className="font-bold text-sm">Make a Call</h4>
                                            </div>
                                            <Button fullWidth color="primary" className="font-bold" startContent={<HiOutlinePhoneIncoming />}>
                                                Call {lead.phone}
                                            </Button>
                                        </div>

                                        {/* Send Email */}
                                        <div className="p-5 border border-divider rounded-2xl space-y-4">
                                            <div className="flex items-center gap-2 text-purple-500">
                                                <HiOutlineMail className="size-5" />
                                                <h4 className="font-bold text-sm">Send Email</h4>
                                            </div>
                                            <Textarea placeholder="Type your email message..." minRows={2} variant="flat" />
                                            <Button fullWidth color="secondary" className="font-bold bg-purple-400" startContent={<HiOutlineInbox />}>
                                                Send Email
                                            </Button>
                                        </div>

                                        {/* Send SMS */}
                                        <div className="p-5 border border-divider rounded-2xl space-y-4">
                                            <div className="flex items-center gap-2 text-green-500">
                                                <HiOutlineChat className="size-5" />
                                                <h4 className="font-bold text-sm">Send SMS</h4>
                                            </div>
                                            <Textarea placeholder="Type your SMS message..." minRows={2} variant="flat" />
                                            <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-foreground/40">
                                                <span>0/160</span>
                                                <Button size="sm" color="success" className="font-bold text-white bg-green-400 dark:bg-green-500" startContent={<HiOutlineChat />}>
                                                    Send SMS
                                                </Button>
                                            </div>
                                        </div>

                                        {/* History */}
                                        <div className="lg:col-span-3 mt-4">
                                            <div className="flex items-center gap-2 mb-4 px-2">
                                                <LuHistory className="size-5 text-gray-400 dark:text-foreground/40" />
                                                <h3 className="font-bold text-base text-foreground">Communication History</h3>
                                            </div>
                                            <div className="p-6 border border-divider rounded-2xl space-y-6 bg-content1/50 dark:bg-content1/20">
                                                <div className="flex gap-4">
                                                    <div className="p-2 bg-purple-50 text-purple-500 rounded-full h-fit">
                                                        <HiOutlineMail className="size-6" />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex justify-between items-center">
                                                            <h5 className="font-bold text-sm text-foreground">Inbound Email</h5>
                                                            <span className="text-[10px] text-gray-400 dark:text-foreground/40">742d ago</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-foreground/60 font-medium">Re: Treatment Inquiry</p>
                                                        <p className="text-xs text-gray-400 dark:text-foreground/40 italic">"Thanks but I decided to go with another provider"</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab key="notes" title="Notes & Tasks">
                                    <div className="pt-6 space-y-6">
                                        <div className="p-6 border border-divider rounded-2xl space-y-4 bg-content1/50 dark:bg-content1/20">
                                            <div className="flex items-center gap-2">
                                                <HiOutlinePencil className="size-5 text-gray-400 dark:text-foreground/40" />
                                                <h3 className="font-bold text-base text-foreground">Lead Notes</h3>
                                            </div>
                                            <Textarea
                                                placeholder="Add a new note..."
                                                minRows={3}
                                                variant="flat"
                                                className="bg-gray-50 dark:bg-white/5 rounded-xl"
                                                isDisabled={!isEditing}
                                                name="notes"
                                                value={formik.values.notes}
                                                onChange={formik.handleChange}
                                            />
                                            {isEditing && (
                                                <Button color="primary" variant="flat" startContent={<HiOutlinePlus />} className="font-bold bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400" onPress={() => formik.handleSubmit()}>
                                                    Update Note
                                                </Button>
                                            )}

                                            <div className="mt-6 space-y-4">
                                                <h4 className="font-bold text-sm px-2 text-foreground">Notes History</h4>
                                                <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl">
                                                    <p className="text-xs text-gray-500 dark:text-foreground/60">
                                                        {lead.notes || 'No notes available.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab key="attribution" title="Attribution">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                        <div className="p-6 border border-divider rounded-2xl space-y-6 bg-content1/50 dark:bg-content1/20">
                                            <div className="flex items-center gap-2">
                                                <LuMousePointer2 className="size-5 text-gray-400 dark:text-foreground/40" />
                                                <h3 className="font-bold text-base text-foreground">Lead Source</h3>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium">Primary Source</p>
                                                <Chip variant="flat" className="bg-gray-50 dark:bg-white/5 border border-divider font-bold px-4 text-foreground">
                                                    {LEAD_SOURCE[lead.source as keyof typeof LEAD_SOURCE] || lead.source}
                                                </Chip>
                                            </div>
                                        </div>
                                        <div className="p-6 border border-divider rounded-2xl space-y-6 bg-content1/50 dark:bg-content1/20">
                                            <div className="flex items-center gap-2">
                                                <HiOutlineChartBar className="size-5 text-gray-400 dark:text-foreground/40" />
                                                <h3 className="font-bold text-base text-foreground">Performance Metrics</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium mb-1">Response Time</p>
                                                    <div className="flex items-center gap-2 text-primary">
                                                        <HiOutlineClock className="size-4" />
                                                        <span className="font-bold text-sm">{lead.responseTime || '0'} minutes</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium mb-1">Lead Score</p>
                                                    <Progress size="sm" color={lead.score > 70 ? "success" : lead.score > 40 ? "warning" : "danger"} value={lead.score || 0} className="max-w-md" />
                                                    <div className="flex justify-end mt-1">
                                                        <span className="text-[10px] font-bold text-gray-500 dark:text-foreground/60">{lead.score || 0}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium mb-1">Tags</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {lead.tags?.length > 0 ? lead.tags.map((tag: string, i: number) => (
                                                            <Chip key={i} size="sm" variant="flat" className="bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 font-bold" startContent={<HiOutlineGlobeAlt className="size-3" />}>
                                                                {tag}
                                                            </Chip>
                                                        )) : (
                                                            <span className="text-xs text-gray-400 dark:text-foreground/40 italic">No tags</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab key="automation" title="Automation">
                                    <div className="pt-6">
                                        <div className="p-12 border border-divider border-dashed rounded-2xl flex flex-col items-center justify-center text-center space-y-4 bg-content1/50 dark:bg-content1/20">
                                            <div className="p-4 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-foreground/40 rounded-full">
                                                <LuTarget className="size-10" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg text-foreground">Automation Workflow</h4>
                                                <p className="text-sm text-gray-400 dark:text-foreground/40 max-w-xs">No active automation workflows for this lead.</p>
                                            </div>
                                            <Button color="primary" variant="flat" className="font-bold">Setup Automation</Button>
                                        </div>
                                    </div>
                                </Tab>
                            </Tabs>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default LeadDetailsModal;
