import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Select,
  SelectItem,
  Tab,
  Tabs,
  Textarea,
} from "@heroui/react";
import { useState } from "react";
import {
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineChat,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineGlobeAlt,
  HiOutlineInbox,
  HiOutlineMail,
  HiOutlinePencil,
  HiOutlinePhone,
  HiOutlinePhoneIncoming,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineUser,
} from "react-icons/hi";
import {
  LuBriefcase,
  LuHistory,
  LuMousePointer2,
  LuTarget,
} from "react-icons/lu";
import { useFetchTeamMembers } from "../../../hooks/settings/useTeam";
import SendEmailModal from "./SendEmailModal";
import LeadAutomations from "../LeadAutomations";
import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";

interface LeadDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  lead: any;
  onDelete?: (lead: any) => void;
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
import PriorityLevelChip from "../../../components/chips/PriorityLevelChip";
import ReferralStatusChip from "../../../components/chips/ReferralStatusChip";
import { LEAD_PRIORITIES, LEAD_STATUSES } from "../../../consts/lead-pipeline";
import { useUpdateLead, useLeadCommunicationHistory } from "../../../hooks/useLeadPipeline";
import { useFetchCallRecords } from "../../../hooks/useCall";
import { timeAgo as formatTimeAgo } from "../../../utils/timeAgo";

const parseNotes = (notes: any) => {
  if (!notes) return [];
  if (Array.isArray(notes)) {
    return [...notes].map((note, index) => ({
      id: note._id || index,
      timestamp: note.timestamp,
      content: note.content,
    })).reverse();
  }
  const notesStr = String(notes);
  const lines = notesStr.split("\n").filter((line) => line.trim());
  return lines.map((line, index) => {
    const match = line.match(/^\[(.*?)\]\s*(.*)$/);
    if (match) {
      return {
        id: index,
        timestamp: match[1],
        content: match[2],
      };
    }
    return {
      id: index,
      timestamp: null,
      content: line,
    };
  }).reverse();
};

