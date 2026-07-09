import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalBody, Button, Input, addToast } from "@heroui/react";
import { Conversation } from "../../../consts/conversations";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineTrendingUp,
  HiOutlineCalendar,
  HiOutlinePencilAlt,
} from "react-icons/hi";
import { addLead, updateLead } from "../../../services/leadPipeline";

interface ViewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Conversation | null;
  onScheduleClick: () => void;
  onLeadSaved?: (updatedLead: any) => void;
  onSendFormClick?: (leadId: string, patientName: string) => void;
}

const ViewLeadModal = ({ isOpen, onClose, lead, onScheduleClick, onLeadSaved, onSendFormClick }: ViewLeadModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead && isOpen) {
      const nameParts = lead.patientName.trim().split(/\s+/);
      const fName = nameParts[0] || "";
      const lName = nameParts.slice(1).join(" ") || "";
      setFirstName(fName);
      setLastName(lName);
      setEmail(lead.patientEmail || "");
      setPhone(lead.patientPhone || "");
      setLocation(lead.patientLocation || "");
      setIsEditing(!lead.leadId);
    }
  }, [lead, isOpen]);

  if (!lead) return null;

  const handleSave = async () => {
    if (!firstName.trim() || !email.trim() || !phone.trim()) {
      addToast({
        title: "Validation Error",
        description: "First name, email, and phone number are required.",
        color: "danger",
      });
      return;
    }

    setLoading(true);
    try {
      if (lead.leadId) {
        // Update existing lead in CRM
        const response = await updateLead({
          id: lead.leadId,
          data: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            location: location.trim(),
            socialConversationId: lead.id, // ensure conversation is linked in DB
          },
        });
        addToast({
          title: "Lead Updated",
          description: "Contact details have been updated successfully.",
          color: "success",
        });
        if (onLeadSaved) {
          onLeadSaved(response);
        }
        setIsEditing(false);
      } else {
        // Create new lead in CRM linked to this conversation ID
        const response = await addLead({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          location: location.trim(),
          source: lead.platform, // "instagram" or "facebook"
          socialConversationId: lead.id,
          status: "newLead",
        });
        addToast({
          title: "Lead Created",
          description: "Conversation has been successfully saved to Lead Tracking.",
          color: "success",
        });
        if (onLeadSaved) {
          onLeadSaved(response);
        }
        setIsEditing(false);
      }
    } catch (err: any) {
      console.error("[ViewLeadModal Save Error]", err);
      addToast({
        title: "Error Saving Lead",
        description: err.response?.data?.message || err.message || "Failed to save lead info.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };
  const getStatusDetails = () => {
    if (!lead.leadId) {
      return {
        label: "Not Saved",
        className: "bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/60"
      };
    }
    switch (lead.leadStatus) {
      case "newLead":
        return {
          label: "New Lead",
          className: "bg-sky-100 dark:bg-sky-900/60 text-sky-500 dark:text-sky-300 border-sky-200 dark:border-sky-700/60"
        };
      case "contacted":
        return {
          label: "Contacted",
          className: "bg-blue-100 dark:bg-blue-900/60 text-blue-500 dark:text-blue-300 border-blue-200 dark:border-blue-700/60"
        };
      case "appointmentScheduled":
        return {
          label: "Appointment Scheduled",
          className: "bg-purple-100 dark:bg-purple-900/60 text-purple-500 dark:text-purple-300 border-purple-200 dark:border-purple-700/60"
        };
      case "noShow":
        return {
          label: "No Show",
          className: "bg-orange-100 dark:bg-orange-900/60 text-orange-500 dark:text-orange-300 border-orange-200 dark:border-orange-700/60"
        };
      case "patientWon":
        return {
          label: "Patient Won",
          className: "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-500 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/60"
        };
      case "lost":
        return {
          label: "Patient Lost",
          className: "bg-slate-100 dark:bg-slate-900/60 text-slate-500 dark:text-slate-350 border-slate-200 dark:border-slate-700/60"
        };
      default:
        return {
          label: "New Lead",
          className: "bg-sky-100 dark:bg-sky-900/60 text-sky-500 dark:text-sky-300 border-sky-200 dark:border-sky-700/60"
        };
    }
  };

  const statusInfo = getStatusDetails();

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="center"
      size="md"
      scrollBehavior="inside"
      classNames={{
        base: "max-sm:!m-3 !m-0",
        closeButton: "text-white hover:bg-white/20 z-50 top-3 right-3",
      }}
    >
      <ModalContent className="overflow-hidden">
        {(onClose) => (
          <>
            <div className="bg-[#0ea5e9] px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/25 flex items-center justify-center font-bold text-lg shrink-0">
                  {firstName.charAt(0) || lead.patientName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-[16px] leading-tight text-white">
                    {isEditing ? `${firstName} ${lastName}` : lead.patientName}
                  </h3>
                  <p className="text-white/85 text-[13px] mt-0.5">Lead Profile</p>
                </div>
              </div>
            </div>

            <ModalBody className="px-5 py-4 gap-4">
              <div className="flex gap-3">
                <div className="bg-sky-50 dark:bg-sky-950/40 rounded-xl p-3 flex-1 flex flex-col items-center justify-center text-center min-w-0">
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 mb-2">Status</span>
                  <span className={`px-2.5 py-0.5 text-[11px] rounded-full font-semibold border whitespace-nowrap ${statusInfo.className}`}>
                    {statusInfo.label}
                  </span>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-xl p-3 flex-1 flex flex-col items-center justify-center text-center min-w-0">
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 mb-1">Lead Score</span>
                  <span className="text-[22px] font-extrabold text-emerald-500 dark:text-emerald-400 leading-none">
                    0
                  </span>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/40 rounded-xl p-3 flex-1 flex flex-col items-center justify-center text-center min-w-0">
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 mb-1">Est. Value</span>
                  <span className="text-[18px] font-extrabold text-purple-500 dark:text-purple-400 leading-none">
                    ${lead.estimatedValue.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Contact Details
                  </h4>
                  {!isEditing && lead.leadId && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-[#0ea5e9] hover:text-[#0284c7] flex items-center gap-1 text-[11px] font-semibold"
                    >
                      <HiOutlinePencilAlt className="text-[14px]" /> Edit Info
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3 p-3 bg-slate-50/50 dark:bg-default-50/40 border border-slate-100 dark:border-default-100 rounded-xl">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="First Name"
                        labelPlacement="outside"
                        placeholder="First Name"
                        size="sm"
                        radius="md"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        isRequired
                      />
                      <Input
                        label="Last Name"
                        labelPlacement="outside"
                        placeholder="Last Name"
                        size="sm"
                        radius="md"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Email"
                        labelPlacement="outside"
                        placeholder="email@example.com"
                        size="sm"
                        radius="md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isRequired
                      />
                      <Input
                        label="Phone"
                        labelPlacement="outside"
                        placeholder="(123) 456-7890"
                        size="sm"
                        radius="md"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        isRequired
                      />
                    </div>
                    <Input
                      label="Location"
                      labelPlacement="outside"
                      placeholder="Location (City, State, etc.)"
                      size="sm"
                      radius="md"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 dark:bg-default-100/60 px-3 py-2.5 rounded-xl flex gap-2 items-center">
                      <HiOutlineMail className="text-slate-400 shrink-0 text-[16px]" />
                      <div className="min-w-0">
                        <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mb-0.5">Email</div>
                        <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-200 truncate">
                          {lead.patientEmail || "—"}
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-default-100/60 px-3 py-2.5 rounded-xl flex gap-2 items-center">
                      <HiOutlinePhone className="text-slate-400 shrink-0 text-[16px]" />
                      <div className="min-w-0">
                        <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mb-0.5">Phone</div>
                        <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">
                          {lead.patientPhone || "—"}
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-default-100/60 px-3 py-2.5 rounded-xl flex gap-2 items-center">
                      <HiOutlineLocationMarker className="text-slate-400 shrink-0 text-[16px]" />
                      <div className="min-w-0">
                        <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mb-0.5">Location</div>
                        <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-200 truncate">
                          {lead.patientLocation || "—"}
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-default-100/60 px-3 py-2.5 rounded-xl flex gap-2 items-center">
                      <HiOutlineTrendingUp className="text-slate-400 shrink-0 text-[16px]" />
                      <div className="min-w-0">
                        <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mb-0.5">Source</div>
                        <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-200 capitalize">
                          {lead.platform === "web" ? "Website Chat" : lead.platform || "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {lead.treatmentInterest && lead.treatmentInterest.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                    Treatment Interest
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.treatmentInterest.map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 bg-[#f5e6ff] dark:bg-purple-950/40 text-[#a855f7] dark:text-purple-300 text-[11px] rounded-md font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {lead.tags && lead.tags.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 border border-slate-200 dark:border-default-300/50 bg-white dark:bg-default-100/50 text-slate-600 dark:text-slate-300 text-[11.5px] rounded-full font-normal"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-2">
                {isEditing ? (
                  <>
                    <Button
                      className="flex-1 font-bold bg-[#00a3e0] text-white text-[12.5px] h-9.5 rounded-lg shadow-none"
                      onPress={handleSave}
                      isLoading={loading}
                    >
                      {lead.leadId ? "Save Changes" : "Save as Lead"}
                    </Button>
                    <Button
                      variant="bordered"
                      className="flex-1 font-semibold text-slate-600 dark:text-slate-300 border-slate-200 dark:border-default-300 text-[12.5px] h-9.5 rounded-lg shadow-none"
                      onPress={() => {
                        if (lead.leadId) {
                          setIsEditing(false);
                        } else {
                          onClose();
                        }
                      }}
                      isDisabled={loading}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="flex-[1.3] font-bold bg-[#00a3e0] text-white text-[12.5px] h-9.5 rounded-lg shadow-none"
                      startContent={<HiOutlineCalendar className="text-[16px] shrink-0" />}
                      onPress={() => {
                        onClose();
                        onScheduleClick();
                      }}
                    >
                      Schedule Appointment
                    </Button>
                    <Button
                      variant="bordered"
                      className="flex-1 font-semibold text-slate-600 dark:text-slate-300 border-slate-200 dark:border-default-300 text-[12.5px] h-9.5 rounded-lg shadow-none"
                      onPress={onClose}
                    >
                      Close
                    </Button>
                    {lead.leadId && (
                      <Button
                        className="flex-1 font-semibold bg-purple-600 hover:bg-purple-700 text-white text-[12.5px] h-9.5 rounded-lg shadow-none"
                        onPress={() => {
                          if (onSendFormClick && lead.leadId) {
                            onSendFormClick(lead.leadId, lead.patientName);
                          }
                        }}
                      >
                        Share Form
                      </Button>
                    )}
                  </>
                )}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ViewLeadModal;
