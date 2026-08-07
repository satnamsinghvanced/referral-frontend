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
  Spinner,
} from "@heroui/react";
import { useState, useEffect } from "react";
import axios from "../../../services/axios";
import { Link } from "react-router-dom";
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



import { useFormik } from "formik";
import PriorityLevelChip from "../../../components/chips/PriorityLevelChip";
import ReferralStatusChip from "../../../components/chips/ReferralStatusChip";
import { LEAD_PRIORITIES, LEAD_STATUSES } from "../../../consts/lead-pipeline";
import { useUpdateLead, useLeadCommunicationHistory, useSendLeadSms, useDeleteLeadCommunicationHistory } from "../../../hooks/useLeadPipeline";
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
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [smsBody, setSmsBody] = useState("");
  const { mutateAsync: sendSms, isPending: sendingSms } = useSendLeadSms();
  const { mutateAsync: deleteCommunication } = useDeleteLeadCommunicationHistory();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hasPhoneConnected, setHasPhoneConnected] = useState<boolean | null>(null);
  const [hasEmailConnected, setHasEmailConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkIntegrations = async () => {
      try {
        const twilioRes = await axios.get("/twilio-checkout/active-numbers") as any;
        console.log("[Integrations Debug] Twilio Response:", twilioRes);
        if (twilioRes && twilioRes.success && Array.isArray(twilioRes.data)) {
          setHasPhoneConnected(twilioRes.data.length > 0);
        } else {
          setHasPhoneConnected(false);
        }
      } catch (err) {
        console.error("Failed to check active numbers:", err);
        setHasPhoneConnected(false);
      }

      try {
        const emailRes = await axios.get("/email-integration") as any;
        console.log("[Integrations Debug] Email Response:", emailRes);
        if (emailRes && emailRes.success && Array.isArray(emailRes.data)) {
          const isConnected = emailRes.data.some((item: any) => item.status === "Connected");
          console.log("[Integrations Debug] Is Email Connected:", isConnected);
          setHasEmailConnected(isConnected);
        } else {
          setHasEmailConnected(false);
        }
      } catch (err) {
        console.error("Failed to check email integrations:", err);
        setHasEmailConnected(false);
      }
    };

    if (isOpen) {
      checkIntegrations();
    }
  }, [isOpen]);

  const handleDeleteCommunication = async (id: string, type: string) => {
    setDeletingId(id);
    try {
      await deleteCommunication({ id, type });
    } catch (error) {
      // Handled by hook
    } finally {
      setDeletingId(null);
    }
  };

  const handleSendSms = async () => {
    if (!smsBody.trim()) return;
    try {
      await sendSms({
        id: lead.id || lead._id,
        body: smsBody.trim(),
      });
      setSmsBody("");
    } catch (error) {
      // Handled by query/toast
    }
  };

  const parsedNotes = parseNotes(lead?.notes || "");
  const { data: communicationData, isLoading: loadingHistory, isFetching: fetchingHistory } = useLeadCommunicationHistory(lead?.id || lead?._id);
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
                      {/* <span className="text-xs text-gray-500 dark:text-foreground/60 font-normal">
                        Lead Score:{" "}
                        <span className="font-bold text-gray-700 dark:text-foreground">
                          {lead.score || 0}
                        </span>
                      </span> */}
                    </div>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody className="px-4 pt-0 pb-4 h-full overflow-auto">
                <Tabs
                  selectedKey={activeTab}
                  onSelectionChange={(key) => setActiveTab(key as string)}
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
                            {/* <Button
                              fullWidth
                              variant="bordered"
                              startContent={<HiOutlinePhone className="size-4" />}
                              className="justify-start font-medium text-gray-700 dark:text-foreground/80 border-foreground/10"
                            >
                              Call via Twilio
                            </Button> */}
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
                              onPress={() => setActiveTab("communication")}
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
                              items={[
                                { _id: "Unassigned", firstName: "Unassigned", lastName: "" },
                                ...(teamMembers?.data || []),
                              ]}
                            >
                              {(member: any) => (
                                <SelectItem key={member._id}>
                                  {member._id === "Unassigned" ? "Unassigned" : `${member.firstName} ${member.lastName}`}
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
                        {/* <div className="p-4 border border-foreground/10 rounded-xl flex flex-col justify-center gap-2 bg-content1/50 dark:bg-content1/20">
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
                        </div> */}
                      </div>
                    </div>
                  </Tab>
                  <Tab key="communication" title="Communication">
                    <div className="space-y-4 pt-1">
                      {(hasPhoneConnected === false || hasEmailConnected === false) && (
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl text-xs space-y-2">
                          {hasPhoneConnected === false && (
                            <p className="flex items-center gap-1.5 font-medium">
                              <span>⚠️</span>
                              <span>Phone service is not connected. Please <Link to="/integrations?highlight=twilio" className="underline font-bold hover:text-amber-500 transition-colors">buy a phone number</Link> to enable SMS messaging.</span>
                            </p>
                          )}
                          {hasEmailConnected === false && (
                            <p className="flex items-center gap-1.5 font-medium">
                              <span>⚠️</span>
                              <span>Email integration is not connected. Please <Link to="/integrations?highlight=email_marketing" className="underline font-bold hover:text-amber-500 transition-colors">connect your Gmail/SMTP</Link> to enable email sending.</span>
                            </p>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Send Email Card */}
                        <div className="p-5 border-l-4 border-purple-500 rounded-xl bg-gradient-to-br from-purple-500/[0.03] to-indigo-500/[0.03] border border-y-foreground/5 border-r-foreground/5 dark:border-y-white/5 dark:border-r-white/5 space-y-4 flex flex-col justify-between min-h-[190px] shadow-sm hover:shadow-purple-500/5 transition-all duration-300">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-purple-500">
                              <HiOutlineMail className="size-5" />
                              <h4 className="font-bold text-sm tracking-wide">Email Communications</h4>
                            </div>
                            <p className="text-[11px] text-foreground/50 leading-relaxed">
                              Send templates, custom campaigns, and direct updates to the lead's email.
                            </p>
                          </div>
                          <Button
                            fullWidth
                            variant="solid"
                            className={`font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/10 rounded-xl transition-all duration-200 transform active:scale-95 py-6 ${hasEmailConnected === false ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                            startContent={<HiOutlineInbox className="size-5 text-white" />}
                            onPress={() => setIsSendEmailOpen(true)}
                            isDisabled={hasEmailConnected === false}
                          >
                            <span className="truncate">{lead.email ? lead.email : "Send Email"}</span>
                          </Button>
                        </div>

                        {/* Send SMS Card */}
                        <div className="p-5 border-l-4 border-green-500 rounded-xl bg-gradient-to-br from-green-500/[0.03] to-emerald-500/[0.03] border border-y-foreground/5 border-r-foreground/5 dark:border-y-white/5 dark:border-r-white/5 space-y-4 flex flex-col justify-between min-h-[190px] shadow-sm hover:shadow-green-500/5 transition-all duration-300">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-green-500">
                              <HiOutlineChat className="size-5" />
                              <h4 className="font-bold text-sm tracking-wide">SMS Texting</h4>
                            </div>
                            <p className="text-[11px] text-foreground/50 leading-relaxed">
                              Send immediate SMS text updates directly to the lead's mobile device.
                            </p>
                          </div>
                          
                          <div className="space-y-3 w-full">
                            <Textarea
                              placeholder="Type your SMS message..."
                              minRows={1}
                              variant="flat"
                              className="text-xs bg-foreground/[0.03] dark:bg-white/[0.03] rounded-lg"
                              value={smsBody}
                              onChange={(e) => setSmsBody(e.target.value)}
                              maxLength={200}
                              isDisabled={hasPhoneConnected === false}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendSms();
                                }
                              }}
                            />
                            <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-foreground/40">
                              <span>{smsBody.length}/200</span>
                              <Button
                                size="sm"
                                variant="solid"
                                className={`font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md shadow-green-500/10 rounded-xl transition-all duration-200 transform active:scale-95 px-4 py-2 ${(!smsBody.trim() || sendingSms || hasPhoneConnected === false) ? 'opacity-50' : ''}`}
                                startContent={!sendingSms && <HiOutlineChat className="size-4 text-white" />}
                                onPress={handleSendSms}
                                isLoading={sendingSms}
                                isDisabled={!smsBody.trim() || sendingSms || hasPhoneConnected === false}
                              >
                                Send SMS
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center gap-2 mb-4 px-2">
                          <LuHistory className="size-5 text-gray-400 dark:text-foreground/40" />
                          <h3 className="font-bold text-base text-foreground">
                            Communication History
                          </h3>
                        </div>
                        <div className="p-4 border border-foreground/10 rounded-xl bg-content1/50 dark:bg-content1/20">
                          {loadingHistory ? (
                            <div className="p-8 flex flex-col items-center justify-center gap-2 text-xs text-gray-400 dark:text-foreground/45 font-medium">
                              <Spinner size="sm" color="primary" />
                              <span>Loading communication history...</span>
                            </div>
                          ) : communicationHistory.length === 0 ? (
                            <div className="p-6 text-center border border-dashed border-foreground/10 rounded-xl bg-gray-50/50 dark:bg-white/5">
                              <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium">No communication history available.</p>
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                              {communicationHistory.map((record: any) => {
                                const isEmail = record.type === "email";
                                const isSms = record.type === "sms";
                                const isIncoming = record.direction === "Incoming";
                                const timeAgoStr = record.date ? formatTimeAgo(record.date) : "";
                                return (
                                  <div
                                    key={record._id}
                                    className="p-3 border border-foreground/10 rounded-xl bg-gray-50 dark:bg-white/5 flex gap-4 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors relative group"
                                  >
                                    <div className={`p-2 rounded-full h-fit ${isEmail
                                      ? "bg-purple-50 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400"
                                      : isSms
                                        ? "bg-green-50 dark:bg-green-900/30 text-green-500 dark:text-green-400"
                                        : isIncoming
                                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400"
                                          : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400"
                                      }`}>
                                      {isEmail ? (
                                        <HiOutlineMail className="size-5" />
                                      ) : isSms ? (
                                        <HiOutlineChat className="size-5" />
                                      ) : (
                                        <HiOutlinePhone className="size-5" />
                                      )}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                      <div className="flex justify-between items-center">
                                        <h5 className="font-bold text-sm text-foreground">
                                          {isEmail ? "Sent Email" : isSms ? (isIncoming ? "Received SMS" : "Sent SMS") : (isIncoming ? "Inbound Call" : "Outbound Call")}
                                        </h5>
                                        <span className="text-[10px] text-gray-400 dark:text-foreground/40 font-medium pr-8">
                                          {timeAgoStr}
                                        </span>
                                      </div>
                                      {isEmail ? (
                                        <div className="space-y-0.5">
                                          <p className="text-xs text-gray-500 dark:text-foreground/60 font-medium">
                                            To: <span className="font-semibold">{lead.email}</span>
                                          </p>
                                          {record.subject && (
                                            <p className="text-xs text-gray-500 dark:text-foreground/60 font-medium">
                                              Subject: <span className="font-semibold text-gray-700 dark:text-foreground/85">{record.subject}</span>
                                            </p>
                                          )}
                                        </div>
                                      ) : isSms ? (
                                        <p className="text-xs text-gray-500 dark:text-foreground/60 font-medium">
                                          Recipient: <span className="font-semibold">{record.recipient || lead.phone}</span>
                                        </p>
                                      ) : (
                                        <p className="text-xs text-gray-500 dark:text-foreground/60 font-medium">
                                          Status: <span className="font-semibold capitalize">{record.status}</span> &bull; Duration: {record.duration}
                                        </p>
                                      )}
                                      {record.body && !isEmail && (
                                        <p className="text-xs text-gray-650 dark:text-foreground/80 whitespace-pre-wrap mt-1 bg-white/5 p-1.5 rounded-md leading-relaxed border border-foreground/5 font-normal">
                                          {record.body}
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
                                    <Button
                                      isIconOnly
                                      size="sm"
                                      variant="light"
                                      color="danger"
                                      className={`${deletingId === record._id ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity absolute right-3 top-3 h-7 w-7 min-w-0`}
                                      onPress={() => handleDeleteCommunication(record._id, record.type)}
                                      title="Delete Record"
                                      isLoading={deletingId === record._id}
                                    >
                                      <HiOutlineTrash className="size-4" />
                                    </Button>
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
                          {/* <div>
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
                          </div> */}
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

              {(onDelete || formik.dirty) && (
                <ModalFooter className="flex justify-between items-center p-4 border-t border-foreground/5 dark:border-white/5 bg-gray-50/10 dark:bg-white/5">
                  {onDelete ? (
                    <Button
                      isIconOnly
                      color="danger"
                      variant="flat"
                      size="sm"
                      onPress={() => onDelete(lead)}
                      title="Delete Lead"
                    >
                      <HiOutlineTrash className="size-4" />
                    </Button>
                  ) : (
                    <div />
                  )}

                  <div className="flex gap-2">
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
