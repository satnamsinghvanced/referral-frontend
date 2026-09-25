import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalBody, Button, Input, Select, SelectItem, addToast } from "@heroui/react";
import { Conversation } from "../../../consts/conversations";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineTrendingUp,
  HiOutlineCalendar,
  HiOutlinePencilAlt,
  HiOutlineDocumentText,
} from "react-icons/hi";
import { addLead, updateLead } from "../../../services/leadPipeline";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
import { useLocationContext } from "../../../providers/LocationContext";
import { Location } from "../../../types/common";
import { EMAIL_REGEX } from "../../../consts/consts";

interface ViewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Conversation | null;
  onScheduleClick: () => void;
  onLeadSaved?: (updatedLead: any) => void;
  onSendFormClick?: (leadId: string, patientName: string) => void;
}

const formatAddress = (loc: Location) => {
  if (!loc.address) return "";
  const parts = [loc.address.street, loc.address.city, loc.address.state, loc.address.zipcode].filter(
    Boolean
  );
  return parts.join(", ");
};

const ViewLeadModal = ({ isOpen, onClose, lead, onScheduleClick, onLeadSaved, onSendFormClick }: ViewLeadModalProps) => {
  const { locations, selectedLocation, getLocationColor } = useLocationContext();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ firstName?: string | undefined; email?: string | undefined; phone?: string | undefined }>({});
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [customLocation, setCustomLocation] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead && isOpen) {
      setErrors({});
      const nameParts = lead.patientName.trim().split(/\s+/);
      const fName = nameParts[0] || "";
      const lName = nameParts.slice(1).join(" ") || "";
      setFirstName(fName);
      setLastName(lName);
      setEmail(lead.patientEmail || "");
      setPhone(formatPhoneNumber(lead.patientPhone || ""));

      const leadLocStr = (lead.locationId || lead.patientLocation || "").trim();
      let matchedLoc: Location | undefined;
      if (leadLocStr && locations && locations.length > 0) {
        matchedLoc = locations.find(
          (l) => l._id === leadLocStr || l.name.toLowerCase() === leadLocStr.toLowerCase()
        );
      }

      if (matchedLoc) {
        setSelectedLocationId(matchedLoc._id || "");
        setCustomLocation(matchedLoc.name);
      } else {
        setSelectedLocationId("");
        setCustomLocation(leadLocStr);
      }

      setIsEditing(!lead.leadId);
    }
  }, [lead, isOpen, locations, selectedLocation]);

  if (!lead) return null;

  const handleSave = async () => {
    const newErrors: { firstName?: string; email?: string; phone?: string } = {};
    const missingList: string[] = [];

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
      missingList.push("First name");
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      missingList.push("Email");
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
      missingList.push("Phone number");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      let desc = "";
      if (missingList.length === 1) {
        desc = `${missingList[0]} is required.`;
      } else if (missingList.length === 2) {
        desc = `${missingList[0]} and ${missingList[1]?.toLowerCase()} are required.`;
      } else if (missingList.length === 3) {
        desc = `${missingList[0]}, ${missingList[1]?.toLowerCase()}, and ${missingList[2]?.toLowerCase()} are required.`;
      } else {
        desc = newErrors.email || "Please fill in all required fields.";
      }
      addToast({
        title: "Validation Error",
        description: desc,
        color: "danger",
      });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const selectedLocObj = locations?.find((l) => l._id === selectedLocationId);
      const locIdToSave = selectedLocObj?._id || (selectedLocationId && /^[0-9a-fA-F]{24}$/.test(selectedLocationId) ? selectedLocationId : null);

      if (lead.leadId) {
        const response = await updateLead({
          id: lead.leadId,
          data: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            locationId: locIdToSave,
            socialConversationId: lead.id, 
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
        const response = await addLead({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          locationId: locIdToSave,
          source: lead.platform,
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

  const targetViewLoc = lead.locationId || lead.patientLocation || "";
  const matchedViewLoc = locations?.find(
    (l) => l._id === targetViewLoc || l.name.toLowerCase() === targetViewLoc.toLowerCase()
  );
  const displayLocName = matchedViewLoc ? matchedViewLoc.name : (targetViewLoc || "—");
  const displayLocColor = matchedViewLoc ? getLocationColor(matchedViewLoc._id) : undefined;
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="center"
      size="md"
      scrollBehavior="inside"
      classNames={{
        base: "max-sm:!m-3 !m-0 sm:max-w-[495px]",
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
                  <div className="flex flex-col gap-3.5 p-3.5 bg-slate-50/50 dark:bg-default-50/40 border border-slate-100 dark:border-default-100 rounded-xl">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="First Name"
                        labelPlacement="outside"
                        placeholder="First Name"
                        size="sm"
                        radius="md"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: undefined }));
                        }}
                        isInvalid={Boolean(errors.firstName)}
                        errorMessage={errors.firstName}
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
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        isInvalid={Boolean(errors.email)}
                        errorMessage={errors.email}
                        isRequired
                      />
                      <Input
                        label="Phone"
                        labelPlacement="outside"
                        placeholder="(123) 456-7890"
                        size="sm"
                        radius="md"
                        value={phone}
                        onChange={(e) => {
                          setPhone(formatPhoneNumber(e.target.value));
                          if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                        }}
                        isInvalid={Boolean(errors.phone)}
                        errorMessage={errors.phone}
                        isRequired
                      />
                    </div>
                    <div className="pt-0.5">
                      {locations && locations.length > 0 ? (
                        <Select
                          label="Practice Location"
                          labelPlacement="outside"
                          placeholder="Select practice location"
                          size="sm"
                          radius="md"
                          variant="flat"
                          disableAnimation
                          selectedKeys={selectedLocationId ? [selectedLocationId] : []}
                          onSelectionChange={(keys) => {
                            const key = Array.from(keys)[0] as string;
                            setSelectedLocationId(key || "");
                            const found = locations.find((l) => l._id === key);
                            if (found) {
                              setCustomLocation(found.name);
                            }
                          }}
                          startContent={
                            !selectedLocationId ? (
                              <HiOutlineLocationMarker className="text-default-400 size-4 shrink-0" />
                            ) : undefined
                          }
                          renderValue={(items) => {
                            return items.map((item) => {
                              const loc = locations.find((l) => l._id === item.key);
                              const locIdx = locations.findIndex((l) => l._id === item.key);
                              const locColor = getLocationColor(loc?._id, locIdx >= 0 ? locIdx : undefined);
                              return (
                                <div key={item.key} className="flex items-center gap-2 min-w-0">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                                    style={{ backgroundColor: locColor }}
                                  />
                                  <span className="text-[13px] font-medium text-foreground truncate">
                                    {loc?.name || item.textValue}
                                  </span>
                                </div>
                              );
                            });
                          }}
                          popoverProps={{
                            classNames: {
                              content: "w-[300px] max-w-full p-0 shadow-xl rounded-xl border border-foreground/10 overflow-hidden bg-background text-foreground",
                            },
                            disableAnimation: true,
                            shouldCloseOnScroll: false,
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
                            const locAddr = formatAddress(loc);
                            return (
                              <SelectItem
                                key={loc._id}
                                textValue={loc.name}
                              >
                                <div className="flex items-start gap-2.5 min-w-0 pr-1">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0 mt-1 shadow-xs"
                                    style={{ backgroundColor: locColor }}
                                  />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold leading-tight text-foreground truncate">
                                      {loc.name}
                                    </p>
                                    {locAddr && (
                                      <p className="text-[10px] text-foreground/60 leading-tight truncate mt-0.5 font-normal">
                                        {locAddr}
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
                          placeholder="Location (City, State, etc.)"
                          size="sm"
                          radius="md"
                          value={customLocation}
                          onChange={(e) => setCustomLocation(e.target.value)}
                          startContent={
                            <HiOutlineLocationMarker className="text-default-400 size-4 shrink-0" />
                          }
                        />
                      )}
                    </div>
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
                          {formatPhoneNumber(lead.patientPhone) || "—"}
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-default-100/60 px-3 py-2.5 rounded-xl flex gap-2 items-center">
                      <HiOutlineLocationMarker className="text-slate-400 shrink-0 text-[16px]" />
                      <div className="min-w-0">
                        <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mb-0.5">Location</div>
                        <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-200 truncate flex items-center gap-1.5">
                          {displayLocColor && (
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: displayLocColor }}
                            />
                          )}
                          <span className="truncate">{displayLocName}</span>
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
              <div className="flex items-center gap-2.5 mt-2 pt-1">
                {isEditing ? (
                  <>
                    <Button
                      className="flex-1 font-semibold bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs h-10 rounded-xl shadow-xs"
                      onPress={handleSave}
                      isLoading={loading}
                    >
                      {lead.leadId ? "Save Changes" : "Save as Lead"}
                    </Button>
                    <Button
                      variant="bordered"
                      className="flex-1 font-semibold text-slate-600 dark:text-slate-300 border-slate-200 dark:border-default-300 text-xs h-10 rounded-xl shadow-none hover:bg-slate-100 dark:hover:bg-default-100"
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
                      className="flex-[1.35] font-semibold bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs h-10 rounded-xl shadow-xs px-3 min-w-0 flex items-center justify-center gap-1.5 transition-all"
                      startContent={<HiOutlineCalendar className="size-4 shrink-0" />}
                      onPress={() => {
                        onClose();
                        onScheduleClick();
                      }}
                    >
                      <span className="whitespace-nowrap truncate">Schedule Appointment</span>
                    </Button>
                    {lead.leadId && (
                      <Button
                        className="flex-1 font-semibold bg-purple-600 hover:bg-purple-700 text-white text-xs h-10 rounded-xl shadow-xs px-3 min-w-0 flex items-center justify-center gap-1.5 transition-all"
                        startContent={<HiOutlineDocumentText className="size-4 shrink-0" />}
                        onPress={() => {
                          if (onSendFormClick && lead.leadId) {
                            onSendFormClick(lead.leadId, lead.patientName);
                          }
                        }}
                      >
                        <span className="whitespace-nowrap truncate">Share Form</span>
                      </Button>
                    )}
                    <Button
                      variant="bordered"
                      className="font-semibold text-slate-600 dark:text-slate-300 border-slate-200 dark:border-default-300 text-xs h-10 rounded-xl px-4 shadow-none hover:bg-slate-100 dark:hover:bg-default-100 transition-all"
                      onPress={onClose}
                    >
                      Close
                    </Button>
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