import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
} from "@heroui/react";
import { useState, useEffect } from "react";
import axios from "../../../services/axios";
import { HiOutlineTrash } from "react-icons/hi";
import { useFetchTeamMembers } from "../../../hooks/settings/useTeam";
import SendEmailModal from "./SendEmailModal";
import LeadAutomations from "../LeadAutomations";
import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";
import { useFormik } from "formik";
import PriorityLevelChip from "../../../components/chips/PriorityLevelChip";
import ReferralStatusChip from "../../../components/chips/ReferralStatusChip";
import { useUpdateLead, useLeadCommunicationHistory, useSendLeadSms, useDeleteLeadCommunicationHistory } from "../../../hooks/useLeadPipeline";
import { parseNotes } from "./lead-details/leadDetailsUtils";
import LeadDetailsOverviewTab from "./lead-details/LeadDetailsOverviewTab";
import LeadDetailsCommunicationTab from "./lead-details/LeadDetailsCommunicationTab";
import LeadDetailsNotesTab from "./lead-details/LeadDetailsNotesTab";
import LeadDetailsAttributionTab from "./lead-details/LeadDetailsAttributionTab";

interface LeadDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  lead: any;
  onDelete?: (lead: any) => void;
}

const LeadDetailsModal = ({ isOpen, onOpenChange, lead, onDelete }: LeadDetailsModalProps) => {
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
  const [noteIdToDelete, setNoteIdToDelete] = useState<string | number | null>(null);
  const [isDeletingNote, setIsDeletingNote] = useState(false);

  useEffect(() => {
    const checkIntegrations = async () => {
      try {
        const twilioRes = (await axios.get(
          "/twilio-checkout/active-numbers",
        )) as any;
        let numberList: any[] = [];
        if (Array.isArray(twilioRes?.data?.numbers)) {
          numberList = twilioRes.data.numbers;
        } else if (Array.isArray(twilioRes?.numbers)) {
          numberList = twilioRes.numbers;
        } else if (Array.isArray(twilioRes?.data)) {
          numberList = twilioRes.data;
        } else if (Array.isArray(twilioRes)) {
          numberList = twilioRes;
        }
        setHasPhoneConnected(numberList.length > 0);
      } catch (err) {
        console.error("Failed to check active numbers:", err);
        setHasPhoneConnected(false);
      }
      try {
        const emailRes = (await axios.get("/email-integration")) as any;
        const emailPayload = emailRes?.data || emailRes;
        const emailList = Array.isArray(emailPayload)
          ? emailPayload
          : emailPayload?.data || [];
        if (Array.isArray(emailList)) {
          const isConnected = emailList.some(
            (item: any) => item.status === "Connected",
          );
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
    } catch (error) { }
  };

  const parsedNotes = parseNotes(lead?.notes || "");
  const { data: communicationData, isLoading: loadingHistory } =
    useLeadCommunicationHistory(lead?.id || lead?._id);
  const communicationHistory = communicationData?.data || communicationData || [];

  const formik = useFormik({
    initialValues: {
      firstName: lead?.firstName || lead?.name?.split(" ")[0] || "",
      lastName: lead?.lastName || lead?.name?.split(" ").slice(1).join(" ") || "",
      email: lead?.email || "",
      phone: lead?.phone || "",
      locationId: lead?.locationId?._id || lead?.locationId || "",
      status: lead?.l_status || lead?.status || "newLead",
      priority: lead?.priority?.toLowerCase() || "medium",
      assignedTo: lead?.assignedTo || "Unassigned",
      estimatedValue: lead?.estimatedValue || 0,
      notes: lead?.notes || "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const { email: _email, ...updatePayload } = values;
        await updateLead({
          id: lead.id || lead._id,
          data: {
            ...updatePayload,
            firstName: values.firstName?.trim(),
            lastName: values.lastName?.trim(),
            phone: values.phone?.trim(),
            locationId: values.locationId || null,
            estimatedValue: Number(values.estimatedValue),
            assignedTo:
              values.assignedTo === "Unassigned" ||
                !/^[0-9a-fA-F]{24}$/.test(values.assignedTo)
                ? null
                : values.assignedTo,
          },
        });
      } catch (error) { }
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
      const currentNotes = Array.isArray(lead.notes)
        ? lead.notes
        : parseNotes(lead.notes).reverse();
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

  const handleDeleteNoteConfirm = async () => {
    if (noteIdToDelete === null) return;
    setIsDeletingNote(true);
    try {
      const currentNotes = Array.isArray(lead.notes)
        ? lead.notes
        : parseNotes(lead.notes).reverse();
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
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-2 flex-shrink-0 p-4">
                <div className="flex justify-between items-start w-full">
                  <div className="space-y-1">
                    <h4 className="text-base font-medium leading-snug text-foreground">
                      {lead.name || `${lead.firstName || ""} ${lead.lastName || ""}`.trim() || "Lead Details"}
                    </h4>
                    <div className="flex items-center gap-3">
                      <ReferralStatusChip status={formik.values.status} />
                      <PriorityLevelChip level={formik.values.priority} />
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
                    <LeadDetailsOverviewTab
                      lead={lead}
                      formik={formik}
                      teamMembers={teamMembers}
                      loadingTeam={loadingTeam}
                      onSendEmailClick={() => setIsSendEmailOpen(true)}
                      onSendSmsClick={() => setActiveTab("communication")}
                    />
                  </Tab>
                  <Tab key="communication" title="Communication">
                    <LeadDetailsCommunicationTab
                      lead={lead}
                      hasPhoneConnected={hasPhoneConnected}
                      hasEmailConnected={hasEmailConnected}
                      smsBody={smsBody}
                      setSmsBody={setSmsBody}
                      sendingSms={sendingSms}
                      onSendSms={handleSendSms}
                      onSendEmailClick={() => setIsSendEmailOpen(true)}
                      communicationHistory={communicationHistory}
                      loadingHistory={loadingHistory}
                      deletingId={deletingId}
                      onDeleteCommunication={handleDeleteCommunication}
                    />
                  </Tab>
                  <Tab key="notes" title="Notes & Tasks">
                    <LeadDetailsNotesTab
                      parsedNotes={parsedNotes}
                      newNote={newNote}
                      setNewNote={setNewNote}
                      addingNote={addingNote}
                      onAddNote={handleAddNote}
                      setNoteIdToDelete={setNoteIdToDelete}
                    />
                  </Tab>
                  <Tab key="attribution" title="Attribution">
                    <LeadDetailsAttributionTab lead={lead} />
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