const LeadDetailsModal = ({
  isOpen,
  onOpenChange,
  lead,
  onDelete,
}: LeadDetailsModalProps) => {
  const { data: teamMembers, isLoading: loadingTeam } = useFetchTeamMembers();
  const { mutateAsync: updateLead, isPending: updating } = useUpdateLead();
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [isSendEmailOpen, setIsSendEmailOpen] = useState(false);
  const parsedNotes = parseNotes(lead?.notes || "");
  const { data: communicationData, isLoading: loadingHistory } = useLeadCommunicationHistory(lead?.id || lead?._id);
  const communicationHistory = communicationData?.data || communicationData || [];
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
            assignedTo:
              values.assignedTo === "Unassigned" ||
                !/^[0-9a-fA-F]{24}$/.test(values.assignedTo)
                ? null
                : values.assignedTo,
          },
        });
      } catch (error) {
        // Error handled by hook
      }
    },
  });

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setAddingNote(true);
    try {
      const timestamp = new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const newNoteItem = { content: newNote.trim(), timestamp };
      const currentNotes = Array.isArray(lead.notes) ? lead.notes : parseNotes(lead.notes).reverse();
      const updatedNotes = [...currentNotes, newNoteItem];
      await updateLead({
        id: lead.id || lead._id,
        data: {
          notes: updatedNotes,
        },
      });
      setNewNote("");
    } catch (error) {
    } finally {
      setAddingNote(false);
    }
  };

  const [noteIdToDelete, setNoteIdToDelete] = useState<string | number | null>(null);
  const [isDeletingNote, setIsDeletingNote] = useState(false);

  const handleDeleteNoteConfirm = async () => {
    if (noteIdToDelete === null) return;
    setIsDeletingNote(true);
    try {
      const currentNotes = Array.isArray(lead.notes) ? lead.notes : parseNotes(lead.notes).reverse();
      const updatedNotes = currentNotes.filter((note: any, index: number) => {
        const id = note._id || index;
        return String(id) !== String(noteIdToDelete);
      });
      await updateLead({
        id: lead.id || lead._id,
        data: {
          notes: updatedNotes,
        },
      });
      setNoteIdToDelete(null);
    } catch (error) {
    } finally {
      setIsDeletingNote(false);
    }
  };
  if (!lead) return null;
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        placement="center"
        scrollBehavior="inside"
        classNames={{
          base: "max-lg:!m-3 !m-0 max-h-[92vh] flex flex-col",
          closeButton: "cursor-pointer",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-2 flex-shrink-0 p-4">
                <div className="flex justify-between items-start w-full">
                  <div className="space-y-1">
                    <h4 className="text-base font-medium leading-snug text-foreground">
                      {lead.firstName} {lead.lastName}
                    </h4>
                    <div className="flex items-center gap-3">
                      <ReferralStatusChip status={formik.values.status} />
                      <PriorityLevelChip level={formik.values.priority} />
                      <span className="text-xs text-gray-500 dark:text-foreground/60 font-normal">
                        Lead Score:{" "}
                        <span className="font-bold text-gray-700 dark:text-foreground">
                          {lead.score || 0}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mr-6">
                    {formik.dirty && (
                      <>
                        <Button
                          size="sm"
                          variant="light"
                          onPress={() => {
                            formik.resetForm();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          color="primary"
                          onPress={() => formik.handleSubmit()}
                          isLoading={updating}
                        >
                          Save Changes
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </ModalHeader>
              <ModalBody className="px-4 pt-0 pb-4 h-full overflow-auto">
                <Tabs
                  aria-label="Lead Details Tabs"
                  variant="light"
                  radius="full"
                  classNames={{
                    base: "bg-primary/15 dark:bg-background rounded-full p-1 w-full flex-shrink-0",
                    tabList: "flex w-full rounded-full p-0 gap-0",
                    tab: "flex-1 h-9 text-sm font-medium transition-all",
                    cursor: "rounded-full bg-white dark:bg-primary",
                    tabContent:
                      "dark:group-data-[selected=true]:text-primary-foreground text-default-500 dark:text-foreground/60 transition-colors",
                  }}
                  className="w-full"
                >
                  <Tab key="overview" title="Overview">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
                      <div className="lg:col-span-6 space-y-4">
                        <div className="p-4 border border-foreground/10 rounded-xl space-y-6 bg-content1/50 dark:bg-content1/20">
                          <div className="flex items-center gap-2 mb-2">
                            <HiOutlineUser className="size-5 text-gray-400 dark:text-foreground/40" />
                            <h3 className="font-bold text-sm text-foreground">
                              Contact Information
                            </h3>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-start gap-4">
                              <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg">
                                <HiOutlineMail className="size-5 text-gray-400 dark:text-foreground/40" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium">
                                  Email
                                </p>
                                <p
                                  className="text-sm font-bold text-foreground cursor-pointer hover:text-purple-500 transition-colors"
                                  onClick={() => setIsSendEmailOpen(true)}
                                >
                                  {lead.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-4">
                              <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg">
                                <HiOutlinePhone className="size-5 text-gray-400 dark:text-foreground/40" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium">
                                  Phone
                                </p>
                                <p className="text-sm font-bold text-foreground">
                                  {lead.phone}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3 mt-6">
                            <Button
                              fullWidth
                              variant="bordered"
                              startContent={<HiOutlinePhone className="size-4" />}
                              className="justify-start font-medium text-gray-700 dark:text-foreground/80 border-foreground/10"
                            >
                              Call via Twilio
                            </Button>
                            <Button
                              fullWidth
                              variant="bordered"
                              startContent={<HiOutlineMail className="size-4" />}
                              className="justify-start font-medium text-gray-700 dark:text-foreground/80 border-foreground/10"
                              onPress={() => setIsSendEmailOpen(true)}
                            >
                              Send Email
                            </Button>
                            <Button
                              fullWidth
                              variant="bordered"
                              startContent={<HiOutlineChat className="size-4" />}
                              className="justify-start font-medium text-gray-700 dark:text-foreground/80 border-foreground/10"
                            >
                              Send SMS
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="lg:col-span-6 space-y-4">
                        <div className="p-4 border border-foreground/10 rounded-xl space-y-6 bg-content1/50 dark:bg-content1/20">
                          <div className="flex items-center gap-2 mb-2">
                            <LuTarget className="size-5 text-gray-400 dark:text-foreground/40" />
                            <h3 className="font-bold text-sm text-foreground">
                              Lead Details
                            </h3>
                          </div>
                          <div className="grid grid-cols-1 gap-6">
                            <Select
                              label="Status"
                              // variant="bordered"
                              className="bg-default-100 data-[hover=true]:bg-default-200 rounded-small"
                              size="sm"
                              selectedKeys={new Set([formik.values.status])}
                              onSelectionChange={(keys) =>
                                formik.setFieldValue(
                                  "status",
                                  Array.from(keys)[0],
                                )
                              }
                              items={LEAD_STATUSES}
                            >
                              {(status) => (
                                <SelectItem key={status.key}>
                                  {status.label}
                                </SelectItem>
                              )}
                            </Select>
                            <Select
                              label="Priority"
                              // variant="bordered"
                              className="bg-default-100 data-[hover=true]:bg-default-200 rounded-small"
                              size="sm"
                              selectedKeys={new Set([formik.values.priority])}
                              onSelectionChange={(keys) =>
                                formik.setFieldValue(
                                  "priority",
                                  Array.from(keys)[0],
                                )
                              }
                              items={LEAD_PRIORITIES}
                            >
                              {(priority) => (
                                <SelectItem key={priority.key}>
                                  {priority.label}
                                </SelectItem>
                              )}
                            </Select>
                            <Select
                              label="Assigned To"
                              // variant=""
                              className="bg-default-100 data-[hover=true]:bg-default-200 rounded-small"
                              size="sm"
                              listboxProps={{ itemClasses: orangeItemClasses }}
                              startContent={
                                loadingTeam ? (
                                  <LuBriefcase className="text-default-400 size-4 animate-pulse mr-1" />
                                ) : (
                                  <LuBriefcase className="text-default-400 size-4 mr-1" />
                                )
                              }
                              selectedKeys={new Set([formik.values.assignedTo])}
                              onSelectionChange={(keys) =>
                                formik.setFieldValue(
                                  "assignedTo",
                                  Array.from(keys)[0],
                                )
                              }
                              items={teamMembers?.data || []}
                            >
                              {(member: any) => (
                                <SelectItem key={member._id}>
                                  {member.firstName} {member.lastName}
                                </SelectItem>
                              )}
                            </Select>
                            <Input
                              label="Estimated Value"
                              // variant="bordered"
                              className="bg-default-100 data-[hover=true]:bg-default-200 rounded-small "
                              value={formik.values.estimatedValue.toString()}
                              onValueChange={(val) =>
                                formik.setFieldValue("estimatedValue", val)
                              }
                              startContent={
                                <HiOutlineCurrencyDollar className="text-gray-400 dark:text-foreground/40" />
                              }
                              size="sm"
                              type="number"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="lg:col-span-12">
                        <div className="p-4 border border-foreground/10 rounded-xl bg-content1/50 dark:bg-content1/20">
                          <div className="flex items-center gap-2 mb-4">
                            <HiOutlinePencil className="size-5 text-gray-400 dark:text-foreground/40" />
                            <h3 className="font-bold text-sm text-foreground">
                              Treatment Interest
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {lead.treatments?.map((t: string, i: number) => (
                              <Chip
                                key={i}
                                variant="flat"
                                size="sm"
                                className="bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 font-bold px-3 border-none"
                              >
                                {t}
                              </Chip>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
                        <div className="p-4 border border-foreground/10 rounded-xl flex items-center gap-4 bg-content1/50 dark:bg-content1/20">
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/40 text-blue-500 dark:text-blue-400 rounded-xl">
                            <HiOutlineClock className="size-6" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium">
                              Created
                            </p>
                            <p className="text-sm font-bold text-foreground">
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="p-4 border border-foreground/10 rounded-xl flex items-center gap-4 bg-content1/50 dark:bg-content1/20">
                          <div className="p-3 bg-green-50 dark:bg-green-900/40 text-green-500 dark:text-green-400 rounded-xl">
                            <HiOutlineCalendar className="size-6" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium">
                              Last Contact
                            </p>
                            <p className="text-sm font-bold text-foreground">
                              {lead.lastContact
                                ? new Date(lead.lastContact).toLocaleDateString()
                                : "Never"}
                            </p>
                          </div>
                        </div>
                        <div className="p-4 border border-foreground/10 rounded-xl flex flex-col justify-center gap-2 bg-content1/50 dark:bg-content1/20">
                          <div className="flex justify-between items-center px-1">
                            <span className="text-xs text-gray-400 dark:text-foreground/40 font-medium">
                              Lead Score
                            </span>
                            <span className="text-xs font-bold text-foreground">
                              {lead.score || 0}/100
                            </span>
                          </div>
                          <Progress
                            size="sm"
                            color="warning"
                            value={lead.score || 0}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </Tab>
                  <Tab key="communication" title="Communication">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
                      <div className="p-4 border border-foreground/10 rounded-xl space-y-4 bg-content1/50 dark:bg-content1/20">
                        <div className="flex items-center gap-2 text-blue-500">
                          <HiOutlinePhone className="size-5" />
                          <h4 className="font-bold text-sm">Make a Call</h4>
                        </div>
                        <Button
                          fullWidth
                          color="primary"
                          className="font-bold"
                          startContent={<HiOutlinePhoneIncoming />}
                        >
                          Call {lead.phone}
                        </Button>
                      </div>
                      <div className="p-4 border border-foreground/10 rounded-xl space-y-4 bg-content1/50 dark:bg-content1/20">
                        <div className="flex items-center gap-2 text-purple-500">
                          <HiOutlineMail className="size-5" />
                          <h4 className="font-bold text-sm">Send Email</h4>
                        </div>
                        <Button
                          fullWidth
                          color="secondary"
                          className="font-bold bg-purple-400 text-white px-1"
                          startContent={<HiOutlineInbox />}
                          onPress={() => setIsSendEmailOpen(true)}
                        >
                          <span className="truncate">{lead.email ? lead.email : "Email"}</span>
                        </Button>
                      </div>
                      <div className="p-4 border border-foreground/10 rounded-xl space-y-4 bg-content1/50 dark:bg-content1/20">
                        <div className="flex items-center gap-2 text-green-500">
                          <HiOutlineChat className="size-5" />
                          <h4 className="font-bold text-sm">Send SMS</h4>
                        </div>
                        <Textarea
                          placeholder="Type your SMS message..."
                          minRows={2}
                          variant="flat"
                        />
                        <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-foreground/40">
                          <span>0/160</span>
                          <Button
                            size="sm"
                            color="success"
                            className="font-bold text-white bg-green-400 dark:bg-green-500"
                            startContent={<HiOutlineChat />}
                          >
                            Send SMS
                          </Button>
                        </div>
                      </div>
                      <div className="lg:col-span-3 mt-4">
                        <div className="flex items-center gap-2 mb-4 px-2">
                          <LuHistory className="size-5 text-gray-400 dark:text-foreground/40" />
                          <h3 className="font-bold text-base text-foreground">
                            Communication History
                          </h3>
                        </div>
                        <div className="p-4 border border-foreground/10 rounded-xl bg-content1/50 dark:bg-content1/20">
                          {loadingHistory ? (
                            <div className="p-8 text-center text-xs text-gray-400 dark:text-foreground/45 font-medium">
                              Loading communication history...
                            </div>
                          ) : communicationHistory.length === 0 ? (
                            <div className="p-6 text-center border border-dashed border-foreground/10 rounded-xl bg-gray-50/50 dark:bg-white/5">
                              <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium">No communication history available.</p>
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                              {communicationHistory.map((record: any) => {
                                const isEmail = record.type === "email";
                                const isIncoming = record.direction === "Incoming";
                                const timeAgoStr = record.date ? formatTimeAgo(record.date) : "";
                                return (
                                  <div
                                    key={record._id}
                                    className="p-3 border border-foreground/10 rounded-xl bg-gray-50 dark:bg-white/5 flex gap-4 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                  >
                                    <div className={`p-2 rounded-full h-fit ${isEmail
                                      ? "bg-purple-50 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400"
                                      : isIncoming
                                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400"
                                        : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400"
                                      }`}>
                                      {isEmail ? (
                                        <HiOutlineMail className="size-5" />
                                      ) : (
                                        <HiOutlinePhone className="size-5" />
                                      )}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                      <div className="flex justify-between items-center">
                                        <h5 className="font-bold text-sm text-foreground">
                                          {isEmail ? "Sent Email" : isIncoming ? "Inbound Call" : "Outbound Call"}
                                        </h5>
                                        <span className="text-[10px] text-gray-400 dark:text-foreground/40 font-medium">
                                          {timeAgoStr}
                                        </span>
                                      </div>
                                      {isEmail ? (
                                        <p className="text-xs text-gray-500 dark:text-foreground/60 font-medium">
                                          To: <span className="font-semibold">{lead.email}</span>
                                        </p>
                                      ) : (
                                        <p className="text-xs text-gray-500 dark:text-foreground/60 font-medium">
                                          Status: <span className="font-semibold capitalize">{record.status}</span> &bull; Duration: {record.duration}
                                        </p>
                                      )}
                                      {record.notes && (
                                        <p className="text-xs text-gray-650 dark:text-foreground/80 whitespace-pre-wrap mt-1 bg-white/5 p-1.5 rounded-md leading-relaxed border border-foreground/5">
                                          {record.notes}
                                        </p>
                                      )}
                                      {!isEmail && record.transcriptionText && record.transcriptionText !== "No transcription available" && record.transcriptionText !== "Processing..." && (
                                        <p className="text-[11px] text-gray-400 dark:text-foreground/45 border-l-2 border-foreground/10 pl-2 mt-1.5 italic">
                                          "{record.transcriptionText}"
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Tab>
                  <Tab key="notes" title="Notes & Tasks">
                    <div className="pt-4 space-y-6">
                      <div className="p-4 border border-foreground/10 rounded-xl space-y-4 bg-content1/50 dark:bg-content1/20">
                        <div className="flex items-center gap-2">
                          <HiOutlinePencil className="size-5 text-gray-400 dark:text-foreground/40" />
                          <h3 className="font-bold text-sm text-foreground">
                            Lead Notes
                          </h3>
                        </div>
                        <Textarea
                          placeholder="Add a new note..."
                          minRows={3}
                          variant="flat"
                          className="bg-gray-50 dark:bg-white/5 rounded-xl"
                          value={newNote}
                          onValueChange={setNewNote}
                        />
                        <Button
                          color="primary"
                          variant="flat"
                          startContent={<HiOutlinePlus className="size-4" />}
                          className="font-bold bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400"
                          onPress={handleAddNote}
                          isLoading={addingNote}
                          isDisabled={!newNote.trim()}
                        >
                          Add Note
                        </Button>
                        <div className="mt-6 space-y-4">
                          <div className="flex justify-between items-center px-2">
                            <h4 className="font-bold text-sm text-foreground">
                              Notes History
                            </h4>
                            <span className="text-[10px] text-gray-400 dark:text-foreground/40 font-medium">
                              {parsedNotes.length} {parsedNotes.length === 1 ? 'note' : 'notes'}
                            </span>
                          </div>
                          {parsedNotes.length === 0 ? (
                            <div className="p-6 text-center border border-dashed border-foreground/10 rounded-xl bg-gray-50/50 dark:bg-white/5">
                              <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium">No notes available.</p>
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                              {parsedNotes.map((note) => (
                                <div
                                  key={note.id}
                                  className="p-3 border border-foreground/10 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                >
                                  <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-[10px] text-gray-400 dark:text-foreground/40 font-bold uppercase tracking-wider">
                                      Lead Note
                                    </span>
                                    <div className="flex items-center gap-2">
                                      {note.timestamp && (
                                        <span className="text-[10px] text-gray-400 dark:text-foreground/45 font-medium">
                                          {note.timestamp}
                                        </span>
                                      )}
                                      <button
                                        onClick={() => setNoteIdToDelete(note.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-0.5 rounded hover:bg-foreground/5"
                                        title="Delete note"
                                      >
                                        <HiOutlineTrash className="size-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-foreground/80 whitespace-pre-wrap leading-relaxed">
                                    {note.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Tab>
                  <Tab key="attribution" title="Attribution">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="p-4 border border-foreground/10 rounded-xl space-y-6 bg-content1/50 dark:bg-content1/20">
                        <div className="flex items-center gap-2">
                          <LuMousePointer2 className="size-5 text-gray-400 dark:text-foreground/40" />
                          <h3 className="font-bold text-sm text-foreground">
                            Lead Source
                          </h3>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium">
                            Primary Source
                          </p>
                          <Chip
                            variant="flat"
                            className="bg-gray-50 dark:bg-white/5 border border-foreground/10 font-bold px-4 text-foreground rounded-full"
                          >
                            {lead.source}
                          </Chip>
                        </div>
                      </div>
                      <div className="p-4 border border-foreground/10 rounded-xl space-y-6 bg-content1/50 dark:bg-content1/20">
                        <div className="flex items-center gap-2">
                          <HiOutlineChartBar className="size-5 text-gray-400 dark:text-foreground/40" />
                          <h3 className="font-bold text-sm text-foreground">
                            Performance Metrics
                          </h3>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium mb-1">
                              Response Time
                            </p>
                            <div className="flex items-center gap-2 text-primary">
                              <HiOutlineClock className="size-4" />
                              <span className="font-bold text-sm">
                                {lead.responseTime || "0"} minutes
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium mb-1">
                              Lead Score
                            </p>
                            <Progress
                              size="sm"
                              color={
                                lead.score > 70
                                  ? "success"
                                  : lead.score > 40
                                    ? "warning"
                                    : "danger"
                              }
                              value={lead.score || 0}
                              className="max-w-md"
                            />
                            <div className="flex justify-end mt-1">
                              <span className="text-[10px] font-bold text-gray-500 dark:text-foreground/60">
                                {lead.score || 0}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium mb-1">
                              Tags
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {lead.tags?.length > 0 ? (
                                lead.tags.map((tag: string, i: number) => (
                                  <Chip
                                    key={i}
                                    size="sm"
                                    variant="flat"
                                    className="bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 font-bold border-none"
                                    startContent={
                                      <HiOutlineGlobeAlt className="size-3" />
                                    }
                                  >
                                    {tag}
                                  </Chip>
                                ))
                              ) : (
                                <span className="text-xs text-gray-400 dark:text-foreground/40 italic">
                                  No tags
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab>
                  <Tab key="automation" title="Automation">
                    <div className="pt-4 space-y-4">
                      <LeadAutomations />
                    </div>
                  </Tab>
                </Tabs>
              </ModalBody>
              {onDelete && (
                <ModalFooter className="flex justify-end p-4 border-t border-foreground/5 dark:border-white/5 bg-gray-50/10 dark:bg-white/5">
                  <Button
                    color="danger"
                    variant="flat"
                    size="sm"
                    startContent={<HiOutlineTrash className="size-4" />}
                    onPress={() => onDelete(lead)}
                  >
                    Delete Lead
                  </Button>
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
      <SendEmailModal
        isOpen={isSendEmailOpen}
        onOpenChange={setIsSendEmailOpen}
        lead={lead}
      />
      <DeleteConfirmationModal
        isOpen={noteIdToDelete !== null}
        onClose={() => setNoteIdToDelete(null)}
        onConfirm={handleDeleteNoteConfirm}
        isLoading={isDeletingNote}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
      />
    </>
  );
};

export default LeadDetailsModal;
