import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalBody, Button, Select, SelectItem, Textarea, Switch, addToast, DatePicker, TimeInput } from "@heroui/react";
import { parseDate, CalendarDate, Time, today, getLocalTimeZone } from "@internationalized/date";
import { Conversation } from "../../../consts/conversations";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { HiOutlineClock } from "react-icons/hi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { parseStringTime } from "../../../utils/parseStringTime";
import { queryClient } from "../../../providers/QueryProvider";
import { getLead } from "../../../services/leadPipeline";

interface ScheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Conversation | null;
  onAppointmentScheduled?: (updatedLead: any) => void;
}

const APPOINTMENT_TYPES = [
  "New Patient Consultation",
  "Records Appointment",
  "Treatment Start",
  "Follow-Up Visit",
  "Retainer Check",
  "Emergency Visit",
];

const safeParseDate = (dateVal: string | null | undefined): CalendarDate | null => {
  if (!dateVal) return null;
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) {
      return parseDate(dateVal);
    }
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return parseDate(`${year}-${month}-${day}`);
    }
  } catch (err) {
    console.error("safeParseDate error:", err);
  }
  return null;
};

const safeParseTime = (timeVal: string | null | undefined): Time | null => {
  if (!timeVal) return null;
  try {
    const match = timeVal.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (match && match[1] && match[2]) {
      let hour = parseInt(match[1], 10);
      const min = parseInt(match[2], 10);
      const ampm = match[3]?.toUpperCase();
      if (ampm === "PM" && hour < 12) hour += 12;
      if (ampm === "AM" && hour === 12) hour = 0;
      return new Time(hour, min);
    }
    return parseStringTime(timeVal);
  } catch (err) {
    console.error("safeParseTime error:", err);
  }
  return null;
};

