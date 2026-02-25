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

const LeadDetailsModal = ({ isOpen, onOpenChange, lead }: LeadDetailsModalProps) => {
    const { data: teamMembers, isLoading: loadingTeam } = useFetchTeamMembers();
    if (!lead) return null;

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="5xl"
            scrollBehavior="inside"
            classNames={{
                base: "max-h-[90vh]",
                header: "border-b border-divider px-8 py-6",
                body: "px-8 py-6",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex justify-between items-start w-full">
                                <div className="space-y-3">
                                    <h2 className="text-2xl font-bold text-foreground">
                                        {lead.name}
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <Chip
                                            variant="flat"
                                            size="sm"
                                            className="font-bold bg-gray-100 text-gray-600 border-none"
                                        >
                                            {lead.status}
                                        </Chip>
                                        <Chip
                                            variant="flat"
                                            size="sm"
                                            className="font-bold bg-blue-50 text-blue-600 border-none px-3"
                                        >
                                            {lead.priority} Priority
                                        </Chip>
                                        <span className="text-sm text-gray-500">
                                            Lead Score: <span className="font-bold text-gray-700">{lead.score}</span>
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="bordered"
                                    startContent={<HiOutlinePencil className="size-4" />}
                                    className="font-medium"
                                >
                                    Edit
                                </Button>
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
                                            <div className="p-6 border border-divider rounded-2xl space-y-6">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <HiOutlineUser className="size-5 text-gray-400" />
                                                    <h3 className="font-bold text-base">Contact Information</h3>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="p-2 bg-gray-50 rounded-lg">
                                                            <HiOutlineMail className="size-5 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400 font-medium">Email</p>
                                                            <p className="text-sm font-bold">{lead.email}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-4">
                                                        <div className="p-2 bg-gray-50 rounded-lg">
                                                            <HiOutlinePhone className="size-5 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400 font-medium">Phone</p>
                                                            <p className="text-sm font-bold">{lead.phone}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-3 mt-6">
                                                    <Button fullWidth variant="bordered" startContent={<HiOutlinePhone className="size-4" />} className="justify-start font-medium text-gray-700">Call via Twilio</Button>
                                                    <Button fullWidth variant="bordered" startContent={<HiOutlineMail className="size-4" />} className="justify-start font-medium text-gray-700">Send Email</Button>
                                                    <Button fullWidth variant="bordered" startContent={<HiOutlineChat className="size-4" />} className="justify-start font-medium text-gray-700">Send SMS</Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Lead Details */}
                                        <div className="lg:col-span-6 space-y-4">
                                            <div className="p-6 border border-divider rounded-2xl space-y-6">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <LuTarget className="size-5 text-gray-400" />
                                                    <h3 className="font-bold text-base">Lead Details</h3>
                                                </div>

                                                <div className="grid grid-cols-1 gap-6">
                                                    <Select label="Status" variant="bordered" defaultSelectedKeys={[lead.stage]} size="sm">
                                                        <SelectItem key="new">New Lead</SelectItem>
                                                        <SelectItem key="contacted">Contacted</SelectItem>
                                                        <SelectItem key="scheduled">Appointment Scheduled</SelectItem>
                                                        <SelectItem key="no-show">No Show</SelectItem>
                                                        <SelectItem key="won">Patient Won</SelectItem>
                                                        <SelectItem key="lost">Lost</SelectItem>
                                                    </Select>

                                                    <Select label="Priority" variant="bordered" defaultSelectedKeys={[lead.priority.toLowerCase()]} size="sm">
                                                        <SelectItem key="high">High</SelectItem>
                                                        <SelectItem key="medium">Medium</SelectItem>
                                                        <SelectItem key="low">Low</SelectItem>
                                                    </Select>

                                                    <Select
                                                        label="Assigned To"
                                                        variant="bordered"
                                                        size="sm"
                                                        listboxProps={{ itemClasses: orangeItemClasses }}
                                                        startContent={loadingTeam ? <LuBriefcase className="text-default-400 size-4 animate-pulse mr-1" /> : <LuBriefcase className="text-default-400 size-4 mr-1" />}
                                                        selectedKeys={new Set([lead.assignedTo])}
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
                                                        defaultValue={lead.value.replace(/[^0-9]/g, '')}
                                                        startContent={<HiOutlineCurrencyDollar className="text-gray-400" />}
                                                        size="sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Treatment Interest */}
                                        <div className="lg:col-span-12">
                                            <div className="p-6 border border-divider rounded-2xl">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <HiOutlinePencil className="size-5 text-gray-400" />
                                                    <h3 className="font-bold text-base">Treatment Interest</h3>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {lead.treatments.map((t: string, i: number) => (
                                                        <Chip key={i} variant="flat" size="sm" className="bg-sky-50 text-sky-600 font-bold px-3">
                                                            {t}
                                                        </Chip>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
                                            <div className="p-4 border border-divider rounded-2xl flex items-center gap-4">
                                                <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                                                    <HiOutlineClock className="size-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-medium">Created</p>
                                                    <p className="text-sm font-bold">743d ago</p>
                                                </div>
                                            </div>
                                            <div className="p-4 border border-divider rounded-2xl flex items-center gap-4">
                                                <div className="p-3 bg-green-50 text-green-500 rounded-xl">
                                                    <HiOutlineCalendar className="size-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-medium">Last Contact</p>
                                                    <p className="text-sm font-bold">742d ago</p>
                                                </div>
                                            </div>
                                            <div className="p-4 border border-divider rounded-2xl flex flex-col justify-center gap-2">
                                                <div className="flex justify-between items-center px-1">
                                                    <span className="text-xs text-gray-400 font-medium">Lead Score</span>
                                                    <span className="text-xs font-bold">{lead.score}/100</span>
                                                </div>
                                                <Progress size="sm" color="warning" value={lead.score} className="w-full" />
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
                                            <div className="flex justify-between items-center text-[10px] text-gray-400">
                                                <span>0/160</span>
                                                <Button size="sm" color="success" className="font-bold text-white bg-green-400" startContent={<HiOutlineChat />}>
                                                    Send SMS
                                                </Button>
                                            </div>
                                        </div>

                                        {/* History */}
                                        <div className="lg:col-span-3 mt-4">
                                            <div className="flex items-center gap-2 mb-4 px-2">
                                                <LuHistory className="size-5 text-gray-400" />
                                                <h3 className="font-bold text-base">Communication History</h3>
                                            </div>
                                            <div className="p-6 border border-divider rounded-2xl space-y-6">
                                                <div className="flex gap-4">
                                                    <div className="p-2 bg-purple-50 text-purple-500 rounded-full h-fit">
                                                        <HiOutlineMail className="size-6" />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex justify-between items-center">
                                                            <h5 className="font-bold text-sm">Inbound Email</h5>
                                                            <span className="text-[10px] text-gray-400">742d ago</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 font-medium">Re: Treatment Inquiry</p>
                                                        <p className="text-xs text-gray-400 italic">"Thanks but I decided to go with another provider"</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab key="notes" title="Notes & Tasks">
                                    <div className="pt-6 space-y-6">
                                        <div className="p-6 border border-divider rounded-2xl space-y-4">
                                            <div className="flex items-center gap-2">
                                                <HiOutlinePencil className="size-5 text-gray-400" />
                                                <h3 className="font-bold text-base">Lead Notes</h3>
                                            </div>
                                            <Textarea placeholder="Add a new note..." minRows={3} variant="flat" className="bg-gray-50 rounded-xl" />
                                            <Button color="primary" variant="flat" startContent={<HiOutlinePlus />} className="font-bold bg-sky-100 text-sky-600">
                                                Add Note
                                            </Button>

                                            <div className="mt-6 space-y-4">
                                                <h4 className="font-bold text-sm px-2">Notes History</h4>
                                                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                                                    <p className="text-xs text-gray-500">
                                                        Went with competitor due to price. Could re-engage with financing promotion.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab key="attribution" title="Attribution">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                        <div className="p-6 border border-divider rounded-2xl space-y-6">
                                            <div className="flex items-center gap-2">
                                                <LuMousePointer2 className="size-5 text-gray-400" />
                                                <h3 className="font-bold text-base">Lead Source</h3>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-xs text-gray-400 font-medium">Primary Source</p>
                                                <Chip variant="flat" className="bg-gray-50 border border-divider font-bold px-4">
                                                    {lead.source}
                                                </Chip>
                                            </div>
                                        </div>
                                        <div className="p-6 border border-divider rounded-2xl space-y-6">
                                            <div className="flex items-center gap-2">
                                                <HiOutlineChartBar className="size-5 text-gray-400" />
                                                <h3 className="font-bold text-base">Performance Metrics</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs text-gray-400 font-medium mb-1">Response Time</p>
                                                    <div className="flex items-center gap-2 text-danger">
                                                        <HiOutlineClock className="size-4" />
                                                        <span className="font-bold text-sm">18 minutes</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-medium mb-1">Lead Score</p>
                                                    <Progress size="sm" color="danger" value={25} className="max-w-md" />
                                                    <div className="flex justify-end mt-1">
                                                        <span className="text-[10px] font-bold text-gray-500">25</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-medium mb-1">Tags</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Chip size="sm" variant="flat" className="bg-sky-50 text-sky-600 font-bold" startContent={<HiOutlineGlobeAlt className="size-3" />}>price-shopper</Chip>
                                                        <Chip size="sm" variant="flat" className="bg-sky-50 text-sky-600 font-bold" startContent={<HiOutlineGlobeAlt className="size-3" />}>lost-to-competitor</Chip>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab key="automation" title="Automation">
                                    <div className="pt-6">
                                        <div className="p-12 border border-divider border-dashed rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                                            <div className="p-4 bg-gray-50 text-gray-400 rounded-full">
                                                <LuTarget className="size-10" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg">Automation Workflow</h4>
                                                <p className="text-sm text-gray-400 max-w-xs">No active automation workflows for this lead.</p>
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