const ScheduleAppointmentModal = ({ isOpen, onClose, lead, onAppointmentScheduled }: ScheduleAppointmentModalProps) => {
  const [fetchedLead, setFetchedLead] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    if (isOpen && lead?.leadId) {
      getLead(lead.leadId)
        .then((res: any) => {
          if (isMounted) {
            const data = res?.data || res;
            if (data) setFetchedLead(data);
          }
        })
        .catch((err) => {
          console.error("Error fetching lead appointment details:", err);
        });
    } else {
      setFetchedLead(null);
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, lead?.leadId]);

  const activeAppt = fetchedLead?.scheduledAppointment || lead?.scheduledAppointment;
  const isAlreadyScheduled = Boolean(activeAppt?.date || lead?.leadStatus === "appointmentScheduled" || fetchedLead?.status === "appointmentScheduled");

  const getInitialDate = () => {
    const rawDate = activeAppt?.date;
    if (rawDate) {
      try {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        }
      } catch (e) { }
    }
    return "";
  };

  const getInitialTime = () => {
    const rawTime = activeAppt?.time;
    if (rawTime) {
      const match = rawTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (match && match[1] && match[2]) {
        let hour = parseInt(match[1], 10);
        const min = match[2];
        const ampm = match[3]?.toUpperCase();
        if (ampm === "PM" && hour < 12) hour += 12;
        if (ampm === "AM" && hour === 12) hour = 0;
        return `${hour.toString().padStart(2, "0")}:${min}`;
      }
      return rawTime;
    }
    return "";
  };

  const validationSchema = Yup.object().shape({
    appointmentType: Yup.string().required("Required"),
    date: Yup.string().required("Date is required"),
    time: Yup.string().required("Time is required"),
    notes: Yup.string().max(500, "Notes too long").nullable(),
    sendReminder: Yup.boolean(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      appointmentType: activeAppt?.appointmentType || "New Patient Consultation",
      date: getInitialDate(),
      time: getInitialTime(),
      notes: activeAppt?.notes || "",
      sendReminder: activeAppt?.sendReminder !== false,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!lead) return;

      const dateStr = values.date ? new Date(values.date).toLocaleDateString() : 'N/A';

      let timeStr = 'N/A';
      if (values.time) {
        const [hourStr, minStr] = values.time.split(':');
        if (hourStr && minStr) {
          let hour = parseInt(hourStr, 10);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          hour = hour % 12;
          hour = hour ? hour : 12; 
          timeStr = `${hour}:${minStr} ${ampm}`;
        }
      }
      
      let updatedLeadData: any = null;
      if (lead.leadId) {
        try {
          const { sendLeadAppointment } = await import("../../../services/leadPipeline");
          const res = await sendLeadAppointment({
            id: lead.leadId,
            appointmentType: values.appointmentType,
            date: dateStr,
            time: timeStr,
            sendReminder: values.sendReminder,
            ...(values.notes ? { notes: values.notes } : {})
          });
          updatedLeadData = res?.data?.lead || res?.data || res;
        } catch (err: any) {
          console.error("Failed to schedule appointment:", err);
          addToast({
            title: "Error",
            description: err?.response?.data?.message || err.message || "Failed to schedule appointment",
            color: "danger",
          });
          return;
        }
      }

      queryClient.invalidateQueries({ queryKey: ["leadStatus"] });
      queryClient.invalidateQueries({ queryKey: ["leadStats"] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });

      if (onAppointmentScheduled) {
        onAppointmentScheduled(updatedLeadData || {
          ...lead,
          leadStatus: "appointmentScheduled",
          scheduledAppointment: {
            appointmentType: values.appointmentType,
            date: dateStr,
            time: timeStr,
            notes: values.notes,
            sendReminder: values.sendReminder,
          }
        });
      }

      addToast({
        title: isAlreadyScheduled ? "Appointment Updated" : "Appointment Scheduled",
        description: `Appointment for ${lead?.patientName || ""} (${values.appointmentType}) has been ${isAlreadyScheduled ? "updated" : "confirmed"}.`,
        color: "success",
      });
      onClose();
    },
  });
  if (!lead) return null;
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="center"
      size="md"
      scrollBehavior="inside"
      classNames={{
        base: "max-sm:!mx-3 max-sm:!my-4 !m-0 w-full max-w-[480px] bg-white dark:bg-content1",
        closeButton: "text-white hover:bg-white/25 z-50 top-3 right-3",
      }}
    >
      <ModalContent className="overflow-hidden">
        {(onClose) => (
          <>
            <div className="bg-[#10b981] px-5 py-4">
              <h3 className="font-bold text-[15px] sm:text-[16px] leading-tight text-white">
                {isAlreadyScheduled ? "Edit Scheduled Appointment" : "Schedule Appointment"}
              </h3>
              <p className="text-white/85 text-[12px] sm:text-[13px] mt-0.5">{lead.patientName}</p>
            </div>
            <ModalBody className="px-5 py-4 gap-4">
              <div>
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                  Appointment Type
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {APPOINTMENT_TYPES.map((type) => (
                    <div
                      key={type}
                      onClick={() => formik.setFieldValue("appointmentType", type)}
                      className={`cursor-pointer rounded-lg px-2.5 sm:px-3 py-2 text-[11.5px] sm:text-[12.5px] font-medium transition-all text-center ${formik.values.appointmentType === type
                        ? "border-[1.5px] border-[#10b981] text-[#10b981] bg-[#e6fcf5]/40"
                        : "border border-slate-200 dark:border-default-200 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                        }`}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                    Date
                  </label>
                  <div className="border border-slate-200 dark:border-default-200 rounded-lg px-3 flex items-center h-9">
                    <DatePicker
                      name="date"
                      className="w-full"
                      classNames={{
                        input: "text-[12px] sm:text-[12.5px] text-slate-600 dark:text-slate-200",
                        inputWrapper: [
                          "bg-transparent shadow-none border-none px-0 h-auto",
                          "!bg-transparent",
                          "data-[hover=true]:!bg-transparent",
                          "data-[focus-within=true]:!bg-transparent",
                          "data-[focus-within=true]:ring-0",
                          "data-[focus-within=true]:ring-offset-0",
                          "group-hover:!bg-transparent",
                        ].join(" "),
                        segment: [
                          "rounded",
                          "data-[hover=true]:!bg-transparent",
                          "data-[focus=true]:!bg-[#10b981]/20",
                          "data-[focus=true]:!text-slate-700 dark:data-[focus=true]:!text-white",
                        ].join(" "),
                      }}
                      minValue={today(getLocalTimeZone())}
                      value={safeParseDate(formik.values.date)}
                      onChange={(date: CalendarDate | null) => {
                        formik.setFieldValue("date", date ? date.toString() : "");
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.errors.date && formik.touched.date && (
                    <div className="text-red-500 text-[10px] mt-0.5">{String(formik.errors.date)}</div>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                    Time
                  </label>
                  <div className="border border-slate-200 dark:border-default-200 rounded-lg px-2 sm:px-3 min-h-9 flex items-center gap-2 overflow-hidden">
                    <HiOutlineClock className="w-4 h-4 flex-none text-slate-400" />
                    <TimeInput
                      className="flex-1 min-w-0"
                      hourCycle={12}
                      value={safeParseTime(formik.values.time)}
                      onChange={(time: Time | null) => {
                        formik.setFieldValue(
                          "time",
                          time ? `${time.hour.toString().padStart(2, "0")}:${time.minute.toString().padStart(2, "0")}` : ""
                        );
                      }}
                      onBlur={formik.handleBlur}
                      classNames={{
                        base: "flex-1 min-w-0",
                        innerWrapper: "min-w-0",
                        inputWrapper: [
                          "bg-transparent shadow-none border-none px-0 min-h-0 h-auto",
                          "!bg-transparent",
                          "data-[hover=true]:!bg-transparent",
                          "data-[focus-within=true]:!bg-transparent",
                          "data-[focus-within=true]:ring-0",
                          "data-[focus-within=true]:ring-offset-0",
                          "group-hover:!bg-transparent",
                        ].join(" "),
                        segment: [
                          "px-0.5 sm:px-1 whitespace-nowrap text-[11px] sm:text-[12px] md:text-[13px]",
                          "rounded",
                          "data-[hover=true]:!bg-transparent",
                          "data-[focus=true]:!bg-[#10b981]/20",
                          "data-[focus=true]:!text-slate-700 dark:data-[focus=true]:!text-white",
                        ].join(" "),
                      }}
                    />
                  </div>
                  {formik.errors.time && formik.touched.time && (
                    <div className="text-red-500 text-[10px] mt-0.5">{String(formik.errors.time)}</div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                  Notes
                </label>
                <Textarea
                  size="sm"
                  radius="sm"
                  variant="bordered"
                  name="notes"
                  placeholder="Any special notes or preparation instructions..."
                  minRows={3}
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  classNames={{
                    inputWrapper: "border-slate-200 dark:border-default-200 rounded-lg shadow-none",
                    input: "text-[12px] sm:text-[12.5px] text-slate-600 dark:text-slate-200 placeholder:text-slate-400",
                  }}
                />
              </div>
              <div className="flex items-center justify-between py-1">
                <div>
                  <h4 className="text-[12.5px] sm:text-[13px] font-semibold text-slate-700 dark:text-slate-200">
                    Send appointment reminder
                  </h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    SMS + email, 24 hrs before
                  </p>
                </div>
                <Switch
                  isSelected={formik.values.sendReminder}
                  onValueChange={(val) => formik.setFieldValue("sendReminder", val)}
                  classNames={{
                    wrapper: "group-data-[selected=true]:bg-[#10b981]"
                  }}
                  size="md"
                />
              </div>
              <div className="flex gap-1.5 sm:gap-2.5 pb-1">
                <Button
                  className="flex-[2] font-bold bg-[#10b981] text-white text-[11px] xs:text-[12.5px] sm:text-[13px] px-2 sm:px-4 h-9 rounded-lg"
                  startContent={!formik.isSubmitting && <HiOutlineCheckCircle className="text-[14px] sm:text-[16px] shrink-0" />}
                  onPress={() => formik.handleSubmit()}
                  isLoading={formik.isSubmitting}
                  isDisabled={formik.isSubmitting}
                >
                  <span className="truncate">
                    {isAlreadyScheduled ? "Update Appointment" : "Confirm Appointment"}
                  </span>
                </Button>
                <Button
                  variant="bordered"
                  className="flex-1 font-semibold text-slate-600 dark:text-slate-300 border-slate-200 dark:border-default-300 text-[11px] xs:text-[12.5px] sm:text-[13px] px-2 sm:px-4 h-9 rounded-lg"
                  onPress={onClose}
                  isDisabled={formik.isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ScheduleAppointmentModal;